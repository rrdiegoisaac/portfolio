import { useEffect, useState } from 'react'
import './IndiceNota.css'

// Títulos que entran al índice: secciones (h2) y subsecciones (h3) de la nota,
// sin los títulos de los gráficos
const SELECTOR = ':scope > h2, :scope > h3, :scope > .nota__resumen > h2'

const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Índice flotante de la nota: una columna de marcas en el borde derecho que se
// despliega al pasar el cursor (pantallas anchas) o un botón que abre la lista (celular)
function IndiceNota({ contenedor }) {
  const [secciones, setSecciones] = useState([])
  const [activa, setActiva] = useState(null)
  const [abierto, setAbierto] = useState(false)

  // Lee los títulos de la nota y les asigna un id para poder enlazarlos
  useEffect(() => {
    const raiz = contenedor.current
    if (!raiz) return
    const titulos = [...raiz.querySelectorAll(SELECTOR)]
    const usados = new Set()
    const lista = titulos.map((el) => {
      let id = el.id || slug(el.textContent)
      while (usados.has(id)) id = `${id}-2`
      usados.add(id)
      el.id = id
      return { id, texto: el.textContent, nivel: el.tagName === 'H2' ? 2 : 3 }
    })
    // Se actualiza en el siguiente cuadro, después de que la nota terminó de dibujarse
    const cuadro = requestAnimationFrame(() => setSecciones(lista))
    return () => cancelAnimationFrame(cuadro)
  }, [contenedor])

  // Marca la sección que se está leyendo: el último título que ya pasó por el tercio superior de la pantalla
  useEffect(() => {
    if (!secciones.length) return
    const elementos = secciones.map((s) => document.getElementById(s.id)).filter(Boolean)
    const actualizar = () => {
      const limite = window.innerHeight * 0.3
      let actual = elementos[0]?.id ?? null
      for (const el of elementos) {
        if (el.getBoundingClientRect().top <= limite) actual = el.id
      }
      setActiva(actual)
    }
    actualizar()
    window.addEventListener('scroll', actualizar, { passive: true })
    window.addEventListener('resize', actualizar)
    return () => {
      window.removeEventListener('scroll', actualizar)
      window.removeEventListener('resize', actualizar)
    }
  }, [secciones])

  // Cierra la lista del celular con Escape
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [abierto])

  if (!secciones.length) return null

  const ir = (evento, id) => {
    evento.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setAbierto(false)
    // Con el mouse, el enlace suelta el foco para que el índice se cierre al retirar el cursor.
    // Con el teclado (detail = 0) se mantiene, para seguir navegando con Tab.
    if (evento.detail > 0) evento.currentTarget.blur()
  }

  const lista = (
    <ol className="indice__lista">
      {secciones.map((s) => (
        <li key={s.id} className={`indice__item indice__item--h${s.nivel}`}>
          <a
            href={`#${s.id}`}
            className={`indice__enlace${s.id === activa ? ' indice__enlace--activo' : ''}`}
            aria-current={s.id === activa ? 'location' : undefined}
            onClick={(e) => ir(e, s.id)}
          >
            {s.texto}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      {/* Pantallas anchas: marcas en el borde derecho que se despliegan */}
      <nav className="indice indice--flotante" aria-label="Índice de la nota">
        <div className="indice__marcas" aria-hidden="true">
          {secciones.map((s) => (
            <span
              key={s.id}
              className={`indice__marca indice__marca--h${s.nivel}${s.id === activa ? ' indice__marca--activa' : ''}`}
            />
          ))}
        </div>
        <div className="indice__panel">
          <p className="indice__titulo">En esta nota</p>
          {lista}
        </div>
      </nav>

      {/* Pantallas angostas: botón que abre la lista */}
      <div className="indice indice--movil">
        <button
          type="button"
          className="indice__boton"
          aria-expanded={abierto}
          aria-controls="indice-movil-lista"
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? 'Cerrar' : 'Índice'}
        </button>
        {abierto && (
          <nav id="indice-movil-lista" className="indice__hoja" aria-label="Índice de la nota">
            <p className="indice__titulo">En esta nota</p>
            {lista}
          </nav>
        )}
      </div>
    </>
  )
}

export default IndiceNota
