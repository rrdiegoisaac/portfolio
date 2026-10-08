import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function TooltipAnio({ active, payload }) {
  if (!active || !payload?.length) return null
  const a = payload[0].payload
  return (
    <ChartTooltip
      title={String(a.anio)}
      rows={[
        { label: 'Casos por 100.000 hab.', value: decimal1(a.tasa) },
        { label: 'Casos policiales', value: formatoNumero(a.casos) },
        { label: 'Con detención en flagrancia', value: `${decimal1(a.pct_detenciones)}%` },
      ]}
    />
  )
}

// Tasa anual de casos policiales de homicidio. Se rotulan solo el primer año, el de referencia y los dos últimos.
function HomicidiosAnual({ anual, referencia }) {
  const rotulados = new Set([anual[0].anio, referencia, ...anual.slice(-2).map((a) => a.anio)])
  const datos = anual.map((a) => ({ ...a, etiqueta: rotulados.has(a.anio) ? decimal1(a.tasa) : '' }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={datos} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis {...ejeProps} dataKey="anio" ticks={datos.filter((a) => a.anio % 5 === 0).map((a) => a.anio)} />
        <YAxis {...ejeProps} tickFormatter={decimal1} width={36} />
        <Tooltip content={<TooltipAnio />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Bar dataKey="tasa" fill={COLOR.serie} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false}>
          <LabelList dataKey="etiqueta" position="top" style={{ fill: 'var(--text)', fontSize: 11 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default HomicidiosAnual
