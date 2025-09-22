"use strict";
// MQTT Simulation for Development
// This simulates the real MQTT communication with RunPod VMs
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttSimulator = void 0;
class MqttSimulator {
    constructor() {
        this.connected = false;
        this.listeners = new Map();
        this.vms = [];
        this.tasks = [];
        this.simulationIntervals = [];
        this.initializeMockData();
    }
    initializeMockData() {
        // Mock VMs
        this.vms = [
            {
                id: 'vm-runpod-001',
                status: 'online',
                location: 'US-East-1',
                ipAddress: '10.0.1.100',
                currentTask: 'task-001',
                performance: {
                    cpu: 45,
                    memory: 67,
                    successRate: 98.5,
                    tasksCompleted: 1247,
                    avgResponseTime: 1200
                },
                lastHeartbeat: new Date(),
                capabilities: ['chrome-stealth', 'captcha-solver', 'proxy-rotation']
            },
            {
                id: 'vm-runpod-002',
                status: 'busy',
                location: 'EU-West-1',
                ipAddress: '10.0.2.100',
                currentTask: 'task-002',
                performance: {
                    cpu: 78,
                    memory: 82,
                    successRate: 96.2,
                    tasksCompleted: 892,
                    avgResponseTime: 1800
                },
                lastHeartbeat: new Date(),
                capabilities: ['chrome-stealth', 'js-rendering', 'mobile-emulation']
            },
            {
                id: 'vm-runpod-003',
                status: 'online',
                location: 'Asia-Pacific',
                ipAddress: '10.0.3.100',
                performance: {
                    cpu: 23,
                    memory: 34,
                    successRate: 94.8,
                    tasksCompleted: 2103,
                    avgResponseTime: 950
                },
                lastHeartbeat: new Date(),
                capabilities: ['chrome-stealth', 'captcha-solver', 'proxy-rotation', 'mobile-emulation']
            }
        ];
        // Mock Tasks
        this.tasks = [
            {
                id: 'task-001',
                url: 'https://amazon.com/products/electronics',
                status: 'running',
                progress: 67,
                assignedVM: 'vm-runpod-001',
                strategy: {
                    type: 'stealth',
                    stealthLevel: 'high',
                    selectors: {
                        'product': '.s-result-item',
                        'title': '[data-cy="title-recipe-title"]',
                        'price': '.a-price-whole'
                    },
                    waitConditions: ['networkidle0'],
                    retryConfig: { maxRetries: 3, delay: 2000 },
                    reason: 'High bot detection on Amazon',
                    estimatedTime: 300
                },
                createdAt: new Date(Date.now() - 900000), // 15 minutes ago
                estimatedCompletion: new Date(Date.now() + 180000) // 3 minutes from now
            },
            {
                id: 'task-002',
                url: 'https://ebay.com/search/laptops',
                status: 'running',
                progress: 23,
                assignedVM: 'vm-runpod-002',
                strategy: {
                    type: 'fast',
                    stealthLevel: 'medium',
                    selectors: {
                        'listing': '.s-item',
                        'title': '.s-item__title',
                        'price': '.s-item__price'
                    },
                    waitConditions: ['domcontentloaded'],
                    retryConfig: { maxRetries: 2, delay: 1000 },
                    reason: 'Standard scraping approach',
                    estimatedTime: 120
                },
                createdAt: new Date(Date.now() - 300000), // 5 minutes ago
                estimatedCompletion: new Date(Date.now() + 420000) // 7 minutes from now
            },
            {
                id: 'task-003',
                url: 'https://shopify-store.com/collections/all',
                status: 'queued',
                progress: 0,
                strategy: {
                    type: 'discovery',
                    stealthLevel: 'low',
                    selectors: {},
                    waitConditions: ['networkidle2'],
                    retryConfig: { maxRetries: 1, delay: 500 },
                    reason: 'Pattern discovery mode',
                    estimatedTime: 180
                },
                createdAt: new Date(Date.now() - 60000) // 1 minute ago
            }
        ];
    }
    connect() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connected = true;
                this.startSimulation();
                this.emit('mqtt/connection/status', { connected: true });
                resolve(true);
            }, 1000 + Math.random() * 2000); // 1-3 second delay
        });
    }
    disconnect() {
        return new Promise((resolve) => {
            this.connected = false;
            this.stopSimulation();
            this.emit('mqtt/connection/status', { connected: false });
            setTimeout(() => resolve(true), 500);
        });
    }
    subscribe(topic, callback) {
        if (!this.listeners.has(topic)) {
            this.listeners.set(topic, []);
        }
        this.listeners.get(topic).push(callback);
    }
    publish(topic, payload) {
        console.log(`[MQTT SIM] Publishing to ${topic}:`, payload);
        // In real implementation, this would send to actual MQTT broker
    }
    emit(topic, payload) {
        const message = {
            topic,
            payload,
            timestamp: new Date()
        };
        const listeners = this.listeners.get(topic) || [];
        listeners.forEach(callback => callback(message));
    }
    startSimulation() {
        // Simulate VM heartbeats every 5 seconds
        const heartbeatInterval = setInterval(() => {
            this.vms.forEach(vm => {
                vm.lastHeartbeat = new Date();
                // Randomly update performance metrics
                vm.performance.cpu = Math.max(0, Math.min(100, vm.performance.cpu + (Math.random() - 0.5) * 10));
                vm.performance.memory = Math.max(0, Math.min(100, vm.performance.memory + (Math.random() - 0.5) * 5));
                this.emit(`vm/${vm.id}/heartbeat`, {
                    vmId: vm.id,
                    status: vm.status,
                    performance: vm.performance,
                    timestamp: vm.lastHeartbeat
                });
            });
        }, 5000);
        // Simulate task progress updates every 2 seconds
        const taskProgressInterval = setInterval(() => {
            this.tasks.forEach(task => {
                if (task.status === 'running') {
                    task.progress = Math.min(100, task.progress + Math.random() * 8);
                    if (task.progress >= 100) {
                        task.status = 'completed';
                        task.completedAt = new Date();
                    }
                    this.emit(`task/${task.id}/progress`, {
                        taskId: task.id,
                        progress: task.progress,
                        status: task.status,
                        assignedVM: task.assignedVM
                    });
                }
            });
        }, 2000);
        // Simulate new tasks being queued every 30 seconds
        const newTaskInterval = setInterval(() => {
            const urls = [
                'https://target.com/electronics',
                'https://walmart.com/groceries',
                'https://bestbuy.com/computers',
                'https://newegg.com/components'
            ];
            const newTask = {
                id: `task-${Date.now()}`,
                url: urls[Math.floor(Math.random() * urls.length)],
                status: 'queued',
                progress: 0,
                strategy: {
                    type: 'fast',
                    stealthLevel: 'medium',
                    selectors: {},
                    waitConditions: ['domcontentloaded'],
                    retryConfig: { maxRetries: 2, delay: 1000 },
                    reason: 'Auto-generated task',
                    estimatedTime: 90 + Math.random() * 120
                },
                createdAt: new Date()
            };
            this.tasks.push(newTask);
            this.emit('task/queue/new', newTask);
        }, 30000);
        this.simulationIntervals = [heartbeatInterval, taskProgressInterval, newTaskInterval];
    }
    stopSimulation() {
        this.simulationIntervals.forEach(interval => clearInterval(interval));
        this.simulationIntervals = [];
    }
    // Getters for current state
    getVMs() {
        return [...this.vms];
    }
    getTasks() {
        return [...this.tasks];
    }
    isConnected() {
        return this.connected;
    }
    // Mock actions
    async startTask(taskData) {
        const newTask = {
            id: `task-${Date.now()}`,
            url: taskData.url || 'https://example.com',
            status: 'queued',
            progress: 0,
            strategy: taskData.strategy || {
                type: 'fast',
                stealthLevel: 'medium',
                selectors: {},
                waitConditions: ['domcontentloaded'],
                retryConfig: { maxRetries: 2, delay: 1000 },
                reason: 'User initiated',
                estimatedTime: 120
            },
            createdAt: new Date()
        };
        this.tasks.push(newTask);
        this.emit('task/queue/new', newTask);
        // Simulate task assignment after a delay
        setTimeout(() => {
            const availableVM = this.vms.find(vm => vm.status === 'online');
            if (availableVM) {
                newTask.assignedVM = availableVM.id;
                newTask.status = 'running';
                availableVM.status = 'busy';
                availableVM.currentTask = newTask.id;
                this.emit(`task/${newTask.id}/assigned`, {
                    taskId: newTask.id,
                    vmId: availableVM.id,
                    status: 'running'
                });
            }
        }, 2000);
        return newTask;
    }
    async stopTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status === 'running') {
            task.status = 'cancelled';
            if (task.assignedVM) {
                const vm = this.vms.find(v => v.id === task.assignedVM);
                if (vm) {
                    vm.status = 'online';
                    vm.currentTask = undefined;
                }
            }
            this.emit(`task/${taskId}/cancelled`, {
                taskId,
                status: 'cancelled'
            });
            return true;
        }
        return false;
    }
}
// Export singleton instance
exports.mqttSimulator = new MqttSimulator();
