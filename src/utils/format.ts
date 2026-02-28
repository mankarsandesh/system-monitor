export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function getColorForPercent(percent: number): string {
  if (percent < 50) return '#00e5a0'
  if (percent < 75) return '#f0b429'
  return '#ff4757'
}

export function getStatusLabel(percent: number): string {
  if (percent < 50) return 'Normal'
  if (percent < 75) return 'Moderate'
  return 'High'
}
