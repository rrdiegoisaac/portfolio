import './SkillGroup.css'

// descripcion es opcional: una frase sobre qué hago con esas herramientas
function SkillGroup({ title, descripcion, skills }) {
  return (
    <div className="skill-group">
      <h3 className="skill-group__title">{title}</h3>
      <div>
        {descripcion && <p className="skill-group__descripcion">{descripcion}</p>}
        <ul className="skill-group__list home__etiquetas">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SkillGroup
