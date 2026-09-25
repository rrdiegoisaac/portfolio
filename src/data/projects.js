// Datos de los proyectos: alimentan las tarjetas de la Home y cada página /proyectos/:slug.
// Para agregar una imagen de portada, pon el archivo en public/ y agrega image: '/nombre.png'.

const GITHUB_USER = 'rrdiegoisaac'

const projects = [
  {
    slug: 'terremotos-chile',
    title: 'Dónde, cuánto y a qué profundidad tiembla en Chile',
    tags: ['Web scraping', 'SQLite', 'Geoanálisis'],
    summary:
      'El catálogo completo del Centro Sismológico Nacional desde 2000, obtenido con web scraping: dónde y a qué profundidad tiembla, cómo creció la red que mide y qué dejaron los terremotos de 2010, 2014 y 2015.',
    stack: ['Python', 'requests', 'BeautifulSoup', 'SQLite', 'pandas'],
    repo: `https://github.com/${GITHUB_USER}/terremotos-chile`,
    dataset: null, // pendiente: URL del dataset en Kaggle
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
    title: 'Delitos en Chile',
    tags: ['Web scraping', 'Streamlit'],
    summary:
      'Histórico de 35 delitos en Chile obtenido con web scraping desde el CEAD, con limpieza, análisis de los datos y un frontend interactivo construido en Streamlit.',
    stack: ['Python', 'Web scraping', 'Streamlit'],
    repo: `https://github.com/${GITHUB_USER}/analisis-delictual-chile`,
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
