import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import './RedAnual.css'

const decimal = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function TooltipAnio({ active, payload }) {
  if (!active || !payload?.length) return null
  const a = payload[0].payload
  const rows = [
    { label: 'Sismos registrados', value: formatoNumero(a.sismos) },
    { label: 'En el Norte Grande (todos)', value: `${decimal(a.pct_norte_grande)}%` },
    { label: 'En el Norte Grande (M4+)', value: `${decimal(a.pct_norte_grande_m4)}%` },
    { label: 'Magnitud más frecuente', value: decimal(a.magnitud_completitud) },
    { label: 'Bajo magnitud 2,5', value: `${decimal(a.pct_bajo_2_5)}%` },
  ]
  if (a.parcial) rows.push({ label: 'Días con datos', value: formatoNumero(a.dias) })
  return <ChartTooltip title={a.parcial ? `${a.anio} (año incompleto)` : String(a.anio)} rows={rows} />
}

const leyenda = (
  <Legend
          itemSorter={null}
    verticalAlign="top"
    align="left"
    height={28}
    wrapperStyle={{ fontSize: 12 }}
    formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
  />
)

// Tres paneles con el mismo eje de años. Son medidas distintas, por eso cada una tiene su propio eje vertical.
function RedAnual({ porAnio, inicioRedEstable, inicioPiso }) {
  const ticksAnios = porAnio.filter((a) => a.anio % 5 === 0).map((a) => a.anio)
  const marca = (anio, texto) => (
    <ReferenceLine
      x={anio}
      stroke={COLOR.eje}
      strokeDasharray="4 4"
      label={{ value: texto, position: 'insideTopRight', fill: 'var(--muted)', fontSize: 11 }}
    />
  )
  const ejeX = <XAxis {...ejeProps} dataKey="anio" ticks={ticksAnios} />
  const tooltip = <Tooltip content={<TooltipAnio />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />

  return (
    <div className="red-anual">
      <div>
        <p className="red-anual__title">Sismos registrados por año</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={porAnio} margin={{ top: 44, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...grillaProps} vertical={false} />
            {ejeX}
            <YAxis {...ejeProps} tickFormatter={formatoNumero} width={48} />
            {tooltip}
            <Bar dataKey="sismos" radius={[3, 3, 0, 0]} maxBarSize={16} isAnimationActive={false}>
              {porAnio.map((a) => (
                <Cell key={a.anio} fill={a.parcial ? COLOR.apagado : COLOR.serie} />
              ))}
            </Bar>
            {marca(inicioRedEstable, String(inicioRedEstable))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="red-anual__title">% de los sismos en el Norte Grande</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={porAnio} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...grillaProps} vertical={false} />
            {ejeX}
            <YAxis {...ejeProps} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} width={40} />
            {tooltip}
            {leyenda}
            <Line name="Todos" dataKey="pct_norte_grande" stroke={COLOR.serie} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line name="Magnitud 4 o más" dataKey="pct_norte_grande_m4" stroke={COLOR.serie2} strokeWidth={2} dot={false} isAnimationActive={false} />
            {marca(inicioRedEstable, String(inicioRedEstable))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="red-anual__title">Magnitud más frecuente del catálogo</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={porAnio} margin={{ top: 44, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...grillaProps} vertical={false} />
            {ejeX}
            <YAxis {...ejeProps} domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} width={28} />
            {tooltip}
            <Line dataKey="magnitud_completitud" stroke={COLOR.serie} strokeWidth={2} dot={false} isAnimationActive={false} />
            {marca(inicioPiso, 'Piso de publicación')}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RedAnual
