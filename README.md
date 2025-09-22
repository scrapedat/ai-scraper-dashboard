# 🎯 AI Scraper Dashboard

**Human-AI Collaborative Desktop Application for Intelligent Web Scraping**

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen.svg)](https://github.com/scrapedat/ai-scraper-dashboard)
[![Electron](https://img.shields.io/badge/Electron-Latest-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![MQTT](https://img.shields.io/badge/MQTT-5.14-orange.svg)](https://mqtt.org/)

## 🚀 Overview

The AI Scraper Dashboard is a modern desktop application that provides a human-AI collaborative interface for managing and monitoring intelligent web scraping operations. It connects to RunPod AI Scraper VMs via MQTT for real-time communication and orchestration.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DESKTOP APP                         │
├─────────────────────────────────────────────────────────────┤
│  🎯 AI Scraper Dashboard (Electron + React + TypeScript)    │
│  ├── 👥 Human-AI Collaboration Interface                   │
│  ├── 📊 Real-time VM Management & Monitoring               │
│  ├── 🧬 Website DNA Intelligence Viewer                    │
│  ├── 📋 Task Queue & Scraping Job Manager                  │
│  └── 💬 Natural Language AI Interface                      │
└─────────────────────────────────────────────────────────────┘
                           │ MQTT WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    RUNPOD CLOUD INFRASTRUCTURE              │
├─────────────────────────────────────────────────────────────┤
│  🤖 AI Scraper VMs      📡 MQTT Broker      🗄️ FrankensteinDB│
│  ├── Chrome Automation  ├── WebSocket       ├── Website DNA │
│  ├── DNA Learning       ├── Pub/Sub         ├── Scraping    │
│  ├── Playwright         └── Real-time       │   History     │
│  └── Extensions                             └── Intelligence │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🎯 **Core Dashboard Features**
- **VM Fleet Management**: Monitor and control multiple RunPod scraper instances
- **Real-time Task Monitoring**: Live updates on scraping progress and results
- **Website DNA Intelligence**: Visual editor for website learning algorithms
- **Task Queue Manager**: Intelligent job scheduling and priority management
- **Performance Analytics**: Charts and metrics for optimization insights

### 🤝 **Human-AI Collaboration**
- **AI Strategy Suggestions**: Intelligent recommendations for scraping approaches
- **Collaborative Editing**: Human-AI teamwork for website DNA optimization
- **Natural Language Interface**: Chat with AI about scraping strategies
- **Smart Automation**: AI learns from human decisions and patterns

### 🧬 **Intelligence Features**  
- **Website DNA Viewer**: Visualize learned website structures and patterns
- **Adaptive Strategies**: AI-powered optimization based on success patterns
- **Cost Optimization**: Smart caching and frequency management
- **Stealth Intelligence**: Adaptive anti-detection strategies

## 🛠️ Technology Stack

### **Frontend Framework**
- **Electron**: Cross-platform desktop application framework
- **React 19.1**: Modern UI library with latest features
- **TypeScript 5.9**: Type-safe development with latest language features
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn/ui**: High-quality component library

### **State Management & Data**
- **Zustand**: Lightweight state management
- **SQLite**: Local data storage and caching
- **IndexedDB**: Browser-based data persistence

### **Communication & Integration**
- **MQTT.js**: WebSocket client for real-time communication
- **WebSocket**: Direct connection to RunPod infrastructure
- **REST APIs**: Integration with FrankensteinDB and external services

### **AI & Intelligence**
- **OpenAI API**: Natural language processing and AI suggestions
- **Local LLM Support**: Privacy-focused AI processing options
- **TensorFlow.js**: Browser-based machine learning capabilities

### **Visualization & Charts**
- **Recharts**: Responsive chart library for data visualization
- **D3.js**: Custom visualization for website DNA structures
- **React Flow**: Interactive node-based workflow visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/scrapedat/ai-scraper-dashboard.git
cd ai-scraper-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package as desktop app
npm run package
```

### Configuration
1. **MQTT Connection**: Configure RunPod MQTT broker settings
2. **AI Integration**: Set up OpenAI API key or local LLM
3. **Database**: Configure FrankensteinDB connection
4. **Authentication**: Set up user authentication tokens

## 📱 Usage

### 1. **Connect to Infrastructure**
- Configure RunPod MQTT broker connection
- Authenticate with your scraping infrastructure
- Verify VM fleet connectivity

### 2. **Natural Language Requests**
```
User: "Get iPhone 15 prices from Amazon and Best Buy"
AI: "I'll check both sites. Amazon was scraped 2 hours ago (data is fresh), 
     but Best Buy needs new data. Using stealth mode for Best Buy."
```

### 3. **Monitor & Optimize**
- View real-time scraping progress
- Analyze website DNA intelligence
- Optimize strategies based on AI suggestions
- Track cost and performance metrics

## 🌐 Integration Points

### **RunPod AI Scraper VMs**
- Real-time task dispatch via MQTT
- Live status monitoring and health checks
- Dynamic scaling based on demand
- Intelligent load balancing

### **FrankensteinDB**
- Website DNA storage and retrieval
- Scraping history and analytics
- Performance metrics and optimization data
- User session and preference management

### **Chrome Extensions**
- DOM manipulation and data extraction
- Stealth operation coordination
- Real-time page interaction
- Enhanced automation capabilities

## 📊 Business Value

### **Cost Optimization**
- Smart caching reduces unnecessary scraping by 60-80%
- Intelligent scheduling optimizes resource usage
- Adaptive strategies minimize blocking and retries

### **Performance Enhancement**
- Real-time monitoring enables immediate issue resolution
- AI-powered optimization improves success rates
- Collaborative human-AI decisions increase accuracy

### **Scalability**
- Cloud-based infrastructure scales automatically
- Desktop app provides consistent user experience
- Distributed architecture handles enterprise workloads

## 🔒 Security & Privacy

- **Local Data Storage**: Sensitive data stays on your device
- **Encrypted Communication**: All MQTT traffic is encrypted
- **API Key Management**: Secure credential storage
- **Privacy-First AI**: Option for local LLM processing

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Manual](docs/configuration.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Architecture Deep Dive](docs/architecture.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/scrapedat/ai-scraper-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/scrapedat/ai-scraper-dashboard/discussions)
- **Documentation**: [Wiki](https://github.com/scrapedat/ai-scraper-dashboard/wiki)

---

**Built with ❤️ by the AI Scraping Team**

*Empowering human-AI collaboration for intelligent web scraping*
