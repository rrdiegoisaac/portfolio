import { useEffect, useState } from 'react'
import './Hero.css'

const SECCIONES = [
  { id: 'sobre-mi', texto: 'Sobre mí' },
  { id: 'habilidades', texto: 'Habilidades' },
  { id: 'proyectos', texto: 'Proyectos' },
  { id: 'contacto', texto: 'Contacto' },
]

// Foto de perfil: pon el archivo en public/ (ej. public/foto.jpg) y cambia null por '/foto.jpg'.
// Mientras sea null se muestran las iniciales.
const FOTO = null

const REDES = [{ texto: 'GitHub', href: 'https://github.com/rrdiegoisaac' }]

// Columna izquierda de la página de inicio: queda fija en pantallas anchas.
// El menú marca la sección que se está leyendo en la columna derecha.
function Hero() {
  const [activa, setActiva] = useState(SECCIONES[0].id)

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((e) => e.isIntersecting)
        if (visible) setActiva(visible.target.id)
      },
      // Cuenta como activa la sección que cruza la franja del 40% superior de la pantalla
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECCIONES.forEach((s) => {
      const elemento = document.getElementById(s.id)
      if (elemento) observador.observe(elemento)
    })

    // La última sección es corta y nunca llega a esa franja: al llegar al final de la página, se marca ella
    const alDesplazar = () => {
      const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (alFinal) setActiva(SECCIONES.at(-1).id)
    }
    window.addEventListener('scroll', alDesplazar, { passive: true })

    return () => {
      observador.disconnect()
      window.removeEventListener('scroll', alDesplazar)
    }
  }, [])

  return (
    <header className="hero" id="inicio">
      <div>
        <div className="hero__foto">
          {FOTO ? <img src={FOTO} alt="Diego Riquelme" /> : <span aria-hidden="true">DR</span>}
        </div>
        <h1 className="hero__name">Diego Riquelme</h1>
        <p className="hero__role">Data Analyst</p>
        <p className="hero__tagline">
          Convierto datos en decisiones y en historias: automatizo con SQL y
          Python, construyo dashboards en Power BI y analizo datos públicos de
          principio a fin.
        </p>

        <nav className="hero__nav" aria-label="Secciones">
          <ul>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`hero__nav-link${activa === s.id ? ' hero__nav-link--activa' : ''}`}
                  aria-current={activa === s.id ? 'true' : undefined}
                >
                  <span className="hero__nav-linea" />
                  {s.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ul className="hero__redes">
        {REDES.map((r) => (
          <li key={r.texto}>
            <a href={r.href} target="_blank" rel="noreferrer">
              {r.texto} ↗
            </a>
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Hero
