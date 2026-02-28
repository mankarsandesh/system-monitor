import './App.css';

import { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Wifi } from 'lucide-react';
import CoreGrid from '../components/CoreGrid';
import DiskCard from '../components/DiskCard';
import GaugeCard from '../components/GaugeCard';
import LineChartCard from '../components/LineChartCard';
import ProcessTable from '../components/ProcessTable';
import StatusBar from '../components/StatusBar';
import TitleBar from '../components/TitleBar';
import { useSystemMonitor } from '../hooks/useSystemMonitor';
import { formatBytes } from '../utils/format';

type Theme = 'dark' | 'light';

export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const {
    data,
    cpuHistory,
    memHistory,
    netRxHistory,
    netTxHistory,
    isElectron,
  } = useSystemMonitor();

  if (!data) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Initializing monitors...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <TitleBar theme={theme} onToggleTheme={toggleTheme} />

      <main className="dashboard">
        <div className="row gauges-row">
          <GaugeCard
            title="CPU Load"
            value={data.cpu.load}
            icon={<Cpu size={14} />}
            subtitle={`${data.cpu.cores.length} cores active`}
          />
          <GaugeCard
            title="Memory"
            value={data.memory.percent}
            icon={<MemoryStick size={14} />}
            subtitle={`${formatBytes(data.memory.used)} / ${formatBytes(data.memory.total)}`}
          />
          <CoreGrid cores={data.cpu.cores} />
        </div>

         <div className="row charts-row">
          <LineChartCard
            title="CPU History"
            data={cpuHistory}
            color="#00e5a0"
            unit="%"
            icon={<Cpu size={13} />}
          />
          <LineChartCard
            title="Memory History"
            data={memHistory}
            color="#3d9cff"
            unit="%"
            icon={<MemoryStick size={13} />}
          />
          <LineChartCard
            title="Network ↓ RX"
            data={netRxHistory}
            color="#f0b429"
            icon={<Wifi size={13} />}
            formatValue={(v) => `${v} KB/s`}
          />
          <LineChartCard
            title="Network ↑ TX"
            data={netTxHistory}
            color="#ff6b9d"
            icon={<Wifi size={13} />}
            formatValue={(v) => `${v} KB/s`}
          />
        </div>

         <div className="row bottom-row">
          <DiskCard disks={data.disk} />
          <ProcessTable
            processes={data.processes.list}
            total={data.processes.all}
            running={data.processes.running}
          />
        </div>

      </main>

      <StatusBar data={data} isElectron={isElectron} />
    </div>
  );
}
