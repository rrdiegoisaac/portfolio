import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const porcentaje = (v) => `${Math.round(v)}%`

function TooltipSubgrupo({ active, payload }) {
  if (!active || !payload?.length) return null
  const s = payload[0].payload
  return (
    <ChartTooltip
      title={s.subgrupo}
      rows={[
        { label: 'Familia', value: s.familia },
        { label: 'Casos policiales', value: formatoNumero(s.casos) },
        { label: 'Detenciones en flagrancia', value: porcentaje(s.pct_detenciones) },
      ]}
    />
  )
}

// % de detenciones en flagrancia por subgrupo, de mayor a menor
function DetencionesSubgrupo({ subgrupos }) {
  return (
    <ResponsiveContainer width="100%" height={subgrupos.length * 24 + 40}>
      <BarChart data={subgrupos} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={4}>
        <CartesianGrid {...grillaProps} horizontal={false} />
        <XAxis {...ejeProps} type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={porcentaje} />
        <YAxis {...ejeProps} type="category" dataKey="subgrupo" width={230} interval={0} tick={{ ...ejeProps.tick, fontSize: 11 }} />
        <Tooltip content={<TooltipSubgrupo />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <ReferenceLine x={50} stroke={COLOR.eje} strokeDasharray="4 4" />
        <Bar dataKey="pct_detenciones" fill={COLOR.serie2} radius={[0, 4, 4, 0]} maxBarSize={16} isAnimationActive={false}>
          <LabelList dataKey="pct_detenciones" position="right" formatter={porcentaje} style={{ fill: 'var(--text)', fontSize: 11 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DetencionesSubgrupo
