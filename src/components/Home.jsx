import { useState } from 'react'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import FondosPowerBI from './FondosPowerBI'
import Contact from './Contact'
import TemaBoton from './TemaBoton'
import useTitulo from './useTitulo'
import './Home.css'

const CLAVE_TEMA = 'tema-inicio'

// El tema elegido se recuerda en el navegador; si no se puede leer, parte en oscuro
function temaGuardado() {
  try {
    return localStorage.getItem(CLAVE_TEMA) === 'claro' ? 'claro' : 'oscuro'
  } catch {
    return 'oscuro'
  }
}

// Página de inicio: portada a pantalla completa y, debajo, las secciones en una columna.
function Home() {
  const [tema, setTema] = useState(temaGuardado)
  useTitulo()

  const cambiarTema = () => {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro'
    setTema(nuevo)
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo)
    } catch {
      // Sin almacenamiento disponible: el cambio dura solo esta visita
    }
  }

  return (
    <div className="home" data-tema={tema}>
      <Hero tema={tema} />
      <main className="home__contenido">
        <About />
        <Skills />
        <FondosPowerBI />
        <Projects />
        <Contact />
      </main>
      <TemaBoton tema={tema} onCambiar={cambiarTema} />
    </div>
  )
}

export default Home
