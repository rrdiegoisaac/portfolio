import { useRef } from 'react'
import cambioMetodo from '../data/terremotos/00_cambio_metodo.json'
import dondeTiembla from '../data/terremotos/01_donde_tiembla.json'
import magnitudes from '../data/terremotos/02_magnitudes.json'
import placas from '../data/terremotos/03_placas.json'
import profundidad from '../data/terremotos/04_profundidad.json'
import tiempo from '../data/terremotos/05_tiempo.json'
import grandes from '../data/terremotos/06_grandes_terremotos.json'
import ChartFigure from './ChartFigure'
import CodeBlock from './CodeBlock'
import CorteProfundidad from './CorteProfundidad'
import DataTable from './DataTable'
import EscalaMagnitud from './EscalaMagnitud'
import FrecuenciaMagnitud from './FrecuenciaMagnitud'
import GrandesTerremotosTabla from './GrandesTerremotosTabla'
import IndiceNota from './IndiceNota'
import MetodoZoom from './MetodoZoom'
import PlacasMapa from './PlacasMapa'
import ProfundidadDistancia from './ProfundidadDistancia'
import ProfundidadPorZona from './ProfundidadPorZona'
import RedAnual from './RedAnual'
import SecuenciaDiaria from './SecuenciaDiaria'
import SecuenciaExceso from './SecuenciaExceso'
import SismosFuertes from './SismosFuertes'
import SismosMapa from './SismosMapa'
import SismosPorLatitud from './SismosPorLatitud'
import SismosPorZona from './SismosPorZona'
import TiempoAnual from './TiempoAnual'
import { nombreTerremoto } from './terremotos'
import './Nota.css'

// Las cifras se leen de los JSON del análisis. Las conclusiones escritas se
// verificaron con los datos 2000–2026: revisarlas si se vuelve a correr el análisis.

const ALTO_MAPA = 640

const fechaCorta = (iso) => iso.slice(0, 10).split('-').reverse().join('-')
const decimal = (v) => v.toLocaleString('es-CL')
const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const entero = (v) => Math.round(v).toLocaleString('es-CL')
const cambioPct = (antes, despues) => `+${Math.round((despues / antes - 1) * 100)}%`

const INICIO_RED = cambioMetodo.inicio_red_estable
const PERIODO = `${fechaCorta(dondeTiembla.periodo.desde)} a ${fechaCorta(dondeTiembla.periodo.hasta)}`
const PERIODO_CATALOGO = `${fechaCorta(cambioMetodo.periodo_catalogo.desde)} a ${fechaCorta(cambioMetodo.periodo_catalogo.hasta)}`
const FUENTE_CSN = `Fuente: catálogo del CSN, ${PERIODO}.`

const zona = (nombre) => dondeTiembla.por_zona.find((z) => z.zona === nombre)
const zonaProf = (nombre) => profundidad.por_zona.find((z) => z.zona === nombre)
const anioRed = (anio) => cambioMetodo.por_anio.find((a) => a.anio === anio)
const deteccion = (nombre) => magnitudes.deteccion_por_zona.find((z) => z.zona === nombre)
const resumen = dondeTiembla.resumen

const anioInicial = anioRed(Number(cambioMetodo.periodo_catalogo.desde.slice(0, 4)))
const ultimoAnioCompleto = cambioMetodo.por_anio.filter((a) => !a.parcial).at(-1)
const norteM5 = (desde, hasta) =>
  cambioMetodo.por_anio.filter((a) => a.anio >= desde && a.anio <= hasta).map((a) => a.norte_grande_m5)
const promedioNorteM5 = (() => {
  const valores = norteM5(INICIO_RED, ultimoAnioCompleto.anio)
  return valores.reduce((s, v) => s + v, 0) / valores.length
})()
const mlvAntes = cambioMetodo.mlv.antes.por_mes
const mlvDespues = cambioMetodo.mlv.despues.por_mes
const TRAMOS = cambioMetodo.tramos

const [maule, illapel, iquique] = grandes.terremotos
const veces = (t, clave) => Math.round(t.antes_30_dias / t.esperado_30_dias[clave])
const tendencia = tiempo.tendencia

const franjasMapa = dondeTiembla.por_latitud.filter((f) => f.latitud >= -61)

const FUENTES = [
  { id: 1, texto: 'Centro Sismológico Nacional, Universidad de Chile. Catálogo de sismicidad.', url: 'https://www.sismologia.cl' },
  { id: 2, texto: 'USGS. Determining the Depth of an Earthquake.', url: 'https://www.usgs.gov/programs/earthquake-hazards/determining-depth-earthquake' },
  {
    id: 3,
    texto: 'USGS. At what depth do earthquakes occur? What is the significance of the depth?',
    url: 'https://www.usgs.gov/faqs/what-depth-do-earthquakes-occur-what-significance-depth',
  },
  { id: 4, texto: 'USGS. Why do so many earthquakes occur at a depth of 10 km?', url: 'https://www.usgs.gov/faqs/why-do-so-many-earthquakes-occur-a-depth-10km' },
  {
    id: 5,
    texto: 'Gutenberg, B. y Richter, C. F. (1944). Frequency of earthquakes in California. Bulletin of the Seismological Society of America, 34(4), 185–188.',
    url: 'https://doi.org/10.1785/BSSA0340040185',
  },
  {
    id: 6,
    texto: 'Bird, P. (2003). An updated digital model of plate boundaries. Geochemistry, Geophysics, Geosystems, 4(3), 1027.',
    url: 'https://doi.org/10.1029/2001GC000252',
  },
  { id: 7, texto: 'Ahlenius, H. (Nordpil) y Bird, P. Tectonic plates: PB2002 en formato GeoJSON. Licencia ODC-By.', url: 'https://github.com/fraxen/tectonicplates' },
  {
    id: 8,
    texto:
      'Wells, D. y Coppersmith, K. (1994). New empirical relationships among magnitude, rupture length, rupture width, rupture area, and surface displacement. Bulletin of the Seismological Society of America, 84(4), 974–1002.',
    url: 'https://doi.org/10.1785/BSSA0840040974',
  },
  {
    id: 9,
    texto: 'Ruiz, S. y otros (2014). Intense foreshocks and a slow slip event preceded the 2014 Iquique Mw 8.1 earthquake. Science, 345(6201), 1165–1169.',
    url: 'https://doi.org/10.1126/science.1256074',
  },
  {
    id: 10,
    texto: 'Schurr, B. y otros (2014). Gradual unlocking of plate boundary controlled initiation of the 2014 Iquique earthquake. Nature, 512, 299–302.',
    url: 'https://doi.org/10.1038/nature13681',
  },
  { id: 11, texto: 'Natural Earth. Límites de países, escalas 1:50 y 1:110 millones (dominio público).', url: 'https://www.naturalearthdata.com' },
]

const COLUMNAS_LIMITES = [
  { key: 'limite', label: 'Límite más cercano' },
  { key: 'sismos', label: 'Sismos', numeric: true, format: (v) => v.toLocaleString('es-CL') },
  { key: 'pct', label: '%', numeric: true, format: (v) => (v === 0 ? '<0,1%' : `${decimal(v)}%`) },
  { key: 'sismos_m6', label: 'Magnitud 6 o más', numeric: true },
  { key: 'prof_mediana_km', label: 'Prof. mediana', numeric: true, format: (v) => `${decimal(v)} km` },
  { key: 'mag_max', label: 'Magnitud máxima', numeric: true, format: decimal1 },
]

const COLUMNAS_METODO = [
  { key: 'tramo', label: 'Magnitud' },
  { key: 'antes', label: 'Al mes con Ml (2025)', numeric: true, format: entero },
  { key: 'despues', label: 'Al mes con Mlv (desde mar. 2026)', numeric: true, format: entero },
  { key: 'cambio', label: 'Cambio', numeric: true },
]
const FILAS_METODO = TRAMOS.map((t) => ({
  tramo: t,
  antes: mlvAntes[t],
  despues: mlvDespues[t],
  cambio: cambioPct(mlvAntes[t], mlvDespues[t]),
}))

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

const CODIGO_SCRAPER = `
def guardar_dia(conn: sqlite3.Connection, dia: date, sismos: list[dict], estado: str) -> None:
    """Guarda los sismos y marca el día como hecho en una sola transacción."""
    with conn:
        conn.executemany(
            """INSERT OR IGNORE INTO sismos
               (informe_url, fecha_local, fecha_utc, lugar, latitud, longitud,
                profundidad_km, magnitud, tipo_magnitud, dia_catalogo)
               VALUES (:informe_url, :fecha_local, :fecha_utc, :lugar, :latitud, :longitud,
                       :profundidad_km, :magnitud, :tipo_magnitud, :dia_catalogo)""",
            sismos,
        )
        conn.execute(
            "INSERT OR REPLACE INTO dias_scrapeados VALUES (?, ?, ?, ?)",
            (dia.isoformat(), len(sismos), estado, datetime.now(timezone.utc).isoformat(timespec="seconds")),
        )
`

const CODIGO_SECUENCIA = `
def radio_km(magnitud: float) -> int:
    """Mitad del largo típico de ruptura (Wells y Coppersmith, 1994) más 50 km."""
    return int(max(RADIO_MIN_KM, round(largo_ruptura_km(magnitud) / 2 + MARGEN_RADIO_KM)))

# Actividad normal 1: el año previo al terremoto, sin el último mes
tasa_previa = (en_circulo & (dias >= -(365 + 30)) & (dias < -30)).sum() / 365

# Actividad normal 2: mediana de las tasas anuales, sin secuencias de otros terremotos
tasa_larga = tasa_largo_plazo(df, t, en_circulo, fin_largo_plazo)
`

function TerremotosNota() {
  const refNota = useRef(null)

  return (
    <div className="nota" ref={refNota}>
      <IndiceNota contenedor={refNota} />
      <p className="nota__lead">
        En Chile tiembla todos los días, pero no en todas partes por igual. Quise
        responder con datos dónde tiembla más, qué tan fuerte, a qué
        profundidad y qué pasa después de un gran terremoto. Para eso descargué
        el catálogo completo del Centro Sismológico Nacional (CSN)
        <Cita n={1} /> desde el año 2000.
      </p>
      <p>
        Es un proyecto que vengo desarrollando desde 2024. La primera versión
        partió de un dataset público de Kaggle; esta la rehice desde cero, con
        los datos obtenidos directamente del CSN y un análisis más riguroso de
        sus limitaciones.
      </p>

      <aside className="nota__resumen">
        <h2 className="nota__resumen-titulo">En resumen</h2>
        <ul>
          <li>
            <strong>El norte tiene más actividad de fondo.</strong> Sin las secuencias
            de los grandes terremotos, el Norte Grande registra unas{' '}
            {decimal1(resumen.sin_secuencias_norte_grande_vs_centro)} veces más sismos
            de magnitud 4 o más por grado de latitud que la zona central.
          </li>
          <li>
            <strong>En el norte también tiembla más profundo:</strong> la
            profundidad típica es de {zonaProf('Norte Grande').mediana_km} km, dentro
            de la placa de Nazca que se hunde bajo el continente.
          </li>
          <li>
            <strong>Tres terremotos dominan el período:</strong> Maule 2010, Illapel
            2015 e Iquique 2014. Iquique tuvo una intensa secuencia previa:{' '}
            {iquique.antes_30_dias} sismos en el mes anterior, cuando lo normal eran
            2 o 3.
          </li>
          <li>
            <strong>El catálogo cambió más que la Tierra.</strong> La red creció,
            cambió la escala de magnitud y en 2026 cambió el método. Con esos
            cambios, los datos no muestran una tendencia concluyente en la
            actividad.
          </li>
        </ul>
        <h3 className="nota__resumen-titulo">Qué hice</h3>
        <ul>
          <li>Web scraping de casi 9.800 páginas diarias del CSN, con Python (requests y BeautifulSoup).</li>
          <li>Una base SQLite de unos 157.000 registros, reanudable y sin duplicados.</li>
          <li>Análisis con pandas y shapely: filtros geográficos, límites de placas y secuencias de réplicas.</li>
          <li>Control de calidad: sesgos de detección, cambios de escala y de método, y pruebas estadísticas.</li>
        </ul>
      </aside>

      <h2>Los datos</h2>
      <p>
        El CSN publica una página por día con todos los sismos que localizó:
        fecha, coordenadas, profundidad, magnitud y un lugar de referencia. Escribí
        un scraper en Python que recorre esas páginas, extrae cada fila y la
        guarda en una base SQLite. Cada día se guarda en una sola transacción
        junto con su registro de avance: si la descarga se corta, sigue donde
        quedó sin duplicar datos.
      </p>
      <CodeBlock file="scraper/scrape_catalogo.py" code={CODIGO_SCRAPER} />
      <p>
        Después filtré lo que no corresponde analizar. Dejé fuera los sismos
        lejanos que el catálogo incluía en sus primeros años (Asia, Oceanía), los
        que ocurren en tierra de Argentina, Bolivia y Perú, y los registros
        duplicados. Para comparar regiones, clasifiqué cada sismo en seis zonas
        según su latitud (Norte Grande, Norte Chico, Centro, Sur, Austral y
        Antártica y Paso Drake), más una categoría oceánica.
      </p>

      <h2>Antes de analizar: la calidad del catálogo</h2>
      <p>
        Un catálogo de sismos no es un registro neutral: depende de cuántas
        estaciones hay, desde qué magnitud se publica y cómo se mide. Al revisar
        los datos año a año aparecen cuatro cambios que condicionan todo lo
        demás.
      </p>

      <h3>1. Una red que creció</h3>
      <p>
        En {anioInicial.anio} el catálogo registró {entero(anioInicial.sismos)} sismos;
        en {ultimoAnioCompleto.anio}, {entero(ultimoAnioCompleto.sismos)}. El caso más
        llamativo es el norte: entre 2000 y 2003 el Norte Grande aporta apenas el
        1% o menos del catálogo, y registra entre{' '}
        {Math.min(...norteM5(2000, 2003))} y {Math.max(...norteM5(2000, 2003))} sismos
        de magnitud 5 o más por año, contra unos {Math.round(promedioNorteM5)} al año
        desde {INICIO_RED}. En ese entonces casi no había estaciones en la zona.
      </p>
      <p>
        Por eso el análisis parte en {INICIO_RED}: es el primer año desde el cual
        el Norte Grande registra siempre al menos el 75% de su nivel reciente de
        sismos de magnitud 4 o más.
      </p>

      <ChartFigure
        wide
        title="Cómo cambió el registro de sismos"
        subtitle="Tres indicadores por año, de 2000 a 2026"
        note={`Magnitud más frecuente: el valor desde el que el catálogo deja de "perder" sismos (método de máxima curvatura). En gris, años incompletos. Fuente: catálogo del CSN, ${PERIODO_CATALOGO}.`}
      >
        <RedAnual
          porAnio={cambioMetodo.por_anio}
          inicioRedEstable={INICIO_RED}
          inicioPiso={cambioMetodo.primer_anio_piso_2_5}
        />
      </ChartFigure>

      <h3>2. Un piso de publicación</h3>
      <p>
        Desde {cambioMetodo.primer_anio_piso_2_5}, el CSN casi no publica sismos bajo
        magnitud 2,5: pasan del {decimal1(anioRed(INICIO_RED).pct_bajo_2_5)}% del
        catálogo en {INICIO_RED} al {decimal1(ultimoAnioCompleto.pct_bajo_2_5)}% en{' '}
        {ultimoAnioCompleto.anio}. Por eso la magnitud más frecuente queda fija en
        2,5 desde entonces. No significa que la red detecte todo desde ahí: es el
        límite de lo que se publica.
      </p>

      <h3>3. Una escala de magnitud que cambió</h3>
      <p>
        Entre los sismos de magnitud 4 o más, los medidos en magnitud momento
        (Mw) pasan de casi 0% hasta 2014 a entre un 30% y un 50% desde 2018. Al mismo
        tiempo baja la proporción de sismos de magnitud 5 o más. Distintas
        escalas dan valores algo distintos para el mismo sismo, así que la
        magnitud 4 de 2010 no es exactamente la misma que la de 2020.
      </p>

      <ChartFigure
        wide
        title="La escala de magnitud cambió con los años"
        subtitle="Entre los sismos de magnitud 4 o más publicados por el CSN"
        note={FUENTE_CSN}
      >
        <EscalaMagnitud escala={magnitudes.escala_por_anio} />
      </ChartFigure>

      <h3>4. Un cambio de método en 2026</h3>
      <p>
        El CSN usa el método Mlv desde 2021 en casos puntuales, pero desde marzo
        de 2026 lo aplica a casi todos los sismos. Con él, el catálogo registra
        más sismos en todos los tramos de magnitud, y el aumento es mucho mayor
        en los sismos pequeños. No es que tiemble más: el método nuevo
        asigna valores algo mayores a los mismos sismos.
      </p>

      <ChartFigure
        wide
        title="Sismos por mes según tramo de magnitud, 2024–2026"
        subtitle="La línea punteada marca marzo de 2026, desde cuando el CSN usa el método Mlv en casi todos los sismos"
        note={`Fuente: catálogo del CSN, ${PERIODO_CATALOGO}.`}
      >
        <MetodoZoom datos={cambioMetodo} />
        <DataTable columns={COLUMNAS_METODO} rows={FILAS_METODO} rowKey="tramo" />
      </ChartFigure>

      <aside className="nota__aviso">
        <strong>Qué significa para el resto del análisis.</strong> Comparo zonas y
        años solo con sismos de magnitud 4 o más, que la red registra completos
        en todo el período. Las comparaciones en el tiempo llegan hasta 2025,
        antes del cambio de método. Y como la escala de magnitud cambió, ninguna
        tendencia de largo plazo es concluyente.
      </aside>

      <h2>¿Dónde tiembla más?</h2>
      <p>
        Si se cuentan todos los sismos, el Norte Grande concentra el{' '}
        {Math.round(zona('Norte Grande').pct)}% del catálogo. Pero esa cifra
        exagera: en el norte la red detecta más sismos pequeños. Con la red
        reciente, el {Math.round(deteccion('Norte Grande').pct_bajo_3)}% de los
        sismos del Norte Grande es de magnitud menor a 3, contra el{' '}
        {Math.round(deteccion('Sur').pct_bajo_3)}% en el Sur.
      </p>

      <ChartFigure
        wide
        title="Sismos registrados por el CSN, por ubicación"
        subtitle="Todas las magnitudes. Cada círculo agrupa los sismos de una celda de 0,5° × 0,5°; su tamaño indica la cantidad. A la derecha, el total por grado de latitud."
        note={`${FUENTE_CSN} Excluye los sismos oceánicos lejos de la costa y los ocurridos en tierra de países vecinos. Costa y fronteras: Natural Earth.`}
      >
        <div className="nota__mapa">
          <SismosMapa data={dondeTiembla.mapa_celdas} height={ALTO_MAPA} />
          <SismosPorLatitud franjas={franjasMapa} height={ALTO_MAPA} />
        </div>
      </ChartFigure>

      <p>
        Con magnitud 4 o más la comparación es pareja. El Norte Grande concentra
        el {Math.round(resumen.pct_norte_grande_m4)}% de esos sismos, y por grado
        de latitud queda casi igual que la zona central ({decimal1(zona('Norte Grande').m4_por_grado_anual)}{' '}
        contra {decimal1(zona('Centro').m4_por_grado_anual)} al año). Pero la zona
        central sube por un solo evento: el terremoto del Maule y sus réplicas.
        Sin las secuencias de los grandes terremotos, el Norte Grande registra{' '}
        {decimal1(resumen.sin_secuencias_norte_grande_vs_centro)} veces más que el
        Centro y {decimal1(resumen.sin_secuencias_norte_grande_vs_norte_chico)} veces
        más que el Norte Chico.
      </p>

      <ChartFigure
        title="Sismos de magnitud 4 o más al año, por grado de latitud"
        subtitle="Con todos los sismos y sin las secuencias de los grandes terremotos (un año desde cada sismo de magnitud 7 o más)"
        note="La Antártica y el Paso Drake no se comparan: el catálogo solo los registra alrededor de grandes secuencias. La zona oceánica no tiene una extensión comparable. p95: la magnitud que solo supera el 5% más fuerte de los sismos de la zona."
      >
        <SismosPorZona zonas={dondeTiembla.por_zona} />
      </ChartFigure>

      <h2>¿Qué tan fuertes?</h2>
      <p>
        Entre {INICIO_RED} y 2026 hubo {magnitudes.sismos_fuertes} sismos de
        magnitud 6 o más, unos {Math.round(magnitudes.fuertes_por_anio)} al año. Los
        tres más fuertes son los grandes terremotos del período: el del Maule
        (8,8), el de Illapel (8,4) y el de Iquique (8,2), según las magnitudes
        del CSN. Por zona, el Norte Grande tiene {magnitudes.fuertes_por_zona[0].sismos},
        el Centro {magnitudes.fuertes_por_zona[2].sismos} y el Norte Chico{' '}
        {magnitudes.fuertes_por_zona[1].sismos}. Más de la mitad de los del Norte
        Grande ({magnitudes.fuertes_norte_grande_intermedios} de{' '}
        {magnitudes.fuertes_norte_grande}) ocurrieron a más de 70 km de
        profundidad.
      </p>

      <ChartFigure
        wide
        title="Sismos de magnitud 6 o más"
        subtitle="El tamaño del círculo indica la magnitud. Pasa el cursor sobre un círculo para ver su detalle."
        note={`Algunos sismos oceánicos y del extremo de la Antártica quedan fuera del recuadro del mapa. ${FUENTE_CSN}`}
      >
        <SismosFuertes fuertes={magnitudes.fuertes} height={ALTO_MAPA} />
      </ChartFigure>

      <h3>Cada cuánto ocurren los sismos grandes</h3>
      <p>
        Los sismos grandes son mucho menos frecuentes que los pequeños. En escala
        logarítmica, la cantidad de sismos de cada magnitud forma casi una recta:
        es la ley de Gutenberg-Richter<Cita n={5} />. Su pendiente, el valor b,
        dice cuántos sismos pequeños hay por cada grande.
      </p>
      <p>
        Aquí vuelve a aparecer el cambio de escala. Con los sismos de magnitud 4
        o más, el valor b sube de {decimal(magnitudes.valor_b.a)} en{' '}
        {magnitudes.periodos_escala.a.join('–')} a {decimal(magnitudes.valor_b.b)} en{' '}
        {magnitudes.periodos_escala.b.join('–')}. Un cambio así en una década no
        es habitual en la sismicidad de una región; lo más probable es que venga
        de la forma de medir.
      </p>

      <ChartFigure
        title="Sismos al año según magnitud, en dos períodos"
        subtitle="Cantidad de sismos por año en cada tramo de 0,1 de magnitud, en escala logarítmica: cada línea de la grilla es 10 veces la anterior"
        note={`Bajo magnitud ~3 las curvas caen porque el catálogo pierde sismos pequeños o no los publica. ${FUENTE_CSN}`}
      >
        <FrecuenciaMagnitud histograma={magnitudes.histograma} periodos={magnitudes.periodos_escala} />
      </ChartFigure>

      <h2>¿A qué profundidad tiembla?</h2>
      <p>
        La profundidad importa: mientras más profundo ocurre un sismo, menos se
        siente en la superficie<Cita n={3} />. En el norte no solo hay más
        sismos, también son más profundos. La profundidad típica en el Norte
        Grande es de {zonaProf('Norte Grande').mediana_km} km, y el{' '}
        {Math.round(zonaProf('Norte Grande').pct_intermedios)}% de sus sismos ocurre a
        más de 70 km. En la zona central es de {zonaProf('Centro').mediana_km} km.
      </p>
      <p>
        Uso 70 km como umbral porque es el límite con que el USGS separa los
        sismos superficiales (0 a 70 km) de los de profundidad intermedia (70 a
        300 km). Según esa misma fuente, todos los sismos a más de 70 km ocurren
        dentro de placas que se hunden bajo otra<Cita n={2} />. Frente a Chile,
        esa placa es la de Nazca.
      </p>
      <p>
        Si se toma una franja de latitud y se ubica cada sismo según su longitud
        y su profundidad, la placa aparece: en el norte, la profundidad típica pasa
        de unos 30 km cerca de la costa a casi 250 km bajo la cordillera. En las
        franjas central y sur el patrón se repite a menos profundidad.
      </p>

      <ChartFigure
        wide
        title="Mientras más hacia el interior, más profundo el sismo"
        subtitle="Profundidad (km) de cada sismo según su longitud, en tres franjas de latitud. La línea oscura es la profundidad mediana."
        note={`La línea vertical marca la posición aproximada de la costa. El eje horizontal está en grados y el vertical en km, así que la inclinación está exagerada. En las franjas con más de 3.000 sismos se dibuja una muestra aleatoria de 3.000; la mediana usa todos. ${FUENTE_CSN}`}
      >
        <CorteProfundidad cortes={profundidad.cortes} />
      </ChartFigure>

      <p>
        Otra forma de verlo es medir la distancia de cada sismo a la fosa, donde
        la placa de Nazca empieza a hundirse. Los sismos a menos de 50 km de la
        fosa tienen una profundidad típica de unos 30 km; a 200–250 km, de unos
        100 km, y en el Norte Grande, a 400–450 km, superan los 230 km.
      </p>

      <ChartFigure
        title="Profundidad típica según la distancia a la fosa"
        subtitle="Mediana de profundidad (km) de los sismos asignados al límite Nazca–Sudamericana, en tramos de 50 km"
        note="Solo se grafican los tramos con al menos 30 sismos. Límite de placas: modelo PB2002 (Bird, 2003)."
      >
        <ProfundidadDistancia tramos={profundidad.profundidad_vs_distancia} />
      </ChartFigure>

      <ChartFigure
        title="Porcentaje de sismos a más de 70 km de profundidad"
        subtitle="Por zona. En gris, la zona donde la profundidad registrada no es confiable."
        note="Mediana: la profundidad del sismo del medio si se ordenan de menor a mayor. p90: la profundidad que solo supera el 10% más profundo de los sismos de la zona."
      >
        <ProfundidadPorZona zonas={profundidad.por_zona} />
      </ChartFigure>

      <aside className="nota__aviso">
        <strong>Ojo con las profundidades.</strong> En la Antártica y el Paso
        Drake, el {Math.round(zonaProf('Antártica y Drake').pct_prof_fija_10km)}% de
        los sismos tiene una profundidad de exactamente 10 km, y en la zona
        Austral, el {Math.round(zonaProf('Austral').pct_prof_fija_10km)}%. Es el valor
        que se asigna cuando los datos no permiten calcular una profundidad
        confiable<Cita n={4} />.
      </aside>

      <h2>Los límites de placas</h2>
      <p>
        Para medir distancias a la fosa usé el modelo de límites de placas
        PB2002, de Peter Bird<Cita n={6} />, en su versión GeoJSON<Cita n={7} />, y
        asigné cada sismo al límite más cercano a su epicentro. Como casi todo
        Chile está frente a la fosa de Nazca, el{' '}
        {decimal(placas.por_limite[0].pct)}% de los sismos queda asignado a ese
        límite: más que un hallazgo, es lo que permite medir la profundidad desde
        la fosa. El resto se reparte entre el extremo sur y el Paso Drake.
      </p>

      <ChartFigure
        wide
        title="Los sismos y los límites de placas"
        subtitle="Límites de placas del modelo PB2002. Línea continua: una placa se hunde bajo otra. Línea punteada: otros tipos de límite. De fondo, la densidad de sismos."
        note={`Fuente: límites de placas de Bird (2003); sismos del catálogo del CSN, ${PERIODO}.`}
      >
        <div className="nota__mapa nota__mapa--tabla">
          <PlacasMapa
            celdas={dondeTiembla.mapa_celdas}
            lineas={placas.lineas}
            puntoTripleLat={placas.punto_triple_lat}
            height={ALTO_MAPA}
          />
          <DataTable columns={COLUMNAS_LIMITES} rows={placas.por_limite} rowKey="limite" />
        </div>
      </ChartFigure>

      <p>
        Según PB2002, a los {decimal(Math.abs(placas.punto_triple_lat))}°S se
        encuentran las placas de Nazca, Antártica y Sudamericana: al sur de ese
        punto, la placa que se hunde bajo el continente es la Antártica. En tramos
        del mismo largo a cada lado, y sin las secuencias de grandes terremotos,
        los sismos de magnitud 4 o más bajan de{' '}
        {decimal1(placas.densidad_punto_triple.norte.por_grado_anual)} a{' '}
        {decimal1(placas.densidad_punto_triple.sur.por_grado_anual)} por grado de
        latitud al año, unas{' '}
        {Math.round(placas.densidad_punto_triple.norte.por_grado_anual / placas.densidad_punto_triple.sur.por_grado_anual)}{' '}
        veces menos. Parte de esa diferencia puede venir de que en el extremo sur
        también hay menos estaciones.
      </p>

      <h2>¿Tiembla más que antes?</h2>
      <p>
        Para responderlo separé la actividad de fondo de las secuencias de los
        grandes terremotos (un año desde cada sismo de magnitud 7 o más) y apliqué
        una prueba de tendencia de Mann-Kendall a los años{' '}
        {tiempo.periodo.desde.slice(0, 4)}–{tiempo.periodo.hasta.slice(0, 4)}.
      </p>
      <p>
        Los años con más sismos son los de los grandes terremotos: 2010, 2015 y
        2014. Sin esas secuencias, la actividad de fondo se mueve entre{' '}
        {entero(tiempo.resumen.min_m4_resto)} y {entero(tiempo.resumen.max_m4_resto)}{' '}
        sismos de magnitud 4 o más por año, sin una tendencia estadísticamente
        significativa (p = {decimal(tendencia.m4_resto.p)}). Con magnitud 4,5 o más
        sí aparece una baja significativa (p = {decimal(tendencia.m45_resto.p)}),
        pero coincide con el cambio de escala de magnitud, así que no se puede
        atribuir a una menor actividad.
      </p>

      <ChartFigure
        title="Sismos de magnitud 4 o más por año"
        subtitle="Actividad de fondo y lo que aportan las secuencias de grandes terremotos"
        note={`Hasta 2025, antes del cambio de método del CSN. Fuente: catálogo del CSN, ${fechaCorta(tiempo.periodo.desde)} a ${fechaCorta(tiempo.periodo.hasta)}.`}
      >
        <TiempoAnual anual={tiempo.anual} />
      </ChartFigure>

      <h2>Anatomía de los grandes terremotos</h2>
      <p>
        El período incluye los tres terremotos más fuertes de Chile en lo que va
        del siglo: el del Maule, el 27 de febrero de 2010; el de Illapel, el 16 de
        septiembre de 2015, y el de Iquique, el 1 de abril de 2014. Para cada uno
        comparé la actividad antes y después con la actividad normal de la zona.
      </p>
      <p>
        El área de cada terremoto es un círculo con un radio de la mitad del
        largo típico de su ruptura, según una relación empírica entre magnitud y
        largo<Cita n={8} />, más 50 km. Lo centré en sus réplicas del primer mes,
        porque muchas rupturas avanzan hacia un solo lado. Cuento solo sismos de
        magnitud 4 o más y hasta 70 km de profundidad, la zona de contacto entre
        las placas. La actividad normal la medí de dos formas: el año anterior
        al terremoto y el largo plazo del período. Por eso las cifras son rangos.
      </p>

      <ChartFigure
        wide
        title="Los tres grandes terremotos del período"
        subtitle="Sismos de magnitud 4 o más, hasta 70 km de profundidad, dentro del radio de cada terremoto. Atribuibles: los registrados menos los esperables con la actividad normal."
        note={`Magnitudes según el CSN; el USGS, por ejemplo, asigna 8,3 a Illapel. ${FUENTE_CSN}`}
      >
        <GrandesTerremotosTabla terremotos={grandes.terremotos} />
      </ChartFigure>

      <CodeBlock file="analisis/secuencias.py" code={CODIGO_SECUENCIA} />

      <h3>El día después</h3>
      <p>
        Los gráficos muestran los sismos por día desde un mes antes hasta dos
        meses después de cada terremoto, en este orden: el Maule, Illapel e
        Iquique. En los tres, la actividad se dispara el día del terremoto y va
        bajando en las semanas siguientes.
      </p>
      <p>
        A primera vista el Maule parece la secuencia más pequeña, aunque fue el
        terremoto más fuerte. No es así: en esos días el catálogo no alcanzó a
        registrar todas sus réplicas. En la semana siguiente registró solo entre
        36 y 56 sismos por día, contando todas las magnitudes. En menor medida
        pasa lo mismo en los tres: las primeras horas después de un gran
        terremoto son un piso, no el total.
      </p>

      <ChartFigure
        wide
        title="Sismos por día alrededor de cada terremoto"
        subtitle="Maule, Illapel e Iquique: 30 días antes (gris) y 60 días después (azul). La línea punteada es la actividad normal del año previo. Los tres gráficos usan la misma escala."
        note={FUENTE_CSN}
      >
        <SecuenciaDiaria terremotos={grandes.terremotos} />
      </ChartFigure>

      <h3>La secuencia previa de Iquique</h3>
      <p>
        En el gráfico de Iquique hay barras grises antes del día 0. En los 30
        días previos al terremoto hubo {iquique.antes_30_dias} sismos (intervalo
        de confianza del 95%: {entero(iquique.antes_30_dias_ic95[0])} a{' '}
        {entero(iquique.antes_30_dias_ic95[1])}), cuando con la actividad normal se
        esperaban entre {decimal1(iquique.esperado_30_dias.largo_plazo)} y{' '}
        {decimal1(iquique.esperado_30_dias.anio_previo)}: entre {veces(iquique, 'anio_previo')}{' '}
        y {veces(iquique, 'largo_plazo')} veces lo normal. En el Maule y en Illapel, el
        mes previo estuvo dentro de lo esperable.
      </p>
      <p>
        Esta secuencia está documentada: desde julio de 2013 hubo enjambres de
        sismos en la zona<Cita n={10} />, y desde el 16 de marzo de 2014 varios
        sismos de magnitud mayor a 6<Cita n={9} />. Los datos muestran la
        secuencia; no permiten decir que el terremoto se pudiera haber
        anticipado.
      </p>

      <h3>Un año después</h3>
      <p>
        Al sumar los sismos atribuibles, la diferencia de tamaño se nota. En el
        año siguiente, el Maule acumula al menos {entero(maule.exceso_365_dias[0])}{' '}
        sismos por sobre lo normal; Illapel, unos {entero(illapel.exceso_365_dias[0])},
        e Iquique, unos {entero(iquique.exceso_365_dias[0])}. En Iquique, casi todo
        ocurre en el primer mes; en el Maule la actividad sigue sumando todo el
        año.
      </p>

      <ChartFigure
        title="Sismos atribuibles a cada terremoto, acumulados en el año siguiente"
        subtitle="Sismos de magnitud 4 o más registrados, menos los esperables con la actividad normal del año previo"
        note={`El Maule es un piso: el catálogo no registró todas sus réplicas de los primeros días. ${FUENTE_CSN}`}
      >
        <SecuenciaExceso terremotos={grandes.terremotos} />
      </ChartFigure>

      <h2>Datos y código</h2>
      <p>
        Todo el proceso es reproducible: el scraper, la base SQLite y cada paso
        del análisis están en el repositorio del proyecto en GitHub, con pruebas
        de las funciones principales y consultas SQL de ejemplo. El catálogo
        completo, sin filtros, está publicado como dataset en{' '}
        <a href="https://www.kaggle.com/datasets/diegoisaac1/chile-earthquakes-20002026-csn-catalog" target="_blank" rel="noreferrer">
          Kaggle
        </a>
        , para que cualquiera pueda hacer su propio análisis.
      </p>

      <h2>Notas metodológicas</h2>
      <ul className="nota__metodo">
        <li>
          Catálogo descargado: {PERIODO_CATALOGO}. Período analizado: {PERIODO},
          desde que la red registra el norte de forma estable. Las comparaciones
          en el tiempo llegan hasta el 31-12-2025, antes del cambio de método del
          CSN.
        </li>
        <li>
          Filtros: se excluyen los sismos lejanos (se usa solo la región entre 17°
          y 66°S y entre 40° y 120°O), los que ocurren en tierra de Argentina,
          Bolivia, Perú y otros países vecinos, los del mar frente a Perú (al norte
          de 18,35°S) y los casi duplicados (mismo sismo publicado dos veces: menos
          de 5 segundos, 0,1° y 0,3 de magnitud de diferencia).
        </li>
        <li>
          Días sin datos en el sitio del CSN: los 31 de diciembre de 2001 a 2019 y
          el 18 de enero de 2009 aparecen sin sismos. No se pudieron recuperar
          desde esta fuente.
        </li>
        <li>
          Las magnitudes se usan tal como las publica el CSN, que combina
          distintas escalas (Ml, Mlv, Mw, entre otras) según el tamaño del sismo y
          el período.
        </li>
        <li>
          Secuencias de grandes terremotos: un año desde cada sismo de magnitud 7
          o más en el territorio analizado, dentro de su radio (
          {grandes.secuencias_marcadas.map((s) => `${nombreTerremoto(s)} ${s.fecha.slice(0, 4)}`).join(', ')}).
        </li>
        <li>
          Radio de cada terremoto: log10(L) = −2,44 + 0,59·M (Wells y
          Coppersmith, 1994), usando L/2 + 50 km. Esa relación se estimó con
          sismos de hasta magnitud 8,1, así que para estos terremotos es una
          aproximación. Actividad normal: año previo sin los últimos 30 días, y
          mediana de las tasas anuales del período sin secuencias.
        </li>
        <li>
          Intervalo de confianza de los sismos previos a Iquique: intervalo exacto
          de Poisson. Mide solo la incertidumbre del conteo, no es una prueba de
          significancia, porque los sismos tienden a agruparse.
        </li>
        <li>
          Límites de placas: cada sismo se asigna al límite de placas oceánico más
          cercano a su epicentro (PB2002). Las distancias usan una proyección
          centrada en el meridiano 70°O, con un error menor a 1 km en el 90% de
          los casos.
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

export default TerremotosNota
