import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import { etiquetaMes, ticksAnuales } from './delitos'
import './QuiebresRegistro.css'

function TooltipMes({ active, payload }) {
  if (!active || !payload?.length) return null
  const m = payload[0].payload
  return <ChartTooltip title={etiquetaMes(m.periodo)} rows={[{ label: 'Casos policiales', value: formatoNumero(m.casos) }]} />
}

// Un panel por subgrupo: casos por mes, con una línea en el mes en que cambia el registro.
// Cada panel tiene su propio eje vertical porque las cantidades son muy distintas.
function QuiebresRegistro({ paneles }) {
  return (
    <div className="quiebres">
      {paneles.map((p) => (
        <div key={p.titulo}>
          <p className="quiebres__title">{p.titulo}</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={p.meses} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid {...grillaProps} vertical={false} />
              <XAxis {...ejeProps} dataKey="periodo" ticks={ticksAnuales(p.meses, 5)} tickFormatter={(v) => v.slice(0, 4)} />
              <YAxis {...ejeProps} tickFormatter={formatoNumero} width={52} />
              <Tooltip content={<TooltipMes />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
              <Line dataKey="casos" stroke={COLOR.serie} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <ReferenceLine
                x={p.marca}
                stroke={COLOR.eje}
                strokeDasharray="4 4"
                label={{ value: p.textoMarca, position: 'insideTopRight', fill: 'var(--muted)', fontSize: 11 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}

export default QuiebresRegistro
