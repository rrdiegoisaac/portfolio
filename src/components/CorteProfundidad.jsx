import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import './CorteProfundidad.css'

const sinMarcador = () => <g />

// Longitud aproximada de la línea de costa en cada franja
const COSTA = {
  'Norte (21,5°–23,5°S)': -70.2,
  'Centro (32°–34°S)': -71.6,
  'Sur (38,5°–41°S)': -73.6,
}

function TooltipSismo({ active, payload }) {
  if (!active || !payload?.length) return null
  const s = payload[0].payload
  return (
    <ChartTooltip
      rows={[
        { label: 'Profundidad', value: `${s.prof} km` },
        { label: 'Magnitud', value: s.mag.toFixed(1) },
        { label: 'Longitud', value: `${Math.abs(s.lon).toFixed(2)}°O` },
      ]}
    />
  )
}

function Corte({ corte }) {
  return (
    <div className="corte">
      <p className="corte__title">
        {corte.nombre}
        <span className="corte__count">
          {formatoNumero(corte.sismos)} sismos
          {corte.puntos_mostrados < corte.sismos && ` · se muestran ${formatoNumero(corte.puntos_mostrados)}`}
        </span>
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid {...grillaProps} />
          <XAxis
            {...ejeProps}
            type="number"
            dataKey="lon"
            domain={[-76, -64]}
            allowDataOverflow
            ticks={[-75, -72, -69, -66]}
            tickFormatter={(v) => `${Math.abs(v)}°O`}
          />
          <YAxis
            {...ejeProps}
            type="number"
            dataKey="prof"
            reversed
            domain={[0, 320]}
            allowDataOverflow
            ticks={[0, 100, 200, 300]}
            width={36}
          />
          <ZAxis type="number" dataKey="mag" range={[8, 90]} />
          <Tooltip content={<TooltipSismo />} cursor={false} isAnimationActive={false} />
          <ReferenceLine
            x={COSTA[corte.nombre]}
            stroke={COLOR.eje}
            label={{ value: 'Costa', position: 'insideBottomLeft', fill: 'var(--muted)', fontSize: 11 }}
          />
          <Scatter data={corte.puntos} fill={COLOR.serie} fillOpacity={0.3} isAnimationActive={false} />
          {/* Mediana por tramo de longitud, calculada con todos los sismos de la franja */}
          <Scatter
            data={corte.mediana_por_longitud}
            line={{ stroke: 'var(--text)', strokeWidth: 2 }}
            shape={sinMarcador}
            legendType="none"
            tooltipType="none"
            isAnimationActive={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

function CorteProfundidad({ cortes }) {
  return (
    <div className="cortes">
      {cortes.map((corte) => (
        <Corte key={corte.nombre} corte={corte} />
      ))}
    </div>
  )
}

export default CorteProfundidad
