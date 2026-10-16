import { useEffect, useRef, useState } from 'react'
import './FondosPowerBI.css'

// Fondos para Power BI diseñados en Figma. Cada uno tiene dos imágenes en public/fondos/:
// con gráficos de ejemplo (archivo.webp) y el fondo vacío (archivo-vacio.webp).
const fondos = [
  { archivo: '01-azul-cristal', nombre: 'Azul cristal' },
  { archivo: '08-navegador-coral', nombre: 'Navegador coral' },
  { archivo: '03-verde-finanzas', nombre: 'Verde finanzas' },
  { archivo: '02-oscuro-ejecutivo', nombre: 'Oscuro ejecutivo' },
  { archivo: '07-navegador-indigo', nombre: 'Navegador índigo' },
  { archivo: '04-purpura-gradiente', nombre: 'Púrpura degradado' },
  { archivo: '06-minimal-ambar', nombre: 'Minimal ámbar' },
]

const ruta = (archivo, vacio) => `/fondos/${archivo}${vacio ? '-vacio' : ''}.webp`

const VELOCIDAD = 30 // px por segundo del avance automático
const DURACION_SALTO = 450 // ms que tarda una flecha en mover un fondo

// Cinta que avanza sola hacia la izquierda; las flechas la deslizan un fondo hacia
// cada lado. La lista se repite tres veces para que el ciclo no tenga saltos visibles;
// las copias quedan ocultas para lectores de pantalla y teclado.
function FondosPowerBI() {
  const pista = useRef(null)
  const grupo = useRef(null)
  const dialogo = useRef(null)
  // offset: cuánto se ha corrido la pista; salto: animación en curso de una flecha
  const estado = useRef({ offset: 0, pausa: false, salto: null, reducido: false })
  const [abierto, setAbierto] = useState(null) // { fondo, vacio }

  useEffect(() => {
    const e = estado.current
    e.reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let previo = null
    let id

    const cuadro = (ahora) => {
      const ancho = grupo.current.offsetWidth // ancho de una copia de la lista
      const dt = previo === null ? 0 : (ahora - previo) / 1000
      previo = ahora

      if (e.salto) {
        const t = e.reducido ? 1 : Math.min(1, (ahora - e.salto.inicio) / DURACION_SALTO)
        const suave = 1 - (1 - t) ** 3
        e.offset = e.salto.desde + (e.salto.hasta - e.salto.desde) * suave
        if (t === 1) e.salto = null
      } else if (!e.pausa && !e.reducido) {
        e.offset += VELOCIDAD * dt
      }
      if (!e.salto && ancho > 0) e.offset = ((e.offset % ancho) + ancho) % ancho

      pista.current.style.transform = `translateX(${-e.offset}px)`
      id = requestAnimationFrame(cuadro)
    }

    id = requestAnimationFrame(cuadro)
    return () => cancelAnimationFrame(id)
  }, [])

  // dir = 1 avanza (hacia la derecha de la lista), dir = -1 retrocede
  const mover = (dir) => {
    const e = estado.current
    const ancho = grupo.current.offsetWidth
    const paso = ancho / fondos.length
    const base = e.salto ? e.salto.hasta : e.offset
    let desde = e.offset
    let hasta = dir > 0 ? (Math.floor(base / paso + 0.01) + 1) * paso : (Math.ceil(base / paso - 0.01) - 1) * paso
    // Mantiene el recorrido dentro de las copias de la lista
    if (desde >= ancho) {
      desde -= ancho
      hasta -= ancho
    }
    if (hasta < 0) {
      desde += ancho
      hasta += ancho
    }
    e.salto = { desde, hasta, inicio: performance.now() }
  }

  // El avance automático se detiene mientras el cursor o el foco están en la cinta
  const pausar = () => {
    estado.current.pausa = true
  }
  const reanudar = () => {
    estado.current.pausa = false
  }

  const abrir = (fondo, vacio) => {
    setAbierto({ fondo, vacio })
    dialogo.current.showModal()
  }

  // Cierra al hacer clic fuera de la imagen (en el fondo oscuro del diálogo)
  const clicDialogo = (ev) => {
    if (ev.target === dialogo.current) dialogo.current.close()
  }

  const lista = (copia, ref) => (
    <ul className="fondos__grupo" ref={ref} aria-hidden={copia || undefined}>
      {fondos.map((fondo) => (
        <li key={fondo.archivo} className="fondos__item">
          <button
            type="button"
            className="fondos__boton"
            onClick={() => abrir(fondo, false)}
            tabIndex={copia ? -1 : undefined}
            aria-label={`Ver en grande: ${fondo.nombre}`}
          >
            <img src={ruta(fondo.archivo, false)} alt="" width="1600" height="900" loading="lazy" />
          </button>
          <div className="fondos__pie">
            <p className="fondos__nombre">{fondo.nombre}</p>
            <button
              type="button"
              className="fondos__vacio"
              onClick={() => abrir(fondo, true)}
              tabIndex={copia ? -1 : undefined}
            >
              Ver sin gráficos
            </button>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <section className="fondos home__seccion" id="fondos" aria-label="Diseño de reportes">
      <h2 className="home__seccion-titulo">Diseño de reportes</h2>
      <p className="fondos__intro">
        Diseño en Figma los fondos de mis dashboards de Power BI: el fondo lleva
        la estructura, la marca y la navegación, y los visuales van encima sin
        fondo propio. Así el reporte se ve ordenado y es liviano de mantener.
        Estos son algunos de mis diseños, con datos de ejemplo.
      </p>

      <div
        className="fondos__carrusel"
        onMouseEnter={pausar}
        onMouseLeave={reanudar}
        onFocus={pausar}
        onBlur={reanudar}
      >
        <div className="fondos__cinta">
          <div className="fondos__pista" ref={pista}>
            {lista(false, grupo)}
            {lista(true)}
            {lista(true)}
          </div>
        </div>
        <button type="button" className="fondos__flecha fondos__flecha--izq" onClick={() => mover(-1)} aria-label="Fondo anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="fondos__flecha fondos__flecha--der" onClick={() => mover(1)} aria-label="Fondo siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <dialog
        ref={dialogo}
        className="fondos__dialogo"
        onClick={clicDialogo}
        onClose={() => setAbierto(null)}
        aria-label={abierto ? abierto.fondo.nombre : 'Fondo de Power BI'}
      >
        {abierto && (
          <figure className="fondos__figura">
            <img
              src={ruta(abierto.fondo.archivo, abierto.vacio)}
              alt={abierto.vacio
                ? `Fondo ${abierto.fondo.nombre} sin gráficos`
                : `Dashboard de ejemplo con el fondo ${abierto.fondo.nombre}`}
              width="1600"
              height="900"
            />
            <figcaption>
              <span>{abierto.fondo.nombre} · diseñado en Figma{abierto.vacio ? '' : ', datos ficticios'}</span>
              <span className="fondos__acciones">
                <span className="fondos__alternar" role="group" aria-label="Vista">
                  <button type="button" aria-pressed={!abierto.vacio} onClick={() => setAbierto({ ...abierto, vacio: false })}>
                    Con gráficos
                  </button>
                  <button type="button" aria-pressed={abierto.vacio} onClick={() => setAbierto({ ...abierto, vacio: true })}>
                    Sin gráficos
                  </button>
                </span>
                <button type="button" className="fondos__cerrar" onClick={() => dialogo.current.close()}>
                  Cerrar
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </section>
  )
}

export default FondosPowerBI
