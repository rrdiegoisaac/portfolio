import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps, margenMapa } from './chartTheme'

function TooltipFranja({ active, payload }) {
  if (!active || !payload?.length) return null
  const franja = payload[0].payload
  return (
    <ChartTooltip title={franja.etiqueta} rows={[{ label: 'Sismos', value: formatoNumero(franja.sismos) }]} />
  )
}

function SismosPorLatitud({ franjas, height }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={franjas} layout="vertical" margin={margenMapa} barCategoryGap={1}>
        <CartesianGrid {...grillaProps} horizontal={false} />
        <XAxis
          {...ejeProps}
          type="number"
          ticks={[0, 5000, 10000, 15000, 20000]}
          tickFormatter={formatoNumero}
          height={24}
        />
        <YAxis
          {...ejeProps}
          type="category"
          dataKey="latitud"
          interval={1}
          tickFormatter={(v) => `${Math.abs(v)}°S`}
          width={40}
        />
        <Tooltip content={<TooltipFranja />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Bar dataKey="sismos" fill={COLOR.serie} radius={[0, 4, 4, 0]} maxBarSize={12} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SismosPorLatitud
