import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import DataTable from './DataTable'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

// Si más de este % de los sismos tiene profundidad fija de 10 km, la profundidad de la zona no es confiable
const UMBRAL_PROF_FIJA = 40

const pct = (v) => `${v.toLocaleString('es-CL')}%`

const COLUMNAS = [
  { key: 'zona', label: 'Zona' },
  { key: 'sismos', label: 'Sismos', numeric: true, format: formatoNumero },
  { key: 'mediana_km', label: 'Prof. mediana', numeric: true, format: (v) => `${v.toLocaleString('es-CL')} km` },
  { key: 'p90_km', label: 'Prof. p90', numeric: true, format: (v) => `${v.toLocaleString('es-CL')} km` },
  { key: 'max_km', label: 'Prof. máxima', numeric: true, format: (v) => `${v.toLocaleString('es-CL')} km` },
  { key: 'pct_intermedios', label: 'Más de 70 km', numeric: true, format: pct },
  { key: 'pct_prof_fija_10km', label: 'Fija en 10 km', numeric: true, format: pct },
]

function TooltipZona({ active, payload }) {
  if (!active || !payload?.length) return null
  const z = payload[0].payload
  return (
    <ChartTooltip
      title={z.zona}
      rows={[
        { label: 'A más de 70 km', value: pct(z.pct_intermedios) },
        { label: 'Profundidad mediana', value: `${z.mediana_km} km` },
        { label: 'Con profundidad fija', value: pct(z.pct_prof_fija_10km) },
      ]}
    />
  )
}

function ProfundidadPorZona({ zonas }) {
  const continentales = zonas.filter((z) => z.zona !== 'Oceánico')

  return (
    <>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={continentales} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
          <CartesianGrid {...grillaProps} horizontal={false} />
          <XAxis {...ejeProps} type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis {...ejeProps} type="category" dataKey="zona" width={120} />
          <Tooltip content={<TooltipZona />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
          <Bar dataKey="pct_intermedios" radius={[0, 4, 4, 0]} maxBarSize={24} isAnimationActive={false}>
            {continentales.map((z) => (
              <Cell key={z.zona} fill={z.pct_prof_fija_10km > UMBRAL_PROF_FIJA ? COLOR.apagado : COLOR.serie} />
            ))}
            <LabelList
              dataKey="pct_intermedios"
              position="right"
              formatter={pct}
              style={{ fill: 'var(--text)', fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <DataTable columns={COLUMNAS} rows={zonas} rowKey="zona" />
    </>
  )
}

export default ProfundidadPorZona
