// Core Dashboard Types
export interface VMInstance {
  id: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  location: string;
  ipAddress: string;
  currentTask?: string;
  performance: {
    cpu: number;
    memory: number;
    successRate: number;
    tasksCompleted: number;
    avgResponseTime: number;
  };
  lastHeartbeat: Date;
  capabilities: string[];
}

export interface ScrapingTask {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  estimatedCompletion?: Date;
  assignedVM?: string;
  strategy: ScrapingStrategy;
  createdAt: Date;
  completedAt?: Date;
  result?: ScrapingResult;
  error?: string;
}

export interface ScrapingStrategy {
  type: 'fast' | 'stealth' | 'discovery' | 'cached';
  stealthLevel: 'none' | 'low' | 'medium' | 'high' | 'maximum';
  selectors: Record<string, string>;
  waitConditions: WaitCondition[];
  retryConfig: RetryConfig;
  reason: string;
  estimatedTime: number;
}

export interface ScrapingResult {
  data: any[];
  metadata: {
    itemsFound: number;
    processingTime: number;
    selectorsUsed: string[];
    pageLoadTime: number;
    stealthDetected: boolean;
  };
  screenshots?: string[];
  errors?: string[];
}

export interface WebsiteDNA {
  domain: string;
  selectors: Record<string, SelectorInfo>;
  loadPatterns: LoadPattern[];
  antiDetection: AntiDetectionStrategy;
  successRate: number;
  avgLoadTime: number;
  lastUpdated: Date;
  totalScrapes: number;
  layoutChanges: number;
  recommendedFrequency: number; // hours
}

export interface SelectorInfo {
  selector: string;
  confidence: number;
  lastWorked: Date;
  successCount: number;
  failureCount: number;
  alternatives: string[];
}

export interface LoadPattern {
  type: 'dynamic' | 'static' | 'spa' | 'infinite-scroll';
  waitTime: number;
  triggerEvents: string[];
  indicators: string[];
}

export interface AntiDetectionStrategy {
  required: boolean;
  techniques: string[];
  userAgents: string[];
  proxyRotation: boolean;
  rateLimiting: {
    requestsPerMinute: number;
    burstLimit: number;
  };
}

export interface WaitCondition {
  type: 'selector' | 'timeout' | 'network' | 'javascript';
  value: string | number;
  optional: boolean;
}

export interface RetryConfig {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
}

// AI Collaboration Types
export interface AISessionMsg {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    domainIntelligence?: WebsiteDNA;
    taskSuggestions?: TaskSuggestion[];
    strategyRecommendations?: StrategyRecommendation[];
    performanceData?: PerformanceMetrics;
  };
}

export interface TaskSuggestion {
  id: string;
  description: string;
  confidence: number;
  estimatedTime: number;
  estimatedCost: number;
  strategy: ScrapingStrategy;
  reasoning: string;
}

export interface StrategyRecommendation {
  id: string;
  domain: string;
  currentStrategy: ScrapingStrategy;
  recommendedStrategy: ScrapingStrategy;
  improvementType: 'performance' | 'cost' | 'reliability' | 'stealth';
  expectedImprovement: number; // percentage
  confidence: number;
  reasoning: string;
}

export interface PerformanceMetrics {
  timeRange: string;
  totalTasks: number;
  successRate: number;
  avgResponseTime: number;
  costSavings: number;
  domainsLearned: number;
  topDomains: Array<{
    domain: string;
    tasks: number;
    successRate: number;
  }>;
}

// MQTT Message Types
export interface MQTTMessage {
  id: string;
  timestamp: Date;
  sender: string;
  recipient: string;
  type: string;
  payload: any;
}

export interface TaskDispatchMessage extends MQTTMessage {
  type: 'task_dispatch';
  payload: {
    task: ScrapingTask;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    requirements: {
      stealthLevel: string;
      region?: string;
      capabilities?: string[];
    };
  };
}

export interface TaskStatusMessage extends MQTTMessage {
  type: 'task_status';
  payload: {
    taskId: string;
    status: ScrapingTask['status'];
    progress: number;
    vmId: string;
    vmStatus: VMInstance['status'];
    estimatedCompletion?: Date;
    error?: string;
  };
}

export interface VMHeartbeatMessage extends MQTTMessage {
  type: 'vm_heartbeat';
  payload: {
    vmId: string;
    performance: VMInstance['performance'];
    currentTask?: string;
    capabilities: string[];
    health: 'excellent' | 'good' | 'degraded' | 'critical';
  };
}

export interface DNAUpdateMessage extends MQTTMessage {
  type: 'dna_update';
  payload: {
    domain: string;
    intelligence: Partial<WebsiteDNA>;
    learningType: 'selector_update' | 'performance_update' | 'structure_change' | 'new_domain';
    confidence: number;
  };
}

// Dashboard State Types
export interface DashboardState {
  // Core Data
  vms: VMInstance[];
  tasks: ScrapingTask[];
  websiteDNA: Record<string, WebsiteDNA>;
  
  // AI Collaboration
  aiSession: AISessionMsg[];
  suggestions: TaskSuggestion[];
  recommendations: StrategyRecommendation[];
  
  // UI State
  selectedVM?: string;
  selectedTask?: string;
  selectedDomain?: string;
  activeView: 'dashboard' | 'vms' | 'tasks' | 'dna' | 'ai' | 'analytics';
  
  // Connection State
  mqttConnected: boolean;
  aiConnected: boolean;
  
  // Settings
  userPreferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    taskComplete: boolean;
    vmOffline: boolean;
    aiSuggestions: boolean;
    errors: boolean;
  };
  defaultStrategy: {
    stealthLevel: string;
    retries: number;
    timeout: number;
  };
  mqttBroker: {
    host: string;
    port: number;
    username?: string;
    useSSL: boolean;
  };
  aiProvider: {
    type: 'openai' | 'local' | 'azure';
    apiKey?: string;
    endpoint?: string;
    model?: string;
  };
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
