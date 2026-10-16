import { Link } from 'react-router-dom'
import useTitulo from './useTitulo'
import './NotFound.css'

function NotFound() {
  useTitulo('Página no encontrada')

  return (
    <main className="not-found">
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__text">
        La dirección que buscas no existe o cambió de lugar.
      </p>
      <Link to="/" className="not-found__link">
        Ir al inicio
      </Link>
    </main>
  )
}

export default NotFound
