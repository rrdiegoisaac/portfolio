// Configuración visual común de los gráficos (Recharts). Los colores vienen de index.css.

export const COLOR = {
  serie: 'var(--chart-1)',
  serie2: 'var(--chart-2)',
  serie3: 'var(--chart-3)',
  secuencial: ['var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)'],
  borde: 'var(--chart-muted)',
  apagado: 'var(--chart-muted)',
  grilla: 'var(--chart-grid)',
  eje: 'var(--chart-axis)',
  superficie: 'var(--bg)',
}

export const ejeProps = {
  stroke: COLOR.eje,
  tick: { fill: COLOR.eje, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: COLOR.grilla },
}

export const grillaProps = {
  stroke: COLOR.grilla,
  strokeDasharray: '0',
}

export const formatoNumero = (n) => n.toLocaleString('es-CL')

// Mismo margen para el mapa y las barras por latitud, así sus ejes quedan alineados
export const margenMapa = { top: 8, right: 8, bottom: 8, left: 0 }
