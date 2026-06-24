# Controle do Casal

Aplicação web para controle financeiro compartilhado, construída com Next.js, React e Supabase. O sistema permite registrar receitas, gastos e economias, acompanhar metas mensais, filtrar por mês, visualizar resumo anual e manter um histórico editável de lançamentos.[cite:317][cite:321]

## Funcionalidades

- Cadastro de receitas.
- Cadastro de gastos com categoria e tipo.
- Cadastro de economias separadas das despesas.
- Edição e exclusão de lançamentos.
- Filtro por mês e opção de visualizar todos os meses.
- Metas mensais de economia e limite de gastos.
- Resumo por categoria.
- Gráfico de gastos por categoria.
- Resumo anual com tabela e gráfico por mês.
- Atualização em tempo real com Supabase Realtime.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 15 | Estrutura da aplicação e build de produção.[cite:317] |
| React 18 | Interface e gerenciamento de estado no cliente.[cite:334] |
| Supabase | Banco de dados, API e realtime.[cite:321][cite:305] |
| Chart.js + react-chartjs-2 | Gráficos mensais e anuais.[cite:322][cite:331] |

## Estrutura do projeto

```bash
app/
  globals.css
  layout.js
  page.js
components/
  annual-chart.jsx
  annual-summary.jsx
  avisos-board.jsx
  category-summary.jsx
  dashboard-cards.jsx
  economia-form.jsx
  gasto-form.jsx
  gastos-chart.jsx
  lancamentos-list.jsx
  metas-form.jsx
  month-filter.jsx
  receita-form.jsx
  year-filter.jsx
lib/
  annual.js
  finance.js
  supabase.js
supabase.sql
```

## Pré-requisitos

- Node.js 18 ou superior.
- Conta no Supabase.
- Projeto configurado na Vercel para deploy.

## Instalação

```bash
npm install
npm run dev
```

A aplicação local ficará disponível em `http://localhost:3000`, que é a porta padrão do servidor de desenvolvimento do Next.js.[cite:317]

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

Essas variáveis precisam estar configuradas também na Vercel para o ambiente de produção funcionar corretamente.[cite:317][cite:372]

## Banco de dados

Execute o conteúdo de `supabase.sql` no SQL Editor do Supabase para criar as tabelas e políticas.

Tabelas usadas:
- `receitas`
- `gastos`
- `economias`
- `metas_mensais`

O projeto depende de políticas de `select`, `insert`, `update` e `delete` para permitir operações do cliente com Row Level Security habilitado.[cite:305]

## Como usar

### Lançamentos

- Cadastre receitas, gastos e economias pelos formulários.
- Use o histórico para editar ou excluir registros.
- Os dados são recarregados após salvamento e também podem refletir atualizações em tempo real.

### Filtro mensal

- Selecione um mês específico no campo `month`.
- Use `Mês atual` para retornar ao período atual.
- Use `Todos os meses` para exibir a visão acumulada.

### Metas mensais

- Defina meta de economia para o mês.
- Defina limite de gastos.
- Acompanhe o progresso pelos cards do dashboard.

### Resumo anual

- Escolha o ano no seletor anual.
- Veja receitas, gastos, economias e saldo consolidados por mês.
- Compare os dados pela tabela e pelo gráfico anual de barras.[cite:322][cite:331]

## Scripts

```bash
npm run dev
npm run build
npm run start
```

O `npm run build` gera a versão otimizada de produção do app Next.js.[cite:317]

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Faça o deploy.

Projetos Next.js são tratados como caso nativo pela Vercel, com integração direta com Git e builds automáticos a cada push.[cite:317][cite:372]

## Observações

- O arquivo `.env.local` não deve ser versionado.
- Se o gráfico ou o resumo anual não aparecerem, confirme se os componentes anuais foram criados em arquivos separados.
- Se a edição parar de funcionar, verifique se o estado `editingItem` continua centralizado em `app/page.js`.
