import { Link } from 'react-router-dom'
import './ProjectCard.css'

function ProjectCard({ project }) {
  return (
    <Link
      to={`/proyectos/${project.slug}`}
      className="project-card"
      style={{ '--card-color': project.color }}
    >
      <div className="project-card__cover">
        {project.image ? (
          <img src={project.image} alt="" className="project-card__image" />
        ) : (
          <span className="project-card__cover-title">{project.title}</span>
        )}
      </div>

      <div className="project-card__body">
        <ul className="project-card__tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>
        <span className="project-card__cta">Leer la nota →</span>
      </div>
    </Link>
  )
}

export default ProjectCard
