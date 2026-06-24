'use client';

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GastosChart({ items }) {
  if (!items.length) {
    return (
      <div className="card">
        <h2>Gráfico de gastos</h2>
        <p className="meta" style={{ marginTop: 12 }}>
          Adicione gastos para visualizar o gráfico por categoria.
        </p>
      </div>
    );
  }

  const data = {
    labels: items.map((item) => item.categoria),
    datasets: [
      {
        data: items.map((item) => Number(item.total)),
        backgroundColor: [
          '#01696f',
          '#0f766e',
          '#d19900',
          '#da7101',
          '#006494',
          '#7a39bb',
          '#a13544',
          '#437a22'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
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
      <h2>Gráfico de gastos por categoria</h2>
      <div className="chart-wrap">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}