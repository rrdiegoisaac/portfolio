import projects from '../data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

function Projects() {
  return (
    <section className="projects home__seccion" id="proyectos" aria-label="Proyectos">
      <h2 className="home__seccion-titulo">Proyectos</h2>
      <p className="projects__intro">
        Cada proyecto tiene su propia nota: el problema, los datos, el código
        relevante y lo que encontré.
      </p>

      <ul className="projects__lista">
        {/* Primero los proyectos con nota publicada */}
        {[...projects]
          .sort((a, b) => Number(Boolean(b.nota)) - Number(Boolean(a.nota)))
          .map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
      </ul>
    </section>
  )
}

export default Projects
