import { useEffect, useRef } from 'react'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import './Home.css'

// Página de inicio en dos columnas: a la izquierda, la presentación fija (Hero);
// a la derecha, las secciones. Un halo de luz suave sigue al cursor.
function Home() {
  const halo = useRef(null)

  useEffect(() => {
    const elemento = halo.current
    const alMover = (e) => {
      elemento.style.setProperty('--x', `${e.clientX}px`)
      elemento.style.setProperty('--y', `${e.clientY}px`)
    }
    window.addEventListener('pointermove', alMover)
    return () => window.removeEventListener('pointermove', alMover)
  }, [])

  return (
    <div className="home">
      <div className="home__halo" ref={halo} aria-hidden="true" />
      <div className="home__layout">
        <Hero />
        <main className="home__contenido">
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </div>
  )
}

export default Home
