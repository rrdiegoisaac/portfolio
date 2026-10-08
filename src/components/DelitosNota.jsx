import { useRef } from 'react'
import datos from '../data/delitos/00_datos.json'
import registro from '../data/delitos/01_registro.json'
import tendencia from '../data/delitos/02_tendencia.json'
import violencia from '../data/delitos/03_violencia.json'
import drogasArmas from '../data/delitos/04_drogas_armas.json'
import regiones from '../data/delitos/05_regiones.json'
import comunas from '../data/delitos/06_comunas.json'
import mapas from '../data/delitos/07_mapas.json'
import BuscadorComuna from './BuscadorComuna'
import ChartFigure from './ChartFigure'
import CodeBlock from './CodeBlock'
import ComunasRanking from './ComunasRanking'
import DataTable from './DataTable'
import DetencionesSubgrupo from './DetencionesSubgrupo'
import HomicidiosAnual from './HomicidiosAnual'
import IndiceNota from './IndiceNota'
import MapaCoropletas from './MapaCoropletas'
import QuiebresRegistro from './QuiebresRegistro'
import RegionesRobos from './RegionesRobos'
import RobosMovil from './RobosMovil'
import RobosRegistro from './RobosRegistro'
import TendenciaFamilias from './TendenciaFamilias'
import TipoDatoFamilias from './TipoDatoFamilias'
import { etiquetaMes } from './delitos'
import './Nota.css'

// Las cifras se leen de los JSON del análisis. Las conclusiones escritas se
// verificaron con los datos 2005–junio de 2026: revisarlas si se vuelve a correr el análisis.
// Lo escrito a mano que depende de los datos: "no han vuelto al nivel de antes de la pandemia",
// "drogas y armas en su nivel más alto o cerca", los meses de los quiebres de registro
// (PANELES_REGISTRO), los años 2020 y 2022 en homicidios, que el máximo de robos con violencia
// sea el año de referencia, y "por lejos" en la Región Metropolitana.

const entero = (v) => Math.round(v).toLocaleString('es-CL')
const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const pctAbs = (v) => `${Math.round(Math.abs(v))}%`
const conSigno = (v) => `${v > 0 ? '+' : '−'}${decimal1(Math.abs(v))}%`
const millones = (v) => (v / 1e6).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const ANIO = datos.ultimo_anio_completo
const REF = tendencia.periodo.referencia
const INICIO = tendencia.periodo.desde
const PERIODO = `enero de ${INICIO} a ${etiquetaMes(datos.periodo.hasta)}`
const FUENTE = `Fuente: CEAD, casos policiales (denuncias y detenciones en flagrancia), ${PERIODO}.`
const FUENTE_TASAS = `${FUENTE} Población: proyecciones del INE, base Censo 2017.`

const familia = (id) => datos.por_familia.find((f) => f.familia_id === id)
const tendenciaFamilia = (id) => tendencia.familias.find((f) => f.familia_id === id)
const residualAnio = (anio) => datos.residual_anual.find((r) => r.anio === anio).pct_residual
const nuevo = (id) => registro.subgrupos_nuevos.find((s) => s.subgrupo_id === id)
const total = tendencia.total
const hom = violencia.resumen.homicidios
const robos = violencia.resumen.robos_violentos
const sorpresa = violencia.resumen.robo_sorpresa
const region = (nombre) => regiones.regiones.find((r) => r.region === nombre)
const semestre = tendencia.acumulado_semestre
const semestreFamilia = (id) => semestre.familias.find((f) => f.familia_id === id)
// Familias que suben más de 1% (el CEAD considera mantención las variaciones entre −1% y 1%)
const subenSemestre = semestre.familias.filter((f) => f.familia_id !== 99 && f.cambio > 1)
// 'a, b y c' ('e' antes de palabras que empiezan con i)
const listaY = (items) => {
  if (items.length < 2) return items[0]
  const ultimo = items.at(-1)
  return `${items.slice(0, -1).join(', ')} ${/^i/i.test(ultimo) ? 'e' : 'y'} ${ultimo}`
}

// Regiones ordenadas por tasa de robos violentos y de homicidios
const porRobos = [...regiones.regiones].sort((a, b) => b.tasa_robos_violentos - a.tasa_robos_violentos)
const porHomicidios = [...regiones.regiones].sort((a, b) => b.tasa_homicidios_3a - a.tasa_homicidios_3a)
const porTotal = [...regiones.regiones].sort((a, b) => b.tasa_total - a.tasa_total)
const rm = region('Metropolitana')
const regionesBajanRobos = regiones.regiones.filter((r) => r.tasa_robos_violentos < r.tasa_robos_violentos_referencia).length

const rankingRobos = comunas.ranking_robos_violentos
const sensibilidad = comunas.sensibilidad_censo
const rankingHomicidios = comunas.ranking_homicidios
const regionesRanking = [...new Set(rankingRobos.map((c) => c.region))]
const enAmbos = rankingRobos.filter((c) => rankingHomicidios.some((h) => h.cut === c.cut)).length
const concentracion = comunas.concentracion_robos_violentos
const comunaInicial = comunas.comunas.find((c) => c.comuna === 'Santiago').cut

const otrosAnual = registro.otros_anual

const FUENTES = [
  {
    id: 1,
    texto: 'Centro de Estudios y Análisis del Delito (CEAD), Ministerio de Seguridad Pública. Estadísticas delictuales.',
    url: 'https://cead.minsegpublica.gob.cl/estadisticas-delictuales/',
  },
  {
    id: 2,
    texto: 'CEAD. Informe de casos policiales, período enero a junio de 2026 (definición de casos policiales y nota técnica sobre homicidios).',
    url: 'https://cead.minsegpublica.gob.cl/wp-content/uploads/download-manager-files/casos-policiales-ene-jun-2026.pdf',
  },
  {
    id: 3,
    texto: 'INE. Encuesta Nacional Urbana de Seguridad Ciudadana (ENUSC) 2024: presentación de resultados (7 de julio de 2025).',
    url: 'https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2025/07/07/subsecretar%C3%ADa-de-prevenci%C3%B3n-del-delito-e-ine-presentan-los-resultados-de-la-encuesta-nacional-urbana-de-seguridad-ciudadana-(enusc)-2024',
  },
  {
    id: 4,
    texto: 'INE. Estimaciones y proyecciones de población por comuna, 2002–2035, base Censo 2017.',
    url: 'https://www.ine.gob.cl/docs/default-source/proyecciones-de-poblacion/cuadros-estadisticos/base-2017/estimaciones-y-proyecciones-2002-2035-comunas.xlsx',
  },
  {
    id: 5,
    texto: 'INE. Estimaciones y proyecciones de población, base 2024 (enero de 2026).',
    url: 'https://www.ine.gob.cl/docs/default-source/prensa-y-comunicacion/eepp2024.pdf',
  },
  { id: 6, texto: 'INE. Censo de Población y Vivienda 2024: resultados por comuna.', url: 'https://censo2024.ine.gob.cl/resultados/' },
  {
    id: 7,
    texto: 'Centro para la Prevención de Homicidios y Delitos Violentos. Estadísticas oficiales de víctimas de homicidio.',
    url: 'https://prevenciondehomicidios.cl/estadisticas',
  },
]

// Referencia numerada a una fuente, ej. <Cita n={2} />
function Cita({ n }) {
  return (
    <sup className="nota__cita">
      <a href={`#fuente-${n}`} aria-label={`Fuente ${n}`}>
        [{n}]
      </a>
    </sup>
  )
}

const CODIGO_PARSER = `
for (nivel, codigo, nombre), fila in zip(esperadas, filas):
    etiqueta = celdas[0].get_text(strip=True)
    if normalizar(etiqueta) != normalizar(nombre):
        raise ValueError(f"Fila inesperada: llegó {etiqueta!r} donde se esperaba {nombre!r}")
    ...

# El total de cada familia tiene que ser la suma de sus subgrupos
for familia_id, totales in total_familia.items():
    if totales != suma_hojas[familia_id]:
        raise ValueError(f"El total de la familia {familia_id} no coincide con la suma de sus subgrupos")
`

const CODIGO_DIVISION = `
def descargar_territorio(session, territorio, tipo_dato, delitos, anios):
    """Si el servidor no alcanza a responder, divide los años en dos mitades."""
    try:
        resp = session.post(DATOS_URL, data=parametros(territorio, tipo_dato, delitos, anios), timeout=180)
        resp.raise_for_status()
        return parsear_tabla(resp.content.decode("utf-8"), delitos)
    except requests.RequestException:
        mitad = len(anios) // 2
        return (descargar_territorio(session, territorio, tipo_dato, delitos, anios[:mitad])
                + descargar_territorio(session, territorio, tipo_dato, delitos, anios[mitad:]))
`

const PANELES_REGISTRO = [
  {
    titulo: 'Otras infracciones a la ley de armas',
    meses: registro.armas_otras_infracciones.meses,
    marca: '2024-05',
    textoMarca: 'may. 2024',
  },
  {
    titulo: 'Consumo de alcohol en la vía pública',
    meses: registro.alcohol.meses,
    marca: '2019-11',
    textoMarca: 'nov. 2019',
  },
  {
    titulo: 'Otros delitos o faltas (categoría residual)',
    meses: registro.otros_mensual.meses,
    marca: '2024-05',
    textoMarca: 'may. 2024',
  },
]

const PANELES_TENDENCIA = [
  { clave: 'total', titulo: 'Las 7 familias de delitos', fin: total.tasa_fin, cambio: total.cambio_vs_referencia, destacado: true },
  ...tendencia.familias.map((f) => ({
    clave: `f${f.familia_id}`,
    titulo: f.familia_id === 99 ? 'Otros delitos o faltas (residual, fuera del total)' : f.familia,
    fin: f.tasa_fin,
    cambio: f.cambio_vs_referencia,
    apagado: f.familia_id === 99,
  })),
]

// Mapas: indicadores, zonas y referencia nacional
const INDICADORES_MAPA = [
  { clave: 'tasa_robos_violentos', nombre: `Robos violentos ${ANIO}`, formato: entero },
  { clave: 'tasa_homicidios_3a', nombre: `Homicidios ${regiones.anios_homicidios.join('–')}`, formato: decimal1 },
  { clave: 'tasa_vif', nombre: `Violencia intrafamiliar ${ANIO}`, formato: entero },
  { clave: 'tasa_total', nombre: `Total 7 familias ${ANIO}`, formato: entero },
]
const ZONAS_REGIONES = Object.fromEntries(
  regiones.regiones.map((r) => [r.region_codigo, { ...r, nombre: r.region, tasa_vif: r.f3 }]),
)
const FORMAS_REGIONES = mapas.pais.regiones.map((r) => ({ id: r.region_codigo, ruta: r.ruta }))
const ZONAS_RM = Object.fromEntries(
  comunas.comunas
    .filter((c) => Math.floor(c.cut / 1000) === 13)
    .map((c) => [
      c.cut,
      {
        ...c,
        nombre: c.comuna,
        nota:
          c.poblacion < comunas.poblacion_minima
            ? `Menos de ${entero(comunas.poblacion_minima)} habitantes: unos pocos casos cambian mucho la tasa.`
            : null,
      },
    ]),
)
const FORMAS_RM = mapas.rm.comunas.map((c) => ({ id: c.cut, ruta: c.ruta }))
const robosRM = comunas.comunas.filter((c) => Math.floor(c.cut / 1000) === 13).reduce((t, c) => t + c.robos_violentos, 0)
const robosPais = comunas.comunas.reduce((t, c) => t + c.robos_violentos, 0)
const poblacionRM = comunas.comunas.filter((c) => Math.floor(c.cut / 1000) === 13).reduce((t, c) => t + c.poblacion, 0)
const poblacionPais = comunas.comunas.reduce((t, c) => t + c.poblacion, 0)

const COLUMNAS_SEMESTRE = [
  { key: 'familia', label: 'Familia' },
  { key: 'anterior', label: `Ene.–jun. ${semestre.anio - 1}`, numeric: true },
  { key: 'actual', label: `Ene.–jun. ${semestre.anio}`, numeric: true },
  { key: 'cambio', label: 'Cambio', numeric: true, format: conSigno },
]

const COLUMNAS_REGIONES = [
  { key: 'region', label: 'Región' },
  { key: 'tasa_total', label: `Casos (7 familias) ${ANIO}`, numeric: true, format: entero },
  { key: 'cambio_total', label: `Cambio vs. ${REF}`, numeric: true, format: conSigno },
  { key: 'tasa_robos_violentos', label: `Robos violentos ${ANIO}`, numeric: true, format: entero },
  { key: 'f3', label: `Violencia intrafamiliar ${ANIO}`, numeric: true, format: entero },
  { key: 'tasa_homicidios_3a', label: `Homicidios ${regiones.anios_homicidios.join('–')}`, numeric: true, format: decimal1 },
]

const SUBGRUPOS_DETENCIONES = drogasArmas.por_subgrupo.filter((s) => s.casos >= 5000)
const microtrafico = drogasArmas.series.microtrafico.anual
const cortante = drogasArmas.series.porte_arma_cortante.anual
const disparo = drogasArmas.series.disparo_injustificado.anual
const anioSerie = (serie, anio) => serie.find((a) => a.anio === anio)
const homAnual = violencia.series.homicidios.anual
const homRecientes = homAnual.filter((a) => a.anio >= 2022).map((a) => a.tasa)

function DelitosNota() {
  const refNota = useRef(null)

  return (
    <div className="nota" ref={refNota}>
      <IndiceNota contenedor={refNota} />
      <p className="nota__lead">
        Los registros policiales son la fuente más citada cuando se habla de
        delincuencia en Chile, y también una de las más fáciles de leer mal.
        Descargué todos los casos policiales que publica el Centro de Estudios y
        Análisis del Delito (CEAD)<Cita n={1} />, mes a mes desde {INICIO} y para cada
        una de las {datos.comunas} comunas, y los analicé como cualquier conjunto de
        datos: primero, cómo se generan; después, qué dicen.
      </p>
      <p>
        En 2024 hice una primera versión de este proyecto, con una aplicación en
        Streamlit y los datos del CEAD hasta 2023. Esta la rehice desde cero: el
        CEAD cambió de sitio y de clasificación de delitos, y quise tratar en
        serio los límites de los datos.
      </p>

      <aside className="nota__resumen">
        <h2 className="nota__resumen-titulo">En resumen</h2>
        <ul>
          <li>
            <strong>Los casos policiales no han vuelto al nivel de antes de la
            pandemia.</strong> En {ANIO} se registraron {entero(total.tasa_fin)} casos por
            cada 100.000 habitantes en las 7 familias de delitos, un{' '}
            {pctAbs(total.cambio_vs_referencia)} menos que en {REF}.
          </li>
          <li>
            <strong>Pero no todo baja.</strong> Los homicidios pasaron de{' '}
            {decimal1(hom.tasa_referencia)} a {decimal1(hom.tasa_fin)} casos por 100.000
            habitantes entre {REF} y {ANIO}, y los delitos de drogas y armas están en
            su nivel más alto o cerca de él.
          </li>
          <li>
            <strong>Los robos violentos se concentran en la Región Metropolitana:</strong>{' '}
            su tasa es {decimal1(rm.tasa_robos_violentos / porRobos[1].tasa_robos_violentos)} veces la de la
            región que le sigue.
          </li>
          <li>
            <strong>El registro cambia, no solo los delitos.</strong> Hay delitos que
            se empiezan a registrar a mitad del período, saltos de un mes a otro y
            una categoría residual que ya es el {Math.round(residualAnio(ANIO))}% de todos
            los casos. Y más de la mitad de los hogares víctimas de un delito
            violento no lo denuncia<Cita n={3} />.
          </li>
        </ul>
        <h3 className="nota__resumen-titulo">Qué hice</h3>
        <ul>
          <li>
            Web scraping de la API del CEAD con Python: {datos.subgrupos} tipos de delitos, mes a
            mes, para el país, las 16 regiones y las {datos.comunas} comunas.
          </li>
          <li>Una base SQLite con los casos, la población del INE y controles de calidad en cada descarga.</li>
          <li>Tasas por 100.000 habitantes con las proyecciones de población del INE, y una comparación con el Censo 2024.</li>
          <li>Revisión de los cambios de registro antes de interpretar cualquier tendencia.</li>
        </ul>
      </aside>

      <h2>Los datos</h2>
      <p>
        El CEAD publica los casos policiales en un formulario web: se elige el
        territorio, los delitos y los meses, y el sitio devuelve una tabla. Detrás
        hay una API que recibe esos filtros y responde con el HTML de la tabla.
        Escribí un scraper en Python que la consulta para cada territorio, lee la
        tabla y guarda cada cifra en una base SQLite.
      </p>
      <p>
        La tabla mezcla filas de familias, grupos y subgrupos de delitos, y omite
        algunas cuando se repiten. Para no asignar una cifra al delito
        equivocado, el scraper compara cada fila con la clasificación esperada y
        comprueba que el total de cada familia sea la suma de sus subgrupos. Si
        algo no cuadra, se detiene en vez de guardar datos mal asignados.
      </p>
      <CodeBlock file="scraper/scrape_cead.py" code={CODIGO_PARSER} />
      <p>
        Con el total del país y las regiones, el servidor del CEAD no alcanzaba a
        responder la consulta completa. La solución fue dividir los años en dos
        mitades cada vez que una consulta falla, hasta que responda:
      </p>
      <CodeBlock file="scraper/scrape_cead.py" code={CODIGO_DIVISION} />
      <p>
        El resultado son {millones(datos.casos_total)} millones de casos policiales
        entre {PERIODO}, en {datos.subgrupos} subgrupos de delitos. Para calcular
        tasas usé la población proyectada por el Instituto Nacional de
        Estadísticas (INE) para cada comuna y año<Cita n={4} />, la misma que usa
        el CEAD en sus tasas. Como control, la suma de las regiones difiere del
        total del país en menos del {decimal1(Math.max(datos.max_diferencia_regiones_pct, 0.1))}% en
        todos los años.
      </p>

      <h2>Qué cuenta un caso policial</h2>
      <p>
        Un caso policial no es un delito ocurrido: es un delito que llegó a
        conocimiento de Carabineros o de la PDI, por una denuncia o porque la
        policía detuvo a alguien en flagrancia<Cita n={2} />. Esa diferencia
        importa. Un robo que nadie denuncia no aparece. Según la Encuesta Nacional
        Urbana de Seguridad Ciudadana 2024, el 55,0% de los hogares víctimas de
        un delito violento no presentó una denuncia formal<Cita n={3} />.
      </p>
      <p>
        Y no todos los casos llegan de la misma forma. En los robos violentos,
        el {decimal1(100 - familia(2).pct_detenciones)}% de los casos de {ANIO} son
        denuncias. En los delitos de drogas, el{' '}
        {decimal1(familia(4).pct_detenciones)}% son detenciones en flagrancia: casos
        que existen porque la policía los encontró. Por eso un aumento de los
        casos de drogas puede reflejar más delitos, pero también más
        controles policiales; con estos datos no se pueden separar.
      </p>

      <ChartFigure
        title={`De dónde vienen los casos de cada familia de delitos, ${ANIO}`}
        subtitle="Porcentaje de los casos policiales que son denuncias y que son detenciones en flagrancia"
        note={FUENTE}
      >
        <TipoDatoFamilias familias={datos.por_familia} />
      </ChartFigure>

      <p>
        La clasificación del CEAD agrupa los delitos en 7 familias y 45
        subgrupos, más una categoría residual: <em>otros delitos o faltas</em>.
        Esa categoría no dice qué delitos agrupa y en {ANIO} reunió el{' '}
        {decimal1(residualAnio(ANIO))}% de todos los casos, contra el{' '}
        {decimal1(residualAnio(INICIO))}% en {INICIO}. Como no se sabe qué contiene,
        la dejé fuera de los totales y la muestro aparte.
      </p>

      <h2>El registro también cambia</h2>
      <p>
        Antes de mirar tendencias revisé cada subgrupo mes a mes. Algunos
        cambios bruscos no parecen cambios en los delitos, sino en cómo se
        registran.
      </p>

      <h3>Delitos que aparecen a mitad de camino</h3>
      <p>
        Varios subgrupos no tienen casos al comienzo del período: los femicidios
        aparecen desde {etiquetaMes(nuevo(10102).desde)}, los acosos sexuales desde{' '}
        {etiquetaMes(nuevo(10203).desde)} y los robos violentos de vehículos desde{' '}
        {etiquetaMes(nuevo(20102).desde)}. En el último caso, los robos de vehículos
        se registraban antes dentro de los robos con violencia: en {ANIO}, el nuevo
        subgrupo reunió el {Math.round(registro.pct_robo_vehiculo)}% de la suma de ambos.
        Para comparar en el tiempo hay que sumarlos.
      </p>

      <ChartFigure
        wide
        title="Robos con violencia o intimidación por mes"
        subtitle={`Desde ${etiquetaMes(nuevo(20102).desde)}, los robos violentos de vehículos se registran como un subgrupo aparte`}
        note={FUENTE}
      >
        <RobosRegistro meses={registro.robos_violentos_mensual} desde="2015-01" marca={nuevo(20102).desde} />
      </ChartFigure>

      <h3>Saltos que no son delitos</h3>
      <p>
        Otros cambios son saltos de un mes a otro. Las <em>otras infracciones a la
        ley de armas</em> pasan de unos {entero(registro.armas_salto.promedio_mensual_antes)}{' '}
        casos al mes a unos {entero(registro.armas_salto.promedio_mensual_despues)} desde
        mayo de 2024, y el {decimal1(100 - registro.armas_salto.pct_detenciones_despues)}%
        son denuncias. Ese subgrupo explica casi todo el aumento de los delitos
        de armas en 2024 y {ANIO}. Los casos por <em>consumo de alcohol en la vía
        pública</em> bajan desde noviembre de 2019 y no se recuperan: entre{' '}
        {ANIO - 3} y {ANIO} promedian {entero(registro.alcohol_cambio.anual_despues)} al año,
        un {pctAbs(registro.alcohol_cambio.pct)} menos que en los 12 meses anteriores a
        esa caída. Y la categoría residual sube de {entero(otrosAnual[String(ANIO - 2)])}{' '}
        a {entero(otrosAnual[String(ANIO)])} casos al año entre {ANIO - 2} y {ANIO}. Los datos no dicen
        por qué; lo que sí dicen es que esos saltos no se deben leer como
        cambios en la delincuencia.
      </p>

      <ChartFigure
        wide
        title="Tres cambios bruscos en el registro"
        subtitle="Casos policiales por mes en el total del país. Cada panel tiene su propia escala."
        note={FUENTE}
      >
        <QuiebresRegistro paneles={PANELES_REGISTRO} />
      </ChartFigure>

      <aside className="nota__aviso">
        <strong>Qué significa para el resto del análisis.</strong> Comparo tasas por
        habitante, no cantidades, porque la población creció. Sumo los robos con
        violencia con los de vehículos. Dejo fuera de los totales la categoría
        residual. Y uso {REF} como referencia, el último año completo antes de
        la pandemia: 2020 y 2021 son años atípicos en casi todos los delitos.
      </aside>

      <h2>¿Hay más delitos que antes?</h2>
      <p>
        En las 7 familias de delitos, la tasa de casos policiales llegó a su
        máximo en {total.max_anio}, con {entero(total.max_tasa)} casos por cada 100.000
        habitantes. Desde entonces bajó. En {ANIO} fue de {entero(total.tasa_fin)}: un{' '}
        {pctAbs(total.cambio_vs_max)} menos que en {total.max_anio} y un{' '}
        {pctAbs(total.cambio_vs_referencia)} menos que en {REF}. El mínimo fue{' '}
        {total.min_anio}, en plena pandemia.
      </p>
      <p>
        El total, sin embargo, esconde caminos distintos. Los delitos contra la
        propiedad no violentos, como hurtos y robos en casas, y las
        incivilidades cayeron con la pandemia y no volvieron:{' '}
        {pctAbs(tendenciaFamilia(6).cambio_vs_referencia)} y{' '}
        {pctAbs(tendenciaFamilia(7).cambio_vs_referencia)} menos que en {REF}. Los
        robos violentos están un {pctAbs(tendenciaFamilia(2).cambio_vs_referencia)}{' '}
        bajo {REF}. En cambio, los delitos de drogas suben un{' '}
        {pctAbs(tendenciaFamilia(4).cambio_vs_referencia)} y los de armas se duplican,
        aunque en armas pesa el salto de registro de 2024.
      </p>

      <ChartFigure
        wide
        title="Casos policiales por cada 100.000 habitantes, por familia de delitos"
        subtitle={`De ${INICIO} a ${ANIO}. La línea punteada marca ${REF}. Cada panel tiene su propia escala.`}
        note={FUENTE_TASAS}
      >
        <TendenciaFamilias anual={tendencia.anual} paneles={PANELES_TENDENCIA} referencia={REF} />
      </ChartFigure>

      <p>
        ¿Significa esto que hay menos delitos? No necesariamente. Los casos
        policiales dependen de que las personas denuncien y de lo que la policía
        detecte, y ambas cosas pueden cambiar con el tiempo. Lo que muestran
        los datos es que los registros policiales, en conjunto, no crecieron.
      </p>

      <h2>Los delitos violentos</h2>

      <h3>Homicidios</h3>
      <p>
        En los homicidios la tendencia es clara. La tasa se mantuvo entre {decimal1(Math.min(...violencia.series.homicidios.anual.filter((a) => a.anio <= REF).map((a) => a.tasa)))} y{' '}
        {decimal1(Math.max(...violencia.series.homicidios.anual.filter((a) => a.anio <= REF).map((a) => a.tasa)))}{' '}
        casos por 100.000 habitantes entre {INICIO} y {REF}. En 2020 subió a{' '}
        {decimal1(anioSerie(homAnual, 2020).tasa)}, y desde 2022 se mantiene entre{' '}
        {decimal1(Math.min(...homRecientes))} y {decimal1(Math.max(...homRecientes))}. En {ANIO} hubo{' '}
        {entero(hom.casos_fin)} casos.
      </p>

      <ChartFigure
        title="Casos policiales de homicidio por cada 100.000 habitantes"
        subtitle="Incluye homicidios y femicidios"
        note={`Son casos conocidos por las policías, no la cifra oficial de víctimas, que publica el Centro para la Prevención de Homicidios y Delitos Violentos. ${FUENTE_TASAS}`}
      >
        <HomicidiosAnual anual={violencia.series.homicidios.anual} referencia={REF} />
      </ChartFigure>

      <p>
        Una advertencia: estas cifras cuentan casos policiales, no víctimas. Un
        caso puede tener más de una víctima, y el CEAD advierte que sus cifras de
        homicidios son preliminares<Cita n={2} />. La cifra oficial la publica el
        Centro para la Prevención de Homicidios y Delitos Violentos<Cita n={7} />.
      </p>

      <h3>Robos</h3>
      <p>
        Los robos con violencia o intimidación, sumando los de vehículos, tuvieron
        su tasa más alta en {robos.max_anio}: {entero(robos.max_tasa)} casos por
        100.000 habitantes. En {ANIO} fueron {entero(robos.tasa_fin)}, un{' '}
        {pctAbs(robos.cambio_vs_referencia)} menos. Los robos por sorpresa, en cambio,
        están un {pctAbs(sorpresa.cambio_vs_referencia)} sobre {REF}, aunque bajo su
        máximo de {sorpresa.max_anio}.
      </p>

      <ChartFigure
        wide
        title="Robos en los últimos 12 meses"
        subtitle="Cada punto es la suma de los 12 meses anteriores, lo que quita la variación entre meses del año"
        note={FUENTE}
      >
        <RobosMovil robos={violencia.series.robos_violentos.movil_12} sorpresa={violencia.series.robo_sorpresa.movil_12} />
      </ChartFigure>

      <h2>Drogas y armas: lo que encuentra la policía</h2>
      <p>
        Hay delitos que casi solo se registran cuando la policía los encuentra.
        El {decimal1(SUBGRUPOS_DETENCIONES[0].pct_detenciones)}% de los casos de{' '}
        {SUBGRUPOS_DETENCIONES[0].subgrupo.toLowerCase()} y el{' '}
        {decimal1(drogasArmas.por_subgrupo.find((s) => s.subgrupo_id === 40102).pct_detenciones)}% de los de
        microtráfico son detenciones en flagrancia. En esos delitos, la cifra
        mide tanto la actividad delictual como la actividad policial.
      </p>

      <ChartFigure
        title={`Qué parte de los casos son detenciones en flagrancia, ${ANIO}`}
        subtitle="Subgrupos con al menos 5.000 casos en el año. La línea punteada marca el 50%."
        note={FUENTE}
      >
        <DetencionesSubgrupo subgrupos={SUBGRUPOS_DETENCIONES} />
      </ChartFigure>

      <p>
        Con esa precaución, los casos de microtráfico pasaron de{' '}
        {entero(anioSerie(microtrafico, REF).casos)} en {REF} a{' '}
        {entero(anioSerie(microtrafico, ANIO).casos)} en {ANIO}, y los de porte de arma
        cortante o punzante, de {entero(anioSerie(cortante, REF).casos)} a{' '}
        {entero(anioSerie(cortante, ANIO).casos)}. Un caso distinto es el disparo
        injustificado, que se registra desde {etiquetaMes(nuevo(50101).desde)} y casi
        siempre por denuncia: pasó de {entero(anioSerie(disparo, REF).casos)} casos en{' '}
        {REF} a {entero(anioSerie(disparo, ANIO).casos)} en {ANIO}.
      </p>

      <h2>¿Dónde?</h2>

      <h3>Regiones</h3>
      <p>
        La Región Metropolitana tiene, por lejos, la tasa más alta de robos
        violentos: {entero(rm.tasa_robos_violentos)} por 100.000 habitantes en {ANIO},
        contra {entero(porRobos[1].tasa_robos_violentos)} en {porRobos[1].region}, la que le
        sigue. En {regionesBajanRobos} de las 16 regiones la tasa está bajo la de{' '}
        {REF}. En homicidios, las tasas más altas de {regiones.anios_homicidios.join(' a ')}{' '}
        están en {porHomicidios[0].region} ({decimal1(porHomicidios[0].tasa_homicidios_3a)}) y{' '}
        {porHomicidios[1].region} ({decimal1(porHomicidios[1].tasa_homicidios_3a)}).
      </p>
      <ChartFigure
        wide
        title="Casos policiales por cada 100.000 habitantes, por región"
        subtitle="Elige un indicador. Pasa el cursor o toca una región para ver su detalle."
        note={`Homicidios: promedio de ${regiones.anios_homicidios.join(' a ')}. El mapa no muestra las islas oceánicas ni el Territorio Antártico. Límites: INE. ${FUENTE_TASAS}`}
      >
        <MapaCoropletas
          viewbox={mapas.pais.viewbox}
          formas={FORMAS_REGIONES}
          zonas={ZONAS_REGIONES}
          indicadores={INDICADORES_MAPA}
          referencia={{ ...regiones.pais, tasa_vif: regiones.pais.f3 }}
          unidad="por 100.000 hab."
          alto={680}
          etiquetaZona="regiones"
        />
      </ChartFigure>

      <p>
        Pero la región con más robos violentos no es la que tiene más casos
        policiales en total. Con las 7 familias, la tasa más alta es la de{' '}
        {porTotal[0].region} ({entero(porTotal[0].tasa_total)}) y la Metropolitana queda
        en el lugar {porTotal.findIndex((r) => r.region === 'Metropolitana') + 1} de 16. El
        total suma delitos muy distintos, de un homicidio a una riña, así que
        una sola cifra de "delincuencia" sirve poco para comparar.
      </p>

      <ChartFigure
        wide
        title="Robos violentos por cada 100.000 habitantes, por región"
        subtitle={`Robos con violencia o intimidación (incluye vehículos) y robos por sorpresa, en ${REF} y ${ANIO}. De norte a sur.`}
        note={`Homicidios: promedio de ${regiones.anios_homicidios.join(' a ')}, porque en las regiones pequeñas son pocos casos al año. ${FUENTE_TASAS}`}
      >
        <RegionesRobos regiones={regiones.regiones} pais={regiones.pais} referencia={REF} anio={ANIO} />
        <DataTable columns={COLUMNAS_REGIONES} rows={regiones.regiones} rowKey="region" />
      </ChartFigure>

      <h3>Comunas</h3>
      <p>
        Los robos violentos están muy concentrados: la mitad de los casos de{' '}
        {ANIO} ocurrió en {concentracion.comunas_mitad} de las {datos.comunas} comunas,
        donde vive el {Math.round(concentracion.pct_poblacion)}% de la población. Entre
        las comunas de más de {entero(comunas.poblacion_minima)} habitantes, la tasa más
        alta es la de {rankingRobos[0].comuna}, con {entero(rankingRobos[0].tasa_robos_violentos)}{' '}
        robos violentos por 100.000 habitantes, seguida de {rankingRobos[1].comuna} y{' '}
        {rankingRobos[2].comuna}.{' '}
        {regionesRanking.length === 1 && `Las ${rankingRobos.length} comunas del ranking son de la región ${regionesRanking[0]}.`}
      </p>

      <p>
        La Región Metropolitana concentra el {Math.round((robosRM / robosPais) * 100)}% de los
        robos violentos del país, con el {Math.round((poblacionRM / poblacionPais) * 100)}% de
        la población. Dentro de ella, las tasas más altas se agrupan en el centro de
        Santiago y las comunas que lo rodean.
      </p>

      <ChartFigure
        wide
        title="Región Metropolitana: casos policiales por cada 100.000 habitantes, por comuna"
        subtitle="Elige un indicador. Pasa el cursor o toca una comuna para ver su detalle."
        note={`Homicidios: promedio de ${comunas.anios_homicidios.join(' a ')}. Límites comunales: INE. ${FUENTE_TASAS}`}
      >
        <MapaCoropletas
          viewbox={mapas.rm.viewbox}
          formas={FORMAS_RM}
          zonas={ZONAS_RM}
          indicadores={INDICADORES_MAPA}
          referencia={{ ...regiones.pais, tasa_vif: regiones.pais.f3 }}
          unidad="por 100.000 hab."
          alto={560}
          etiquetaZona="comunas de la región"
        />
      </ChartFigure>

      <ChartFigure
        title={`Las ${rankingRobos.length} comunas con más robos violentos por habitante, ${ANIO}`}
        subtitle={`Casos por 100.000 habitantes. Solo comunas de ${entero(comunas.poblacion_minima)} habitantes o más (${comunas.n_comunas_ranking} comunas).`}
        note={`La tasa se calcula con quienes viven en la comuna, no con quienes trabajan o circulan en ella. ${FUENTE_TASAS}`}
      >
        <ComunasRanking comunas={rankingRobos} clave="tasa_robos_violentos" unidad="Robos violentos por 100.000 hab." />
      </ChartFigure>

      <p>
        Hay que leer este ranking con cuidado. La tasa divide los casos por los
        habitantes de la comuna, pero muchos robos ocurren donde la gente
        trabaja, compra o pasa, no donde vive. Las comunas con mucho comercio y
        oficinas tienen más personas circulando que residentes, y eso sube su
        tasa.
      </p>
      <p>
        Los homicidios dibujan otro mapa. Con el promedio de{' '}
        {comunas.anios_homicidios.join(' a ')}, la tasa más alta es la de{' '}
        {rankingHomicidios[0].comuna}, con {decimal1(rankingHomicidios[0].tasa_homicidios_3a)}{' '}
        casos por 100.000 habitantes al año, {decimal1(rankingHomicidios[0].tasa_homicidios_3a / regiones.pais.tasa_homicidios_3a)}{' '}
        veces la del país. De las{' '}
        {rankingRobos.length} comunas con más robos violentos por habitante, solo{' '}
        {enAmbos} están también entre las {rankingHomicidios.length} con más homicidios.
      </p>

      <ChartFigure
        title={`Las ${rankingHomicidios.length} comunas con más homicidios por habitante, ${comunas.anios_homicidios.join('–')}`}
        subtitle={`Casos policiales de homicidio por 100.000 habitantes, promedio anual. Solo comunas de ${entero(comunas.poblacion_minima)} habitantes o más.`}
        note={FUENTE_TASAS}
      >
        <ComunasRanking comunas={rankingHomicidios} clave="tasa_homicidios_3a" unidad="Homicidios por 100.000 hab. al año" formato={decimal1} />
      </ChartFigure>

      <p>
        Otra duda es la población. El Censo 2024 contó{' '}
        {millones(datos.poblacion.censo_2024_censada)} millones de personas<Cita n={6} />,
        menos que los {millones(datos.poblacion.proyeccion_2024)} millones que proyectaba el
        INE para ese año. La mayor parte de esa diferencia es la omisión del
        censo, que el INE estima en un {decimal1(datos.poblacion.omision_censal_pct)}%: con
        su nueva estimación, la población a la fecha del censo era de{' '}
        {millones(datos.poblacion.base_2024_fecha_censo)} millones<Cita n={5} />, cerca de
        la proyección. Pero entre comunas la diferencia varía, desde{' '}
        {conSigno(sensibilidad.censo_vs_proyeccion_min)} hasta{' '}
        {conSigno(sensibilidad.censo_vs_proyeccion_max)}. Si calculo el ranking con la
        población censada, {sensibilidad.coinciden_top15} de las 15 comunas se mantienen en
        el grupo de las 15 más altas.
      </p>

      <h3>Busca tu comuna</h3>
      <p>
        Las tasas de cada comuna, comparadas con las del país. En las comunas
        pequeñas, unos pocos casos cambian mucho la tasa.
      </p>
      <ChartFigure
        title="Tu comuna frente al país"
        subtitle={`Casos policiales por cada 100.000 habitantes, ${ANIO}`}
        note={FUENTE_TASAS}
      >
        <BuscadorComuna
          comunas={comunas.comunas}
          pais={regiones.pais}
          anio={ANIO}
          aniosHomicidios={comunas.anios_homicidios}
          poblacionMinima={comunas.poblacion_minima}
          inicial={comunaInicial}
        />
      </ChartFigure>

      <h2>Lo último: primer semestre de {semestre.anio}</h2>
      <p>
        Entre enero y junio de {semestre.anio}, los robos violentos bajaron un{' '}
        {pctAbs(semestreFamilia(2).cambio)} respecto del mismo período de{' '}
        {semestre.anio - 1}, y los delitos contra la propiedad no violentos, un{' '}
        {pctAbs(semestreFamilia(6).cambio)}. En cambio, subieron estas familias:{' '}
        {listaY(subenSemestre.map((f) => `${f.familia.toLowerCase()} (${conSigno(f.cambio)})`))}.
      </p>
      <DataTable columns={COLUMNAS_SEMESTRE} rows={semestre.familias} rowKey="familia" />

      <h2>Datos y código</h2>
      <p>
        Todo el proceso es reproducible: el scraper, la base SQLite, la carga de
        población y cada paso del análisis están en el repositorio del proyecto
        en GitHub, con pruebas de las funciones principales y consultas SQL de
        ejemplo.
      </p>

      <h2>Notas metodológicas</h2>
      <ul className="nota__metodo">
        <li>
          Datos descargados del CEAD el {datos.descargado_en.split('-').reverse().join('-')}:
          casos policiales mensuales de {PERIODO}, para el total del país, las 16
          regiones y las {datos.comunas} comunas. El CEAD actualiza sus cifras, así que
          una descarga posterior puede dar valores algo distintos.
        </li>
        <li>
          Casos policiales = denuncias + detenciones en flagrancia, en Carabineros
          y la PDI. Un procedimiento de detención puede incluir a más de una
          persona.
        </li>
        <li>
          Clasificación: la del CEAD vigente en 2026, con 7 familias y 45
          subgrupos, más la categoría residual <em>otros delitos o faltas</em> (3
          subgrupos), que se excluye de los totales. Robos violentos = robos con
          violencia o intimidación, robos violentos de vehículos y robos por
          sorpresa.
        </li>
        <li>
          Tasas: casos por cada 100.000 habitantes, con las estimaciones y
          proyecciones de población del INE por comuna, base Censo 2017. El INE
          publicará proyecciones comunales con base en el Censo 2024 durante el
          segundo semestre de 2026; con ellas, las tasas de algunas comunas
          pueden cambiar.
        </li>
        <li>
          Homicidios por comuna y región: promedio de {comunas.anios_homicidios.join(' a ')}.
          Rankings de comunas: solo comunas de {entero(comunas.poblacion_minima)} habitantes
          o más.
        </li>
        <li>
          Año de referencia: {REF}, el último año completo antes de la pandemia.
          Las comparaciones anuales llegan hasta {ANIO}; el primer semestre de{' '}
          {semestre.anio} se compara solo con el mismo período del año anterior.
        </li>
      </ul>

      <h2>Fuentes</h2>
      <ol className="nota__fuentes">
        {FUENTES.map((f) => (
          <li key={f.id} id={`fuente-${f.id}`}>
            {f.texto}{' '}
            <a href={f.url} target="_blank" rel="noreferrer">
              {f.url.replace('https://', '')}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default DelitosNota
