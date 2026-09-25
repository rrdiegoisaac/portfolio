import ChartTooltip from './ChartTooltip'
import DataTable from './DataTable'
import SismosMapa from './SismosMapa'
import './SismosFuertes.css'

const formatoFecha = (iso) => iso.split('-').reverse().join('-')
const decimal = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1 })

const COLUMNAS = [
  { key: 'fecha', label: 'Fecha', format: formatoFecha },
  { key: 'magnitud', label: 'Magnitud', numeric: true, format: decimal },
  { key: 'profundidad_km', label: 'Prof.', numeric: true, format: (v) => `${v} km` },
  { key: 'lugar', label: 'Lugar de referencia' },
]

function TooltipSismo({ active, payload }) {
  if (!active || !payload?.length) return null
  const s = payload[0].payload
  return (
    <ChartTooltip
      title={s.lugar}
      rows={[
        { label: 'Fecha', value: formatoFecha(s.fecha) },
        { label: 'Magnitud', value: decimal(s.magnitud) },
        { label: 'Profundidad', value: `${s.profundidad_km} km` },
      ]}
    />
  )
}

function SismosFuertes({ fuertes, height, topN = 10 }) {
  return (
    <div className="sismos-fuertes">
      <SismosMapa
        data={fuertes}
        height={height}
        sizeKey="magnitud"
        sizeRange={[40, 420]}
        sizeScale="linear"
        tooltip={<TooltipSismo />}
        opacity={0.7}
      />
      <div>
        <p className="sismos-fuertes__caption">Los {topN} más fuertes</p>
        <DataTable
          columns={COLUMNAS}
          rows={fuertes.slice(0, topN).map((s) => ({ ...s, clave: `${s.fecha}-${s.magnitud}-${s.lugar}` }))}
          rowKey="clave"
        />
      </div>
    </div>
  )
}

export default SismosFuertes
