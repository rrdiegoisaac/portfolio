import {
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import fronteras from '../data/terremotos/07_fronteras.json'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, margenMapa } from './chartTheme'

// Ciudades de referencia para ubicarse en el mapa
const CIUDADES = [
  { nombre: 'Arica', lat: -18.48, lon: -70.32 },
  { nombre: 'Antofagasta', lat: -23.65, lon: -70.4 },
  { nombre: 'La Serena', lat: -29.9, lon: -71.25 },
  { nombre: 'Santiago', lat: -33.45, lon: -70.67 },
  { nombre: 'Concepción', lat: -36.82, lon: -73.05 },
  { nombre: 'Puerto Montt', lat: -41.47, lon: -72.94 },
  { nombre: 'Punta Arenas', lat: -53.16, lon: -70.91 },
]

const MAPA_LAT = [-61, -17]

const sinMarcador = () => <g />

// Costa y fronteras (Natural Earth), dibujadas debajo de los datos
const CONTORNOS = fronteras.lineas.map((linea, i) => (
  <Scatter
    key={`frontera-${i}`}
    data={linea.puntos}
    line={{ stroke: COLOR.borde, strokeWidth: 1 }}
    shape={sinMarcador}
    legendType="none"
    tooltipType="none"
    isAnimationActive={false}
  />
))

// Los nombres de ciudades van en una columna sobre el océano (borde izquierdo del mapa),
// unidos a su ciudad por una línea fina, para que los puntos de datos no los tapen.
function etiquetasCiudades([lonMin, lonMax]) {
  const ancho = lonMax - lonMin
  const xTexto = lonMin + ancho * 0.01
  const xInicioLinea = lonMin + ancho * 0.2 // después del texto más largo ("Puerto Montt")

  return CIUDADES.flatMap((c) => [
    <ReferenceLine
      key={`${c.nombre}-linea`}
      segment={[
        { x: xInicioLinea, y: c.lat },
        { x: c.lon, y: c.lat },
      ]}
      stroke="var(--muted)"
      strokeWidth={1}
    />,
    <ReferenceDot
      key={`${c.nombre}-punto`}
      x={c.lon}
      y={c.lat}
      r={4}
      fill="var(--text)"
      stroke="var(--bg)"
      strokeWidth={1.5}
    />,
    <ReferenceDot
      key={`${c.nombre}-texto`}
      x={xTexto}
      y={c.lat}
      r={0}
      label={{ value: c.nombre, position: 'right', fill: 'var(--text)', fontSize: 11, fontWeight: 600 }}
    />,
  ])
}

function TooltipCelda({ active, payload }) {
  if (!active || !payload?.length) return null
  const celda = payload[0].payload
  return (
    <ChartTooltip
      title={`${Math.abs(celda.lat).toFixed(2)}°S · ${Math.abs(celda.lon).toFixed(2)}°O`}
      rows={[
        { label: 'Sismos', value: formatoNumero(celda.sismos) },
        { label: 'Magnitud máxima', value: celda.mag_max.toFixed(1) },
      ]}
    />
  )
}

// Mapa de puntos de Chile. Por defecto muestra celdas con su cantidad de sismos;
// con sizeKey, sizeScale y tooltip se puede usar para otros puntos (ej. sismos individuales).
function SismosMapa({
  data,
  height,
  sizeKey = 'sismos',
  sizeRange = [10, 420],
  sizeScale = 'sqrt',
  tooltip = <TooltipCelda />,
  opacity = 0.55,
  lonDomain = [-80, -60],
  latDomain = MAPA_LAT,
  lonTicks = [-75, -70, -65],
  showCities = true,
  children,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={margenMapa}>
        <XAxis
          {...ejeProps}
          type="number"
          dataKey="lon"
          domain={lonDomain}
          allowDataOverflow
          ticks={lonTicks}
          tickFormatter={(v) => `${Math.abs(v)}°O`}
          height={24}
        />
        <YAxis
          {...ejeProps}
          type="number"
          dataKey="lat"
          domain={latDomain}
          allowDataOverflow
          ticks={[-20, -30, -40, -50, -60]}
          tickFormatter={(v) => `${Math.abs(v)}°S`}
          width={40}
        />
        <ZAxis type="number" dataKey={sizeKey} range={sizeRange} scale={sizeScale} />
        <Tooltip content={tooltip} cursor={false} isAnimationActive={false} />
        {CONTORNOS}
        <Scatter
          data={data}
          fill={COLOR.serie}
          fillOpacity={opacity}
          stroke={COLOR.superficie}
          strokeWidth={1}
          isAnimationActive={false}
        />
        {children}
        {showCities && etiquetasCiudades(lonDomain)}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

export default SismosMapa
