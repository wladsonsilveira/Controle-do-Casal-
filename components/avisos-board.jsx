'use client';

export default function AvisosBoard({ dashboard }) {
  const avisos = [];

  if (dashboard.percentualUsado >= 100) {
    avisos.push('Os gastos já ultrapassaram a receita. Revisem despesas variáveis hoje.');
  } else if (dashboard.percentualUsado >= 80) {
    avisos.push('Atenção: vocês já comprometeram boa parte da renda do mês.');
  } else {
    avisos.push('Situação saudável no momento. Continuem acompanhando os lançamentos.');
  }

  if (dashboard.saldo > 0) {
    avisos.push('Avaliem separar parte do saldo para reserva ou meta do casal.');
  }

  return (
    <div className="card">
      <h2>Quadro de avisos</h2>

      <div className="list" style={{ marginTop: 12 }}>
        {avisos.map((aviso, index) => (
          <div key={index} className="notice">
            {aviso}
          </div>
        ))}
      </div>
    </div>
  );
}