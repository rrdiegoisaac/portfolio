import './ChartTooltip.css'

// Tooltip genérico: recibe un título y filas [{ label, value }]
function ChartTooltip({ title, rows }) {
  return (
    <div className="chart-tooltip">
      {title && <p className="chart-tooltip__title">{title}</p>}
      <dl className="chart-tooltip__rows">
        {rows.map((row) => (
          <div key={row.label} className="chart-tooltip__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ChartTooltip
