'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const initialState = {
  descricao: '',
  valor: '',
  data_referencia: ''
};

export default function ReceitaForm({ onSaved, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem?.origem === 'receita') {
      setForm({
        descricao: editingItem.descricao || '',
        valor: editingItem.valor || '',
        data_referencia: editingItem.data_referencia || ''
      });
    }
  }, [editingItem]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      descricao: form.descricao,
      valor: Number(form.valor),
      data_referencia: form.data_referencia
    };

    const query = editingItem?.origem === 'receita'
      ? supabase.from('receitas').update(payload).eq('id', editingItem.id)
      : supabase.from('receitas').insert([payload]);

    const { error } = await query;

    if (error) {
      alert('Erro ao salvar receita: ' + error.message);
      setLoading(false);
      return;
    }

    setForm(initialState);
    onCancelEdit?.();
    await onSaved?.();
    setLoading(false);
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>{editingItem?.origem === 'receita' ? 'Editar receita' : 'Nova receita'}</h2>

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

      <div className="form-actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Salvando...' : editingItem?.origem === 'receita' ? 'Atualizar receita' : 'Cadastrar receita'}
        </button>

        {editingItem?.origem === 'receita' && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}