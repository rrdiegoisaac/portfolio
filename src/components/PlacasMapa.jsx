import { ReferenceDot, Scatter } from 'recharts'
import SismosMapa from './SismosMapa'

// Etiquetas de cada límite, ubicadas a mano donde no tapan los datos
const ETIQUETAS = [
  { texto: 'Nazca bajo Sudamericana', lon: -81.5, lat: -30 },
  { texto: 'Dorsal de Chile', lon: -81.5, lat: -42.5 },
  { texto: 'Antártica bajo Sudamericana', lon: -81.5, lat: -50 },
  { texto: 'Scotia y Shetland', lon: -71, lat: -60.3 },
]

const sinMarcador = () => <g />

function PlacasMapa({ celdas, lineas, puntoTripleLat, height }) {
  return (
    <SismosMapa
      data={celdas}
      height={height}
      lonDomain={[-82, -56]}
      latDomain={[-62, -16]}
      lonTicks={[-80, -70, -60]}
      opacity={0.35}
      showCities={false}
    >
      {lineas.map((linea, i) => (
        <Scatter
          key={i}
          data={linea.puntos}
          line={{
            stroke: 'var(--text)',
            strokeWidth: linea.subduccion ? 2.5 : 1.5,
            strokeDasharray: linea.subduccion ? undefined : '5 4',
          }}
          shape={sinMarcador}
          legendType="none"
          tooltipType="none"
          isAnimationActive={false}
        />
      ))}
      <ReferenceDot
        x={-76}
        y={puntoTripleLat}
        r={6}
        fill="var(--chart-2)"
        stroke="var(--bg)"
        strokeWidth={2}
        label={{
          value: `Punto triple (${Math.abs(puntoTripleLat).toLocaleString('es-CL')}°S)`,
          position: 'right',
          fill: 'var(--text)',
          fontSize: 12,
          fontWeight: 600,
        }}
      />
      {ETIQUETAS.map((e) => (
        <ReferenceDot
          key={e.texto}
          x={e.lon}
          y={e.lat}
          r={0}
          label={{ value: e.texto, position: 'right', fill: 'var(--muted)', fontSize: 11 }}
        />
      ))}
    </SismosMapa>
  )
}

export default PlacasMapa
