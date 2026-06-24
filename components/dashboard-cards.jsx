'use client';

import { formatCurrency } from '../lib/finance';

export default function DashboardCards({ data }) {
  const badgeClass = data.percentualUsado >= 100
    ? 'badge danger'
    : data.percentualUsado >= 80
      ? 'badge warning'
      : 'badge success';

  return (
    <section className="grid cards">
      <div className="card">
        <div className="title">Receitas</div>
        <div className="value">{formatCurrency(data.totalReceitas)}</div>
      </div>
      <div className="card">
        <div className="title">Gastos</div>
        <div className="value">{formatCurrency(data.totalGastos)}</div>
      </div>
      <div className="card">
        <div className="title">Saldo</div>
        <div className="value">{formatCurrency(data.saldo)}</div>
      </div>
      <div className="card">
        <div className="title">Comprometimento da renda</div>
        <div className="value">{data.percentualUsado.toFixed(1)}%</div>
        <div style={{ marginTop: 12 }}>
          <span className={badgeClass}>{data.alerta}</span>
        </div>
      </div>
    </section>
  );
}