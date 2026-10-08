import SkillGroup from './SkillGroup'
import './Skills.css'

const skillGroups = [
  {
    title: 'SQL y bases de datos',
    skills: [
      'SQL Server',
      'Stored Procedures',
      'Jobs',
      'Triggers',
      'Optimización de consultas',
      'SAP',
      'Oracle',
    ],
  },
  {
    title: 'Python',
    skills: ['Selenium', 'SQLAlchemy', 'Web scraping', 'ETL', 'Streamlit'],
  },
  {
    title: 'Power BI',
    skills: ['DAX', 'Power Query', 'Power BI Service', 'KPIs y reportes'],
  },
  {
    title: 'Modelado predictivo',
    skills: [
      'Redes neuronales',
      'Árboles de decisión',
      'Clustering',
      'Regresión',
      'Feature engineering',
    ],
  },
]

function Skills() {
  return (
    <section className="skills home__seccion" id="habilidades" aria-label="Habilidades">
      <h2 className="home__seccion-titulo">Habilidades</h2>
      <ol className="skills__lista">
        {skillGroups.map((group) => (
          <li key={group.title}>
            <SkillGroup title={group.title} skills={group.skills} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Skills
