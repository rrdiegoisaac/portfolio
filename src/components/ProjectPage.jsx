import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import projects, { getProjectBySlug } from '../data/projects'
import NotFound from './NotFound'
import './ProjectPage.css'

// Nota completa de cada proyecto. Se cargan por separado para no sumar
// sus gráficos y datos al resto del sitio.
const articles = {
  'terremotos-chile': lazy(() => import('./TerremotosNota')),
}

function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return <NotFound />
  }

  const Article = articles[project.slug]
  const otherProjects = projects.filter((p) => p.slug !== project.slug)

  return (
    <main className="project-page" style={{ '--project-color': project.color }}>
      <article className="project-page__article">
        <a href="/#proyectos" className="project-page__back">
          ← Volver a proyectos
        </a>

        <header className="project-page__header">
          <p className="project-page__kicker">{project.tags.join(' · ')}</p>
          <h1 className="project-page__title">{project.title}</h1>
          <p className="project-page__dek">{project.summary}</p>

          <div className="project-page__meta">
            <ul className="project-page__stack">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="project-page__links">
              {project.repo && (
                <a href={project.repo} className="project-page__repo" target="_blank" rel="noreferrer">
                  Ver código en GitHub ↗
                </a>
              )}
              {project.dataset && (
                <a href={project.dataset} className="project-page__repo" target="_blank" rel="noreferrer">
                  Ver datos en Kaggle ↗
                </a>
              )}
            </div>
          </div>
        </header>

        {Article ? (
          <Suspense fallback={<p className="project-page__loading">Cargando la nota…</p>}>
            <Article />
          </Suspense>
        ) : (
          <div className="project-page__notice">
            <p>
              <strong>Nota en preparación.</strong> Aquí irá el análisis
              completo: el problema, los datos, gráficos interactivos, el
              código clave y los hallazgos.
            </p>
          </div>
        )}
      </article>

      <nav className="project-page__more" aria-label="Otros proyectos">
        <h2 className="project-page__more-title">Otros proyectos</h2>
        <ul className="project-page__more-list">
          {otherProjects.map((p) => (
            <li key={p.slug}>
              <Link to={`/proyectos/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}

export default ProjectPage
