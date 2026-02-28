/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

// System monitor API
contextBridge.exposeInMainWorld('electronAPI', {
  startMonitoring: () => ipcRenderer.send('start-monitoring'),
  stopMonitoring: () => ipcRenderer.send('stop-monitoring'),
  onSystemData: (cb: (data: unknown) => void) => {
    ipcRenderer.on('system-data', (_event, data) => cb(data));
  },
  removeSystemDataListener: () => {
    ipcRenderer.removeAllListeners('system-data');
  },
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
});

export type ElectronHandler = typeof electronHandler;
