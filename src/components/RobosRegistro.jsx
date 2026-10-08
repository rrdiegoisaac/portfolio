import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import { etiquetaMes, ticksAnuales } from './delitos'

function TooltipMes({ active, payload }) {
  if (!active || !payload?.length) return null
  const m = payload[0].payload
  return (
    <ChartTooltip
      title={etiquetaMes(m.periodo)}
      rows={[
        { label: 'Robo con violencia o intimidación', value: formatoNumero(m.robo_con_violencia) },
        { label: 'Robo violento de vehículo', value: formatoNumero(m.robo_violento_vehiculo) },
        { label: 'Suma', value: formatoNumero(m.robo_con_violencia + m.robo_violento_vehiculo) },
      ]}
    />
  )
}

// Áreas apiladas por mes: desde que el CEAD separa los robos violentos de vehículos, la suma sigue siendo comparable
function RobosRegistro({ meses, desde, marca }) {
  const datos = meses.filter((m) => m.periodo >= desde)
  const ticks = ticksAnuales(datos)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis {...ejeProps} dataKey="periodo" ticks={ticks} tickFormatter={(p) => p.slice(0, 4)} />
        <YAxis {...ejeProps} tickFormatter={formatoNumero} width={48} />
        <Tooltip content={<TooltipMes />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Area
          name="Robo con violencia o intimidación"
          dataKey="robo_con_violencia"
          stackId="a"
          stroke={COLOR.serie}
          strokeWidth={2}
          fill={COLOR.serie}
          fillOpacity={0.35}
          isAnimationActive={false}
        />
        <Area
          name="Robo violento de vehículo"
          dataKey="robo_violento_vehiculo"
          stackId="a"
          stroke={COLOR.serie2}
          strokeWidth={2}
          fill={COLOR.serie2}
          fillOpacity={0.35}
          isAnimationActive={false}
        />
        <ReferenceLine
          x={marca}
          stroke={COLOR.eje}
          strokeDasharray="4 4"
          label={{ value: 'Se registra aparte', position: 'insideTopLeft', fill: 'var(--muted)', fontSize: 11 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default RobosRegistro
