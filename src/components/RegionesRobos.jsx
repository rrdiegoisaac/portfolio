import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const entero = (v) => formatoNumero(Math.round(v))

function TooltipRegion({ active, payload, referencia, anio }) {
  if (!active || !payload?.length) return null
  const r = payload[0].payload
  return (
    <ChartTooltip
      title={r.region}
      rows={[
        { label: `Robos violentos ${anio}`, value: `${entero(r.tasa_robos_violentos)} por 100.000 hab.` },
        { label: `Robos violentos ${referencia}`, value: `${entero(r.tasa_robos_violentos_referencia)} por 100.000 hab.` },
        { label: 'Población', value: formatoNumero(r.poblacion) },
      ]}
    />
  )
}

// Tasa de robos violentos por región, de norte a sur, en el año de referencia y en el último año completo
function RegionesRobos({ regiones, pais, referencia, anio }) {
  const filas = [...regiones, { ...pais, region: 'Total país' }]
  return (
    <ResponsiveContainer width="100%" height={filas.length * 30 + 40}>
      <BarChart data={filas} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barGap={2} barCategoryGap={6}>
        <CartesianGrid {...grillaProps} horizontal={false} />
        <XAxis {...ejeProps} type="number" tickFormatter={formatoNumero} />
        <YAxis {...ejeProps} type="category" dataKey="region" width={130} interval={0} />
        <Tooltip content={<TooltipRegion referencia={referencia} anio={anio} />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Bar name={String(referencia)} dataKey="tasa_robos_violentos_referencia" fill={COLOR.apagado} radius={[0, 4, 4, 0]} maxBarSize={10} isAnimationActive={false} />
        <Bar name={String(anio)} dataKey="tasa_robos_violentos" fill={COLOR.serie} radius={[0, 4, 4, 0]} maxBarSize={10} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RegionesRobos
