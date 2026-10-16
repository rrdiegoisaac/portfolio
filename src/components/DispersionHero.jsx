import { useEffect, useRef } from 'react'
import './DispersionHero.css'

const CANTIDAD = 140
const RADIO_CURSOR = 90 // px: los puntos dentro de este radio se apartan del cursor
const COLORES_CSS = ['--chart-1', '--chart-2', '--chart-3']
const MARGEN = 28
const ESPERA = 3000 // ms que se muestra cada gráfico
const TRANSICION = 1600 // ms que tardan los puntos en llegar al gráfico siguiente

// Números pseudoaleatorios con semilla: los gráficos son siempre los mismos
function generador(semilla) {
  let s = semilla
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const limitar = (v, min = 0.03, max = 0.97) => Math.min(max, Math.max(min, v))
const entre01 = (v) => Math.min(1, Math.max(0, v))
const suavizar = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const sigmoide = (z) => 1 / (1 + Math.exp(-z))
const decimal = (v) => v.toFixed(2).replace('.', ',').replace('-', '−')

function hexARgb(hex) {
  const h = hex.replace('#', '')
  const largo = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(largo.slice(i, i + 2), 16))
}

// Valores al azar de cada punto; cada gráfico los usa para ubicarlo
function crearBase() {
  const azar = generador(42)
  const normal = () => Math.sqrt(-2 * Math.log(azar() + 1e-9)) * Math.cos(2 * Math.PI * azar())
  return Array.from({ length: CANTIDAD }, (_, i) => ({
    i,
    u1: azar(),
    u2: azar(),
    u3: azar(),
    n1: normal(),
    n2: normal(),
    r: 3 + azar() * 3.5,
    fase: azar() * Math.PI * 2,
  }))
}

// Recta de mínimos cuadrados y correlación de Pearson
function ajustar(puntos) {
  const n = puntos.length
  const mx = puntos.reduce((s, p) => s + p.x, 0) / n
  const my = puntos.reduce((s, p) => s + p.y, 0) / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  puntos.forEach((p) => {
    sxy += (p.x - mx) * (p.y - my)
    sxx += (p.x - mx) ** 2
    syy += (p.y - my) ** 2
  })
  const pendiente = sxy / sxx
  return { pendiente, intercepto: my - pendiente * mx, r: sxy / Math.sqrt(sxx * syy) }
}

function cuantil(ordenados, q) {
  const pos = (ordenados.length - 1) * q
  const abajo = Math.floor(pos)
  const arriba = ordenados[abajo + 1] ?? ordenados[abajo]
  return ordenados[abajo] + (arriba - ordenados[abajo]) * (pos - abajo)
}

// Cada gráfico define dónde va cada punto (x e y de 0 a 1), su grupo de color y lo que
// se dibuja detrás (fondo) o encima (frente) de los puntos.

function lineal(base, intercepto, pendiente, ruido) {
  const puntos = base.map((b) => ({
    x: b.u1,
    y: limitar(intercepto + pendiente * b.u1 + ruido * b.n1),
    grupo: b.u1 < 0.36 ? 0 : b.u1 < 0.7 ? 1 : 2,
  }))
  const recta = ajustar(puntos)
  return {
    nombre: `Regresión lineal · r = ${decimal(recta.r)}`,
    puntos,
    frente: ({ ctx, px, py, colorEje, alfa }) => {
      ctx.globalAlpha = alfa * 0.7
      ctx.strokeStyle = colorEje
      ctx.lineWidth = 2
      ctx.setLineDash([6, 6])
      ctx.beginPath()
      ctx.moveTo(px(0), py(recta.intercepto))
      ctx.lineTo(px(1), py(recta.intercepto + recta.pendiente))
      ctx.stroke()
      ctx.setLineDash([])
    },
  }
}

function logistica(base) {
  const probabilidad = (x) => sigmoide((x - 0.5) * 11)
  // Los puntos van en una franja abajo (clase 0) o arriba (clase 1), fuera del rango de la
  // curva, para que ninguno quede del lado de la curva que no le corresponde
  const puntos = base.map((b) => {
    const clase = b.u2 < probabilidad(b.u1) ? 1 : 0
    const y = clase ? limitar(0.93 + b.n1 * 0.02, 0.89, 0.97) : limitar(0.07 + b.n1 * 0.02, 0.03, 0.11)
    return { x: b.u1, y, grupo: clase }
  })
  return {
    nombre: 'Regresión logística',
    puntos,
    frente: ({ ctx, px, py, colorEje, alfa }) => {
      ctx.globalAlpha = alfa * 0.8
      ctx.strokeStyle = colorEje
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let k = 0; k <= 80; k++) {
        const x = k / 80
        ctx.lineTo(px(x), py(0.17 + 0.66 * probabilidad(x)))
      }
      ctx.stroke()
    },
  }
}

function cajas(base) {
  const centros = [0.2, 0.5, 0.8]
  const medias = [0.38, 0.62, 0.46]
  const desvios = [0.09, 0.13, 0.06]
  const puntos = base.map((b) => {
    const g = b.i % 3
    return { x: centros[g] + (b.u1 - 0.5) * 0.14, y: limitar(medias[g] + desvios[g] * b.n1), grupo: g }
  })
  const resumen = centros.map((_, g) => {
    const ys = puntos
      .filter((p) => p.grupo === g)
      .map((p) => p.y)
      .sort((a, b) => a - b)
    const q1 = cuantil(ys, 0.25)
    const q3 = cuantil(ys, 0.75)
    const riq = q3 - q1
    return {
      q1,
      q3,
      mediana: cuantil(ys, 0.5),
      min: ys.find((y) => y >= q1 - 1.5 * riq),
      max: ys.findLast((y) => y <= q3 + 1.5 * riq),
    }
  })
  return {
    nombre: 'Diagrama de caja · 3 grupos',
    puntos,
    fondo: ({ ctx, px, py, rgba, alfa }) => {
      resumen.forEach((c, g) => {
        ctx.globalAlpha = alfa
        ctx.fillStyle = rgba(g, 0.12)
        ctx.fillRect(px(centros[g] - 0.1), py(c.q3), px(0.2) - px(0), py(c.q1) - py(c.q3))
      })
    },
    frente: ({ ctx, px, py, colorEje, alfa }) => {
      ctx.globalAlpha = alfa * 0.85
      ctx.strokeStyle = colorEje
      resumen.forEach((c, g) => {
        const centro = centros[g]
        ctx.lineWidth = 1.5
        ctx.strokeRect(px(centro - 0.1), py(c.q3), px(0.2) - px(0), py(c.q1) - py(c.q3))
        ctx.beginPath()
        ctx.moveTo(px(centro), py(c.q3))
        ctx.lineTo(px(centro), py(c.max))
        ctx.moveTo(px(centro), py(c.q1))
        ctx.lineTo(px(centro), py(c.min))
        ctx.moveTo(px(centro - 0.04), py(c.max))
        ctx.lineTo(px(centro + 0.04), py(c.max))
        ctx.moveTo(px(centro - 0.04), py(c.min))
        ctx.lineTo(px(centro + 0.04), py(c.min))
        ctx.stroke()
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(px(centro - 0.1), py(c.mediana))
        ctx.lineTo(px(centro + 0.1), py(c.mediana))
        ctx.stroke()
      })
    },
  }
}

function arbol(base) {
  const CORTE_X = 0.42
  const hoja = (x, y) => (x < CORTE_X ? (y < 0.6 ? 0 : 1) : y < 0.35 ? 1 : 2)
  // Un 7 % de los puntos queda en la hoja "equivocada", como en datos reales
  const puntos = base.map((b) => {
    const x = limitar(b.u1)
    const y = limitar(b.u2)
    const g = hoja(x, y)
    return { x, y, grupo: b.u3 < 0.07 ? (g + 1) % 3 : g }
  })
  const regiones = [
    [0, 0, CORTE_X, 0.6, 0],
    [0, 0.6, CORTE_X, 1, 1],
    [CORTE_X, 0, 1, 0.35, 1],
    [CORTE_X, 0.35, 1, 1, 2],
  ]
  return {
    nombre: 'Árbol de decisión · 3 cortes',
    puntos,
    fondo: ({ ctx, px, py, rgba, alfa }) => {
      ctx.globalAlpha = alfa
      regiones.forEach(([x0, y0, x1, y1, g]) => {
        ctx.fillStyle = rgba(g, 0.1)
        ctx.fillRect(px(x0), py(y1), px(x1) - px(x0), py(y0) - py(y1))
      })
    },
    frente: ({ ctx, px, py, colorEje, alfa }) => {
      ctx.globalAlpha = alfa * 0.75
      ctx.strokeStyle = colorEje
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px(CORTE_X), py(0))
      ctx.lineTo(px(CORTE_X), py(1))
      ctx.moveTo(px(0), py(0.6))
      ctx.lineTo(px(CORTE_X), py(0.6))
      ctx.moveTo(px(CORTE_X), py(0.35))
      ctx.lineTo(px(1), py(0.35))
      ctx.stroke()
    },
  }
}

function segmentacion(base) {
  const nubes = [
    [0.25, 0.3],
    [0.72, 0.28],
    [0.55, 0.76],
  ]
  const puntos = base.map((b) => {
    const [cx, cy] = nubes[b.i % 3]
    return { x: limitar(cx + 0.09 * b.n1), y: limitar(cy + 0.09 * b.n2), grupo: 0 }
  })
  // k-means de verdad, partiendo de tres centroides arbitrarios
  let centroides = [
    [0.15, 0.15],
    [0.85, 0.15],
    [0.5, 0.9],
  ]
  for (let vuelta = 0; vuelta < 10; vuelta++) {
    puntos.forEach((p) => {
      const distancias = centroides.map(([cx, cy]) => (p.x - cx) ** 2 + (p.y - cy) ** 2)
      p.grupo = distancias.indexOf(Math.min(...distancias))
    })
    centroides = centroides.map((c, g) => {
      const del = puntos.filter((p) => p.grupo === g)
      if (!del.length) return c
      return [del.reduce((s, p) => s + p.x, 0) / del.length, del.reduce((s, p) => s + p.y, 0) / del.length]
    })
  }
  return {
    nombre: 'Segmentación · k-means (k = 3)',
    puntos,
    fondo: ({ ctx, px, py, rgba, alfa }) => {
      ctx.globalAlpha = alfa
      ctx.lineWidth = 1
      puntos.forEach((p) => {
        const [cx, cy] = centroides[p.grupo]
        ctx.strokeStyle = rgba(p.grupo, 0.25)
        ctx.beginPath()
        ctx.moveTo(px(p.x), py(p.y))
        ctx.lineTo(px(cx), py(cy))
        ctx.stroke()
      })
    },
    frente: ({ ctx, px, py, rgba, colorBorde, alfa }) => {
      ctx.globalAlpha = alfa
      centroides.forEach(([cx, cy], g) => {
        const x = px(cx)
        const y = py(cy)
        ;[
          [colorBorde, 6],
          [rgba(g, 1), 3],
        ].forEach(([color, grosor]) => {
          ctx.strokeStyle = color
          ctx.lineWidth = grosor
          ctx.beginPath()
          ctx.moveTo(x - 8, y - 8)
          ctx.lineTo(x + 8, y + 8)
          ctx.moveTo(x + 8, y - 8)
          ctx.lineTo(x - 8, y + 8)
          ctx.stroke()
        })
      })
    },
  }
}

function histograma(base) {
  const BARRAS = 17
  const MEDIA = 0.5
  const DESVIO = 0.16
  const ancho = 1 / BARRAS
  const barras = base.map((b) => Math.min(BARRAS - 1, Math.floor(entre01(MEDIA + DESVIO * b.n2) * BARRAS)))
  const conteos = Array(BARRAS).fill(0)
  barras.forEach((k) => conteos[k]++)
  const paso = 0.9 / Math.max(...conteos)
  const apilados = Array(BARRAS).fill(0)
  const puntos = barras.map((k) => ({
    x: (k + 0.5) * ancho,
    y: 0.035 + apilados[k]++ * paso,
    grupo: k < BARRAS / 3 ? 0 : k < (2 * BARRAS) / 3 ? 1 : 2,
  }))
  // Curva normal escalada a la cantidad de puntos esperada en cada barra
  const esperado = (x) =>
    (CANTIDAD * ancho * Math.exp(-(((x - MEDIA) / DESVIO) ** 2) / 2)) / (DESVIO * Math.sqrt(2 * Math.PI))
  return {
    nombre: 'Distribución · histograma',
    puntos,
    frente: ({ ctx, px, py, colorEje, alfa }) => {
      ctx.globalAlpha = alfa * 0.8
      ctx.strokeStyle = colorEje
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let k = 0; k <= 80; k++) {
        const x = k / 80
        ctx.lineTo(px(x), py(Math.max(0, 0.035 + (esperado(x) - 0.5) * paso)))
      }
      ctx.stroke()
    },
  }
}

function crearEscenas(base) {
  return [
    lineal(base, 0.18, 0.62, 0.07),
    arbol(base),
    logistica(base),
    cajas(base),
    lineal(base, 0.82, -0.55, 0.13),
    segmentacion(base),
    histograma(base),
    lineal(base, 0.5, 0, 0.17),
  ]
}

// Gráfico decorativo de la portada: los mismos puntos pasan por varios tipos de gráfico
// (regresiones, árbol de decisión, cajas, k-means, histograma). Flotan, se apartan del
// cursor, el ciclo se pausa con el cursor encima y un clic adelanta al siguiente.
// Con "reducir movimiento" queda quieto y solo cambia con clic.
// tema: al cambiar, solo se vuelven a leer los colores; el ciclo sigue donde iba.
function DispersionHero({ tema }) {
  const ref = useRef(null)
  const refrescar = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const base = crearBase()
    const escenas = crearEscenas(base)
    // Cada punto parte con un pequeño desfase para que no se muevan todos en bloque
    const retraso = base.map((b) => (b.fase / (Math.PI * 2)) * 0.3)
    const cursor = { x: -9999, y: -9999 }
    const estado = base.map(() => ({ dx: 0, dy: 0, vx: 0, vy: 0 }))
    let actuales = []
    let indice = 0
    let reloj = 0 // ms desde que se mostró el gráfico actual
    let ultimo = null
    let encima = false
    let ancho = 0
    let alto = 0
    let colores = []
    let colorEje = ''
    let colorBorde = ''
    let colorTexto = ''
    let fuente = ''
    let animacion = null
    let visible = true

    const leerColores = () => {
      const estilos = getComputedStyle(canvas)
      colores = COLORES_CSS.map((v) => hexARgb(estilos.getPropertyValue(v).trim()))
      colorEje = estilos.getPropertyValue('--chart-axis').trim()
      // El borde de cada punto es del color de la tarjeta, para separarlos en ambos temas
      colorBorde = estilos.getPropertyValue('--surface').trim() || '#ffffff'
      colorTexto = estilos.getPropertyValue('--muted').trim()
      fuente = estilos.fontFamily
    }

    const rgba = (g, a) => `rgba(${colores[g].join(', ')}, ${a})`

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

    const siguiente = () => (indice + 1) % escenas.length
    const avance = () => (reloj < ESPERA ? 0 : entre01((reloj - ESPERA) / TRANSICION))

    // Posición y color de cada punto, a medio camino entre el gráfico actual y el siguiente
    const calcular = () => {
      const a = escenas[indice].puntos
      const b = escenas[siguiente()].puntos
      const progreso = avance()
      actuales = a.map((p, i) => {
        const q = b[i]
        const k = progreso === 0 ? 0 : suavizar(entre01((progreso - retraso[i]) / 0.7))
        const color = colores[p.grupo].map((c, j) => Math.round(c + (colores[q.grupo][j] - c) * k))
        return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k, color: `rgb(${color.join(', ')})` }
      })
    }

    const dibujar = (t) => {
      calcular()
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

      // Las líneas y cajas del gráfico actual se borran al empezar el cambio y las del
      // siguiente aparecen cuando los puntos ya llegaron
      const progreso = avance()
      const capas = [
        [escenas[indice], 1 - entre01(progreso / 0.3)],
        [escenas[siguiente()], entre01((progreso - 0.75) / 0.25)],
      ].filter(([, alfa]) => alfa > 0)
      const capa = (parte) => {
        ctx.save()
        ctx.beginPath()
        ctx.rect(px(0), py(1), px(1) - px(0), py(0) - py(1))
        ctx.clip()
        capas.forEach(([escena, alfa]) => escena[parte]?.({ ctx, px, py, rgba, colorEje, colorBorde, alfa }))
        ctx.restore()
      }

      capa('fondo')

      // Puntos
      const flotar = reducirMovimiento ? 0 : 3
      base.forEach((b, i) => {
        const e = estado[i]
        const p = actuales[i]
        const x = px(p.x) + e.dx + Math.cos(t * 0.6 + b.fase) * flotar
        const y = py(p.y) + e.dy + Math.sin(t * 0.8 + b.fase) * flotar
        ctx.beginPath()
        ctx.arc(x, y, b.r, 0, Math.PI * 2)
        ctx.globalAlpha = 0.8
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.lineWidth = 1.5
        ctx.strokeStyle = colorBorde
        ctx.stroke()
      })

      capa('frente')

      // Nombre del gráfico y un punto por cada gráfico del ciclo
      ctx.font = `600 12px ${fuente}`
      ctx.textBaseline = 'middle'
      ctx.fillStyle = colorTexto
      capas.forEach(([escena, alfa]) => {
        ctx.globalAlpha = alfa
        ctx.fillText(escena.nombre, MARGEN, MARGEN / 2)
      })
      escenas.forEach((_, j) => {
        ctx.globalAlpha = j === indice ? 0.9 : 0.3
        ctx.beginPath()
        ctx.arc(ancho - MARGEN - (escenas.length - 1 - j) * 10, MARGEN / 2, 2.5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    // Cada punto se aparta del cursor y vuelve a su lugar como un resorte
    const mover = () => {
      actuales.forEach((p, i) => {
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

    // Con el cursor encima, el gráfico se queda quieto (pero un cambio ya empezado termina)
    const avanzarReloj = (dt) => {
      if (encima && reloj < ESPERA) return
      reloj += dt
      if (reloj >= ESPERA + TRANSICION) {
        indice = siguiente()
        reloj = 0
      }
    }

    const cuadro = (ahora) => {
      // Tope de 50 ms por cuadro para que el ciclo no salte al volver a la pestaña
      avanzarReloj(ultimo === null ? 0 : Math.min(ahora - ultimo, 50))
      ultimo = ahora
      mover()
      dibujar(ahora / 1000)
      if (visible) {
        animacion = requestAnimationFrame(cuadro)
      } else {
        animacion = null
        ultimo = null
      }
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
    const alEntrarCanvas = () => {
      encima = true
    }
    const alSalirCanvas = () => {
      encima = false
    }
    const alClic = () => {
      if (reducirMovimiento) {
        indice = siguiente()
        dibujar(0)
      } else if (reloj < ESPERA) {
        reloj = ESPERA
      }
    }

    leerColores()
    ajustarTamano()
    dibujar(0)
    refrescar.current = () => {
      leerColores()
      dibujar(performance.now() / 1000)
    }

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

    canvas.addEventListener('click', alClic)
    if (!reducirMovimiento) {
      window.addEventListener('pointermove', alMover)
      document.addEventListener('pointerleave', alSalir)
      canvas.addEventListener('pointerenter', alEntrarCanvas)
      canvas.addEventListener('pointerleave', alSalirCanvas)
    }

    return () => {
      if (animacion) cancelAnimationFrame(animacion)
      observadorTamano.disconnect()
      observadorVista.disconnect()
      canvas.removeEventListener('click', alClic)
      window.removeEventListener('pointermove', alMover)
      document.removeEventListener('pointerleave', alSalir)
      canvas.removeEventListener('pointerenter', alEntrarCanvas)
      canvas.removeEventListener('pointerleave', alSalirCanvas)
    }
  }, [])

  useEffect(() => {
    refrescar.current?.()
  }, [tema])

  return <canvas ref={ref} className="dispersion-hero" aria-hidden="true" />
}

export default DispersionHero
