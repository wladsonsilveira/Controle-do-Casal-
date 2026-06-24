'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardCards from '../components/dashboard-cards';
import ReceitaForm from '../components/receita-form';
import GastoForm from '../components/gasto-form';
import AvisosBoard from '../components/avisos-board';
import LancamentosList from '../components/lancamentos-list';
import MonthFilter from '../components/month-filter';
import { supabase } from '../lib/supabase';
import { getDashboardData } from '../lib/finance';

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getMonthRange(monthValue) {
  const safeMonth = monthValue || getCurrentMonth();
  const [year, month] = safeMonth.split('-').map(Number);
  const end = new Date(year, month, 0);

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

  return { startDate, endDate };
}

function getPeriodLabel(month, allMonths) {
  if (allMonths) {
    return 'Exibindo: todos os meses';
  }

  const [year, monthNumber] = month.split('-');
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  const label = date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return `Exibindo: ${label}`;
}

export default function HomePage() {
  const [receitas, setReceitas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [allMonths, setAllMonths] = useState(false);

  async function loadData(selectedMonth = month, useAllMonths = allMonths) {
    let receitasQuery = supabase
      .from('receitas')
      .select('*')
      .order('data_referencia', { ascending: false });

    let gastosQuery = supabase
      .from('gastos')
      .select('*')
      .order('data_referencia', { ascending: false });

    if (!useAllMonths) {
      const { startDate, endDate } = getMonthRange(selectedMonth);

      receitasQuery = receitasQuery
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate);

      gastosQuery = gastosQuery
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate);
    }

    const receitasResult = await receitasQuery;
    const gastosResult = await gastosQuery;

    if (receitasResult.error) {
      console.error('Erro receitas:', receitasResult.error.message);
      setReceitas([]);
    } else {
      setReceitas(receitasResult.data || []);
    }

    if (gastosResult.error) {
      console.error('Erro gastos:', gastosResult.error.message);
      setGastos([]);
    } else {
      setGastos(gastosResult.data || []);
    }
  }

  useEffect(() => {
    loadData(month, allMonths);

    const channel = supabase
      .channel('finance-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'receitas' }, () => loadData(month, allMonths))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, () => loadData(month, allMonths))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [month, allMonths]);

  const dashboard = useMemo(() => getDashboardData(receitas, gastos), [receitas, gastos]);
  const periodLabel = getPeriodLabel(month, allMonths);

  return (
    <main className="container" style={{ paddingBottom: 40 }}>
      <header className="header">
        <h1 style={{ fontSize: 34, marginBottom: 8 }}>Controle do Casal</h1>
        <p className="meta">Gestão financeira compartilhada com atualização em tempo real.</p>
      </header>

      <MonthFilter
        month={month}
        setMonth={setMonth}
        allMonths={allMonths}
        setAllMonths={setAllMonths}
      />

      <div className="card" style={{ marginBottom: 24 }}>
        <strong>{periodLabel}</strong>
      </div>

      <DashboardCards data={dashboard} />

      <section className="section columns">
        <ReceitaForm onSaved={() => loadData(month, allMonths)} />
        <GastoForm onSaved={() => loadData(month, allMonths)} />
      </section>

      <section className="section columns">
        <AvisosBoard dashboard={dashboard} />
        <div className="card">
          <h2>Ideias de gestão</h2>
          <div className="list" style={{ marginTop: 12 }}>
            <div className="notice">Definam um teto mensal para gastos variáveis.</div>
            <div className="notice">Lancem as despesas no mesmo dia para manter o saldo real.</div>
            <div className="notice">Criem uma meta de reserva e acompanhem a sobra do mês.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <LancamentosList
          receitas={receitas}
          gastos={gastos}
          reloadData={() => loadData(month, allMonths)}
        />
      </section>
    </main>
  );
}