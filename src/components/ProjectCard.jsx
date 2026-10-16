import { Link } from 'react-router-dom'
import './ProjectCard.css'

// Fila de la lista de proyectos: miniatura, título, resumen y etiquetas. Con nota publicada,
// toda la fila es el enlace; sin nota, la fila solo se muestra y no lleva a ninguna parte.
function ProjectCard({ project }) {
  const contenido = (
    <>
      <div className="project-card__cover" aria-hidden="true">
        {project.image && <img src={project.image} alt="" className="project-card__image" loading="lazy" />}
        <span className="project-card__estado">{project.nota ? 'Nota' : 'Pronto'}</span>
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">
          {project.title} {project.nota && <span className="project-card__flecha">→</span>}
        </h3>
        <p className="project-card__summary">{project.summary}</p>
        {!project.nota && <p className="project-card__pendiente">Nota en preparación</p>}
        <ul className="project-card__tags home__etiquetas">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </>
  )

  const estilo = { '--card-color': project.color }

  if (!project.nota) {
    return (
      <div className="project-card project-card--pendiente" style={estilo}>
        {contenido}
      </div>
    )
  }

  return (
    <Link to={`/proyectos/${project.slug}`} className="project-card" style={estilo}>
      {contenido}
    </Link>
  )
}

export default ProjectCard
