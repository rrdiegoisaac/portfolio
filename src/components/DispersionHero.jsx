import { useEffect, useRef } from 'react'
import './DispersionHero.css'

const CANTIDAD = 140
const RADIO_CURSOR = 90 // px: los puntos dentro de este radio se apartan del cursor
const COLORES_CSS = ['--chart-1', '--chart-2', '--chart-3']
const MARGEN = 28

// Números pseudoaleatorios con semilla: la nube de puntos es siempre la misma
function generador(semilla) {
  let s = semilla
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Nube de puntos con correlación positiva, en tres grupos según x (0 a 1 en ambos ejes)
function crearNube() {
  const azar = generador(42)
  const normal = () => Math.sqrt(-2 * Math.log(azar() + 1e-9)) * Math.cos(2 * Math.PI * azar())
  return Array.from({ length: CANTIDAD }, () => {
    const x = azar()
    const y = Math.min(0.97, Math.max(0.03, 0.18 + 0.62 * x + normal() * 0.1))
    return { x, y, grupo: x < 0.36 ? 0 : x < 0.7 ? 1 : 2, r: 3 + azar() * 3.5, fase: azar() * Math.PI * 2 }
  })
}

// Recta de mínimos cuadrados de la nube
function tendencia(nube) {
  const n = nube.length
  const mx = nube.reduce((s, p) => s + p.x, 0) / n
  const my = nube.reduce((s, p) => s + p.y, 0) / n
  const pendiente =
    nube.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / nube.reduce((s, p) => s + (p.x - mx) ** 2, 0)
  return { pendiente, intercepto: my - pendiente * mx }
}

// Gráfico de dispersión decorativo de la portada: los puntos flotan alrededor de su
// posición y se apartan del cursor. Con "reducir movimiento" queda quieto.
function DispersionHero() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nube = crearNube()
    const recta = tendencia(nube)
    const cursor = { x: -9999, y: -9999 }
    const estado = nube.map(() => ({ dx: 0, dy: 0, vx: 0, vy: 0 }))
    let ancho = 0
    let alto = 0
    let colores = []
    let colorEje = ''
    let animacion = null
    let visible = true

    const leerColores = () => {
      const estilos = getComputedStyle(canvas)
      colores = COLORES_CSS.map((v) => estilos.getPropertyValue(v).trim())
      colorEje = estilos.getPropertyValue('--chart-axis').trim()
    }

    const ajustarTamano = () => {
      const escala = window.devicePixelRatio || 1
      ancho = canvas.clientWidth
      alto = canvas.clientHeight
      canvas.width = ancho * escala
      canvas.height = alto * escala
      ctx.setTransform(escala, 0, 0, escala, 0, 0)
    }

    // De coordenadas 0–1 a píxeles (y hacia arriba)
    const px = (x) => MARGEN + x * (ancho - MARGEN * 2)
    const py = (y) => alto - MARGEN - y * (alto - MARGEN * 2)

    const dibujar = (t) => {
      ctx.clearRect(0, 0, ancho, alto)

      // Grilla y ejes
      ctx.strokeStyle = colorEje
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.18
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.moveTo(px(0), py(i / 4))
        ctx.lineTo(px(1), py(i / 4))
        ctx.stroke()
      }
      ctx.globalAlpha = 0.55
      ctx.beginPath()
      ctx.moveTo(px(0), py(1))
      ctx.lineTo(px(0), py(0))
      ctx.lineTo(px(1), py(0))
      ctx.stroke()

      // Línea de tendencia
      ctx.globalAlpha = 0.6
      ctx.setLineDash([6, 6])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px(0), py(recta.intercepto))
      ctx.lineTo(px(1), py(recta.intercepto + recta.pendiente))
      ctx.stroke()
      ctx.setLineDash([])

      // Puntos
      nube.forEach((p, i) => {
        const e = estado[i]
        const flotar = reducirMovimiento ? 0 : 3
        const x = px(p.x) + e.dx + Math.cos(t * 0.6 + p.fase) * flotar
        const y = py(p.y) + e.dy + Math.sin(t * 0.8 + p.fase) * flotar
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.globalAlpha = 0.8
        ctx.fillStyle = colores[p.grupo]
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#ffffff'
        ctx.stroke()
      })
      ctx.globalAlpha = 1
    }

    // Cada punto se aparta del cursor y vuelve a su lugar como un resorte
    const mover = () => {
      nube.forEach((p, i) => {
        const e = estado[i]
        const dx = px(p.x) + e.dx - cursor.x
        const dy = py(p.y) + e.dy - cursor.y
        const distancia = Math.hypot(dx, dy)
        if (distancia < RADIO_CURSOR && distancia > 0) {
          const fuerza = (1 - distancia / RADIO_CURSOR) * 2.2
          e.vx += (dx / distancia) * fuerza
          e.vy += (dy / distancia) * fuerza
        }
        e.vx = (e.vx - e.dx * 0.04) * 0.86
        e.vy = (e.vy - e.dy * 0.04) * 0.86
        e.dx += e.vx
        e.dy += e.vy
      })
    }

    const cuadro = (ahora) => {
      mover()
      dibujar(ahora / 1000)
      animacion = visible ? requestAnimationFrame(cuadro) : null
    }

    const alMover = (e) => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
    }
    const alSalir = () => {
      cursor.x = -9999
      cursor.y = -9999
    }

    leerColores()
    ajustarTamano()
    dibujar(0)

    const observadorTamano = new ResizeObserver(() => {
      ajustarTamano()
      dibujar(performance.now() / 1000)
    })
    observadorTamano.observe(canvas)

    // Solo se anima mientras está en pantalla
    const observadorVista = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible && !animacion && !reducirMovimiento) animacion = requestAnimationFrame(cuadro)
    })
    observadorVista.observe(canvas)

    if (!reducirMovimiento) {
      window.addEventListener('pointermove', alMover)
      document.addEventListener('pointerleave', alSalir)
    }

    return () => {
      if (animacion) cancelAnimationFrame(animacion)
      observadorTamano.disconnect()
      observadorVista.disconnect()
      window.removeEventListener('pointermove', alMover)
      document.removeEventListener('pointerleave', alSalir)
    }
  }, [])

  return <canvas ref={ref} className="dispersion-hero" aria-hidden="true" />
}

export default DispersionHero
