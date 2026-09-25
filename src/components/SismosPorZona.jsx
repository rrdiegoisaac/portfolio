import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import DataTable from './DataTable'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const decimal1 = (v) => v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const porcentaje = (v) => `${decimal1(v)}%`

const COLUMNAS = [
  { key: 'zona', label: 'Zona' },
  { key: 'sismos', label: 'Sismos (todas las magnitudes)', numeric: true, format: formatoNumero },
  { key: 'sismos_m4', label: 'Sismos M4+', numeric: true, format: formatoNumero },
  { key: 'pct_m4', label: '% de los M4+', numeric: true, format: porcentaje },
  { key: 'm4_por_grado_anual', label: 'M4+ por grado al año', numeric: true, format: decimal1 },
  { key: 'm4_sin_secuencias_por_grado_anual', label: 'Sin grandes secuencias', numeric: true, format: decimal1 },
  { key: 'mag_p95', label: 'Magnitud p95', numeric: true, format: decimal1 },
]

function TooltipZona({ active, payload }) {
  if (!active || !payload?.length) return null
  const z = payload[0].payload
  return (
    <ChartTooltip
      title={z.zona}
      rows={[
        { label: 'M4+ por grado al año', value: decimal1(z.m4_por_grado_anual) },
        { label: 'Sin grandes secuencias', value: decimal1(z.m4_sin_secuencias_por_grado_anual) },
      ]}
    />
  )
}

function SismosPorZona({ zonas }) {
  const filas = zonas.map((z) => ({ ...z, mag_p95: z.magnitud.p95 }))
  const comparables = filas.filter((z) => z.comparable)

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparables} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }} barGap={2}>
          <CartesianGrid {...grillaProps} horizontal={false} />
          <XAxis {...ejeProps} type="number" tickFormatter={formatoNumero} />
          <YAxis {...ejeProps} type="category" dataKey="zona" width={110} />
          <Tooltip content={<TooltipZona />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
          <Legend
          itemSorter={null}
            verticalAlign="top"
            align="left"
            height={32}
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
          />
          <Bar name="Todos los sismos M4+" dataKey="m4_por_grado_anual" fill={COLOR.serie} radius={[0, 4, 4, 0]} maxBarSize={14} isAnimationActive={false}>
            <LabelList dataKey="m4_por_grado_anual" position="right" formatter={decimal1} style={{ fill: 'var(--text)', fontSize: 11 }} />
          </Bar>
          <Bar
            name="Sin las secuencias de grandes terremotos"
            dataKey="m4_sin_secuencias_por_grado_anual"
            fill={COLOR.serie2}
            radius={[0, 4, 4, 0]}
            maxBarSize={14}
            isAnimationActive={false}
          >
            <LabelList dataKey="m4_sin_secuencias_por_grado_anual" position="right" formatter={decimal1} style={{ fill: 'var(--text)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <DataTable columns={COLUMNAS} rows={filas} rowKey="zona" />
    </>
  )
}

export default SismosPorZona
