import React from 'react'
import { getColorForPercent } from '../utils/format'

interface Props {
  cores: number[]
}

export default function CoreGrid({ cores }: Props) {
  return (
    <div className="card core-card">
      <div className="card-header">
        <span className="card-title">CPU Cores</span>
        <span className="core-count">{cores.length} cores</span>
      </div>
      <div className="core-grid">
        {cores.map((load, i) => {
          const color = getColorForPercent(load)
          return (
            <div key={i} className="core-item">
              <div className="core-bar-track">
                <div
                  className="core-bar-fill"
                  style={{
                    height: `${load}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}80`,
                  }}
                />
              </div>
              <span className="core-label" style={{ color }}>{load}%</span>
              <span className="core-name">C{i}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
