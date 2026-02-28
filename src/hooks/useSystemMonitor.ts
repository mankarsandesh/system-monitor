import { useCallback, useEffect, useRef, useState } from 'react'
import { ChartPoint, SystemData } from '../types'

const MAX_HISTORY = 60 // keep 60 data points (~90 seconds)

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

// Mock data for web preview (when not in Electron)
function generateMockData(): SystemData {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min
  return {
    cpu: {
      load: Math.round(rand(15, 85)),
      cores: Array.from({ length: 8 }, () => Math.round(rand(5, 95))),
    },
    memory: {
      total: 17179869184,
      used: Math.round(rand(4e9, 12e9)),
      free: 0,
      percent: Math.round(rand(30, 75)),
    },
    disk: [
      { fs: '/dev/sda1', mount: '/', size: 512e9, used: Math.round(rand(100e9, 350e9)), percent: Math.round(rand(20, 70)) },
      { fs: '/dev/sdb1', mount: '/data', size: 1e12, used: Math.round(rand(200e9, 700e9)), percent: Math.round(rand(20, 70)) },
    ],
    network: {
      rx: Math.round(rand(0, 5e6)),
      tx: Math.round(rand(0, 2e6)),
      interface: 'eth0',
    },
    processes: {
      all: Math.round(rand(200, 350)),
      running: Math.round(rand(2, 8)),
      list: [
        { pid: 1234, name: 'node', cpu: parseFloat(rand(0, 30).toFixed(1)), mem: parseFloat(rand(1, 15).toFixed(1)) },
        { pid: 2345, name: 'chrome', cpu: parseFloat(rand(0, 20).toFixed(1)), mem: parseFloat(rand(5, 25).toFixed(1)) },
        { pid: 3456, name: 'vscode', cpu: parseFloat(rand(0, 15).toFixed(1)), mem: parseFloat(rand(3, 12).toFixed(1)) },
        { pid: 4567, name: 'electron', cpu: parseFloat(rand(0, 10).toFixed(1)), mem: parseFloat(rand(2, 8).toFixed(1)) },
        { pid: 5678, name: 'postgres', cpu: parseFloat(rand(0, 8).toFixed(1)), mem: parseFloat(rand(1, 6).toFixed(1)) },
        { pid: 6789, name: 'docker', cpu: parseFloat(rand(0, 5).toFixed(1)), mem: parseFloat(rand(1, 4).toFixed(1)) },
      ],
    },
    os: { platform: 'linux', distro: 'Ubuntu 22.04', hostname: 'dev-machine', arch: 'x64' },
    temp: Math.round(rand(45, 75)),
    timestamp: Date.now(),
  }
}

export function useSystemMonitor() {
  const [data, setData] = useState<SystemData | null>(null)
  const [cpuHistory, setCpuHistory] = useState<ChartPoint[]>([])
  const [memHistory, setMemHistory] = useState<ChartPoint[]>([])
  const [netRxHistory, setNetRxHistory] = useState<ChartPoint[]>([])
  const [netTxHistory, setNetTxHistory] = useState<ChartPoint[]>([])
  const mockInterval = useRef<NodeJS.Timeout | null>(null)
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI

  const addToHistory = useCallback((setter: React.Dispatch<React.SetStateAction<ChartPoint[]>>, value: number, ts: number) => {
    setter(prev => {
      const next = [...prev, { time: formatTime(ts), value }]
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
    })
  }, [])

  const handleData = useCallback((incoming: SystemData) => {
    // patch free
    incoming.memory.free = incoming.memory.total - incoming.memory.used
    setData(incoming)
    addToHistory(setCpuHistory, incoming.cpu.load, incoming.timestamp)
    addToHistory(setMemHistory, incoming.memory.percent, incoming.timestamp)
    addToHistory(setNetRxHistory, Math.round(incoming.network.rx / 1024), incoming.timestamp)
    addToHistory(setNetTxHistory, Math.round(incoming.network.tx / 1024), incoming.timestamp)
  }, [addToHistory])

  useEffect(() => {
    if (isElectron) {
      window.electronAPI.onSystemData(handleData)
      window.electronAPI.startMonitoring()
      return () => {
        window.electronAPI.stopMonitoring()
        window.electronAPI.removeSystemDataListener()
      }
    } else {
      // Web preview — use mock data
      const tick = () => handleData(generateMockData())
      tick()
      mockInterval.current = setInterval(tick, 1500)
      return () => { if (mockInterval.current) clearInterval(mockInterval.current) }
    }
  }, [handleData, isElectron])

  return { data, cpuHistory, memHistory, netRxHistory, netTxHistory, isElectron }
}
