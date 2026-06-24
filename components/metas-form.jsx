'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MetasForm({ month, metaMensal, onSaved }) {
  const [form, setForm] = useState({
    meta_economia: '',
    limite_gastos: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      meta_economia: metaMensal?.meta_economia ?? '',
      limite_gastos: metaMensal?.limite_gastos ?? ''
    });
  }, [metaMensal]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('metas_mensais').upsert(
      {
        mes: month,
        meta_economia: Number(form.meta_economia || 0),
        limite_gastos: Number(form.limite_gastos || 0)
      },
      { onConflict: 'mes' }
    );

    if (error) {
      alert('Erro ao salvar metas: ' + error.message);
      setLoading(false);
      return;
    }

    await onSaved?.();
    setLoading(false);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="card-heading">
        <div>
          <h2>Metas do mês</h2>
          <p className="meta">Defina o alvo de economia e o limite máximo de gastos.</p>
        </div>
        <span className="badge neutral">{month}</span>
      </div>

      <div className="form-row">
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Meta de economia"
          value={form.meta_economia}
          onChange={(e) => setForm({ ...form, meta_economia: e.target.value })}
        />

        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Limite de gastos"
          value={form.limite_gastos}
          onChange={(e) => setForm({ ...form, limite_gastos: e.target.value })}
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar metas'}
      </button>
    </form>
  );
}