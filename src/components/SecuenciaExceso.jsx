import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'
import { etiquetaTerremoto, nombreTerremoto } from './terremotos'

// Colores fijos por orden (máximo 3 series, validados para daltonismo en la paleta)
const COLORES = [COLOR.serie, COLOR.serie2, COLOR.serie3]

function TooltipDia({ active, payload, terremotos }) {
  if (!active || !payload?.length) return null
  const fila = payload[0].payload
  return (
    <ChartTooltip
      title={`${fila.dia} días después`}
      rows={terremotos.map((t, i) => ({ label: etiquetaTerremoto(t), value: formatoNumero(Math.round(fila[`t${i}`])) }))}
    />
  )
}

// Nombre del terremoto escrito al final de su línea, para identificarla sin depender del color
function etiquetaFinal(nombre, ultimoIndice) {
  function EtiquetaFinal({ x, y, index }) {
    if (index !== ultimoIndice) return null
    return (
      <text x={x + 8} y={y} dy={4} fill="var(--text)" fontSize={12} fontWeight={600}>
        {nombre}
      </text>
    )
  }
  return EtiquetaFinal
}

function SecuenciaExceso({ terremotos }) {
  // Una fila por día con el exceso de cada terremoto en columnas t0, t1, t2
  const filas = terremotos[0].exceso_acumulado.map((punto, idx) => {
    const fila = { dia: punto.dia }
    terremotos.forEach((t, i) => {
      fila[`t${i}`] = t.exceso_acumulado[idx]?.exceso ?? null
    })
    return fila
  })

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={filas} margin={{ top: 8, right: 72, bottom: 16, left: 0 }}>
        <CartesianGrid {...grillaProps} vertical={false} />
        <XAxis
          {...ejeProps}
          dataKey="dia"
          type="number"
          domain={[0, 365]}
          ticks={[0, 60, 120, 180, 240, 300, 365]}
          label={{ value: 'Días después del terremoto', position: 'insideBottom', offset: -12, fill: 'var(--muted)', fontSize: 12 }}
        />
        <YAxis {...ejeProps} tickFormatter={formatoNumero} width={52} />
        <Tooltip content={<TooltipDia terremotos={terremotos} />} cursor={{ stroke: COLOR.eje }} isAnimationActive={false} />
        <Legend
          itemSorter={null}
          verticalAlign="top"
          align="left"
          height={32}
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
        />
        {terremotos.map((t, i) => (
          <Line
            key={t.fecha_utc}
            name={etiquetaTerremoto(t)}
            dataKey={`t${i}`}
            stroke={COLORES[i]}
            strokeWidth={2}
            dot={false}
            label={etiquetaFinal(nombreTerremoto(t), filas.length - 1)}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SecuenciaExceso
