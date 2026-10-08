import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import './TendenciaFamilias.css'

const signo = (v) => `${v > 0 ? '+' : ''}${Math.round(v)}%`

function TooltipAnio({ active, payload, clave }) {
  if (!active || !payload?.length) return null
  const a = payload[0].payload
  return <ChartTooltip title={String(a.anio)} rows={[{ label: 'Casos por 100.000 hab.', value: formatoNumero(Math.round(a[clave])) }]} />
}

// Paneles pequeños, uno por familia, cada uno con su propio eje vertical (desde 0):
// los niveles son muy distintos, lo que se compara es la forma de cada curva
function TendenciaFamilias({ anual, paneles, referencia }) {
  const ticks = anual.filter((a) => a.anio % 5 === 0).map((a) => a.anio)
  return (
    <div className="tendencia-familias">
      {paneles.map((p) => (
        <div key={p.clave} className={p.destacado ? 'tendencia-familias__panel--destacado' : undefined}>
          <p className="tendencia-familias__title">{p.titulo}</p>
          <p className="tendencia-familias__dato">
            {formatoNumero(Math.round(p.fin))} por 100.000 hab. · {signo(p.cambio)} vs. {referencia}
          </p>
          <ResponsiveContainer width="100%" height={p.destacado ? 220 : 150}>
            <LineChart data={anual} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid {...grillaProps} vertical={false} />
              <XAxis {...ejeProps} dataKey="anio" ticks={ticks} />
              <YAxis {...ejeProps} domain={[0, 'auto']} tickFormatter={formatoNumero} width={44} tickCount={3} />
              <Tooltip content={<TooltipAnio clave={p.clave} />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
              <ReferenceLine x={referencia} stroke={COLOR.eje} strokeDasharray="4 4" />
              <Line
                dataKey={p.clave}
                stroke={p.apagado ? COLOR.eje : COLOR.serie}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}

export default TendenciaFamilias
