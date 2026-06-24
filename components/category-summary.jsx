'use client';

import { formatCurrency } from '../lib/finance';

export default function CategorySummary({ items }) {
  return (
    <div className="card">
      <h2>Resumo por categoria</h2>

      <div className="list" style={{ marginTop: 12 }}>
        {items.length === 0 && (
          <p className="meta">Nenhum gasto encontrado para o período.</p>
        )}

        {items.map((item) => (
          <div key={item.categoria} className="item">
            <strong>{item.categoria}</strong>
            <strong>{formatCurrency(item.total)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}