import { useState } from 'react'
import DataTable from './DataTable'
import { formatoNumero } from './chartTheme'
import './BuscadorComuna.css'

const entero = (v) => formatoNumero(Math.round(v))
const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const veces = (comuna, pais) => {
  if (!pais) return '—'
  const r = comuna / pais
  return `${decimal1(r)} veces`
}

const COLUMNAS = [
  { key: 'indicador', label: 'Por cada 100.000 habitantes' },
  { key: 'comuna', label: 'Comuna', numeric: true },
  { key: 'pais', label: 'Chile', numeric: true },
  { key: 'relacion', label: 'Comuna / Chile', numeric: true },
]

// Elegir una comuna y comparar sus tasas con las del país
function BuscadorComuna({ comunas, pais, anio, aniosHomicidios, poblacionMinima, inicial }) {
  const ordenadas = [...comunas].sort((a, b) => a.comuna.localeCompare(b.comuna, 'es'))
  const [cut, setCut] = useState(inicial)
  const c = comunas.find((x) => x.cut === cut)

  const filas = [
    { indicador: `Casos policiales (7 familias), ${anio}`, clave: 'tasa_total', formato: entero },
    { indicador: `Robos violentos, ${anio}`, clave: 'tasa_robos_violentos', formato: entero },
    { indicador: `Violencia intrafamiliar, ${anio}`, clave: 'tasa_vif', formato: entero },
    { indicador: `Homicidios, promedio ${aniosHomicidios[0]}–${aniosHomicidios[1]}`, clave: 'tasa_homicidios_3a', formato: decimal1 },
  ].map((f) => ({
    indicador: f.indicador,
    comuna: f.formato(c[f.clave]),
    pais: f.formato(pais[f.clave]),
    relacion: veces(c[f.clave], pais[f.clave]),
  }))

  return (
    <div className="buscador-comuna">
      <label className="buscador-comuna__label" htmlFor="buscador-comuna">
        Comuna
      </label>
      <select id="buscador-comuna" className="buscador-comuna__select" value={cut} onChange={(e) => setCut(Number(e.target.value))}>
        {ordenadas.map((x) => (
          <option key={x.cut} value={x.cut}>
            {x.comuna} ({x.region})
          </option>
        ))}
      </select>
      <p className="buscador-comuna__meta">
        Población proyectada {anio}: {formatoNumero(c.poblacion)} habitantes · {formatoNumero(c.robos_violentos)} robos violentos ·{' '}
        {formatoNumero(c.homicidios_3a)} homicidios en {aniosHomicidios[0]}–{aniosHomicidios[1]}
      </p>
      {c.poblacion < poblacionMinima && (
        <p className="buscador-comuna__aviso">
          Comuna de menos de {formatoNumero(poblacionMinima)} habitantes: unos pocos casos cambian mucho la tasa.
        </p>
      )}
      <DataTable columns={COLUMNAS} rows={filas} rowKey="indicador" />
    </div>
  )
}

export default BuscadorComuna
