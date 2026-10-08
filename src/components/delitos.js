// Utilidades de la nota de delitos

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MESES_CORTOS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.']

// '2019-12' -> 'diciembre de 2019'
export function etiquetaMes(periodo) {
  const [anio, mes] = periodo.split('-')
  return `${MESES[Number(mes) - 1]} de ${anio}`
}

// '2019-12' -> 'dic. 2019'
export function etiquetaMesCorta(periodo) {
  const [anio, mes] = periodo.split('-')
  return `${MESES_CORTOS[Number(mes) - 1]} ${anio}`
}

// Ticks de enero cada `paso` años, para ejes de meses
export function ticksAnuales(datos, paso = 2, clave = 'periodo') {
  return datos
    .map((d) => d[clave])
    .filter((p) => p.endsWith('-01') && Number(p.slice(0, 4)) % paso === 0)
}
