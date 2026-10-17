# Loja de produtos digitais

Loja própria de e-books e outros produtos digitais. Arquitetura em `docs/ARQUITETURA.md`.

## Estado atual (Fase 2, fundação)

Pronto: projeto Next.js, schema Prisma completo, validação de ambiente com travas de produção, autenticação própria (argon2, sessão em banco, papéis), guardas de autorização, script do primeiro administrador, testes unitários.

Ainda não verificado: geração do cliente Prisma, migration inicial e login contra um banco real. O ambiente onde isto foi escrito não conseguiu baixar o motor do Prisma, então esses passos precisam rodar na sua máquina (abaixo).

## Requisitos

Node 22 ou superior, npm, Docker (para o PostgreSQL local).

## Instalação

```bash
npm install
cp .env.example .env
docker compose up -d db
npx prisma generate
npx prisma migrate dev --name init
```

Os dois comandos do Prisma baixam binários de `binaries.prisma.sh`, então precisam de internet liberada.

## Primeiro administrador

```bash
ADMIN_EMAIL=voce@exemplo.com ADMIN_NAME="Seu Nome" npm run admin:create
```

A senha é pedida no terminal (mínimo de 10 caracteres). Pode ser passada por `ADMIN_PASSWORD` só na hora de rodar, sem gravar em arquivo.

## Desenvolvimento e testes

```bash
npm run dev          # http://localhost:3000, login em /entrar
npm run test         # testes unitários
npm run typecheck
npm run lint
```

## Limitações conhecidas

- Catálogo, painel, checkout, pagamentos e downloads ainda não existem (Fases 3 a 6).
- Recuperação de senha tem tabela no banco, mas o fluxo e o envio de e-mail vêm depois.
- Limite de tentativas de login ainda não implementado.
