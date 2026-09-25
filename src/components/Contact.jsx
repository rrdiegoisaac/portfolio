import './Contact.css'

// Los enlaces sin href no se muestran: completa LinkedIn y el correo cuando quieras publicarlos.
const links = [
  { label: 'GitHub', href: 'https://github.com/rrdiegoisaac' },
  { label: 'LinkedIn', href: '' },
  { label: 'Correo', href: '' }, // formato: 'mailto:tu@correo.com'
]

function Contact() {
  const visibleLinks = links.filter((link) => link.href)

  return (
    <section className="contact" id="contacto">
      <div className="contact__content">
        <h2 className="contact__title">Contacto</h2>
        <p className="contact__text">
          ¿Tienes un proyecto de datos o una vacante en la que pueda aportar?
          Escríbeme.
        </p>

        <ul className="contact__links">
          {visibleLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="contact__link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="contact__footer">
        © {new Date().getFullYear()} Diego Riquelme
      </footer>
    </section>
  )
}

export default Contact
