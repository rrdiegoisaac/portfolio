import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const decimal = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1 })

function TooltipAnio({ active, payload }) {
  if (!active || !payload?.length) return null
  const a = payload[0].payload
  return (
    <ChartTooltip
      title={String(a.anio)}
      rows={[
        { label: 'Sismos M4+', value: formatoNumero(a.m4) },
        { label: 'En secuencias de grandes terremotos', value: formatoNumero(a.m4_secuencias) },
        { label: 'Resto', value: formatoNumero(a.m4_resto) },
        { label: 'Sismos M4,5+', value: formatoNumero(a.m45) },
        { label: 'Mayor sismo', value: `${decimal(a.mayor_magnitud)} · ${a.mayor_lugar}` },
      ]}
    />
  )
}

// Barras apiladas: actividad de fondo (abajo) y la que aportan las secuencias de grandes terremotos (arriba)
function TiempoAnual({ anual }) {
  const tope = Math.ceil(Math.max(...anual.map((a) => a.m4)) / 500) * 500
  const ticksY = Array.from({ length: tope / 500 + 1 }, (_, i) => i * 500)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={anual} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis {...ejeProps} dataKey="anio" />
        <YAxis {...ejeProps} domain={[0, tope]} ticks={ticksY} tickFormatter={formatoNumero} width={48} />
        <Tooltip content={<TooltipAnio />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        <Bar name="Actividad de fondo" dataKey="m4_resto" stackId="a" fill={COLOR.serie} maxBarSize={36} isAnimationActive={false} />
        <Bar
          name="Secuencias de grandes terremotos"
          dataKey="m4_secuencias"
          stackId="a"
          fill={COLOR.serie2}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
          isAnimationActive={false}
        >
          <LabelList dataKey="m4" position="top" formatter={formatoNumero} style={{ fill: 'var(--text)', fontSize: 11 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TiempoAnual
