import './Hero.css'

const skills = ['SQL', 'Python', 'Power BI']

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__content">
        <p className="hero__greeting">Hola, soy</p>
        <h1 className="hero__name">Diego Riquelme</h1>

        <p className="hero__role">
          <span className="hero__role-title">Data Analyst</span>
          {skills.map((skill) => (
            <span key={skill} className="hero__skill">
              {skill}
            </span>
          ))}
        </p>

        <p className="hero__description">
          Convierto datos operacionales en decisiones. Llevo 2 años en
          telecomunicaciones automatizando procesos con SQL Server y Python,
          integrando SAP y Oracle, y construyendo dashboards en Power BI.
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
    </section>
  )
}

export default Hero
