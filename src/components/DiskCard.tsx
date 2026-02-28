import React from 'react'
import { HardDrive } from 'lucide-react'
import { DiskInfo } from '../types'
import { formatBytes, getColorForPercent } from '../utils/format'

interface Props {
  disks: DiskInfo[]
}

export default function DiskCard({ disks }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon"><HardDrive size={14} /></span>
        <span className="card-title">Disk Usage</span>
      </div>

      <div className="disk-list">
        {disks.map((disk) => {
          const color = getColorForPercent(disk.percent)
          return (
            <div key={disk.mount} className="disk-item">
              <div className="disk-info">
                <span className="disk-mount">{disk.mount}</span>
                <span className="disk-fs">{disk.fs}</span>
              </div>
              <div className="disk-bar-wrap">
                <div className="disk-bar">
                  <div
                    className="disk-bar-fill"
                    style={{ width: `${disk.percent}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
                  />
                </div>
                <div className="disk-meta">
                  <span style={{ color }}>{disk.percent}%</span>
                  <span className="disk-size">{formatBytes(disk.used)} / {formatBytes(disk.size)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
