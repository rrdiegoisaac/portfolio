import './SkillGroup.css'

function SkillGroup({ title, skills }) {
  return (
    <div className="skill-group">
      <h3 className="skill-group__title">{title}</h3>
      <ul className="skill-group__list home__etiquetas">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  )
}

export default SkillGroup
