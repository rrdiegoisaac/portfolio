import StatCard from './StatCard'
import './About.css'

const stats = [
  { value: '2 años', label: 'como Data Analyst en telecomunicaciones' },
  { value: '3 fuentes', label: 'SQL Server, SAP y Oracle integradas en un mismo entorno analítico' },
  { value: '4 proyectos', label: 'propios, desde la obtención de los datos hasta las conclusiones' },
]

function About() {
  return (
    <section className="about" id="sobre-mi">
      <div className="about__content">
        <h2 className="about__title">Sobre mí</h2>

        <div className="about__grid">
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

          <div className="about__stats">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
