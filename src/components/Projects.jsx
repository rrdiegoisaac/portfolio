import projects from '../data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

function Projects() {
  return (
    <section className="projects" id="proyectos">
      <div className="projects__content">
        <h2 className="projects__title">Proyectos</h2>
        <p className="projects__intro">
          Cada proyecto tiene su propia nota: el problema, los datos, el
          código relevante y lo que encontré.
        </p>

        <div className="projects__grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
