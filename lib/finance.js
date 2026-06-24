export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

export function getDashboardData(receitas = [], gastos = []) {
  const totalReceitas = receitas.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const saldo = totalReceitas - totalGastos;
  const percentualUsado = totalReceitas > 0 ? (totalGastos / totalReceitas) * 100 : 0;

  let alerta = 'Tudo sob controle';
  if (totalReceitas === 0 && totalGastos > 0) alerta = 'Sem receita cadastrada e já existem gastos';
  else if (percentualUsado >= 100) alerta = 'Gastos acima da receita';
  else if (percentualUsado >= 80) alerta = 'Atenção: gastos próximos do limite';

  return {
    totalReceitas,
    totalGastos,
    saldo,
    percentualUsado,
    alerta
  };
}