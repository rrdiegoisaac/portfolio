import SkillGroup from './SkillGroup'
import './Skills.css'

const skillGroups = [
  {
    title: 'SQL Server',
    descripcion:
      'Desarrollo y administro bases en producción: automatizo con stored procedures, jobs y triggers, monitoreo la carga y optimizo las consultas lentas.',
    skills: [
      'Stored Procedures',
      'Jobs',
      'Triggers',
      'Índices',
      'Optimización de consultas',
      'Activity Monitor',
      'SQL Server Profiler',
      'Administración de bases',
      'Buenas prácticas de backend',
      'SAP',
      'Oracle',
    ],
  },
  {
    title: 'Python y ETL',
    descripcion:
      'Construyo procesos ETL completos: extraigo datos con web scraping y desde APIs, los limpio y los cargo a la base con ejecuciones programadas.',
    skills: [
      'Web scraping',
      'Selenium',
      'Requests',
      'Consumo de APIs',
      'Limpieza de datos',
      'Carga a bases de datos',
      'SQLAlchemy',
      'Ejecución programada',
      'Streamlit',
    ],
  },
  {
    title: 'Power BI',
    descripcion:
      'Modelo los datos antes de visualizarlos: relaciones entre tablas, medidas DAX eficientes y reportes que se actualizan solos, con actualización incremental para no recargar toda la historia cada vez.',
    skills: [
      'DAX',
      'Variables en DAX',
      'Columnas calculadas',
      'Power Query',
      'Modelado y relaciones',
      'Modelo estrella',
      'Fechas relativas',
      'Actualización incremental',
      'DAX Studio',
      'Power BI Service',
      'Actualización programada',
      'KPIs y reportes',
    ],
  },
  {
    title: 'Diseño de reportes',
    descripcion:
      'Diseño en Figma los fondos y la navegación de mis reportes, para que se lean rápido y mantengan una misma línea visual.',
    skills: [
      'Figma',
      'Fondos y plantillas para Power BI',
      'Navegación entre páginas',
      'Jerarquía visual',
      'Buenas prácticas de visualización',
    ],
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
            <SkillGroup title={group.title} descripcion={group.descripcion} skills={group.skills} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Skills
