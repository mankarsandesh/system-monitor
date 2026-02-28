/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import si from 'systeminformation';
import { SystemData } from '../types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let monitoringInterval: NodeJS.Timeout | null = null;

// ─── GET System Data Collection ──────────────────────────────────────────────────

async function collectSystemData(): Promise<SystemData> {
  const [cpuLoad, mem, fsSize, netStats, procs, osInfo, cpuTemp] =
    await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.processes(),
      si.osInfo(),
      si.cpuTemperature(),
    ]);

  return {
    cpu: {
      load: Math.round(cpuLoad.currentLoad),
      cores: cpuLoad.cpus.map((c) => Math.round(c.load)),
    },
    memory: {
      total: mem.total,
      used: mem.active,
      free: mem.available,
      percent: Math.round((mem.active / mem.total) * 100),
    },
    disk: fsSize
      .filter((d) => d.size > 0)
      .map((d) => ({
        fs: d.fs,
        mount: d.mount,
        size: d.size,
        used: d.used,
        percent: Math.round(d.use),
      })),
    network: {
      rx: Math.max(0, netStats[0]?.rx_sec ?? 0),
      tx: Math.max(0, netStats[0]?.tx_sec ?? 0),
      interface: netStats[0]?.iface ?? 'N/A',
    },
    processes: {
      all: procs.all,
      running: procs.running,
      list: procs.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 10)
        .map((p) => ({
          pid: p.pid,
          name: p.name,
          cpu: parseFloat(p.cpu.toFixed(1)),
          mem: parseFloat(p.mem.toFixed(1)),
        })),
    },
    os: {
      platform: osInfo.platform,
      distro: osInfo.distro,
      hostname: osInfo.hostname,
      arch: osInfo.arch,
    },
    temp: Math.round(cpuTemp.main ?? 0),
    timestamp: Date.now(),
  };
}

// ─── GET IPC: System Monitoring ──────────────────────────────────────────────────

ipcMain.on('start-monitoring', () => {
  if (monitoringInterval) return;

  const tick = async () => {
    try {
      const data = await collectSystemData();
      mainWindow?.webContents.send('system-data', data);
    } catch (err) {
      console.error('System monitor error:', err);
    }
  };

  tick(); 
  monitoringInterval = setInterval(tick, 1500);
});

ipcMain.on('stop-monitoring', () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
});

// ─── GET IPC: Window Controls 

ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow?.close());

// ─── IPC: Legacy test ────────────────────────────────────────────────────────

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ─── GET App Setup ───────────────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name: string) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    // Stop monitoring when window closes
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
