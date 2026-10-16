import SkillGroup from './SkillGroup'
import './Skills.css'

const skillGroups = [
  {
    title: 'SQL y bases de datos',
    descripcion:
      'Trabajo con SQL Server, PostgreSQL y SQLite. En producción desarrollo y administro SQL Server: automatizo con stored procedures, jobs y triggers, diagnostico cuellos de botella y materializo en data marts los cálculos más costosos.',
    skills: [
      'SQL Server',
      'PostgreSQL',
      'SQLite',
      'Stored Procedures',
      'Jobs',
      'Triggers',
      'Índices',
      'Optimización de consultas',
      'Cuellos de botella',
      'Data marts',
      'Tablas precalculadas',
      'Cargas batch programadas',
      'Activity Monitor',
      'SQL Server Profiler',
      'Administración de bases',
      'Buenas prácticas de backend',
      'SAP',
      'Oracle',
      'SGS',
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
      'API REST de Fabric',
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
