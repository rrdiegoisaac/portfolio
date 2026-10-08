import { useState } from 'react'
import { formatoNumero } from './chartTheme'
import './MapaCoropletas.css'

const COLORES = ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)']

// Cortes por cuartiles: cada color agrupa a un cuarto de las zonas
function cortesCuartiles(valores) {
  const orden = [...valores].sort((a, b) => a - b)
  const q = (p) => orden[Math.floor(p * (orden.length - 1))]
  return [q(0.25), q(0.5), q(0.75)]
}

const claseDe = (valor, cortes) => cortes.filter((c) => valor > c).length

// Mapa coroplético en SVG. formas: [{ id, ruta }] en coordenadas del viewBox.
// zonas: { [id]: { nombre, poblacion, nota?, ...indicadores } }. indicadores: [{ clave, nombre, formato }].
// Al pasar el cursor, tocar o enfocar con el teclado una zona, el panel muestra su detalle.
function MapaCoropletas({ viewbox, formas, zonas, indicadores, referencia, unidad, alto, etiquetaZona }) {
  const [indicador, setIndicador] = useState(indicadores[0].clave)
  const [activa, setActiva] = useState(null)
  const actual = indicadores.find((i) => i.clave === indicador)

  const valores = formas.map((f) => zonas[f.id]?.[indicador]).filter((v) => v != null)
  const cortes = cortesCuartiles(valores)
  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const limites = [minimo, ...cortes, maximo]

  const ranking = formas
    .filter((f) => zonas[f.id]?.[indicador] != null)
    .sort((a, b) => zonas[b.id][indicador] - zonas[a.id][indicador])
  const idMostrado = activa ?? ranking[0]?.id
  const zona = zonas[idMostrado]
  const puesto = ranking.findIndex((f) => f.id === idMostrado) + 1

  return (
    <div className="mapa-coropletas">
      <div className="mapa-coropletas__selector" role="group" aria-label="Indicador del mapa">
        {indicadores.map((i) => (
          <button
            key={i.clave}
            type="button"
            className="mapa-coropletas__boton"
            aria-pressed={i.clave === indicador}
            onClick={() => setIndicador(i.clave)}
          >
            {i.nombre}
          </button>
        ))}
      </div>

      <div className="mapa-coropletas__cuerpo">
        <svg
          className="mapa-coropletas__svg"
          viewBox={viewbox.join(' ')}
          style={{ maxHeight: alto }}
          role="img"
          aria-label={`Mapa: ${actual.nombre}`}
          onMouseLeave={() => setActiva(null)}
        >
          {formas.map((f) => {
            const valor = zonas[f.id]?.[indicador]
            return (
              <path
                key={f.id}
                d={f.ruta}
                className={`mapa-coropletas__zona${f.id === idMostrado ? ' mapa-coropletas__zona--activa' : ''}`}
                fill={valor == null ? 'var(--chart-muted)' : COLORES[claseDe(valor, cortes)]}
                tabIndex={0}
                aria-label={`${zonas[f.id]?.nombre}: ${valor == null ? 'sin datos' : actual.formato(valor)}`}
                onMouseEnter={() => setActiva(f.id)}
                onFocus={() => setActiva(f.id)}
                onClick={() => setActiva(f.id)}
              />
            )
          })}
          {/* La zona activa se vuelve a dibujar encima, para que su borde no quede tapado */}
          {formas
            .filter((f) => f.id === idMostrado)
            .map((f) => (
              <path key="activa" d={f.ruta} className="mapa-coropletas__borde-activo" />
            ))}
        </svg>

        <div className="mapa-coropletas__panel">
          {zona && (
            <div className="mapa-coropletas__detalle" aria-live="polite">
              <p className="mapa-coropletas__nombre">{zona.nombre}</p>
              <p className="mapa-coropletas__valor">
                {actual.formato(zona[indicador])} <span>{unidad}</span>
              </p>
              <p className="mapa-coropletas__meta">
                Puesto {puesto} de {ranking.length} {etiquetaZona} · Chile: {actual.formato(referencia[indicador])}
              </p>
              <p className="mapa-coropletas__meta">Población: {formatoNumero(zona.poblacion)} habitantes</p>
              {zona.nota && <p className="mapa-coropletas__nota">{zona.nota}</p>}
            </div>
          )}

          <div className="mapa-coropletas__leyenda">
            <p className="mapa-coropletas__leyenda-titulo">{actual.nombre}</p>
            <ul>
              {COLORES.map((color, i) => (
                <li key={color}>
                  <span className="mapa-coropletas__muestra" style={{ backgroundColor: color }} />
                  {actual.formato(limites[i])} a {actual.formato(limites[i + 1])}
                </li>
              ))}
            </ul>
            <p className="mapa-coropletas__ayuda">Cada color reúne a un cuarto de las {etiquetaZona}. Pasa el cursor o toca una zona para ver su detalle.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapaCoropletas
