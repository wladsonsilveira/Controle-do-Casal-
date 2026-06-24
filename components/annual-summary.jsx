'use client';

import { formatCurrency } from '../lib/finance';

export default function AnnualSummary({ items }) {
  return (
    <div className="card">
      <h2>Resumo anual por mês</h2>

      <div className="table-wrap" style={{ marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Mês</th>
              <th>Receitas</th>
              <th>Gastos</th>
              <th>Economias</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.month}>
                <td>{item.month}</td>
                <td>{formatCurrency(item.receitas)}</td>
                <td>{formatCurrency(item.gastos)}</td>
                <td>{formatCurrency(item.economias)}</td>
                <td>{formatCurrency(item.saldo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}