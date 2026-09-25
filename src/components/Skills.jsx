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
    <section className="skills" id="habilidades">
      <div className="skills__content">
        <h2 className="skills__title">Habilidades</h2>

        <div className="skills__grid">
          {skillGroups.map((group) => (
            <SkillGroup key={group.title} title={group.title} skills={group.skills} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
