import { useEffect, useRef } from 'react'
import './PuntosFlotantes.css'

const CANTIDAD = 70
const RADIO_MOUSE = 120 // px: los puntos dentro de este radio se apartan del cursor
const COLORES_CSS = ['--chart-1', '--chart-2', '--chart-3', '--seq-1']

// Fondo decorativo de la portada: círculos que flotan lento y se apartan del cursor.
// Con "reducir movimiento" activado en el sistema se dibujan una vez y quedan quietos.
function PuntosFlotantes() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: -9999, y: -9999 }
    let puntos = []
    let ancho = 0
    let alto = 0
    let colores = []
    let animacion = null
    let visible = true

    const leerColores = () => {
      const estilos = getComputedStyle(document.documentElement)
      colores = COLORES_CSS.map((v) => estilos.getPropertyValue(v).trim())
    }

    const crearPuntos = () => {
      puntos = Array.from({ length: CANTIDAD }, (_, i) => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 2 + Math.random() * 5,
        // Uno de cada cuatro es relleno; el resto, solo contorno
        relleno: i % 4 === 0,
        color: i % COLORES_CSS.length,
      }))
    }

    const ajustarTamano = () => {
      const escala = window.devicePixelRatio || 1
      ancho = canvas.clientWidth
      alto = canvas.clientHeight
      canvas.width = ancho * escala
      canvas.height = alto * escala
      ctx.setTransform(escala, 0, 0, escala, 0, 0)
      if (!puntos.length) crearPuntos()
    }

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto)
      for (const p of puntos) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.globalAlpha = p.relleno ? 0.55 : 0.8
        if (p.relleno) {
          ctx.fillStyle = colores[p.color]
          ctx.fill()
        } else {
          ctx.strokeStyle = colores[p.color]
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const mover = () => {
      for (const p of puntos) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const distancia = Math.hypot(dx, dy)
        if (distancia < RADIO_MOUSE && distancia > 0) {
          const fuerza = (1 - distancia / RADIO_MOUSE) * 0.6
          p.vx += (dx / distancia) * fuerza
          p.vy += (dy / distancia) * fuerza
        }
        // Roce: después del empujón vuelven de a poco a su velocidad de deriva
        p.vx = p.vx * 0.96 + (Math.random() - 0.5) * 0.01
        p.vy = p.vy * 0.96 + (Math.random() - 0.5) * 0.01
        p.x += p.vx + Math.sign(p.vx) * 0.05
        p.y += p.vy + Math.sign(p.vy) * 0.05
        // Al salir por un borde, entran por el opuesto
        if (p.x < -10) p.x = ancho + 10
        if (p.x > ancho + 10) p.x = -10
        if (p.y < -10) p.y = alto + 10
        if (p.y > alto + 10) p.y = -10
      }
    }

    const cuadro = () => {
      mover()
      dibujar()
      animacion = visible ? requestAnimationFrame(cuadro) : null
    }

    const alMoverMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const alSalirMouse = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    leerColores()
    ajustarTamano()
    dibujar()

    const observadorTamano = new ResizeObserver(() => {
      ajustarTamano()
      dibujar()
    })
    observadorTamano.observe(canvas)

    // Los colores cambian si el sistema pasa a modo oscuro
    const modoOscuro = window.matchMedia('(prefers-color-scheme: dark)')
    const alCambiarTema = () => {
      leerColores()
      dibujar()
    }
    modoOscuro.addEventListener('change', alCambiarTema)

    // Solo se anima mientras la portada está en pantalla
    const observadorVista = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible && !animacion && !reducirMovimiento) animacion = requestAnimationFrame(cuadro)
    })
    observadorVista.observe(canvas)

    const zona = canvas.parentElement
    if (!reducirMovimiento) {
      zona.addEventListener('pointermove', alMoverMouse)
      zona.addEventListener('pointerleave', alSalirMouse)
    }

    return () => {
      if (animacion) cancelAnimationFrame(animacion)
      observadorTamano.disconnect()
      observadorVista.disconnect()
      modoOscuro.removeEventListener('change', alCambiarTema)
      zona.removeEventListener('pointermove', alMoverMouse)
      zona.removeEventListener('pointerleave', alSalirMouse)
    }
  }, [])

  return <canvas ref={ref} className="puntos-flotantes" aria-hidden="true" />
}

export default PuntosFlotantes
