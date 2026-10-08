import projects from '../data/projects'
import './About.css'

const notasPublicadas = projects.filter((p) => p.nota).length

// Cifras de los proyectos: 157.384 sismos (catálogo del CSN, terremotos-chile) y
// 36,9 millones de casos policiales (CEAD, delincuencia-chile). Actualizarlas si cambian los datos.
const destacados = [
  {
    cifra: '2 años',
    titulo: 'como Data Analyst en telecomunicaciones',
    texto: 'Automatización con SQL Server y Python, datos de SAP y Oracle, y dashboards en Power BI.',
  },
  {
    cifra: '37 millones',
    titulo: 'de sismos y casos policiales en mis análisis',
    texto: '157.384 sismos del CSN y 36,9 millones de casos del CEAD, obtenidos con web scraping.',
  },
  {
    cifra: `${notasPublicadas} notas`,
    titulo: 'interactivas publicadas',
    texto: 'Cada una va de los datos crudos a las conclusiones, con gráficos, código y fuentes.',
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
        <p>
          Además participo en competencias de Kaggle, donde desarrollo
          modelos predictivos con redes neuronales, árboles de decisión y
          clustering.
        </p>
      </div>

      <ul className="about__destacados">
        {destacados.map((d) => (
          <li key={d.titulo} className="about__destacado">
            <p className="about__cifra">{d.cifra}</p>
            <p className="about__destacado-titulo">{d.titulo}</p>
            <p className="about__destacado-texto">{d.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default About
