import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, grillaProps } from './chartTheme'
import './RedAnual.css'

function TooltipAnio({ active, payload }) {
  if (!active || !payload?.length) return null
  const a = payload[0].payload
  return (
    <ChartTooltip
      title={String(a.anio)}
      rows={[
        { label: 'M4+ medidos en Mw', value: `${a.pct_mw.toLocaleString('es-CL')}%` },
        { label: 'M5+ por cada M4+', value: a.razon_m5_m4.toLocaleString('es-CL', { minimumFractionDigits: 3 }) },
      ]}
    />
  )
}

// Dos paneles: qué escala se usa y cómo cambia la proporción de sismos grandes
function EscalaMagnitud({ escala }) {
  const ticks = escala.filter((a) => a.anio % 4 === 0).map((a) => a.anio)
  const panel = (titulo, clave, dominio, formato) => (
    <div>
      <p className="red-anual__title">{titulo}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={escala} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...grillaProps} vertical={false} />
          <XAxis {...ejeProps} dataKey="anio" ticks={ticks} />
          <YAxis {...ejeProps} domain={dominio} tickFormatter={formato} width={44} />
          <Tooltip content={<TooltipAnio />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
          <Line dataKey={clave} stroke={COLOR.serie} strokeWidth={2} dot={{ r: 3, fill: COLOR.serie }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
  return (
    <div className="red-anual red-anual--dos">
      {panel('% de los sismos M4+ medidos en magnitud momento (Mw)', 'pct_mw', [0, 60], (v) => `${v}%`)}
      {panel('Sismos M5+ por cada sismo M4+', 'razon_m5_m4', [0, 0.2], (v) => v.toLocaleString('es-CL'))}
    </div>
  )
}

export default EscalaMagnitud
