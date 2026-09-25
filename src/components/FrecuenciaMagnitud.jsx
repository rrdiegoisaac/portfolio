import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, grillaProps } from './chartTheme'

const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const numero = (v) => v.toLocaleString('es-CL', { maximumFractionDigits: v < 10 ? 1 : 0 })

function TooltipTramo({ active, payload, nombres }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <ChartTooltip
      title={`Magnitud ${decimal1(d.magnitud)}`}
      rows={[
        { label: nombres.a, value: d.a != null ? `${numero(d.a)} al año` : '—' },
        { label: nombres.b, value: d.b != null ? `${numero(d.b)} al año` : '—' },
      ]}
    />
  )
}

// Histograma no acumulado (tramos de 0,1) en escala logarítmica, para dos períodos.
// En escala log, la ley de Gutenberg-Richter es una recta; su pendiente es el valor b.
function FrecuenciaMagnitud({ histograma, periodos }) {
  const nombres = {
    a: `${periodos.a[0]}–${periodos.a[1]}`,
    b: `${periodos.b[0]}–${periodos.b[1]}`,
  }
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={histograma} margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis
          {...ejeProps}
          dataKey="magnitud"
          type="number"
          domain={[2.5, 8.8]}
          ticks={[3, 4, 5, 6, 7, 8]}
          label={{ value: 'Magnitud', position: 'insideBottom', offset: -12, fill: 'var(--muted)', fontSize: 12 }}
        />
        <YAxis
          {...ejeProps}
          scale="log"
          domain={[0.01, 10000]}
          ticks={[0.01, 0.1, 1, 10, 100, 1000, 10000]}
          allowDataOverflow
          tickFormatter={(v) => v.toLocaleString('es-CL')}
          width={56}
        />
        <Tooltip content={<TooltipTramo nombres={nombres} />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Line name={nombres.a} dataKey="a" stroke={COLOR.serie} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
        <Line name={nombres.b} dataKey="b" stroke={COLOR.serie2} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default FrecuenciaMagnitud
