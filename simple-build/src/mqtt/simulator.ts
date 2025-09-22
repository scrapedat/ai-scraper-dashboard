// MQTT Simulation System for AI Scraper Dashboard
// Generates realistic VM and task data

interface VMInstance {
  id: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  location: string;
  currentTask?: string;
  performance: {
    cpu: number;
    memory: number;
    successRate: number;
  };
  lastSeen: Date;
}

interface ScrapingTask {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion: Date;
  assignedVM: string;
  strategy: string;
  results?: any;
}

class MQTTSimulator {
  private vms: VMInstance[] = [];
  private tasks: ScrapingTask[] = [];
  private simulationInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeVMs();
    this.initializeTasks();
    this.startSimulation();
  }

  private initializeVMs(): void {
    const locations = ['US-East', 'US-West', 'EU-West', 'Asia-Pacific', 'Canada', 'Brazil'];
    
    for (let i = 1; i <= 30; i++) {
      const statuses: VMInstance['status'][] = ['online', 'busy', 'offline', 'error'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      this.vms.push({
        id: `vm-${i.toString().padStart(3, '0')}`,
        status: randomStatus,
        location: locations[Math.floor(Math.random() * locations.length)],
        currentTask: randomStatus === 'busy' ? `task-${Math.floor(Math.random() * 1000)}` : undefined,
        performance: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          successRate: Math.floor(Math.random() * 40) + 60, // 60-100%
        },
        lastSeen: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      });
    }
  }

  private initializeTasks(): void {
    const strategies = ['gentle', 'aggressive', 'stealth', 'rapid', 'comprehensive'];
    const statuses: ScrapingTask['status'][] = ['queued', 'running', 'completed', 'failed'];
    
    for (let i = 1; i <= 50; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      this.tasks.push({
        id: `task-${i.toString().padStart(4, '0')}`,
        url: `https://example-site-${i}.com`,
        status,
        progress: status === 'completed' ? 100 : Math.floor(Math.random() * 100),
        estimatedCompletion: new Date(Date.now() + Math.random() * 7200000), // Within 2 hours
        assignedVM: `vm-${Math.floor(Math.random() * 30 + 1).toString().padStart(3, '0')}`,
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
      });
    }
  }

  private startSimulation(): void {
    // Update VM statuses and performance metrics every 30 seconds
    this.simulationInterval = setInterval(() => {
      this.updateVMStatuses();
      this.updateTaskProgress();
    }, 30000);

    console.log('🎭 MQTT Simulation started');
  }

  private updateVMStatuses(): void {
    this.vms.forEach(vm => {
      // Randomly update performance metrics
      vm.performance.cpu = Math.max(0, Math.min(100, vm.performance.cpu + (Math.random() - 0.5) * 20));
      vm.performance.memory = Math.max(0, Math.min(100, vm.performance.memory + (Math.random() - 0.5) * 15));
      
      // Occasionally change status
      if (Math.random() < 0.1) {
        const statuses: VMInstance['status'][] = ['online', 'busy', 'offline'];
        vm.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      vm.lastSeen = new Date();
    });
  }

  private updateTaskProgress(): void {
    this.tasks.forEach(task => {
      if (task.status === 'running' && task.progress < 100) {
        task.progress = Math.min(100, task.progress + Math.floor(Math.random() * 10) + 1);
        
        if (task.progress >= 100) {
          task.status = Math.random() > 0.9 ? 'failed' : 'completed';
        }
      }
    });
  }

  public getVMs(): VMInstance[] {
    return [...this.vms];
  }

  public getTasks(): ScrapingTask[] {
    return [...this.tasks];
  }

  public stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      console.log('🛑 MQTT Simulation stopped');
    }
  }
}

// Create singleton simulator instance
export const mqttSimulator = new MQTTSimulator();

// Export types for use elsewhere
export type { VMInstance, ScrapingTask };