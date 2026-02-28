import React from 'react'
import { Cpu } from 'lucide-react'
import { ProcessInfo } from '../types'

interface Props {
  processes: ProcessInfo[]
  total: number
  running: number
}

export default function ProcessTable({ processes, total, running }: Props) {
  return (
    <div className="card process-card">
      <div className="card-header">
        <span className="card-icon"><Cpu size={14} /></span>
        <span className="card-title">Top Processes</span>
        <span className="proc-stats">{running} running / {total} total</span>
      </div>

      <table className="proc-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>Name</th>
            <th>CPU%</th>
            <th>MEM%</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.pid}>
              <td className="pid">{p.pid}</td>
              <td className="pname">{p.name}</td>
              <td>
                <div className="mini-bar-wrap">
                  <div className="mini-bar" style={{ width: `${Math.min(p.cpu, 100)}%`, backgroundColor: p.cpu > 50 ? '#ff4757' : '#00e5a0' }} />
                  <span style={{ color: p.cpu > 50 ? '#ff4757' : '#00e5a0' }}>{p.cpu}%</span>
                </div>
              </td>
              <td>
                <div className="mini-bar-wrap">
                  <div className="mini-bar" style={{ width: `${Math.min(p.mem, 100)}%`, backgroundColor: p.mem > 20 ? '#f0b429' : '#3d9cff' }} />
                  <span style={{ color: p.mem > 20 ? '#f0b429' : '#3d9cff' }}>{p.mem}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
