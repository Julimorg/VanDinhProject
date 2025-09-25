import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'node:path';
import isDev from 'electron-is-dev';
import os from 'os';
import fs from 'fs';
import { machineId } from 'node-machine-id'; // Sửa cách import

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs');
  console.log('-- Preload path:', preloadPath);
  console.log(`-- Index file : ${path.join(path.dirname(process.execPath), './dist/index.html')}`);

  if (!fs.existsSync(preloadPath)) {
    console.error('Lỗi: File preload.cjs không tồn tại tại:', preloadPath);
  } else {
    console.log('File preload.cjs exist');
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    title: 'Zentry man',
    icon: path.join(__dirname, './public/zentryIcon.ico'),
    resizable: true,
    minimizable: true,
    maximizable: true,
    autoHideMenuBar: false,
    frame: true,
    transparent: false,
    fullscreen: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: preloadPath,
    },
  });

if (isDev) {
    console.log('Running in development mode, loading URL: http://localhost:5173');
    win.loadURL('http://localhost:5173').catch((err) => {
      console.error('Lỗi khi tải URL:', err);
    });
    win.webContents.openDevTools();
  } else {
    // Sử dụng file: scheme rõ ràng
    const indexPath = `file://${path.join(path.dirname(process.execPath), './dist/index.html')}`;
    console.log('Running in production mode, loading file:', indexPath);
    if (!fs.existsSync(path.join(process.resourcesPath, 'app/dist/index.html'))) {
      console.error('Lỗi: File index.html không tồn tại tại:', path.join(process.resourcesPath, './dist/index.html'));
    } else {
      console.log('File index.html tồn tại');
    }
    win.loadURL(indexPath).catch((err) => {
      console.error('Lỗi khi tải file index.html:', err);
    });
  }
  
}

// Handle lấy IP Device
ipcMain.handle('get-ip-address', async () => {
  try {
    const networkInterfaces = os.networkInterfaces();
    let ipAddress: string | undefined;

    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces) {
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            ipAddress = iface.address;
            console.log('IP Address:', ipAddress);
            break;
          }
        }
      }
      if (ipAddress) break;
    }

    return ipAddress || 'Không tìm thấy địa chỉ IP';
  } catch (error) {
    console.error('Lỗi khi lấy IP:', error);
    return 'Lỗi khi lấy IP';
  }
});

// Handle lấy Machine ID
ipcMain.handle('get-machine-id', async () => {
  try {
    const id = await machineId(); // Gọi hàm machineId trực tiếp
    console.log('Machine ID:', id);
    return id;
  } catch (error) {
    console.error('Lỗi khi lấy Machine ID:', error);
    return 'Lỗi khi lấy Machine ID';
  }
});

// Handle lấy địa chỉ MAC
ipcMain.handle('get-mac-address', async () => {
  try {
    const networkInterfaces = os.networkInterfaces();
    let macAddress: string | undefined;

    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces) {
        for (const iface of interfaces) {
          if (iface.mac && !iface.internal) {
            macAddress = iface.mac;
            console.log('MAC Address:', macAddress);
            break;
          }
        }
      }
      if (macAddress) break;
    }

    return macAddress || 'Không tìm thấy địa chỉ MAC';
  } catch (error) {
    console.error('Lỗi khi lấy MAC:', error);
    return 'Lỗi khi lấy MAC';
  }
});

app.whenReady().then(() => {
  // console.log('Electron app đã sẵn sàng');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});