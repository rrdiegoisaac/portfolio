import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import { etiquetaMes, ticksAnuales } from './delitos'

function TooltipMes({ active, payload }) {
  if (!active || !payload?.length) return null
  const m = payload[0].payload
  return (
    <ChartTooltip
      title={`12 meses hasta ${etiquetaMes(m.periodo)}`}
      rows={[
        { label: 'Robos con violencia o intimidación', value: formatoNumero(m.robos) },
        { label: 'Robos por sorpresa', value: formatoNumero(m.sorpresa) },
      ]}
    />
  )
}

// Suma móvil de 12 meses: cada punto es el total del año que termina en ese mes
function RobosMovil({ robos, sorpresa }) {
  const porPeriodo = new Map(sorpresa.map((m) => [m.periodo, m.casos]))
  const datos = robos.map((m) => ({ periodo: m.periodo, robos: m.casos, sorpresa: porPeriodo.get(m.periodo) }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis {...ejeProps} dataKey="periodo" ticks={ticksAnuales(datos, 5)} tickFormatter={(p) => p.slice(0, 4)} />
        <YAxis {...ejeProps} domain={[0, 'auto']} tickFormatter={formatoNumero} width={52} />
        <Tooltip content={<TooltipMes />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Line name="Con violencia o intimidación (incl. vehículos)" dataKey="robos" stroke={COLOR.serie} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line name="Por sorpresa" dataKey="sorpresa" stroke={COLOR.serie2} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RobosMovil
