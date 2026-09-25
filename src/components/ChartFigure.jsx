import './ChartFigure.css'

function ChartFigure({ title, subtitle, note, children, wide = false }) {
  return (
    <figure className={`chart-figure${wide ? ' chart-figure--wide' : ''}`}>
      <header className="chart-figure__header">
        <h3 className="chart-figure__title">{title}</h3>
        {subtitle && <p className="chart-figure__subtitle">{subtitle}</p>}
      </header>
      <div className="chart-figure__body">{children}</div>
      {note && <figcaption className="chart-figure__note">{note}</figcaption>}
    </figure>
  )
}

export default ChartFigure
