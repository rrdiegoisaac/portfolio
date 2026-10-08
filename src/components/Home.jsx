import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import './Home.css'

// Página de inicio: portada a pantalla completa y, debajo, las secciones en una columna.
function Home() {
  return (
    <div className="home">
      <Hero />
      <main className="home__contenido">
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}

export default Home
