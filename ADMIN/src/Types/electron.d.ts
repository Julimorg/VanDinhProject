export interface ElectronAPI {
  getIpAddress: () => Promise<string>;
  getMachineId: () => Promise<string>;
  getMacAddress: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}