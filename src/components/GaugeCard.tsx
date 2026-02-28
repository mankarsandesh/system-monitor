import React from 'react'
import { getColorForPercent, getStatusLabel } from '../utils/format'

interface Props {
  title: string
  value: number
  unit?: string
  subtitle?: string
  icon: React.ReactNode
}

export default function GaugeCard({ title, value, unit = '%', subtitle, icon }: Props) {
  const color = getColorForPercent(value)
  const status = getStatusLabel(value)

  // SVG arc parameters
  const r = 36
  const cx = 50
  const cy = 50
  const circumference = 2 * Math.PI * r
  const arc = (value / 100) * circumference

  return (
    <div className="card gauge-card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
        <span className="status-badge" style={{ color, borderColor: color + '40', backgroundColor: color + '15' }}>
          {status}
        </span>
      </div>

      <div className="gauge-body">
        <svg viewBox="0 0 100 100" className="gauge-svg">
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2a3a" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
          />
          {/* Glow */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            opacity="0.3"
            filter="url(#glow)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
            {value}
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle" fill="#4a6080" fontSize="8" fontFamily="monospace">
            {unit}
          </text>
        </svg>

        {subtitle && <p className="gauge-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
