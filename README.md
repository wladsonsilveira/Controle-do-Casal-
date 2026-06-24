# Controle do Casal

Projeto inicial de gestão financeira para casal com Next.js + Supabase + Vercel.

## 1. Instalação

```bash
npm install
```

## 2. Configure o ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Campos:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Banco de dados

Rode o conteúdo de `supabase.sql` no SQL Editor do Supabase.

## 4. Rodar localmente

```bash
npm run dev
```

## 5. GitHub

```bash
git init
git add .
git commit -m "feat: projeto inicial controle casal"
```

## 6. Vercel

- Importe o repositório no Vercel.
- Configure as variáveis de ambiente com os mesmos valores do `.env.local`.
- Faça o deploy.