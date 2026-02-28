import React from 'react'
import { Minus, Square, X, Activity, Sun, Moon } from 'lucide-react'

const isElectron = typeof window !== 'undefined' && !!window.electronAPI

interface TitleBarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function TitleBar({ theme, onToggleTheme }: TitleBarProps) {
  return (
    <div className="titlebar">
      <div className="titlebar-left">
        <div className="titlebar-icon">
          <Activity size={14} />
        </div>
        <span className="titlebar-title">SysMonitor</span>
        <span className="titlebar-badge">LIVE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>

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
    </div>
  )
}
