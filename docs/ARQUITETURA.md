# Arquitetura da loja de produtos digitais

Este documento é a Fase 1. Ele define o que será construído e por quê, antes de qualquer código. Decisões marcadas como "a confirmar" dependem de informação que ainda não temos.

## 1. Visão geral

Uma aplicação Next.js única (monolito modular) com TypeScript, que serve a loja pública, a área do cliente, o painel administrativo e as rotas de API (incluindo o webhook de pagamento). PostgreSQL guarda os dados, Prisma faz o acesso, e os PDFs ficam em armazenamento privado compatível com S3.

Escolhi monolito modular porque o volume inicial é pequeno (um produto de R$ 9,90) e o custo de manter vários serviços não se paga. Os limites entre módulos são mantidos por pastas e interfaces, então separar algo no futuro é possível sem reescrever regra de negócio.

## 2. Stack e versões

| Camada | Escolha | Observação |
| --- | --- | --- |
| Framework | Next.js (App Router) com TypeScript | Versão exata fixada na instalação, após conferir compatibilidade |
| Interface | React, Tailwind CSS, componentes no estilo shadcn/ui | Componentes copiados para o projeto, sem dependência de runtime |
| Banco | PostgreSQL | Docker em desenvolvimento |
| ORM | Prisma | Migrations versionadas |
| Validação | Zod | Toda entrada de servidor passa por schema |
| Autenticação | Auth.js (credenciais por e-mail e senha, sessão em banco) | Hash de senha com argon2 |
| Armazenamento | API S3 (AWS S3, Cloudflare R2 ou MinIO em desenvolvimento) | Bucket privado, URLs assinadas |
| Testes | Vitest (unidade e integração), Playwright (ponta a ponta) | Provedor de pagamento simulado nos testes |
| Pagamento | Interface própria, adaptador Pagar.me, adaptador simulado | Ver seção 6 |

Decisão a confirmar: a lib de autenticação. Auth.js é o padrão do ecossistema, mas a API dele mudou várias vezes. Vou conferir a versão estável atual na instalação e, se houver problema de compatibilidade com a versão do Next.js, uso uma implementação própria de sessão em banco, que cobre os mesmos requisitos.

## 3. Estrutura de diretórios

```
loja-digital/
  prisma/
    schema.prisma
    migrations/
    seed.ts                 # só dados de bootstrap (papéis), nunca vendas fictícias
  src/
    app/                    # páginas e rotas (camada de apresentação)
      (loja)/               # home, catálogo, produto, carrinho, checkout
      (conta)/              # área do cliente: pedidos e downloads
      admin/                # painel administrativo
      api/
        webhooks/pagamentos/[provider]/route.ts
        downloads/[token]/route.ts
    components/             # componentes de interface
    domain/                 # regras de negócio puras, sem I/O
      pedidos/              # máquina de estados do pedido e do pagamento
      precos/               # cálculo de preço e total
      catalogo/
    services/               # casos de uso que orquestram domínio e infraestrutura
      checkout.service.ts
      pedidos.service.ts
      pagamentos.service.ts       # processador de notificações
      entrega.service.ts
    infra/
      db/                   # cliente Prisma e repositórios
      pagamentos/
        payment-provider.ts       # interface
        pagarme/                  # adaptador Pagar.me
        simulado/                 # adaptador de desenvolvimento e testes
        index.ts                  # seleção do provedor com trava de produção
      storage/              # interface de armazenamento e adaptador S3
      email/                # interface de e-mail (envio de link de acesso, recuperação de senha)
    auth/                   # sessão, papéis, guardas de autorização
    lib/                    # utilitários (moeda, slug, datas)
    validation/             # schemas Zod
    config/env.ts           # leitura e validação das variáveis de ambiente
  tests/
    unit/
    integration/
    e2e/
  scripts/                  # criação do primeiro administrador, reconciliação
  docs/
```

Regra de dependência: `app` chama `services`; `services` usam `domain` e `infra`; `domain` não importa nada de fora. O código de Pagar.me só existe em `infra/pagamentos/pagarme`.

## 4. Modelo de dados

Todos os valores monetários são inteiros em centavos. IDs são cuid ou uuid. Toda tabela tem `createdAt` e `updatedAt`.

**User**: id, email (único), nome, passwordHash, role (CUSTOMER ou ADMIN), emailVerifiedAt. Role fica como enum no usuário. Se surgirem papéis intermediários (suporte, editor), troca-se por tabela de papéis, e a mudança fica contida em `auth/`.

**Category**: id, nome, slug (único), descrição, ordem.

**Collection**: id, nome, slug (único), descrição, imagem, ordem.

**Product**: id, nome, slug (único), descrição curta e completa, capa, galeria (tabela `ProductImage`), categoryId, collectionId (opcional), `priceCents`, `promoPriceCents` (opcional), status (DRAFT, PUBLISHED, ARCHIVED), tipo (EBOOK, PACOTE_PDF, LIVRO_ATIVIDADES, MATERIAL_EDUCATIVO, KIT, OUTRO), faixaEtáriaMin e faixaEtáriaMax (opcionais), licença de uso (texto), seoTitle, seoDescription, ordem de exibição. Nada aqui é específico de pintura infantil.

**ProductFile**: id, productId, nome exibido, papel (PRINCIPAL ou BONUS), ordem. Os bytes não ficam aqui: ficam em `FileVersion`.

**FileVersion**: id, productFileId, storageKey (chave no bucket privado), tamanho, mimeType, checksum SHA-256, número da versão, ativa (booleano). Substituir um arquivo cria nova versão. Pedidos antigos continuam apontando para a versão que o cliente comprou se a política for essa (ver seção 7).

**Order**: id, userId, status do pedido, `totalCents`, moeda, e-mail do comprador no momento da compra, `expiresAt`, timestamps de pago, cancelado e reembolsado.

**OrderItem**: id, orderId, productId (referência, sem cascata de exclusão), `productName` e `unitPriceCents` copiados no momento da compra, quantidade. Isso garante que alterar o catálogo não muda o histórico.

**Payment**: id, orderId, provider, `externalId` (único por provider), método (PIX, CARTAO), status do pagamento, `amountCents`, `idempotencyKey` (única), dados de exibição do método (por exemplo QR code Pix e expiração, nunca dados de cartão), `version` para controle otimista de concorrência.

**PaymentEvent**: id, paymentId (opcional, para eventos que chegam antes de casar com um pagamento), provider, `externalEventId` (único por provider), tipo, payload bruto (sem segredos), recebidoEm, processadoEm, resultado. A unicidade de `externalEventId` é o que torna o webhook idempotente.

**DownloadGrant**: id, orderItemId, userId, fileVersionId, revogadoEm (opcional), contador de downloads, limite. É a concessão de acesso. Ela só existe depois de pagamento confirmado.

**DownloadToken**: id, grantId, hash do token (o token em si nunca é salvo), expiresAt, usadoEm. Links temporários gerados sob demanda.

**AuditLog**: id, actorUserId, ação, entidade, entidadeId, antes e depois (JSON sem dados sensíveis), IP resumido, timestamp. Escrito na mesma transação da ação administrativa.

**Coupon** (apenas o esquema, sem lógica no MVP): código, tipo, valor, validade, limite de uso.

Índices principais: `Product(status, categoryId, ordem)`, `Product(slug)`, `Order(userId, createdAt)`, `Order(status, expiresAt)` para reconciliação e expiração, `Payment(provider, externalId)` único, `PaymentEvent(provider, externalEventId)` único, `DownloadGrant(userId)`.

Política de exclusão: nada de cascata em pedidos, itens, pagamentos e eventos. Produtos usados em pedidos só podem ser arquivados, nunca apagados. Usuários com pedidos são anonimizados em vez de removidos quando houver pedido de exclusão (LGPD), preservando o registro financeiro que a lei exige guardar.

## 5. Fluxo de compra

1. Cliente monta o carrinho. O carrinho guarda só `productId` e quantidade (cookie ou, se logado, banco). Preço nunca é aceito do navegador.
2. No checkout, o servidor relê os produtos do banco, confere que estão publicados, calcula o total e cria o `Order` em PENDENTE com os itens copiados, tudo em uma transação.
3. O serviço de checkout chama `PaymentProvider.createPayment` com a chave de idempotência derivada do pedido. O retorno (por exemplo QR Pix) é salvo em `Payment`.
4. O cliente vê o resumo e as instruções de pagamento. A página de retorno apenas consulta o estado do pedido no banco. Ela não confirma nada.
5. O gateway envia o webhook. A rota valida a assinatura, grava o `PaymentEvent` (a unicidade barra duplicados), e o processador aplica a transição de estado se ela for válida.
6. Ao entrar em PAGO, na mesma transação, criam-se os `DownloadGrant` de cada arquivo ativo dos produtos do pedido.
7. Um job de reconciliação consulta no gateway os pagamentos que continuam pendentes e cobre webhooks perdidos. Pedidos pendentes além do prazo viram EXPIRADO.

Comprador sem conta: o checkout exige e-mail. O acesso aos downloads é por conta (criada no checkout com link de definição de senha) ou por link de acesso enviado ao e-mail do pedido. Decisão a confirmar com você: preferir exigir cadastro antes da compra reduz suporte, mas pode derrubar conversão em compra de R$ 9,90. Minha proposta é checkout só com e-mail e criação de conta automática.

## 6. Pagamentos

Interface em `infra/pagamentos/payment-provider.ts`:

- `createPayment(input)`: cria a cobrança, recebe chave de idempotência.
- `getPaymentStatus(externalId)`: consulta autenticada, usada na reconciliação.
- `refundPayment(externalId, amountCents)`: opcional por provider.
- `validateWebhook(headers, rawBody)`: devolve o evento validado ou lança erro. Precisa do corpo bruto, não do JSON já interpretado.
- `normalizePaymentStatus(statusDoGateway)`: converte para os estados internos.

Estados internos do pagamento: CRIADO, PENDENTE, PROCESSANDO, APROVADO, RECUSADO, EXPIRADO, REEMBOLSO_SOLICITADO, REEMBOLSADO. Estados do pedido: CRIADO, AGUARDANDO_PAGAMENTO, PAGO, CANCELADO, EXPIRADO, REEMBOLSADO.

Transições válidas (qualquer outra é ignorada e registrada):

- Pagamento: CRIADO para PENDENTE ou PROCESSANDO; PENDENTE e PROCESSANDO para APROVADO, RECUSADO ou EXPIRADO; APROVADO para REEMBOLSO_SOLICITADO; REEMBOLSO_SOLICITADO para REEMBOLSADO ou de volta a APROVADO se o reembolso falhar. Estados finais (RECUSADO, EXPIRADO, REEMBOLSADO) não saem do lugar.
- Pedido: AGUARDANDO_PAGAMENTO para PAGO, CANCELADO ou EXPIRADO; PAGO para REEMBOLSADO.

Uma notificação antiga de "aprovado" que chegue depois de um reembolso não encontra transição válida e não muda nada. A aplicação da transição usa `version` do pagamento (atualização condicional), então dois webhooks simultâneos não passam juntos.

Provedores:

- `SimuladoPaymentProvider`: só para desenvolvimento e testes. A seleção em `index.ts` lança erro na inicialização se `NODE_ENV=production` e o provider configurado for o simulado. Além disso, o módulo simulado não é importado dinamicamente em produção.
- `PagarMePaymentProvider`: será escrito na Fase 5 depois de ler a documentação oficial em https://docs.pagar.me/. Não vou escrever endpoints, cabeçalhos nem formato de assinatura de memória. Sem credenciais, ele fica estruturado e configurado por variáveis de ambiente, sem ser testado contra o gateway.

Chaves secretas só existem no servidor, lidas em `config/env.ts`, que valida com Zod e falha na subida se algo obrigatório faltar em produção.

## 7. Entrega protegida e reembolso

- Os PDFs ficam em bucket privado, sem URL pública.
- O cliente logado vê em "Meus pedidos" apenas os `DownloadGrant` dele. Ao clicar em baixar, o servidor confere sessão, dono do grant, grant não revogado, limite de downloads e pedido ainda em PAGO. Só então emite um `DownloadToken` curto (por exemplo 5 minutos) e redireciona para uma URL assinada do S3 com validade igual.
- Tentativas são limitadas por grant e por IP. Cada emissão grava um registro de evento sem coletar mais do que o necessário.
- Link expirado mostra mensagem clara e permite pedir novo, repetindo toda a verificação.
- Reembolso: o grant é revogado quando o pedido vira REEMBOLSADO. Essa é a regra técnica. A política comercial (por exemplo, o direito de arrependimento de 7 dias do Código de Defesa do Consumidor em compras online, e como ele se aplica a produto digital já baixado) precisa de revisão jurídica sua antes da publicação. Deixo a revogação configurável por flag até lá.
- Versões de arquivo: o grant aponta para a `FileVersion` vigente na compra. Corrigir um PDF cria versão nova e, por decisão de produto, pode-se migrar os grants existentes para a nova versão (ação administrativa auditada).

## 8. Segurança

Sessões em cookie `httpOnly`, `secure` e `sameSite=lax`. Hash de senha com argon2. Limitação de tentativas em login, recuperação de senha, checkout e download. Autorização checada no servidor em toda Server Action e rota, nunca só escondendo botão. CSRF coberto pelas proteções de Server Actions e por `sameSite`; rotas de API que mudam estado exigem checagem de origem. Cabeçalhos de segurança (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) configurados no Next. Upload de arquivo: tipo verificado pelo conteúdo (assinatura `%PDF`), tamanho máximo configurável, nome do objeto gerado pelo servidor. Logs sem tokens, senhas ou payload completo de pagamento. Primeiro administrador criado por script de linha de comando que lê a senha de entrada interativa ou de variável de ambiente temporária, nunca de valor fixo no código.

## 9. Testes

Vitest para domínio e serviços (máquina de estados, preço, checkout, webhook duplicado, fora de ordem e inválido, download sem pagamento, acesso a arquivo de outro cliente, reembolso e revogação, permissões de admin, adulteração de preço). Os testes de integração usam um PostgreSQL real (container) e o provedor simulado. O comportamento do adaptador em falha de rede é testado no próprio adaptador com cliente HTTP substituído. Playwright cobre a jornada ponta a ponta quando a Fase 7 chegar.

## 10. Riscos e decisões em aberto

| Risco ou decisão | Tratamento |
| --- | --- |
| Pagar.me exige conta ativa e credenciais de teste para validar a integração | Adaptador estruturado e documentado, com teste real só quando houver credenciais |
| Política de reembolso e direito de arrependimento em produto digital | Revisão jurídica antes de publicar. Revogação configurável |
| Armazenamento S3: provedor ainda não escolhido | Interface de storage com adaptador S3, MinIO em desenvolvimento. Escolha entre AWS S3 e Cloudflare R2 fica para o deploy |
| Envio de e-mail (link de acesso, recuperação de senha) | Interface de e-mail com adaptador de console em desenvolvimento. Provedor real a escolher |
| Checkout exige cadastro ou só e-mail | Proposta: só e-mail com conta automática. A confirmar |
| Deploy | Next.js em plataforma que suporte Node, mais PostgreSQL gerenciado. Escolha final na Fase 8 |
| Jobs periódicos (reconciliação, expiração) | Rota protegida chamada por agendador da plataforma, ou script em cron. Definir no deploy |

## 11. Ordem de implementação

Fase 2 (fundação) entrega: projeto rodando, schema Prisma com migration inicial, validação de ambiente, autenticação com papéis, script do primeiro administrador, `.env.example` e README inicial. As fases seguintes seguem o roteiro do prompt original.
