export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

export function getMonthFromDate(dateValue) {
  if (!dateValue) return '';
  return String(dateValue).slice(0, 7);
}

export function getCategorySummary(gastos = []) {
  const grouped = gastos.reduce((acc, item) => {
    const categoria = item.categoria || 'Outros';
    acc[categoria] = (acc[categoria] || 0) + Number(item.valor || 0);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

export function getDashboardData(receitas = [], gastos = [], economias = [], meta = null) {
  const totalReceitas = receitas.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalGastos = gastos.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalEconomias = economias.reduce((sum, item) => sum + Number(item.valor || 0), 0);

  const saldo = totalReceitas - totalGastos - totalEconomias;
  const percentualUsado = totalReceitas > 0 ? (totalGastos / totalReceitas) * 100 : 0;

  const metaEconomia = Number(meta?.meta_economia || 0);
  const limiteGastos = Number(meta?.limite_gastos || 0);

  const percentualMetaEconomia =
    metaEconomia > 0 ? Math.min((totalEconomias / metaEconomia) * 100, 100) : 0;

  const percentualLimiteGastos =
    limiteGastos > 0 ? (totalGastos / limiteGastos) * 100 : 0;

  let alerta = 'Tudo sob controle';

  if (totalReceitas === 0 && (totalGastos > 0 || totalEconomias > 0)) {
    alerta = 'Sem receitas cadastradas e já existem saídas';
  } else if (limiteGastos > 0 && percentualLimiteGastos >= 100) {
    alerta = 'Limite de gastos atingido';
  } else if (percentualUsado >= 100) {
    alerta = 'Gastos acima da receita';
  } else if (limiteGastos > 0 && percentualLimiteGastos >= 80) {
    alerta = 'Atenção: gastos próximos do limite mensal';
  } else if (metaEconomia > 0 && percentualMetaEconomia >= 100) {
    alerta = 'Meta de economia concluída';
  }

  return {
    totalReceitas,
    totalGastos,
    totalEconomias,
    saldo,
    percentualUsado,
    alerta,
    metaEconomia,
    limiteGastos,
    percentualMetaEconomia,
    percentualLimiteGastos,
    categorySummary: getCategorySummary(gastos)
  };
}