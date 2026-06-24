'use client';

import { formatCurrency } from '../lib/finance';

function getBadgeClass(value) {
  if (value >= 100) return 'badge danger';
  if (value >= 80) return 'badge warning';
  return 'badge success';
}

function ProgressBar({ value, tone = 'primary' }) {
  const safeValue = Math.max(0, Math.min(value || 0, 100));

  return (
    <div className="progress">
      <div
        className={`progress-bar ${tone}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default function DashboardCards({ data }) {
  const comprometimentoClass = getBadgeClass(data.percentualUsado);
  const limiteClass = getBadgeClass(data.percentualLimiteGastos);
  const economiaClass = getBadgeClass(data.percentualMetaEconomia);

  return (
    <section className="grid cards">
      <div className="card stat-card">
        <div className="title">Receitas</div>
        <div className="value">{formatCurrency(data.totalReceitas)}</div>
      </div>

      <div className="card stat-card">
        <div className="title">Gastos</div>
        <div className="value">{formatCurrency(data.totalGastos)}</div>
      </div>

      <div className="card stat-card">
        <div className="title">Economias</div>
        <div className="value">{formatCurrency(data.totalEconomias)}</div>
      </div>

      <div className="card stat-card">
        <div className="title">Saldo real</div>
        <div className="value">{formatCurrency(data.saldo)}</div>
      </div>

      <div className="card stat-card span-2">
        <div className="card-heading">
          <div>
            <div className="title">Comprometimento da renda</div>
            <div className="value small">{data.percentualUsado.toFixed(1)}%</div>
          </div>
          <span className={comprometimentoClass}>{data.alerta}</span>
        </div>
        <ProgressBar value={data.percentualUsado} tone="danger" />
      </div>

      <div className="card stat-card">
        <div className="title">Meta de economia</div>
        <div className="value small">{data.percentualMetaEconomia.toFixed(1)}%</div>
        <ProgressBar value={data.percentualMetaEconomia} tone="success" />
        <div style={{ marginTop: 12 }}>
          <span className={economiaClass}>
            {formatCurrency(data.totalEconomias)} de {formatCurrency(data.metaEconomia)}
          </span>
        </div>
      </div>

      <div className="card stat-card">
        <div className="title">Limite de gastos</div>
        <div className="value small">
          {data.limiteGastos > 0 ? `${data.percentualLimiteGastos.toFixed(1)}%` : '0%'}
        </div>
        <ProgressBar value={data.percentualLimiteGastos} tone="warning" />
        <div style={{ marginTop: 12 }}>
          <span className={limiteClass}>
            {formatCurrency(data.totalGastos)} de {formatCurrency(data.limiteGastos)}
          </span>
        </div>
      </div>
    </section>
  );
}