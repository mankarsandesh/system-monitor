export interface SystemData {
  cpu: {
    load: number
    cores: number[]
  }
  memory: {
    total: number
    used: number
    free: number
    percent: number
  }
  disk: DiskInfo[]
  network: {
    rx: number
    tx: number
    interface: string
  }
  processes: {
    all: number
    running: number
    list: ProcessInfo[]
  }
  os: {
    platform: string
    distro: string
    hostname: string
    arch: string
  }
  temp: number
  timestamp: number
}

export interface DiskInfo {
  fs: string
  mount: string
  size: number
  used: number
  percent: number
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  mem: number
}

export interface ChartPoint {
  time: string
  value: number
}

// Extend Window for Electron API
declare global {
  interface Window {
    electronAPI: {
      startMonitoring: () => void
      stopMonitoring: () => void
      onSystemData: (cb: (data: SystemData) => void) => void
      removeSystemDataListener: () => void
      getSystemInfo: () => Promise<any>
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}
