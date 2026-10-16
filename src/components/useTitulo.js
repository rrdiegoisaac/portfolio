import { useEffect } from 'react'

const SITIO = 'Diego Riquelme · Data Analyst & Data Engineer'

// Título de la pestaña del navegador. Sin argumento, usa el del sitio.
function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Diego Riquelme` : SITIO
  }, [titulo])
}

export default useTitulo
