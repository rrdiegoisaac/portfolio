import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { COLOR, ejeProps, formatoNumero, grillaProps } from './chartTheme'

const entero = (v) => formatoNumero(Math.round(v))

function TooltipComuna({ active, payload, clave, unidad }) {
  if (!active || !payload?.length) return null
  const c = payload[0].payload
  return (
    <ChartTooltip
      title={`${c.comuna} (${c.region})`}
      rows={[
        { label: unidad, value: c[clave].toLocaleString('es-CL') },
        { label: 'Población proyectada', value: formatoNumero(c.poblacion) },
        { label: 'Censo 2024 vs. proyección', value: `${c.censo_vs_proyeccion_pct > 0 ? '+' : ''}${c.censo_vs_proyeccion_pct.toLocaleString('es-CL')}%` },
      ]}
    />
  )
}

// Ranking horizontal de comunas para un indicador (tasa por 100.000 habitantes)
function ComunasRanking({ comunas, clave, unidad, formato = entero }) {
  return (
    <ResponsiveContainer width="100%" height={comunas.length * 26 + 30}>
      <BarChart data={comunas} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }} barCategoryGap={4}>
        <CartesianGrid {...grillaProps} horizontal={false} />
        <XAxis {...ejeProps} type="number" tickFormatter={formatoNumero} />
        <YAxis {...ejeProps} type="category" dataKey="comuna" width={150} interval={0} />
        <Tooltip content={<TooltipComuna clave={clave} unidad={unidad} />} cursor={{ fill: 'var(--surface)' }} isAnimationActive={false} />
        <Bar dataKey={clave} fill={COLOR.serie} radius={[0, 4, 4, 0]} maxBarSize={16} isAnimationActive={false}>
          <LabelList dataKey={clave} position="right" formatter={formato} style={{ fill: 'var(--text)', fontSize: 11 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ComunasRanking
