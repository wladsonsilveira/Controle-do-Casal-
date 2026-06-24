'use client';

import { useMemo } from 'react';
import { formatCurrency } from '../lib/finance';
import { supabase } from '../lib/supabase';

export default function LancamentosList({
  receitas,
  gastos,
  economias,
  reloadData,
  setEditingItem
}) {
  const items = useMemo(() => {
    return [
      ...receitas.map((item) => ({ ...item, origem: 'receita' })),
      ...gastos.map((item) => ({ ...item, origem: 'gasto' })),
      ...economias.map((item) => ({ ...item, origem: 'economia' }))
    ].sort((a, b) => new Date(b.data_referencia) - new Date(a.data_referencia));
  }, [receitas, gastos, economias]);

  async function handleDelete(item) {
    const confirmar = window.confirm(`Deseja excluir "${item.descricao}"?`);
    if (!confirmar) return;

    const tabela =
      item.origem === 'receita'
        ? 'receitas'
        : item.origem === 'gasto'
          ? 'gastos'
          : 'economias';

    const { error } = await supabase.from(tabela).delete().eq('id', item.id);

    if (error) {
      alert(`Erro ao excluir ${item.origem}: ${error.message}`);
      return;
    }

    await reloadData();
  }

  return (
    <div className="card">
      <div className="card-heading">
        <div>
          <h2>Últimos lançamentos</h2>
          <p className="meta">Receitas, gastos e economias no mesmo histórico.</p>
        </div>
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {items.length === 0 && (
          <p className="meta">Nenhum lançamento cadastrado neste período.</p>
        )}

        {items.map((item) => (
          <div key={`${item.origem}-${item.id}`} className="item item-stack-mobile">
            <div>
              <strong>{item.descricao}</strong>

              <div className="meta">
                {item.origem === 'receita' && `Receita • ${item.data_referencia}`}

                {item.origem === 'gasto' &&
                  `Gasto ${item.tipo} • ${item.categoria} • ${item.data_referencia}`}

                {item.origem === 'economia' && `Economia • ${item.data_referencia}`}
              </div>

              {item.origem === 'gasto' && item.recorrente && (
                <div style={{ marginTop: 8 }}>
                  <span className="badge neutral">
                    Recorrente • {item.frequencia || 'sem frequência'}
                  </span>
                </div>
              )}
            </div>

            <div className="item-actions">
              <strong
                style={{
                  color:
                    item.origem === 'receita'
                      ? '#166534'
                      : item.origem === 'economia'
                        ? '#0f766e'
                        : '#b91c1c'
                }}
              >
                {item.origem === 'receita' ? '+' : '-'} {formatCurrency(item.valor)}
              </strong>

              <button
                type="button"
                className="small-btn edit-btn"
                onClick={() => setEditingItem(item)}
              >
                Editar
              </button>

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