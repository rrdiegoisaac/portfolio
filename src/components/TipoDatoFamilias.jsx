import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function TooltipFamilia({ active, payload }) {
  if (!active || !payload?.length) return null
  const f = payload[0].payload
  return (
    <ChartTooltip
      title={f.familia}
      rows={[
        { label: 'Casos policiales', value: formatoNumero(f.casos) },
        { label: 'Denuncias', value: `${formatoNumero(f.denuncias)} (${decimal1(100 - f.pct_detenciones)}%)` },
        { label: 'Detenciones en flagrancia', value: `${formatoNumero(f.detenciones)} (${decimal1(f.pct_detenciones)}%)` },
      ]}
    />
  )
}

// Barras 100% apiladas: qué parte de los casos de cada familia viene de denuncias y qué parte de detenciones
function TipoDatoFamilias({ familias }) {
  const filas = [...familias]
    .sort((a, b) => b.pct_detenciones - a.pct_detenciones)
    .map((f) => ({ ...f, pct_denuncias: 100 - f.pct_detenciones }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={filas} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap={6}>
        <CartesianGrid {...grillaProps} horizontal={false} />
        <XAxis {...ejeProps} type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis {...ejeProps} type="category" dataKey="familia" width={190} />
        <Tooltip content={<TooltipFamilia />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Bar name="Detenciones en flagrancia" dataKey="pct_detenciones" stackId="a" fill={COLOR.serie2} maxBarSize={22} isAnimationActive={false} />
        <Bar
          name="Denuncias"
          dataKey="pct_denuncias"
          stackId="a"
          fill={COLOR.serie}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TipoDatoFamilias
