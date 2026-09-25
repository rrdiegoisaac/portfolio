import './SkillGroup.css'

function SkillGroup({ title, skills }) {
  return (
    <div className="skill-group">
      <h3 className="skill-group__title">{title}</h3>
      <ul className="skill-group__list">
        {skills.map((skill) => (
          <li key={skill} className="skill-group__item">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkillGroup
