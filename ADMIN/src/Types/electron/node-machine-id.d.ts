// src/types/node-machine-id.d.ts
declare module 'node-machine-id' {
  export function machineId(): Promise<string>;
  export function machineIdSync(options?: { original: boolean }): string;
}