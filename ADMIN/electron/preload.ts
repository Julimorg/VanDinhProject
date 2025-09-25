import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script đang chạy');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  onMessage: (callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) =>
    ipcRenderer.on('message', callback),
  getIpAddress: () => ipcRenderer.invoke('get-ip-address'),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  getMacAddress: () => ipcRenderer.invoke('get-mac-address'),
});