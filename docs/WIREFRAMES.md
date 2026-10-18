# Meu Ebook Digital: wireframes da loja

Este documento mostra, tela por tela, quais blocos serão construídos e com qual intenção. Não há decisão visual aqui: nada de cor, fonte ou estilo. Isso vem na etapa seguinte, depois que você aprovar a estrutura.

## Como ler

Cada caixa é um bloco. O texto dentro dela diz o que o bloco é, e a etiqueta diz que tipo de conteúdo vai nele.

| Etiqueta | Significado |
| --- | --- |
| `[IMG]` | Imagem. A descrição diz o que ela mostra e de onde vem |
| `[GRAF]` | Gráfico. A descrição diz o tipo e quais dados |
| `[TABELA]` | Tabela de dados reais do banco |
| `[FORM]` | Formulário com validação no servidor |
| `[BTN]` | Botão ou link de ação |
| `[TEXTO]` | Texto vindo do banco ou escrito à mão |
| `[LISTA]` | Lista de itens repetidos |
| `[ESTADO]` | Estado de tela: carregando, vazio ou erro |

Os códigos `F-01`, `F-02` e assim por diante são as features. Cada uma vira uma issue no GitHub (ver `docs/features.json` e a seção final).

Todas as imagens de produto são ilustrações originais da marca ou placeholders marcados como tal. Nenhum dado de venda é fictício: onde não há dado, a tela mostra o estado vazio.

---

## Parte 1. Loja pública

### T01. Página inicial (F-10)

```
+--------------------------------------------------------------+
| LOGO        Catálogo  Categorias  Contato     [BTN carrinho 0]|
+--------------------------------------------------------------+
| [TEXTO] Título e uma frase sobre a marca       +------------+ |
| [BTN] Ver os livros                            | [IMG]      | |
|                                                | ilustração | |
|                                                | principal  | |
|                                                +------------+ |
+--------------------------------------------------------------+
| Categorias                                                   |
| +---------+ +---------+ +---------+                          |
| | [IMG]   | | [IMG]   | | [IMG]   |   [LISTA] vinda do banco |
| | nome    | | nome    | | nome    |                          |
| +---------+ +---------+ +---------+                          |
+--------------------------------------------------------------+
| Em destaque                                                  |
| +---------+ +---------+ +---------+ +---------+              |
| | [IMG]   | | [IMG]   | | [IMG]   | | [IMG]   |  cards de    |
| | nome    | | nome    | | nome    | | nome    |  produto     |
| | R$ 9,90 | | R$ ...  | |         | |         |  (ver C1)    |
| | [BTN]   | |         | |         | |         |              |
| +---------+ +---------+ +---------+ +---------+              |
+--------------------------------------------------------------+
| Novidades                  [LISTA] 4 últimos publicados      |
+--------------------------------------------------------------+
| Como funciona                                                |
| 1 Pague com Pix ou cartão | 2 Receba na hora | 3 Imprima     |
| [TEXTO] três blocos curtos com ícone simples                 |
+--------------------------------------------------------------+
| Perguntas frequentes     [LISTA] pergunta e resposta         |
+--------------------------------------------------------------+
| Rodapé: contato, política de privacidade, termos, vendedor   |
+--------------------------------------------------------------+
```

Intenções:
- Hero com imagem: mostra o estilo dos desenhos logo de início. A imagem é uma ilustração original aprovada por você.
- Categorias, destaques e novidades vêm do banco. Sem produtos publicados, cada seção mostra `[ESTADO] vazio` e se esconde em produção.
- "Como funciona" existe para tirar a dúvida mais comum de quem compra produto digital: "como eu recebo?".
- Perguntas frequentes cobrem tamanho do papel, impressão, prazo de acesso e reembolso.

### T02. Catálogo e categoria (F-11)

```
+--------------------------------------------------------------+
| [cabeçalho]                                                  |
+--------------------------------------------------------------+
| Catálogo                          Ordenar: [Novidades v]     |
| +--------------+  +----------------------------------------+ |
| | Filtros      |  | +-------+ +-------+ +-------+          | |
| | Categoria    |  | |[IMG]  | |[IMG]  | |[IMG]  |          | |
| |  ( ) ...     |  | |nome   | |nome   | |nome   |          | |
| | Coleção      |  | |preço  | |preço  | |preço  |          | |
| |  ( ) ...     |  | +-------+ +-------+ +-------+          | |
| | Faixa etária |  |                                        | |
| |  ( ) 3 a 5   |  | [BTN] Carregar mais  ou  paginação     | |
| | [BTN limpar] |  +----------------------------------------+ |
| +--------------+                                             |
|  [ESTADO] nenhum produto encontrado, com botão limpar filtros|
+--------------------------------------------------------------+
```

Intenções: filtros por categoria, coleção e faixa etária usam os campos do banco. No celular, os filtros viram um painel que abre por botão. A URL guarda os filtros para poder compartilhar e para o buscador indexar.

### T03. Página do produto (F-12)

```
+--------------------------------------------------------------+
| [cabeçalho]                                                  |
+--------------------------------------------------------------+
| +------------------+   [TEXTO] Nome do produto               |
| | [IMG] capa       |   [TEXTO] Descrição curta               |
| |                  |   Faixa etária: 3 a 5 anos              |
| +------------------+   Formato: PDF para imprimir            |
| [IMG][IMG][IMG]        Preço: R$ 9,90  (promo, se houver)    |
| miniaturas             [BTN] Comprar agora                   |
|                        [BTN] Adicionar ao carrinho           |
|                        [BTN] Compartilhar  (F-19)            |
|                        [TEXTO] Acesso imediato após o        |
|                        pagamento confirmado                  |
+--------------------------------------------------------------+
| O que está incluído                                          |
| [LISTA] arquivo principal, arquivos bônus, quantidade        |
| ex.: 20 desenhos para colorir, 5 atividades bônus            |
+--------------------------------------------------------------+
| Amostras  [IMG] [IMG] [IMG]  páginas de exemplo autorizadas  |
+--------------------------------------------------------------+
| Sobre o produto     [TEXTO] descrição completa               |
| Licença de uso      [TEXTO] uso pessoal, não revender        |
+--------------------------------------------------------------+
| Você também pode gostar   [LISTA] 3 a 4 produtos relacionados|
+--------------------------------------------------------------+
```

Intenções: tudo vem do banco, então produto novo não exige mexer no código. As amostras só aparecem se o admin enviou imagens. O bloco "incluído" lista os arquivos reais cadastrados, sem expor o PDF pago. Metadados de SEO e Open Graph saem dos campos do produto (F-15).

Link do produto (F-19): todo produto tem dois endereços. `/p/slug` abre esta página. `/comprar/slug` abre o checkout (T05) com o produto já no pedido, para usar em bio, story e mensagem. O botão Compartilhar oferece copiar o link, WhatsApp e, no celular, o menu de compartilhar do aparelho. A mesma ação existe em cada card de produto (C1) e na lista de produtos do painel (T12).

### T04. Carrinho (F-13)

```
+--------------------------------------------------------------+
| Seu carrinho                                                 |
| +----------------------------------------------------------+ |
| | [IMG] Nome do produto        qtd [ 1 ]   R$ 9,90  [BTN x]| |
| | [IMG] Nome do produto        qtd [ 1 ]   R$ 9,90  [BTN x]| |
| +----------------------------------------------------------+ |
|                              Total: R$ 19,80                 |
|                              [BTN] Ir para o pagamento       |
| [ESTADO] carrinho vazio, com link para o catálogo            |
+--------------------------------------------------------------+
```

Intenções: o carrinho guarda só o ID do produto e a quantidade. O preço mostrado é recalculado no servidor a cada carregamento. Para produto digital de licença única, a quantidade fica travada em 1 (regra por tipo de produto).

### T05. Checkout (F-14)

```
+--------------------------------------------------------------+
| Finalizar compra                                             |
| +---------------------------------+ +----------------------+ |
| | 1. Seus dados  [FORM]           | | Resumo do pedido     | |
| |   Nome                          | | [LISTA] itens e      | |
| |   E-mail                        | | preços do servidor   | |
| |   [ ] Li e aceito os termos     | | Total: R$ 9,90       | |
| |                                 | +----------------------+ |
| | 2. Forma de pagamento           |                          |
| |   (o) Pix   ( ) Cartão          |                          |
| |   [FORM] campos do cartão feitos|                          |
| |   pelo gateway, não por nós     |                          |
| |                                 |                          |
| | [BTN] Pagar R$ 9,90             |                          |
| +---------------------------------+                          |
| [ESTADO] processando, erro de pagamento, tente de novo       |
+--------------------------------------------------------------+
```

Intenções: só nome, e-mail e aceite dos termos, que é o mínimo para entregar e atender. Os dados de cartão nunca passam pelo nosso servidor nem ficam no nosso banco. O botão fica travado enquanto processa, para evitar cobrança dupla.

### T06. Aguardando Pix (F-16)

```
+--------------------------------------------------------------+
| Falta pouco: pague o Pix                                     |
| +-------------------+    Valor: R$ 9,90                      |
| | [IMG] QR code     |    Expira em: 29:41   [TEXTO] contador |
| | gerado pelo       |    [BTN] Copiar código Pix             |
| | gateway           |                                        |
| +-------------------+    Status: aguardando pagamento        |
| [TEXTO] Esta página atualiza sozinha quando o pagamento for  |
| confirmado. Você também recebe um e-mail.                    |
| [ESTADO] expirado, com botão gerar novo Pix                  |
+--------------------------------------------------------------+
```

Intenções: a tela consulta o estado do pedido no nosso banco, que só muda por webhook validado ou reconciliação. Chegar nesta página nunca libera download.

### T07. Resultado do pedido (F-17)

```
+--------------------------------------------------------------+
| [ESTADO pago]      Pagamento confirmado                      |
|   [LISTA] arquivos liberados   [BTN] Baixar   [BTN] Meus pedidos
|                                                              |
| [ESTADO pendente]  Ainda estamos aguardando a confirmação    |
| [ESTADO recusado]  Pagamento não aprovado  [BTN] Tentar outra|
| [ESTADO expirado]  Pedido expirou          [BTN] Refazer     |
+--------------------------------------------------------------+
```

Intenções: uma única tela com quatro estados, todos lidos do banco. Os botões de download só aparecem no estado pago.

### T08. Entrar, criar conta e recuperar senha (F-05, F-06)

```
+----------------------------+
| Entrar                     |
| [FORM] e-mail, senha       |
| [BTN] Entrar               |
| link: Esqueci minha senha  |
| link: Criar conta          |
+----------------------------+
```

Intenções: criar conta e recuperar senha usam o mesmo desenho. A conta também é criada automaticamente no checkout, com e-mail para definir a senha.

---

## Parte 2. Área do cliente

### T09. Meus pedidos (F-18)

```
+--------------------------------------------------------------+
| Meus pedidos                                                 |
| [TABELA] número | data | itens | total | status | [BTN ver]   |
| [ESTADO] você ainda não fez pedidos                          |
+--------------------------------------------------------------+
```

### T10. Detalhe do pedido e downloads (F-18, F-30, F-31)

```
+--------------------------------------------------------------+
| Pedido #1234    status: pago    pago em 16/10/2026           |
| Itens: [LISTA] produto, preço pago                           |
| Arquivos                                                     |
| [LISTA] nome do arquivo | principal ou bônus | [BTN Baixar]  |
| [TEXTO] O link de download vale por 5 minutos e é gerado a   |
| cada clique.                                                 |
| [ESTADO] link expirado, com botão gerar outro                |
| [ESTADO] pedido reembolsado, acesso encerrado                |
| [BTN] Falar com o suporte                                    |
+--------------------------------------------------------------+
```

---

## Parte 3. Painel administrativo

Estrutura comum a todas as telas do painel:

```
+----------+---------------------------------------------------+
| Menu     |  Título da tela                      [BTN ação]   |
| Painel   |  -----------------------------------------------  |
| Produtos |  conteúdo da tela                                 |
| Arquivos |                                                   |
| Pedidos  |                                                   |
| Clientes |                                                   |
| Catálogo |                                                   |
| Auditoria|                                                   |
+----------+---------------------------------------------------+
```

### T11. Painel de vendas (F-40)

```
+--------------------------------------------------------------+
| Período: [Últimos 30 dias v]                                 |
| +-----------+ +-----------+ +-----------+ +-----------+      |
| | Fatur.    | | Pedidos   | | Ticket    | | Pendentes |      |
| | bruto     | | pagos     | | médio     | | e cancel. |      |
| | R$ ...    | | n         | | R$ ...    | | n e n     | KPIs |
| +-----------+ +-----------+ +-----------+ +-----------+      |
| +------------------------------+ +-------------------------+ |
| | [GRAF] linha                 | | [GRAF] barras horizontais| |
| | faturamento bruto por dia    | | produtos mais vendidos   | |
| | eixo X: dias, eixo Y: R$     | | por quantidade           | |
| +------------------------------+ +-------------------------+ |
| Reembolsos no período: R$ ...   Taxas estimadas: R$ ...      |
| Líquido estimado: R$ ...        [TEXTO] nota: estimativa     |
| [TABELA] últimos pedidos: número | cliente | total | status  |
| [ESTADO] sem vendas no período                               |
+--------------------------------------------------------------+
```

Intenções:
- Os quatro indicadores usam só pedidos reais. Faturamento bruto, reembolsos, taxas e líquido estimado aparecem separados, e nada aqui se chama lucro.
- Taxa de conversão fica de fora até existir contagem confiável de visitas (decisão registrada em F-40).
- O gráfico de linha mostra dias sem venda como zero, não como buraco.

### T12. Lista de produtos (F-20)

```
+--------------------------------------------------------------+
| Produtos                                    [BTN Novo produto]|
| [FORM busca]  Status: [Todos v]  Categoria: [Todas v]        |
| [TABELA] capa | nome | categoria | preço | status | ações    |
|   ações: editar, publicar ou despublicar, arquivar, ver prévia|
| [ESTADO] nenhum produto cadastrado, com botão criar o primeiro|
+--------------------------------------------------------------+
```

### T13. Editor de produto (F-20, F-21, F-22)

```
+--------------------------------------------------------------+
| Novo produto   status: rascunho   [BTN Prévia] [BTN Salvar]  |
| Abas: Dados | Preço | Imagens | Arquivos | SEO               |
| ------------------------------------------------------------ |
| Aba Dados   [FORM] nome, slug, descrição curta, descrição    |
|             completa, categoria, coleção, tipo, faixa etária,|
|             texto da licença                                 |
| Aba Preço   [FORM] preço, preço promocional (em reais, o     |
|             sistema guarda em centavos)                      |
| Aba Imagens [IMG] capa + galeria, com legenda e ordem        |
| Aba Arquivos [LISTA] ver T14                                 |
| Aba SEO     [FORM] título e descrição para o buscador, e     |
|             [IMG] prévia de como aparece ao compartilhar     |
| [BTN Publicar]  só habilita se tiver capa, preço e arquivo   |
+--------------------------------------------------------------+
```

Intenções: o botão Publicar só liga quando o produto está completo, para ninguém vender algo sem arquivo para entregar. A prévia abre a página real do produto (T03) com um aviso de rascunho.

### T14. Arquivos digitais do produto (F-23)

```
+--------------------------------------------------------------+
| Arquivos do produto                       [BTN Enviar PDF]   |
| [LISTA] nome | papel [principal v] | versão | tamanho | ações|
|   ações: substituir versão, marcar como bônus, remover       |
| [FORM envio] só PDF, tamanho máximo mostrado na tela         |
| [TEXTO] Substituir cria uma nova versão. Pedidos antigos      |
| continuam com a versão que o cliente comprou.                |
| [ESTADO] enviando, erro de tipo ou tamanho                   |
+--------------------------------------------------------------+
```

### T15. Categorias e coleções (F-24)

```
+--------------------------------------------------------------+
| Categorias | Coleções   (duas abas)         [BTN Nova]       |
| [TABELA] nome | slug | produtos | ordem | ações              |
| [FORM] criar e editar em painel lateral                      |
+--------------------------------------------------------------+
```

### T16. Lista de pedidos (F-41)

```
+--------------------------------------------------------------+
| Pedidos                                                      |
| Status: [Todos v]  Período: [..]  [FORM busca e-mail ou nº]  |
| [TABELA] número | data | cliente | total | status | ver     |
|   status: pago, pendente, cancelado, expirado, reembolsado   |
+--------------------------------------------------------------+
```

### T17. Detalhe do pedido (F-41, F-42)

```
+--------------------------------------------------------------+
| Pedido #1234                                                 |
| +--------------------+ +-----------------------------------+ |
| | Resumo             | | Linha do tempo de status          | |
| | cliente, e-mail    | | [LISTA] data | evento | origem    | |
| | itens e preços     | | criado, pendente, pago, ...       | |
| | total, método      | | origem: webhook, consulta, admin  | |
| +--------------------+ +-----------------------------------+ |
| Pagamento: id externo, status do gateway                     |
| Acesso: [TABELA] arquivo | downloads usados | [BTN revogar]  |
| [BTN Reemitir acesso]  [BTN Reembolsar]  (pedem confirmação  |
| e gravam no registro de auditoria)                           |
+--------------------------------------------------------------+
```

### T18. Clientes (F-43)

```
+--------------------------------------------------------------+
| Clientes   [FORM busca por e-mail]                           |
| [TABELA] nome | e-mail | pedidos | última compra | ver       |
| Detalhe: dados mínimos, [TABELA] pedidos, [BTN anonimizar]   |
+--------------------------------------------------------------+
```

### T19. Registro de auditoria (F-44)

```
+--------------------------------------------------------------+
| Auditoria     Ação: [Todas v]   Período: [..]                |
| [TABELA] data | quem | ação | entidade | antes e depois      |
+--------------------------------------------------------------+
```

---

## Parte 4. Páginas de texto

### T20. Política de privacidade, termos, contato (F-50)

```
+--------------------------------------------------------------+
| Título da página                                             |
| [TEXTO] conteúdo longo com sumário lateral                   |
| Contato: [FORM] nome, e-mail, assunto (inclui pedido de      |
| privacidade), mensagem                                       |
+--------------------------------------------------------------+
```

Intenção: os textos legais são rascunhos marcados como pendentes de revisão jurídica até você aprovar. Os dados do vendedor (nome, documento, e-mail de atendimento) são preenchidos por você.

---

## Blocos reutilizáveis

| ID | Bloco | Onde aparece | Conteúdo |
| --- | --- | --- | --- |
| C1 | Card de produto | T01, T02, T03 | `[IMG]` capa, nome, preço (e promoção), `[BTN]` |
| C2 | Cabeçalho | todas as telas públicas | logo, links, contador do carrinho |
| C3 | Rodapé | todas as telas públicas | links legais, contato, dados do vendedor |
| C4 | Estados de tela | todas | carregando, vazio, erro, com mensagem útil |
| C5 | Tabela de admin | T12 a T19 | ordenação, busca, paginação no servidor |
| C6 | Indicador (KPI) | T11 | rótulo, valor, período |
| C7 | Confirmação | T17, T18 | caixa que descreve a ação e pede confirmação |

## Pontos para você decidir antes do desenho visual

1. O checkout pede só nome e e-mail (conta criada automaticamente) ou exige cadastro antes? A proposta está desenhada com só e-mail.
2. A página inicial já nasce com seção de novidades e destaques, mas com um único produto ela fica quase vazia. Prefiro manter as seções escondidas até haver produtos suficientes. Concorda?
3. Imagens de amostra: quantas páginas do e-book você autoriza mostrar publicamente? Isso define o tamanho do bloco "Amostras".
4. Perguntas frequentes: você escreve as respostas, ou preparo um rascunho para você ajustar?

## Ligação com o GitHub

Cada feature (`F-xx`) tem uma entrada em `docs/features.json` com fase, telas, blocos e critérios de aceite. O script `scripts/github-issues.mjs` transforma essas entradas em issues, com um rótulo por fase e por área. O trabalho de cada feature acontece em uma branch `feature/F-xx-nome` e fecha a issue por pull request. Detalhes no `README`.
