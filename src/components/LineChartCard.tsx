import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartPoint } from '../types'

interface Props {
  title: string
  data: ChartPoint[]
  color: string
  unit?: string
  icon?: React.ReactNode
  formatValue?: (v: number) => string
}

const CustomTooltip = ({ active, payload, unit, formatValue }: any) => {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value ?? 0
  return (
    <div className="chart-tooltip">
      <span>{formatValue ? formatValue(val) : `${val}${unit}`}</span>
    </div>
  )
}

export default function LineChartCard({ title, data, color, unit = '%', icon, formatValue }: Props) {
  const latest = data[data.length - 1]?.value ?? 0
  const displayVal = formatValue ? formatValue(latest) : `${latest}${unit}`

  return (
    <div className="card chart-card">
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <span className="card-title">{title}</span>
        <span className="chart-current" style={{ color }}>{displayVal}</span>
      </div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: '#2d4060', fontSize: 9 }} tickLine={false} axisLine={false} interval={9} />
            <YAxis tick={{ fill: '#2d4060', fontSize: 9 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} formatValue={formatValue} />} />
            <Area
              type="monotoneX"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${title})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
