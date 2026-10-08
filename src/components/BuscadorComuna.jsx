import { useId, useState } from 'react'
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

// Minúsculas y sin tildes, para buscar 'nunoa' y encontrar Ñuñoa
const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const MAX_SUGERENCIAS = 8

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
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [resaltada, setResaltada] = useState(0)
  const idLista = useId()
  const c = comunas.find((x) => x.cut === cut)

  // Primero las comunas cuyo nombre empieza con lo escrito, después las que lo contienen
  const consulta = normalizar(texto.trim())
  const sugerencias = consulta
    ? [
        ...ordenadas.filter((x) => normalizar(x.comuna).startsWith(consulta)),
        ...ordenadas.filter((x) => !normalizar(x.comuna).startsWith(consulta) && normalizar(`${x.comuna} ${x.region}`).includes(consulta)),
      ].slice(0, MAX_SUGERENCIAS)
    : []
  const visible = abierto && sugerencias.length > 0

  const elegir = (comuna) => {
    setCut(comuna.cut)
    setTexto('')
    setAbierto(false)
  }

  const alTeclear = (e) => {
    if (e.key === 'ArrowDown' && sugerencias.length) {
      e.preventDefault()
      setAbierto(true)
      setResaltada((i) => (i + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp' && sugerencias.length) {
      e.preventDefault()
      setResaltada((i) => (i - 1 + sugerencias.length) % sugerencias.length)
    } else if (e.key === 'Enter' && visible) {
      e.preventDefault()
      elegir(sugerencias[resaltada])
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

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
        Busca una comuna
      </label>
      <div className="buscador-comuna__campo">
        <input
          id="buscador-comuna"
          className="buscador-comuna__input"
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder="Escribe el nombre, ej. Ñuñoa"
          aria-expanded={visible}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={visible ? `${idLista}-${resaltada}` : undefined}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAbierto(true)
            setResaltada(0)
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onKeyDown={alTeclear}
        />
        {visible && (
          <ul id={idLista} className="buscador-comuna__lista" role="listbox">
            {sugerencias.map((x, i) => (
              <li
                key={x.cut}
                id={`${idLista}-${i}`}
                role="option"
                aria-selected={i === resaltada}
                className="buscador-comuna__opcion"
                // mousedown en vez de click: se ejecuta antes de que el campo pierda el foco
                onMouseDown={(e) => {
                  e.preventDefault()
                  elegir(x)
                }}
                onMouseEnter={() => setResaltada(i)}
              >
                {x.comuna} <span>{x.region}</span>
              </li>
            ))}
          </ul>
        )}
        {abierto && consulta && !sugerencias.length && <p className="buscador-comuna__vacio">No hay comunas con ese nombre.</p>}
      </div>
      <p className="buscador-comuna__elegida">
        {c.comuna} <span>({c.region})</span>
      </p>
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
