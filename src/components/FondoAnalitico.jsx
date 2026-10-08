import './FondoAnalitico.css'

// Fondo decorativo de la página de inicio: un gráfico tenue, con grilla, áreas apiladas
// y una serie con puntos. Las curvas se generan con sumas de senos (no son datos reales)
// y el conjunto se desplaza lento de lado a lado.

const ANCHO = 1600
const ALTO = 900
const PASOS = 64
// Las curvas sobresalen 100 px por lado, para que al desplazarse no se vea su borde
const X0 = -100
const X1 = ANCHO + 100

// Curva suave: suma de senos con fase y amplitud propias
const curva = (fase, amplitud, base) =>
  Array.from({ length: PASOS + 1 }, (_, i) => {
    const x = X0 + (i / PASOS) * (X1 - X0)
    const t = i / PASOS
    const y = base - amplitud * (Math.sin(t * 6.3 + fase) * 0.6 + Math.sin(t * 13.1 + fase * 2) * 0.25 + Math.sin(t * 2.2) * 0.4)
    return [x, y]
  })

const capas = [curva(0.4, 40, 690), curva(1.7, 55, 620), curva(3.1, 50, 545)]

// Área entre una curva y la de abajo (o el borde inferior)
const area = (arriba, abajo) => {
  const ida = arriba.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join('L')
  const vuelta = abajo
    ? [...abajo].reverse().map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join('L')
    : `${X1},${ALTO}L${X0},${ALTO}`
  return `M${ida}L${vuelta}Z`
}

const linea = curva(5.2, 70, 380)
const rutaLinea = `M${linea.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join('L')}`
const puntos = linea.filter((_, i) => i % 6 === 3)
const grilla = Array.from({ length: 8 }, (_, i) => (i + 1) * (ALTO / 9))

function FondoAnalitico() {
  return (
    <div className="fondo-analitico" aria-hidden="true">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMax slice">
        <g className="fondo-analitico__grilla">
          {grilla.map((y) => (
            <line key={y} x1="0" x2={ANCHO} y1={y} y2={y} />
          ))}
        </g>
        <g className="fondo-analitico__deriva">
          <path className="fondo-analitico__capa fondo-analitico__capa--1" d={area(capas[0])} />
          <path className="fondo-analitico__capa fondo-analitico__capa--2" d={area(capas[1], capas[0])} />
          <path className="fondo-analitico__capa fondo-analitico__capa--3" d={area(capas[2], capas[1])} />
          <path className="fondo-analitico__linea" d={rutaLinea} />
          {puntos.map(([x, y]) => (
            <circle key={x} className="fondo-analitico__punto" cx={x} cy={y} r="5" />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default FondoAnalitico
