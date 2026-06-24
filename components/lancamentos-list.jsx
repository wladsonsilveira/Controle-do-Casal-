'use client';

import { formatCurrency } from '../lib/finance';
import { supabase } from '../lib/supabase';

export default function LancamentosList({ receitas, gastos, reloadData }) {
  const items = [
    ...receitas.map((item) => ({ ...item, origem: 'receita' })),
    ...gastos.map((item) => ({ ...item, origem: 'gasto' }))
  ].sort((a, b) => new Date(b.data_referencia) - new Date(a.data_referencia));

  async function handleDelete(item) {
    const confirmar = window.confirm(`Deseja excluir "${item.descricao}"?`);
    if (!confirmar) return;

    const tabela = item.origem === 'receita' ? 'receitas' : 'gastos';

    const { error } = await supabase
      .from(tabela)
      .delete()
      .eq('id', item.id);

    if (error) {
      alert(`Erro ao excluir ${item.origem}: ${error.message}`);
      console.error('Erro ao excluir:', error);
      return;
    }

    await reloadData();
    alert('Lançamento excluído com sucesso.');
  }

  return (
    <div className="card">
      <h2>Últimos lançamentos</h2>

      <div className="list" style={{ marginTop: 12 }}>
        {items.length === 0 && (
          <p className="meta">Nenhum lançamento cadastrado neste mês.</p>
        )}

        {items.map((item) => (
          <div key={`${item.origem}-${item.id}`} className="item">
            <div>
              <strong>{item.descricao}</strong>
              <div className="meta">
                {item.origem === 'receita' ? 'Receita' : `Gasto ${item.tipo}`} • {item.data_referencia}
              </div>
            </div>

            <div className="item-actions">
              <strong style={{ color: item.origem === 'receita' ? '#166534' : '#b91c1c' }}>
                {item.origem === 'receita' ? '+' : '-'} {formatCurrency(item.valor)}
              </strong>

              <button
                type="button"
                className="small-btn"
                onClick={() => handleDelete(item)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}