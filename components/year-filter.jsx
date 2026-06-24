'use client';

export default function YearFilter({ year, setYear }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, index) => currentYear - index);

  return (
    <div className="card filter-card">
      <h2 style={{ marginBottom: 12 }}>Resumo anual</h2>

      <div className="form-row">
        <select
          className="select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}