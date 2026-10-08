import './About.css'

// Tarjetas de presentación. enlace es opcional.
const destacados = [
  {
    cifra: '3 años',
    titulo: 'como Data Analyst',
    texto: 'En telecomunicaciones: automatización con SQL Server y Python, datos de SAP y Oracle, y dashboards en Power BI.',
  },
  {
    cifra: 'Kaggle',
    titulo: 'Competencias y datasets abiertos',
    texto: 'Participo en competencias de modelos predictivos y publico datasets para la comunidad, como el catálogo de sismos de Chile 2000–2026.',
    enlace: { texto: 'Ver perfil', href: 'https://www.kaggle.com/diegoisaac1' },
  },
  {
    cifra: 'Ing. Comercial',
    titulo: 'Formación en negocios',
    texto: 'Mi base para entender qué pregunta hay detrás de cada análisis y comunicar los resultados a quienes toman decisiones.',
  },
]

function About() {
  return (
    <section className="about home__seccion" id="sobre-mi" aria-label="Sobre mí">
      <h2 className="home__seccion-titulo">Sobre mí</h2>
      <div className="about__text">
        <p>
          Trabajo como Data Analyst en la industria de telecomunicaciones,
          con foco en la automatización y en optimizar el rendimiento de
          las consultas. Desarrollo y mantengo stored procedures, jobs y
          triggers en SQL Server, integrando datos de SAP y Oracle.
        </p>
        <p>
          Creo y mantengo KPIs, reportes y dashboards en Power BI (DAX,
          Power Query) que se actualizan solos con schedules en Power BI
          Service. Automatizo tareas con Python (Selenium, SQLAlchemy)
          para que los flujos de datos sean eficientes y confiables.
        </p>
      </div>

      <ul className="about__destacados">
        {destacados.map((d) => (
          <li key={d.titulo} className="about__destacado">
            <p className="about__cifra">{d.cifra}</p>
            <p className="about__destacado-titulo">{d.titulo}</p>
            <p className="about__destacado-texto">
              {d.texto}
              {d.enlace && (
                <>
                  {' '}
                  <a href={d.enlace.href} target="_blank" rel="noreferrer">
                    {d.enlace.texto} ↗
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default About
