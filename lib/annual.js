export const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function monthIndexFromDate(dateValue) {
  const date = new Date(dateValue);
  return date.getMonth();
}

export function buildAnnualSummary(receitas = [], gastos = [], economias = []) {
  const base = MONTH_LABELS.map((label, index) => ({
    month: label,
    monthIndex: index,
    receitas: 0,
    gastos: 0,
    economias: 0,
    saldo: 0
  }));

  receitas.forEach((item) => {
    const idx = monthIndexFromDate(item.data_referencia);
    base[idx].receitas += Number(item.valor || 0);
  });

  gastos.forEach((item) => {
    const idx = monthIndexFromDate(item.data_referencia);
    base[idx].gastos += Number(item.valor || 0);
  });

  economias.forEach((item) => {
    const idx = monthIndexFromDate(item.data_referencia);
    base[idx].economias += Number(item.valor || 0);
  });

  base.forEach((item) => {
    item.saldo = item.receitas - item.gastos - item.economias;
  });

  return base;
}