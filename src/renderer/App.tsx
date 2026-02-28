import './App.css';

import StatusBar from '../components/StatusBar';
import TitleBar from '../components/TitleBar';
import { useSystemMonitor } from '../hooks/useSystemMonitor';

export default function App() {
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
      <TitleBar />

      <main className="dashboard">
        <div className="row gauges-row"></div>
      </main>

      <StatusBar data={data} isElectron={isElectron} />
    </div>
  );
}
