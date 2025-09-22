"use strict";
// MQTT Client for AI Scraper Dashboard
// Switches between real MQTT and simulation based on environment
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
const simulator_1 = require("./simulator");
class MqttClient {
    constructor() {
        this.isSimulation = true; // Toggle this for real MQTT
        this.status = 'disconnected';
        this.eventListeners = {};
        // In development, always use simulation unless explicitly configured
        this.isSimulation = process.env.NODE_ENV === 'development' || !process.env.MQTT_BROKER_URL;
        if (this.isSimulation) {
            this.setupSimulationListeners();
        }
    }
    setupSimulationListeners() {
        // Subscribe to all simulation events
        simulator_1.mqttSimulator.subscribe('mqtt/connection/status', (message) => {
            this.status = message.payload.connected ? 'connected' : 'disconnected';
            this.emit('connection-status', this.status);
        });
        simulator_1.mqttSimulator.subscribe('vm/+/heartbeat', (message) => {
            this.emit('vm-heartbeat', message.payload);
        });
        simulator_1.mqttSimulator.subscribe('task/+/progress', (message) => {
            this.emit('task-progress', message.payload);
        });
        simulator_1.mqttSimulator.subscribe('task/+/assigned', (message) => {
            this.emit('task-assigned', message.payload);
        });
        simulator_1.mqttSimulator.subscribe('task/+/cancelled', (message) => {
            this.emit('task-cancelled', message.payload);
        });
        simulator_1.mqttSimulator.subscribe('task/queue/new', (message) => {
            this.emit('new-task', message.payload);
        });
    }
    async connect() {
        try {
            this.status = 'connecting';
            this.emit('connection-status', this.status);
            if (this.isSimulation) {
                const success = await simulator_1.mqttSimulator.connect();
                return success;
            }
            else {
                // Real MQTT connection would go here
                // const mqtt = require('mqtt');
                // this.client = mqtt.connect(process.env.MQTT_BROKER_URL);
                throw new Error('Real MQTT not implemented yet');
            }
        }
        catch (error) {
            this.status = 'error';
            this.emit('connection-status', this.status);
            this.emit('error', error);
            return false;
        }
    }
    async disconnect() {
        if (this.isSimulation) {
            return await simulator_1.mqttSimulator.disconnect();
        }
        else {
            // Real MQTT disconnection would go here
            return true;
        }
    }
    // Event management
    on(event, listener) {
        this.eventListeners[event] = listener;
    }
    off(event) {
        delete this.eventListeners[event];
    }
    emit(event, ...args) {
        const listener = this.eventListeners[event];
        if (listener) {
            listener(...args);
        }
    }
    // Dashboard API methods
    getConnectionStatus() {
        return this.status;
    }
    isConnected() {
        return this.status === 'connected';
    }
    getVMs() {
        if (this.isSimulation) {
            return simulator_1.mqttSimulator.getVMs();
        }
        return [];
    }
    getTasks() {
        if (this.isSimulation) {
            return simulator_1.mqttSimulator.getTasks();
        }
        return [];
    }
    async startTask(taskData) {
        if (this.isSimulation) {
            return await simulator_1.mqttSimulator.startTask(taskData);
        }
        return null;
    }
    async stopTask(taskId) {
        if (this.isSimulation) {
            return await simulator_1.mqttSimulator.stopTask(taskId);
        }
        return false;
    }
    // Real-time data for dashboard
    getConnectionInfo() {
        return {
            status: this.status,
            mode: this.isSimulation ? 'simulation' : 'production',
            uptime: this.isSimulation ? '00:05:23' : '00:00:00', // Mock uptime
            messagesReceived: this.isSimulation ? 156 : 0,
            messagesSent: this.isSimulation ? 43 : 0
        };
    }
}
// Export singleton instance
exports.mqttClient = new MqttClient();
