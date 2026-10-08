import PuntosFlotantes from './PuntosFlotantes'
import './Hero.css'

const ENLACES = [
  { href: '#sobre-mi', texto: 'Sobre mí' },
  { href: '#habilidades', texto: 'Habilidades' },
  { href: '#proyectos', texto: 'Proyectos' },
  { href: '#contacto', texto: 'Contacto' },
]

// La mitad de los enlaces va a cada lado del monograma
const izquierda = ENLACES.slice(0, 2)
const derecha = ENLACES.slice(2)

function Hero() {
  return (
    <section className="hero" id="inicio">
      <PuntosFlotantes />

      <nav className="hero__nav" aria-label="Secciones">
        <ul className="hero__nav-lista">
          {izquierda.map((e) => (
            <li key={e.href}>
              <a href={e.href}>{e.texto}</a>
            </li>
          ))}
        </ul>
        <a href="#inicio" className="hero__monograma" aria-label="Inicio">
          DR
        </a>
        <ul className="hero__nav-lista">
          {derecha.map((e) => (
            <li key={e.href}>
              <a href={e.href}>{e.texto}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hero__content">
        <p className="hero__kicker">Diego Riquelme · Data Analyst</p>
        <h1 className="hero__title">
          Datos que se convierten en decisiones y en historias
        </h1>
        <p className="hero__description">
          Automatizo procesos con SQL y Python, construyo dashboards en Power BI
          y, en mis proyectos, sigo los datos desde la fuente hasta las
          conclusiones.
        </p>

        <div className="hero__actions">
          <a href="#proyectos" className="hero__button hero__button--primary">
            Ver proyectos
          </a>
          <a href="#contacto" className="hero__button hero__button--secondary">
            Contacto
          </a>
        </div>
      </div>

      <a href="#sobre-mi" className="hero__mas">
        Más abajo
      </a>
    </section>
  )
}

export default Hero
