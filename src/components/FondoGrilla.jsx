import { useEffect, useRef } from 'react'
import './FondoGrilla.css'

const PASO = 30 // px entre puntos
const RADIO_CURSOR = 180 // px: los puntos dentro de este radio se encienden y crecen

// Fondo de la página de inicio: una grilla de puntos, como un gráfico de dispersión,
// recorrida por una onda lenta. Alrededor del cursor los puntos se encienden.
// Con "reducir movimiento" la onda se detiene y solo responde al cursor.
function FondoGrilla() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = { x: -9999, y: -9999 }
    let ancho = 0
    let alto = 0
    let colorBase = ''
    let colorAcento = ''
    let animacion = null
    const inicio = performance.now()

    const leerColores = () => {
      const estilos = getComputedStyle(canvas)
      colorBase = estilos.getPropertyValue('--grilla-punto').trim()
      colorAcento = estilos.getPropertyValue('--accent').trim()
    }

    const ajustarTamano = () => {
      const escala = window.devicePixelRatio || 1
      ancho = window.innerWidth
      alto = window.innerHeight
      canvas.width = ancho * escala
      canvas.height = alto * escala
      ctx.setTransform(escala, 0, 0, escala, 0, 0)
    }

    const dibujar = (ahora) => {
      const t = reducirMovimiento ? 0 : (ahora - inicio) / 1000
      ctx.clearRect(0, 0, ancho, alto)
      for (let x = PASO / 2; x < ancho; x += PASO) {
        for (let y = PASO / 2; y < alto; y += PASO) {
          // Onda diagonal que avanza lento: da movimiento aunque no se mueva el mouse
          const onda = (Math.sin(x * 0.012 + y * 0.008 - t * 0.9) + 1) / 2
          const distancia = Math.hypot(x - cursor.x, y - cursor.y)
          const cerca = Math.max(0, 1 - distancia / RADIO_CURSOR)

          const radio = 0.8 + onda * 0.9 + cerca * 2.2
          ctx.beginPath()
          ctx.arc(x, y, radio, 0, Math.PI * 2)
          if (cerca > 0) {
            ctx.globalAlpha = 0.25 + cerca * 0.75
            ctx.fillStyle = colorAcento
          } else {
            ctx.globalAlpha = 0.25 + onda * 0.4
            ctx.fillStyle = colorBase
          }
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const cuadro = (ahora) => {
      dibujar(ahora)
      animacion = requestAnimationFrame(cuadro)
    }

    const alMover = (e) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
      if (reducirMovimiento) dibujar(0)
    }
    const alSalir = () => {
      cursor.x = -9999
      cursor.y = -9999
      if (reducirMovimiento) dibujar(0)
    }
    const alRedimensionar = () => {
      ajustarTamano()
      dibujar(performance.now())
    }
    // Sin animar mientras la pestaña está oculta
    const alCambiarVisibilidad = () => {
      if (document.hidden && animacion) {
        cancelAnimationFrame(animacion)
        animacion = null
      } else if (!document.hidden && !animacion && !reducirMovimiento) {
        animacion = requestAnimationFrame(cuadro)
      }
    }

    leerColores()
    ajustarTamano()
    dibujar(performance.now())
    if (!reducirMovimiento) animacion = requestAnimationFrame(cuadro)

    window.addEventListener('pointermove', alMover)
    document.addEventListener('pointerleave', alSalir)
    window.addEventListener('resize', alRedimensionar)
    document.addEventListener('visibilitychange', alCambiarVisibilidad)

    return () => {
      if (animacion) cancelAnimationFrame(animacion)
      window.removeEventListener('pointermove', alMover)
      document.removeEventListener('pointerleave', alSalir)
      window.removeEventListener('resize', alRedimensionar)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    }
  }, [])

  return <canvas ref={ref} className="fondo-grilla" aria-hidden="true" />
}

export default FondoGrilla
