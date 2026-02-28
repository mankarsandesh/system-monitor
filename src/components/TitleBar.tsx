import React from 'react'
import { Minus, Square, X, Activity } from 'lucide-react'

const isElectron = typeof window !== 'undefined' && !!window.electronAPI

export default function TitleBar() {
  return (
    <div className="titlebar">
      <div className="titlebar-left">
        <div className="titlebar-icon">
          <Activity size={14} />
        </div>
        <span className="titlebar-title">SysMonitor</span>
        <span className="titlebar-badge">LIVE</span>
      </div>

      {isElectron && (
        <div className="titlebar-controls">
          <button className="ctrl-btn minimize" onClick={() => window.electronAPI.minimize()} title="Minimize">
            <Minus size={12} />
          </button>
          <button className="ctrl-btn maximize" onClick={() => window.electronAPI.maximize()} title="Maximize">
            <Square size={11} />
          </button>
          <button className="ctrl-btn close" onClick={() => window.electronAPI.close()} title="Close">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
