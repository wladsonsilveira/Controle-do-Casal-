'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function GastoForm({ onSaved }) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    categoria: 'Casa',
    tipo: 'variavel',
    data_referencia: ''
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('gastos').insert([
      {
        descricao: form.descricao,
        valor: Number(form.valor),
        categoria: form.categoria,
        tipo: form.tipo,
        data_referencia: form.data_referencia
      }
    ]);

    if (error) {
      alert('Erro ao salvar gasto: ' + error.message);
      console.error('Erro gasto:', error);
      setLoading(false);
      return;
    }

    setForm({
      descricao: '',
      valor: '',
      categoria: 'Casa',
      tipo: 'variavel',
      data_referencia: ''
    });

    if (onSaved) {
      await onSaved();
    }

    setLoading(false);
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>Novo gasto</h2>

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

        <select
          className="select"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        >
          <option>Casa</option>
          <option>Mercado</option>
          <option>Transporte</option>
          <option>Saúde</option>
          <option>Lazer</option>
          <option>Outros</option>
        </select>
      </div>

      <div className="form-row">
        <select
          className="select"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="fixo">Fixo</option>
          <option value="variavel">Variável</option>
        </select>

        <input
          className="input"
          type="date"
          value={form.data_referencia}
          onChange={(e) => setForm({ ...form, data_referencia: e.target.value })}
          required
        />
      </div>

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar gasto'}
      </button>
    </form>
  );
}