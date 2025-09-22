"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // App info
    getAppVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
    getPlatform: () => electron_1.ipcRenderer.invoke('get-platform'),
    // MQTT functionality
    getMqttConnectionStatus: () => electron_1.ipcRenderer.invoke('mqtt-connection-status'),
    connectMqtt: () => electron_1.ipcRenderer.invoke('mqtt-connect'),
    disconnectMqtt: () => electron_1.ipcRenderer.invoke('mqtt-disconnect'),
    // VM management
    getVmStatus: () => electron_1.ipcRenderer.invoke('get-vm-status'),
    // Task management
    getTasks: () => electron_1.ipcRenderer.invoke('get-tasks'),
    startTask: (taskData) => electron_1.ipcRenderer.invoke('start-task', taskData),
    stopTask: (taskId) => electron_1.ipcRenderer.invoke('stop-task', taskId),
    // Event listeners
    onMqttStatusChange: (callback) => {
        electron_1.ipcRenderer.on('mqtt-status-changed', (_event, status) => callback(status));
    },
    onVmUpdate: (callback) => {
        electron_1.ipcRenderer.on('vm-updated', (_event, vmData) => callback(vmData));
    },
    onTaskUpdate: (callback) => {
        electron_1.ipcRenderer.on('task-updated', (_event, taskData) => callback(taskData));
    },
    onTaskAssigned: (callback) => {
        electron_1.ipcRenderer.on('task-assigned', (_event, assignmentData) => callback(assignmentData));
    },
    onNewTask: (callback) => {
        electron_1.ipcRenderer.on('new-task', (_event, taskData) => callback(taskData));
    },
    onMqttError: (callback) => {
        electron_1.ipcRenderer.on('mqtt-error', (_event, error) => callback(error));
    },
    // Remove listeners
    removeAllListeners: (channel) => {
        electron_1.ipcRenderer.removeAllListeners(channel);
    }
});
