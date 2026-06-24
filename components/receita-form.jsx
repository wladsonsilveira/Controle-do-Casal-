'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ReceitaForm({ onSaved }) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data_referencia: ''
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('receitas').insert([
      {
        descricao: form.descricao,
        valor: Number(form.valor),
        data_referencia: form.data_referencia
      }
    ]);

    if (error) {
      alert('Erro ao salvar receita: ' + error.message);
      console.error('Erro receita:', error);
      setLoading(false);
      return;
    }

    setForm({
      descricao: '',
      valor: '',
      data_referencia: ''
    });

    if (onSaved) {
      await onSaved();
    }

    setLoading(false);
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>Nova receita</h2>

      <input
        className="input"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        required
      />

      <div className="form-row">
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
          required
        />

        <input
          className="input"
          type="date"
          value={form.data_referencia}
          onChange={(e) => setForm({ ...form, data_referencia: e.target.value })}
          required
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar receita'}
      </button>
    </form>
  );
}