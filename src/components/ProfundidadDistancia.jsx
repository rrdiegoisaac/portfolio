import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

function TooltipTramo({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const rows = []
  if (d.norte_grande != null) {
    rows.push({ label: `Norte Grande (${formatoNumero(d.norte_grande_n)} sismos)`, value: `${d.norte_grande} km` })
  }
  if (d.resto != null) {
    rows.push({ label: `Norte Chico al Sur (${formatoNumero(d.resto_n)} sismos)`, value: `${d.resto} km` })
  }
  return <ChartTooltip title={`A ${d.etiqueta} km de la fosa`} rows={rows} />
}

function ProfundidadDistancia({ tramos }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={tramos} margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis
          {...ejeProps}
          dataKey="etiqueta"
          label={{ value: 'Distancia a la fosa (km)', position: 'insideBottom', offset: -12, fill: 'var(--muted)', fontSize: 12 }}
        />
        <YAxis {...ejeProps} reversed domain={[0, 260]} ticks={[0, 50, 100, 150, 200, 250]} width={40} />
        <Tooltip content={<TooltipTramo />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Line
          name="Norte Grande"
          dataKey="norte_grande"
          stroke={COLOR.serie}
          strokeWidth={2}
          dot={{ r: 4, fill: COLOR.serie, stroke: COLOR.superficie, strokeWidth: 2 }}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          name="Norte Chico al Sur"
          dataKey="resto"
          stroke={COLOR.serie2}
          strokeWidth={2}
          dot={{ r: 4, fill: COLOR.serie2, stroke: COLOR.superficie, strokeWidth: 2 }}
          connectNulls
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ProfundidadDistancia
