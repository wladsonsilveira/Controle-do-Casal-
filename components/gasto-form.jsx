'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const initialState = {
  descricao: '',
  valor: '',
  categoria: 'Casa',
  tipo: 'variavel',
  data_referencia: '',
  recorrente: false,
  frequencia: '',
  quantidade_repeticoes: 1
};

function addMonths(dateString, monthsToAdd) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setMonth(date.getMonth() + monthsToAdd);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');

  return `${newYear}-${newMonth}-${newDay}`;
}

function addDays(dateString, daysToAdd) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + daysToAdd);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');

  return `${newYear}-${newMonth}-${newDay}`;
}

function buildRecurringRows(form) {
  const total = Number(form.quantidade_repeticoes || 1);
  const rows = [];

  for (let index = 0; index < total; index += 1) {
    const data_referencia =
      form.frequencia === 'mensal'
        ? addMonths(form.data_referencia, index)
        : addDays(form.data_referencia, index * 7);

    rows.push({
      descricao: form.descricao,
      valor: Number(form.valor),
      categoria: form.categoria,
      tipo: form.tipo,
      data_referencia,
      recorrente: true,
      frequencia: form.frequencia,
      quantidade_repeticoes: total,
      ativo: true
    });
  }

  return rows;
}

export default function GastoForm({ onSaved, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem?.origem === 'gasto') {
      setForm({
        descricao: editingItem.descricao || '',
        valor: editingItem.valor || '',
        categoria: editingItem.categoria || 'Casa',
        tipo: editingItem.tipo || 'variavel',
        data_referencia: editingItem.data_referencia || '',
        recorrente: Boolean(editingItem.recorrente),
        frequencia: editingItem.frequencia || '',
        quantidade_repeticoes: editingItem.quantidade_repeticoes || 1
      });
    }
  }, [editingItem]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleRecurringChange(checked) {
    if (!checked) {
      setForm((prev) => ({
        ...prev,
        recorrente: false,
        frequencia: '',
        quantidade_repeticoes: 1
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      recorrente: true,
      frequencia: prev.frequencia || 'mensal',
      quantidade_repeticoes: prev.quantidade_repeticoes || 1
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (editingItem?.origem === 'gasto') {
      const payload = {
        descricao: form.descricao,
        valor: Number(form.valor),
        categoria: form.categoria,
        tipo: form.tipo,
        data_referencia: form.data_referencia,
        recorrente: form.recorrente,
        frequencia: form.recorrente ? form.frequencia : null,
        quantidade_repeticoes: form.recorrente
          ? Number(form.quantidade_repeticoes || 1)
          : null,
        ativo: true
      };

      const { error } = await supabase
        .from('gastos')
        .update(payload)
        .eq('id', editingItem.id);

      if (error) {
        alert('Erro ao atualizar gasto: ' + error.message);
        setLoading(false);
        return;
      }

      setForm(initialState);
      onCancelEdit?.();
      await onSaved?.();
      setLoading(false);
      return;
    }

    const rows = form.recorrente
      ? buildRecurringRows(form)
      : [
          {
            descricao: form.descricao,
            valor: Number(form.valor),
            categoria: form.categoria,
            tipo: form.tipo,
            data_referencia: form.data_referencia,
            recorrente: false,
            frequencia: null,
            quantidade_repeticoes: null,
            ativo: true
          }
        ];

    const { error } = await supabase.from('gastos').insert(rows);

    if (error) {
      alert('Erro ao salvar gasto: ' + error.message);
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
      <h2>{editingItem?.origem === 'gasto' ? 'Editar gasto' : 'Novo gasto'}</h2>

      <input
        className="input"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => updateField('descricao', e.target.value)}
        required
      />

      <div className="form-row">
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => updateField('valor', e.target.value)}
          required
        />

        <select
          className="select"
          value={form.categoria}
          onChange={(e) => updateField('categoria', e.target.value)}
        >
          <option>Casa</option>
          <option>Mercado</option>
          <option>Transporte</option>
          <option>Saúde</option>
          <option>Lazer</option>
          <option>Educação</option>
          <option>Assinaturas</option>
          <option>Cartão</option>
          <option>Outros</option>
        </select>
      </div>

      <div className="form-row">
        <select
          className="select"
          value={form.tipo}
          onChange={(e) => updateField('tipo', e.target.value)}
        >
          <option value="fixo">Fixo</option>
          <option value="variavel">Variável</option>
        </select>

        <input
          className="input"
          type="date"
          value={form.data_referencia}
          onChange={(e) => updateField('data_referencia', e.target.value)}
          required
        />
      </div>

      {!editingItem && (
        <>
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.recorrente}
              onChange={(e) => handleRecurringChange(e.target.checked)}
            />
            <span>Replicar como gasto recorrente</span>
          </label>

          {form.recorrente && (
            <div className="recurring-box">
              <div className="form-row">
                <select
                  className="select"
                  value={form.frequencia}
                  onChange={(e) => updateField('frequencia', e.target.value)}
                  required
                >
                  <option value="mensal">Mensal</option>
                  <option value="semanal">Semanal</option>
                </select>

                <input
                  className="input"
                  type="number"
                  min="1"
                  placeholder="Quantidade de repetições"
                  value={form.quantidade_repeticoes}
                  onChange={(e) =>
                    updateField('quantidade_repeticoes', e.target.value)
                  }
                  required
                />
              </div>

              <p className="meta">
                Exemplo: mensal + 6 cria 6 lançamentos; semanal + 8 cria 8 lançamentos.
              </p>
            </div>
          )}
        </>
      )}

      {editingItem?.origem === 'gasto' && (
        <div className="notice">
          A edição altera apenas este lançamento já criado.
        </div>
      )}

      <div className="form-actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading
            ? 'Salvando...'
            : editingItem?.origem === 'gasto'
              ? 'Atualizar gasto'
              : 'Cadastrar gasto'}
        </button>

        {editingItem?.origem === 'gasto' && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}