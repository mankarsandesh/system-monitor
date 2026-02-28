import { Monitor, Server, Thermometer } from 'lucide-react'
import { SystemData } from '../types'

interface Props {
  data: SystemData
  isElectron: boolean
}

export default function StatusBar({ data, isElectron }: Props) {
  const tempColor = data.temp > 70 ? '#ff4757' : data.temp > 55 ? '#f0b429' : '#00e5a0'

  return (
    <div className="status-bar">
      <div className="status-item">
        <Monitor size={11} />
        <span>{data.os.hostname}</span>
      </div>
      <div className="status-item">
        <Server size={11} />
        <span>{data.os.distro} ({data.os.arch})</span>
      </div>
      {data.temp > 0 && (
        <div className="status-item" style={{ color: tempColor }}>
          <Thermometer size={11} />
          <span>CPU Temp: {data.temp}°C</span>
        </div>
      )}
      <div className="status-spacer" />
      <div className="status-item">
        <span className="live-dot" />
        <span>{isElectron ? 'Live Data' : 'Simulated Preview'}</span>
      </div>
    </div>
  )
}
