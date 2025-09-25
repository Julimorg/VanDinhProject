"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const node_machine_id_1 = require("node-machine-id"); // Sửa cách import
function createWindow() {
    const preloadPath = node_path_1.default.join(__dirname, 'preload.cjs');
    console.log('-- Preload path:', preloadPath);
    console.log(`-- Index file : ${node_path_1.default.join(node_path_1.default.dirname(process.execPath), './dist/index.html')}`);
    if (!fs_1.default.existsSync(preloadPath)) {
        console.error('Lỗi: File preload.cjs không tồn tại tại:', preloadPath);
    }
    else {
        console.log('File preload.cjs exist');
    }
    const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
    const win = new electron_1.BrowserWindow({
        width,
        height,
        title: 'Zentry man',
        icon: node_path_1.default.join(__dirname, './public/zentryIcon.ico'),
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
    if (electron_is_dev_1.default) {
        console.log('Running in development mode, loading URL: http://localhost:5173');
        win.loadURL('http://localhost:5173').catch((err) => {
            console.error('Lỗi khi tải URL:', err);
        });
        win.webContents.openDevTools();
    }
    else {
        // Sử dụng file: scheme rõ ràng
        const indexPath = `file://${node_path_1.default.join(node_path_1.default.dirname(process.execPath), './dist/index.html')}`;
        console.log('Running in production mode, loading file:', indexPath);
        if (!fs_1.default.existsSync(node_path_1.default.join(process.resourcesPath, 'app/dist/index.html'))) {
            console.error('Lỗi: File index.html không tồn tại tại:', node_path_1.default.join(process.resourcesPath, './dist/index.html'));
        }
        else {
            console.log('File index.html tồn tại');
        }
        win.loadURL(indexPath).catch((err) => {
            console.error('Lỗi khi tải file index.html:', err);
        });
    }
}
// Handle lấy IP Device
electron_1.ipcMain.handle('get-ip-address', async () => {
    try {
        const networkInterfaces = os_1.default.networkInterfaces();
        let ipAddress;
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
            if (ipAddress)
                break;
        }
        return ipAddress || 'Không tìm thấy địa chỉ IP';
    }
    catch (error) {
        console.error('Lỗi khi lấy IP:', error);
        return 'Lỗi khi lấy IP';
    }
});
// Handle lấy Machine ID
electron_1.ipcMain.handle('get-machine-id', async () => {
    try {
        const id = await (0, node_machine_id_1.machineId)(); // Gọi hàm machineId trực tiếp
        console.log('Machine ID:', id);
        return id;
    }
    catch (error) {
        console.error('Lỗi khi lấy Machine ID:', error);
        return 'Lỗi khi lấy Machine ID';
    }
});
// Handle lấy địa chỉ MAC
electron_1.ipcMain.handle('get-mac-address', async () => {
    try {
        const networkInterfaces = os_1.default.networkInterfaces();
        let macAddress;
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
            if (macAddress)
                break;
        }
        return macAddress || 'Không tìm thấy địa chỉ MAC';
    }
    catch (error) {
        console.error('Lỗi khi lấy MAC:', error);
        return 'Lỗi khi lấy MAC';
    }
});
electron_1.app.whenReady().then(() => {
    // console.log('Electron app đã sẵn sàng');
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
