import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const nombreMes = (mes) => `${MESES[Number(mes.slice(5, 7)) - 1]} ${mes.slice(0, 4)}`

function TooltipMes({ active, payload, tramos }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <ChartTooltip
      title={nombreMes(d.mes)}
      rows={[
        ...[...tramos].reverse().map((t) => ({ label: `Magnitud ${t}`, value: formatoNumero(d[t]) })),
        { label: 'Medidos con Mlv', value: `${d.pct_mlv.toLocaleString('es-CL')}%` },
      ]}
    />
  )
}

// Sismos por mes apilados por tramo de magnitud (de menor a mayor, del tono más claro al más oscuro)
function MetodoZoom({ datos }) {
  const { zoom, tramos, mlv } = datos
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={zoom} margin={{ top: 16, right: 16, bottom: 0, left: 0 }} barCategoryGap={2}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis
          {...ejeProps}
          dataKey="mes"
          ticks={zoom.filter((d) => ['01', '07'].includes(d.mes.slice(5, 7))).map((d) => d.mes)}
          tickFormatter={nombreMes}
        />
        <YAxis {...ejeProps} tickFormatter={formatoNumero} width={48} />
        <Tooltip content={<TooltipMes tramos={tramos} />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>Magnitud {value}</span>}
        />
        {tramos.map((t, i) => (
          <Bar key={t} dataKey={t} stackId="m" fill={COLOR.secuencial[i]} isAnimationActive={false} />
        ))}
        <ReferenceLine
          x={mlv.habitual_desde}
          stroke="var(--text)"
          strokeDasharray="4 4"
          label={{ value: 'Mlv', position: 'insideTopLeft', fill: 'var(--text)', fontSize: 11 }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default MetodoZoom
