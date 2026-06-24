'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AnnualChart({ items }) {
  const data = {
    labels: items.map((item) => item.month),
    datasets: [
      {
        label: 'Receitas',
        data: items.map((item) => item.receitas),
        backgroundColor: '#166534'
      },
      {
        label: 'Gastos',
        data: items.map((item) => item.gastos),
        backgroundColor: '#b91c1c'
      },
      {
        label: 'Economias',
        data: items.map((item) => item.economias),
        backgroundColor: '#0f766e'
      },
      {
        label: 'Saldo',
        data: items.map((item) => item.saldo),
        backgroundColor: '#d19900'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="card">
      <h2>Gráfico anual</h2>
      <div className="chart-wide">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}