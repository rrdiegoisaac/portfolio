import './About.css'

// Tarjetas de presentación. enlace es opcional.
const destacados = [
  {
    cifra: '3 años',
    titulo: 'como Data Analyst & Data Engineer',
    texto: 'En telecomunicaciones, para clientes como Movistar, VTR y OnNet.',
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

// Resultados concretos del trabajo actual
const logros = [
  {
    cifra: '25 min → 8 s',
    texto: 'Consultas SQL críticas, con índices y reescribiendo las consultas.',
  },
  {
    cifra: '−70 %',
    texto: 'Tiempo de carga de reportes de Power BI, optimizados con SQL Server Profiler y DAX Studio.',
  },
  {
    cifra: '1 h → 10 min',
    texto: 'Proceso ETL completo, desde la descarga de los datos hasta la carga en el servidor.',
  },
  {
    cifra: '+300',
    texto: 'Procesos automatizados: unos 200 stored procedures, 100 scripts ETL en Python y los jobs que los ejecutan.',
  },
  {
    cifra: '+30',
    texto: 'Dashboards de Power BI en producción, que se actualizan solos en Power BI Service.',
  },
  {
    cifra: '+10',
    texto: 'Fuentes de datos integradas en una misma base: SAP, Oracle, SGS, APIs y web scraping.',
  },
]

function About() {
  return (
    <section className="about home__seccion" id="sobre-mi" aria-label="Sobre mí">
      <h2 className="home__seccion-titulo">Sobre mí</h2>
      <div className="about__text">
        <p>
          Me hago cargo del ciclo completo del dato: extracción,
          transformación, modelado y visualización.
        </p>
        <p>
          Trabajo con bases relacionales en SQL Server, PostgreSQL y SQLite.
          En producción desarrollo y administro SQL Server: stored
          procedures, jobs, triggers e índices. Diagnostico cuellos de botella
          con Activity Monitor y SQL Server Profiler y, cuando el costo de
          cálculo lo justifica, materializo tablas en data marts con cargas
          batch programadas. Integro datos de SAP, Oracle y SGS.
        </p>
        <p>
          Construyo pipelines ETL en Python: extracción con web scraping
          (Selenium) y APIs REST (requests), transformación y carga a la base
          con SQLAlchemy, con ejecución programada.
        </p>
        <p>
          En Power BI diseño modelos estrella, optimizo medidas DAX con DAX
          Studio y configuro actualización incremental en Power BI Service.
          Con la API REST de Fabric automatizo el envío de reportes y la
          extracción de datos de los modelos publicados. La capa visual la
          diseño en Figma y la cargo como fondo SVG.
        </p>
      </div>

      <div className="about__logros">
        <h3 className="about__logros-titulo">Algunos resultados</h3>
        <ul className="about__logros-lista">
          {logros.map((logro) => (
            <li key={logro.texto} className="about__logro">
              <p className="about__logro-cifra">{logro.cifra}</p>
              <p className="about__logro-texto">{logro.texto}</p>
            </li>
          ))}
        </ul>
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
