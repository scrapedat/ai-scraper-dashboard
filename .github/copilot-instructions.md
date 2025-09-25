# �� AI Scraper Dashboard - GitHub Copilot Instructions

## Project Overview
**AI Scraper Dashboard** is a Human-AI collaborative desktop application for managing and monitoring intelligent web scraping operations - web browsing and eventually training models. It provides a modern interface for changing how humans view data, URLs, videos, images, and other content from the web. The dashboard connects to a fleet of AI-powered scraper VMs - multipass, mqtt  real-time communication. It integrates with FrankensteinDB for website DNA intelligence and uses OpenAI or local LLMs for AI collaboration. You can think of it as a blend of a task manager, real-time monitoring tool, and AI assistant for web scraping. No website scraping is done in the dashboard itself - it is purely a control and monitoring interface, meant to be a customizable dashboard for users to manage their work and collaborate with AI.  

## 🏗️ Architecture & Tech Stack

### **Core Framework**
- **Electron**: Cross-platform desktop application and web app
- **Vite**: Fast build tool and development server  
- **React 19.1**: Modern UI library with hooks and concurrent features
- **TypeScript 5.9**: Type-safe development with latest language features
- **User Interface**: Shadcn/ui components with Tailwind CSS for styling - highly customizable and responsive design
Data export directly to training for models, in a VM or locally. The dashboard itself does not do any scraping or data processing. You can ask AI to gather any data and structure it for you, but the actual scraping is done in the VMs by AI, its an easier and more efficient way to manage and monitor the scraping process without needing to code or manage infrastructure.

### **State Management**
- **Zustand**: Lightweight state management for React
- **React Query**: Server state synchronization
- **Local Storage**: Persistent user preferences and cache

### **Communication Layer**
- **MQTT.js**: WebSocket client for real-time communication with RunPod
- **Socket.io**: Alternative real-time communication option
- **REST APIs**: Integration with FrankensteinDB and external services

### **AI Integration**
- **OpenAI API**: Natural language processing and AI suggestions
- **Local LLM Support**: Privacy-focused AI processing options
- **React Hooks**: Custom hooks for AI state management

## 📁 Project Structure

```
ai-scraper-dashboard/
├── src/
│   ├── components/          # React UI components
│   │   ├── dashboard/       # Main dashboard views
│   │   ├── vm-management/   # VM fleet management
│   │   ├── dna-intelligence/# Website DNA viewer/editor  
│   │   ├── task-queue/      # Job management interface
│   │   ├── ai-collaboration/# Human-AI teamwork features
│   │   └── common/          # Shared UI components
│   ├── mqtt/               # MQTT communication layer
│   │   ├── client.ts       # MQTT client setup
│   │   ├── topics.ts       # Topic definitions
│   │   └── handlers.ts     # Message handlers
│   ├── ai/                 # AI integration
│   │   ├── openai.ts       # OpenAI API integration
│   │   ├── llm-local.ts    # Local LLM support
│   │   └── suggestions.ts  # AI suggestion engine
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.ts             # Electron main process
├── public/                 # Static assets
├── docs/                   # Documentation
└── package.json            # Dependencies and scripts
```

## 🎯 Development Guidelines

### **Component Development**
- Use functional components with hooks
- Implement TypeScript interfaces for all props
- Follow React best practices for state management
- Use Tailwind CSS for styling with Shadcn/ui components

### **MQTT Communication**
- Implement proper error handling and reconnection logic
- Use typed message interfaces for type safety
- Handle connection states gracefully in UI
- Implement message queuing for offline scenarios

### **AI Integration**
- Create reusable hooks for AI functionality
- Implement proper error handling for API calls
- Support both cloud and local AI processing
- Design collaborative interfaces for human-AI interaction

### **Data Management**
- Use React Query for server state
- Implement proper caching strategies
- Handle offline scenarios gracefully
- Maintain data consistency across components

## 🚀 Key Features to Implement

### **1. VM Fleet Management**
```typescript
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
}
```

### **2. Real-time Task Monitoring**
```typescript
interface ScrapingTask {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion: Date;
  assignedVM: string;
  strategy: ScrapingStrategy;
}
```

### **3. Website DNA Intelligence**
```typescript
interface WebsiteDNA {
  domain: string;
  selectors: Record<string, string>;
  loadPatterns: LoadPattern[];
  antiDetection: AntiDetectionStrategy;
  successRate: number;
  lastUpdated: Date;
}
```

### **4. AI Collaboration Interface**
```typescript
interface AISessionMsg {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    domainIntelligence?: WebsiteDNA;
    taskSuggestions?: TaskSuggestion[];
    strategyRecommendations?: StrategyRecommendation[];
  };
}
```

## 📡 MQTT Integration Patterns

### **Topic Structure**
```typescript
const MQTT_TOPICS = {
  // Dashboard → VMs
  TASK_DISPATCH: `dashboard/${userId}/tasks/dispatch`,
  VM_CONTROL: `dashboard/${userId}/vm/control`,
  
  // VMs → Dashboard  
  TASK_STATUS: `vm/${vmId}/tasks/status`,
  VM_HEARTBEAT: `vm/${vmId}/heartbeat`,
  
  // Dashboard ↔ Database
  DNA_QUERY: `dashboard/${userId}/dna/query`,
  DNA_UPDATE: `database/dna/updated`,
  
  // AI Collaboration
  AI_SUGGESTION: `ai/${userId}/suggestions`,
  STRATEGY_RECOMMENDATION: `ai/${userId}/strategy`
} as const;
```

### **Message Handlers**
```typescript
// Implement typed message handlers
const handleTaskStatus = (message: TaskStatusMessage) => {
  // Update UI with task progress
  updateTaskInQueue(message.taskId, message.status);
  
  // Update VM status
  updateVMStatus(message.vmId, message.vmStatus);
  
  // Trigger UI notifications if needed
  if (message.status === 'completed') {
    showNotification(`Task ${message.taskId} completed successfully`);
  }
};
```

## 🎨 UI/UX Guidelines

### **Design Principles**
- **Real-time First**: Show live updates prominently
- **AI Collaboration**: Make AI suggestions contextual and actionable  
- **Progressive Disclosure**: Show essential info first, details on demand
- **Accessibility**: Support keyboard navigation and screen readers

### **Component Patterns**
- Use Shadcn/ui components as base building blocks
- Implement consistent loading and error states
- Create reusable data visualization components
- Design responsive layouts for different screen sizes

### **State Management Patterns**
```typescript
// Use Zustand for global state
interface DashboardState {
  vms: VMInstance[];
  tasks: ScrapingTask[];
  aiSession: AISessionMsg[];
  websiteDNA: Record<string, WebsiteDNA>;
  
  // Actions
  addTask: (task: CreateTaskRequest) => void;
  updateVM: (vmId: string, updates: Partial<VMInstance>) => void;
  addAIMessage: (message: Omit<AISessionMsg, 'id' | 'timestamp'>) => void;
}
```

## 🔧 Integration Points

### **RunPod AI Scraper VMs**
- Connect via MQTT WebSocket to RunPod infrastructure
- Monitor VM health and performance metrics
- Dispatch tasks with intelligent load balancing
- Receive real-time scraping results and updates

### **FrankensteinDB**
- Query website DNA and scraping history
- Store user preferences and session data
- Retrieve performance analytics and optimization data
- Manage user authentication and permissions

### **AI Services**
- Integrate OpenAI API for natural language processing
- Support local LLM for privacy-focused processing
- Implement AI suggestion engine for strategy recommendations
- Create collaborative editing interface for human-AI interaction

## 🚀 Development Workflow

### **Getting Started**
1. Set up development environment with Node.js 18+
2. Install dependencies with `npm install`
3. Configure MQTT broker connection settings
4. Set up AI API keys or local LLM
5. Start development server with `npm run dev`

### **Testing Strategy**
- Unit tests for components and utilities
- Integration tests for MQTT communication
- E2E tests for critical user workflows
- Performance tests for real-time features

### **Build & Deployment**
- Webpack bundling for optimized production builds
- Electron Builder for cross-platform packaging
- GitHub Actions for automated CI/CD
- Auto-updates for seamless user experience

---

## 🎯 Current Development Focus

The dashboard is designed to be the primary interface for users to:
1. **Monitor**: Real-time visibility into scraping operations
2. **Control**: Intelligent task management and VM orchestration  
3. **Optimize**: AI-powered strategy recommendations and learning
4. **Collaborate**: Human-AI teamwork for continuous improvement

**Next Steps**: Implement core dashboard components and MQTT communication layer.
