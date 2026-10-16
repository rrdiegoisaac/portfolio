import './About.css'

// Tarjetas de presentación. enlace es opcional.
const destacados = [
  {
    cifra: '3 años',
    titulo: 'como Data Analyst',
    texto: 'En telecomunicaciones: desarrollo y administración de SQL Server, ETL con Python, datos de SAP y Oracle, y dashboards en Power BI diseñados en Figma.',
  },
  {
    cifra: 'Kaggle',
    titulo: 'Competencias y datasets abiertos',
    texto: 'Participo en competencias de modelos predictivos y publico datasets para que la comunidad pueda usarlos.',
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
          Trabajo como Data Analyst en la industria de telecomunicaciones.
          En el backend administro y optimizo bases en SQL Server: desarrollo
          stored procedures, jobs y triggers, trabajo con índices y reviso el
          rendimiento con Activity Monitor y SQL Server Profiler. Integro
          datos de SAP y Oracle.
        </p>
        <p>
          Construyo procesos ETL en Python: extraigo datos con web scraping
          (Selenium) y consumiendo APIs (requests), los limpio y los cargo a
          la base con SQLAlchemy, con
          ejecuciones programadas para que los flujos corran solos y sean
          confiables.
        </p>
        <p>
          En Power BI modelo las relaciones entre tablas, escribo medidas DAX
          (y las optimizo con DAX Studio) y publico reportes que se actualizan
          solos en Power BI Service. También diseño en Figma los fondos y la
          navegación de esos reportes. Aplico buenas prácticas en ambos lados:
          un backend ordenado y eficiente, y reportes claros de leer.
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
