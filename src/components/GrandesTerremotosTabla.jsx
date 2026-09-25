import DataTable from './DataTable'
import { nombreTerremoto } from './terremotos'

const decimal = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const fecha = (iso) => iso.slice(0, 10).split('-').reverse().join('-')
// Rango entre las dos referencias de actividad normal; si coinciden, un solo valor
const rango = ([a, b]) => (a === b ? a.toLocaleString('es-CL') : `${a.toLocaleString('es-CL')}–${b.toLocaleString('es-CL')}`)

const COLUMNAS = [
  { key: 'nombre', label: 'Terremoto' },
  { key: 'magnitud', label: 'Magnitud (CSN)', numeric: true, format: decimal },
  { key: 'radio_km', label: 'Radio', numeric: true, format: (v) => `${v} km` },
  { key: 'primer_dia', label: 'Primeras 24 h', numeric: true },
  { key: 'exceso_30_dias', label: 'Atribuibles, 30 días', numeric: true, format: rango },
  { key: 'exceso_365_dias', label: 'Atribuibles, 1 año', numeric: true, format: rango },
  { key: 'mayor', label: 'Mayor réplica', numeric: true },
]

function GrandesTerremotosTabla({ terremotos }) {
  const filas = terremotos.map((t) => ({
    ...t,
    nombre: `${nombreTerremoto(t)} · ${fecha(t.fecha_local)}`,
    mayor: t.mayor_replica ? decimal(t.mayor_replica.magnitud) : null,
  }))
  return <DataTable columns={COLUMNAS} rows={filas} rowKey="fecha_utc" />
}

export default GrandesTerremotosTabla
