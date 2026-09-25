import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, grillaProps } from './chartTheme'
import { CATALOGO_INCOMPLETO, nombreTerremoto } from './terremotos'
import './SecuenciaDiaria.css'

const etiquetaDia = (d) => (d === 0 ? 'Primeras 24 h' : d > 0 ? `Día +${d}` : `Día ${d}`)
const decimal = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function TooltipDia({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return <ChartTooltip title={etiquetaDia(d.dia)} rows={[{ label: 'Sismos', value: d.sismos }]} />
}

// Un gráfico por terremoto, todos con la misma escala vertical para poder compararlos
function SecuenciaDiaria({ terremotos }) {
  // Escala común redondeada hacia arriba a 50, con marcas cada 50
  const maximo = Math.ceil(Math.max(...terremotos.flatMap((t) => t.diario.map((d) => d.sismos))) / 50) * 50
  const ticksY = Array.from({ length: maximo / 50 + 1 }, (_, i) => i * 50)

  return (
    <div className="secuencias">
      {terremotos.map((t) => {
        const incompleto = CATALOGO_INCOMPLETO.has(t.fecha_utc.slice(0, 10))
        return (
          <div key={t.fecha_utc} className="secuencia">
            <p className="secuencia__title">
              <span className="secuencia__nombre">
                {nombreTerremoto(t)} {t.anio}
              </span>
              <span className="secuencia__lugar">
                Magnitud {decimal(t.magnitud)} · {t.lugar}
              </span>
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={t.diario} margin={{ top: 16, right: 8, bottom: 0, left: 0 }} barCategoryGap={0}>
                <CartesianGrid {...grillaProps} vertical={false} />
                <XAxis
                  {...ejeProps}
                  dataKey="dia"
                  ticks={[-30, 0, 30]}
                  tickFormatter={(d) => (d > 0 ? `+${d}` : String(d))}
                />
                <YAxis {...ejeProps} domain={[0, maximo]} ticks={ticksY} allowDataOverflow width={36} />
                <Tooltip content={<TooltipDia />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
                <ReferenceLine y={t.linea_base_por_dia.anio_previo} stroke={COLOR.eje} strokeDasharray="4 4" />
                <ReferenceLine
                  x={0}
                  stroke="var(--text)"
                  label={{ value: 'Terremoto', position: 'insideTopRight', fill: 'var(--text)', fontSize: 11 }}
                />
                <Bar dataKey="sismos" isAnimationActive={false}>
                  {t.diario.map((d) => (
                    <Cell key={d.dia} fill={d.dia < 0 ? COLOR.apagado : COLOR.serie} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {incompleto && (
              <p className="secuencia__aviso">
                El catálogo no registró todas las réplicas de los primeros días: las barras reales serían
                más altas.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SecuenciaDiaria
