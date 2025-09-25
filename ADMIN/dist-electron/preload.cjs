"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('Preload script đang chạy');
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => electron_1.ipcRenderer.send('message', message),
    onMessage: (callback) => electron_1.ipcRenderer.on('message', callback),
    getIpAddress: () => electron_1.ipcRenderer.invoke('get-ip-address'),
    getMachineId: () => electron_1.ipcRenderer.invoke('get-machine-id'),
    getMacAddress: () => electron_1.ipcRenderer.invoke('get-mac-address'),
});
