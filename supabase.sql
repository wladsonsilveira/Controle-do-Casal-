alter table public.receitas enable row level security;
alter table public.gastos enable row level security;

create policy "receitas_select_public"
on public.receitas
for select
to anon
using (true);

create policy "receitas_insert_public"
on public.receitas
for insert
to anon
with check (true);

create policy "gastos_select_public"
on public.gastos
for select
to anon
using (true);

create policy "gastos_insert_public"
on public.gastos
for insert
to anon
with check (true);