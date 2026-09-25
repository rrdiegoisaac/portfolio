// Nombres con que se conoce a los grandes terremotos, por fecha (UTC) del sismo principal.
// Si el análisis elige otro terremoto que no está aquí, se usa su lugar de referencia.
const NOMBRES = {
  '2010-02-27': 'Maule',
  '2014-04-01': 'Iquique',
  '2015-09-16': 'Illapel',
  '2016-12-25': 'Melinka',
  '2020-09-01': 'Huasco',
  '2024-07-19': 'San Pedro de Atacama',
}

const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// Recibe un objeto con fecha_utc (o fecha) y lugar
export function nombreTerremoto(t) {
  const fecha = (t.fecha_utc ?? t.fecha).slice(0, 10)
  return NOMBRES[fecha] ?? t.lugar
}

// Ej. "Maule 2010 · M8,8"
export function etiquetaTerremoto(t) {
  return `${nombreTerremoto(t)} ${t.anio} · M${decimal1(t.magnitud)}`
}

// Sismos principales cuyo catálogo no registró todas las réplicas de los primeros días
export const CATALOGO_INCOMPLETO = new Set(['2010-02-27'])
