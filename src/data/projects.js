// Datos de los proyectos: alimentan las tarjetas de la Home y cada página /proyectos/:slug.
// Para agregar una imagen de portada, pon el archivo en public/ y agrega image: '/nombre.png'.
// nota: true cuando la nota del proyecto ya está publicada (registrada en ProjectPage.jsx).

const GITHUB_USER = 'rrdiegoisaac'

const projects = [
  {
    slug: 'terremotos-chile',
    nota: true,
    title: 'Dónde, cuánto y a qué profundidad tiembla en Chile',
    tags: ['Web scraping', 'SQLite', 'Geoanálisis'],
    summary:
      'El catálogo completo del Centro Sismológico Nacional desde 2000, obtenido con web scraping: dónde y a qué profundidad tiembla, cómo creció la red que mide y qué dejaron los terremotos de 2010, 2014 y 2015.',
    stack: ['Python', 'requests', 'BeautifulSoup', 'SQLite', 'pandas'],
    repo: `https://github.com/${GITHUB_USER}/terremotos-chile`,
    dataset: 'https://www.kaggle.com/datasets/diegoisaac1/chile-earthquakes-20002026-csn-catalog',
    color: '#b45309',
  },
  {
    slug: 'portal-inmobiliario',
    title: 'Propiedades en Portal Inmobiliario',
    tags: ['Web scraping', 'ETL', 'Machine Learning'],
    summary:
      'Datos de propiedades obtenidos con web scraping desde Portal Inmobiliario, limpiados y analizados estadística, visual y geográficamente, para luego aplicar modelos de regresión.',
    stack: ['Python', 'Web scraping', 'Regresión'],
    repo: `https://github.com/${GITHUB_USER}/analisis-datos-inmobiliarios`,
    color: '#0e7490',
  },
  {
    slug: 'delitos-chile',
    nota: true,
    title: 'Qué dicen (y qué no) los registros policiales de Chile',
    tags: ['Web scraping', 'SQLite', 'Series de tiempo'],
    summary:
      'Los casos policiales del CEAD desde 2005, mes a mes y para las 346 comunas, obtenidos con web scraping: cómo cambiaron los delitos, dónde se concentran y qué cambios del propio registro hay que tener en cuenta antes de sacar conclusiones.',
    stack: ['Python', 'requests', 'BeautifulSoup', 'SQLite', 'pandas'],
    repo: `https://github.com/${GITHUB_USER}/delincuencia-chile`,
    color: '#9f1239',
  },
  {
    slug: 'segmentacion-clientes',
    title: 'Segmentación de clientes',
    tags: ['Clustering', 'Feature engineering'],
    summary:
      'Feature engineering y algoritmos de aprendizaje no supervisado para segmentar clientes en grupos y apoyar decisiones de negocio más precisas.',
    stack: ['Python', 'Clustering', 'Feature engineering'],
    repo: `https://github.com/${GITHUB_USER}/customer-analysis`,
    color: '#15803d',
  },
]

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

export default projects
