'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardCards from '../components/dashboard-cards';
import ReceitaForm from '../components/receita-form';
import GastoForm from '../components/gasto-form';
import EconomiaForm from '../components/economia-form';
import AvisosBoard from '../components/avisos-board';
import LancamentosList from '../components/lancamentos-list';
import MonthFilter from '../components/month-filter';
import MetasForm from '../components/metas-form';
import CategorySummary from '../components/category-summary';
import GastosChart from '../components/gastos-chart';
import YearFilter from '../components/year-filter';
import AnnualSummary from '../components/annual-summary';
import AnnualChart from '../components/annual-chart';
import { supabase } from '../lib/supabase';
import { getDashboardData } from '../lib/finance';
import { buildAnnualSummary } from '../lib/annual';

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
  if (allMonths) return 'Exibindo: todos os meses';

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
  const [economias, setEconomias] = useState([]);
  const [metaMensal, setMetaMensal] = useState(null);
  const [month, setMonth] = useState(getCurrentMonth());
  const [allMonths, setAllMonths] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [annualData, setAnnualData] = useState([]);

  async function loadData(selectedMonth = month, useAllMonths = allMonths) {
    let receitasQuery = supabase
      .from('receitas')
      .select('*')
      .order('data_referencia', { ascending: false });

    let gastosQuery = supabase
      .from('gastos')
      .select('*')
      .order('data_referencia', { ascending: false });

    let economiasQuery = supabase
      .from('economias')
      .select('*')
      .order('data_referencia', { ascending: false });

    if (!useAllMonths) {
      const { startDate, endDate } = getMonthRange(selectedMonth);

      receitasQuery = receitasQuery.gte('data_referencia', startDate).lte('data_referencia', endDate);
      gastosQuery = gastosQuery.gte('data_referencia', startDate).lte('data_referencia', endDate);
      economiasQuery = economiasQuery.gte('data_referencia', startDate).lte('data_referencia', endDate);
    }

    const [receitasResult, gastosResult, economiasResult, metaResult] = await Promise.all([
      receitasQuery,
      gastosQuery,
      economiasQuery,
      supabase.from('metas_mensais').select('*').eq('mes', selectedMonth).maybeSingle()
    ]);

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

    if (economiasResult.error) {
      console.error('Erro economias:', economiasResult.error.message);
      setEconomias([]);
    } else {
      setEconomias(economiasResult.data || []);
    }

    if (metaResult.error) {
      console.error('Erro meta mensal:', metaResult.error.message);
      setMetaMensal(null);
    } else {
      setMetaMensal(metaResult.data || null);
    }
  }

  async function loadAnnualData(year = selectedYear) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const [receitasResult, gastosResult, economiasResult] = await Promise.all([
      supabase
        .from('receitas')
        .select('*')
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate)
        .order('data_referencia', { ascending: true }),

      supabase
        .from('gastos')
        .select('*')
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate)
        .order('data_referencia', { ascending: true }),

      supabase
        .from('economias')
        .select('*')
        .gte('data_referencia', startDate)
        .lte('data_referencia', endDate)
        .order('data_referencia', { ascending: true })
    ]);

    if (receitasResult.error || gastosResult.error || economiasResult.error) {
      console.error('Erro ao carregar resumo anual');
      setAnnualData([]);
      return;
    }

    const summary = buildAnnualSummary(
      receitasResult.data || [],
      gastosResult.data || [],
      economiasResult.data || []
    );

    setAnnualData(summary);
  }

  async function handleSaved() {
    setEditingItem(null);
    await loadData(month, allMonths);
    await loadAnnualData(selectedYear);
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  useEffect(() => {
    loadData(month, allMonths);

    const channel = supabase
      .channel('finance-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'receitas' }, async () => {
        await loadData(month, allMonths);
        await loadAnnualData(selectedYear);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, async () => {
        await loadData(month, allMonths);
        await loadAnnualData(selectedYear);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'economias' }, async () => {
        await loadData(month, allMonths);
        await loadAnnualData(selectedYear);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'metas_mensais' }, async () => {
        await loadData(month, allMonths);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [month, allMonths, selectedYear]);

  useEffect(() => {
    loadAnnualData(selectedYear);
  }, [selectedYear]);

  const dashboard = useMemo(
    () => getDashboardData(receitas, gastos, economias, metaMensal),
    [receitas, gastos, economias, metaMensal]
  );

  const periodLabel = getPeriodLabel(month, allMonths);

  return (
    <main className="container app-shell">
      <header className="header hero-card">
        <div>
          <span className="eyebrow">Planejamento financeiro</span>
          <h1 className="page-title">Controle do Casal</h1>
          <p className="meta lead">
            Gestão financeira compartilhada, com visão mensal, metas, progresso da reserva e resumo anual.
          </p>
        </div>
      </header>

      <MonthFilter
        month={month}
        setMonth={setMonth}
        allMonths={allMonths}
        setAllMonths={setAllMonths}
      />

      <div className="card period-card">
        <strong>{periodLabel}</strong>
      </div>

      <DashboardCards data={dashboard} />

      {!allMonths && (
        <section className="section">
          <MetasForm
            month={month}
            metaMensal={metaMensal}
            onSaved={() => loadData(month, allMonths)}
          />
        </section>
      )}

      <section className="section forms-grid">
        <ReceitaForm
          onSaved={handleSaved}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <GastoForm
          onSaved={handleSaved}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <EconomiaForm
          onSaved={handleSaved}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />
      </section>

      <section className="section insights-grid">
        <AvisosBoard dashboard={dashboard} />
        <CategorySummary items={dashboard.categorySummary} />
      </section>

      <section className="section">
        <GastosChart items={dashboard.categorySummary} />
      </section>

      <section className="section">
        <YearFilter year={selectedYear} setYear={setSelectedYear} />
      </section>

      <section className="section insights-grid annual-grid">
        <AnnualSummary items={annualData} />
        <AnnualChart items={annualData} />
      </section>

      <section className="section">
        <LancamentosList
          receitas={receitas}
          gastos={gastos}
          economias={economias}
          reloadData={handleSaved}
          setEditingItem={setEditingItem}
        />
      </section>
    </main>
  );
}