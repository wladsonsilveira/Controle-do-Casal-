'use client';

export default function AvisosBoard({ dashboard }) {
  const avisos = [];

  if (dashboard.limiteGastos > 0 && dashboard.percentualLimiteGastos >= 100) {
    avisos.push('O limite de gastos do mês foi atingido. Vale revisar as despesas variáveis.');
  } else if (dashboard.limiteGastos > 0 && dashboard.percentualLimiteGastos >= 80) {
    avisos.push('Atenção: os gastos estão próximos do limite definido para o mês.');
  } else {
    avisos.push('Os gastos estão sob controle no momento.');
  }

  if (dashboard.metaEconomia > 0 && dashboard.percentualMetaEconomia >= 100) {
    avisos.push('Parabéns: a meta de economia do mês já foi concluída.');
  } else if (dashboard.metaEconomia > 0) {
    avisos.push('Continuem registrando economias para avançar na meta mensal.');
  }

  if (dashboard.saldo < 0) {
    avisos.push('O saldo real ficou negativo. Talvez seja hora de segurar gastos não essenciais.');
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