"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const client_1 = require("./mqtt/client");
// Enable live reload for development
if (process.env.NODE_ENV === 'development') {
    try {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
            hardResetMethod: 'exit'
        });
    }
    catch (_) {
        console.log('Electron reload not available');
    }
}
function createMainWindow() {
    // Create the browser window
    const mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        show: false,
        icon: process.platform === 'linux' ? path.join(__dirname, '../assets/icon.png') : undefined,
        autoHideMenuBar: true, // Hide menu bar by default
    });
    // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3001');
        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }
    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Set up MQTT event forwarding after window is ready
        setupMqttEventForwarding(mainWindow);
    });
    return mainWindow;
}
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(() => {
    createMainWindow();
    electron_1.app.on('activate', () => {
        // On macOS, re-create a window when the dock icon is clicked
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Set app security policies
electron_1.app.on('web-contents-created', (event, contents) => {
    // Prevent new window creation
    contents.setWindowOpenHandler(({ url }) => {
        console.log('Blocked new window creation to:', url);
        return { action: 'deny' };
    });
    // Prevent navigation to external URLs
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'file://') {
            event.preventDefault();
            console.log('Blocked navigation to:', navigationUrl);
        }
    });
});
// IPC handlers for dashboard functionality
electron_1.ipcMain.handle('get-app-version', () => {
    return electron_1.app.getVersion();
});
electron_1.ipcMain.handle('get-platform', () => {
    return process.platform;
});
// MQTT connection management
electron_1.ipcMain.handle('mqtt-connection-status', () => {
    return client_1.mqttClient.getConnectionInfo();
});
electron_1.ipcMain.handle('mqtt-connect', async () => {
    try {
        const success = await client_1.mqttClient.connect();
        return { success, status: client_1.mqttClient.getConnectionStatus() };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('mqtt-disconnect', async () => {
    try {
        const success = await client_1.mqttClient.disconnect();
        return { success, status: client_1.mqttClient.getConnectionStatus() };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
// VM management
electron_1.ipcMain.handle('get-vm-status', () => {
    return client_1.mqttClient.getVMs();
});
// Task management
electron_1.ipcMain.handle('get-tasks', () => {
    return client_1.mqttClient.getTasks();
});
electron_1.ipcMain.handle('start-task', async (event, taskData) => {
    try {
        const task = await client_1.mqttClient.startTask(taskData);
        return { success: true, task };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('stop-task', async (event, taskId) => {
    try {
        const success = await client_1.mqttClient.stopTask(taskId);
        return { success };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
// Set up MQTT event forwarding to renderer
function setupMqttEventForwarding(mainWindow) {
    client_1.mqttClient.on('connection-status', (status) => {
        mainWindow.webContents.send('mqtt-status-changed', status);
    });
    client_1.mqttClient.on('vm-heartbeat', (vmData) => {
        mainWindow.webContents.send('vm-updated', vmData);
    });
    client_1.mqttClient.on('task-progress', (taskData) => {
        mainWindow.webContents.send('task-updated', taskData);
    });
    client_1.mqttClient.on('task-assigned', (assignmentData) => {
        mainWindow.webContents.send('task-assigned', assignmentData);
    });
    client_1.mqttClient.on('new-task', (taskData) => {
        mainWindow.webContents.send('new-task', taskData);
    });
    client_1.mqttClient.on('error', (error) => {
        mainWindow.webContents.send('mqtt-error', error.message);
    });
}
