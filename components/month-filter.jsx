'use client';

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function MonthFilter({ month, setMonth, allMonths, setAllMonths }) {
  function handleMonthChange(e) {
    const value = e.target.value;

    if (!value) {
      setMonth(getCurrentMonth());
      setAllMonths(false);
      return;
    }

    setMonth(value);
    setAllMonths(false);
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Filtro mensal</h2>

      <div className="form-row">
        <input
          className="input"
          type="month"
          value={allMonths ? '' : month}
          onChange={handleMonthChange}
        />

        <button
          type="button"
          className="btn"
          onClick={() => {
            setMonth(getCurrentMonth());
            setAllMonths(false);
          }}
        >
          Mês atual
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setAllMonths(true)}
        >
          Todos os meses
        </button>
      </div>
    </div>
  );
}