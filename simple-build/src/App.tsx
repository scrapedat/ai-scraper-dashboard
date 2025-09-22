import React, { useState, useEffect, useMemo } from 'react';

// Types
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

interface ScrapedItem {
  id: string;
  type: 'image' | 'video' | 'document' | 'url' | 'text' | 'structured';
  title: string;
  url: string;
  metadata: {
    size?: string;
    format?: string;
    resolution?: string;
    duration?: string;
    pages?: number;
    words?: number;
    createdAt: Date;
    source: string;
    tags: string[];
  };
  thumbnail?: string;
  content?: string;
}

// Mock data generation
const generateMockVMs = (): VMInstance[] => {
  const locations = ['US-East', 'US-West', 'EU-West', 'Asia-Pacific', 'Canada', 'Brazil'];
  const vms: VMInstance[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const statuses: VMInstance['status'][] = ['online', 'busy', 'offline', 'error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    vms.push({
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
  
  return vms;
};

const generateMockTasks = (): ScrapingTask[] => {
  const strategies = ['gentle', 'aggressive', 'stealth', 'rapid', 'comprehensive'];
  const statuses: ScrapingTask['status'][] = ['queued', 'running', 'completed', 'failed'];
  const tasks: ScrapingTask[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    tasks.push({
      id: `task-${i.toString().padStart(4, '0')}`,
      url: `https://example-site-${i}.com`,
      status,
      progress: status === 'completed' ? 100 : Math.floor(Math.random() * 100),
      estimatedCompletion: new Date(Date.now() + Math.random() * 7200000), // Within 2 hours
      assignedVM: `vm-${Math.floor(Math.random() * 30 + 1).toString().padStart(3, '0')}`,
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
    });
  }
  
  return tasks;
};

const generateMockScrapedData = (): ScrapedItem[] => {
  const items: ScrapedItem[] = [];
  const types: ScrapedItem['type'][] = ['image', 'video', 'document', 'url', 'text', 'structured'];
  
  // Generate 200 mock items
  for (let i = 1; i <= 200; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const baseItem = {
      id: `item-${i.toString().padStart(4, '0')}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Item ${i}`,
      url: `https://source-${i}.com/${type}/${i}`,
      metadata: {
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30), // Within last 30 days
        source: `source-${Math.floor(Math.random() * 20) + 1}.com`,
        tags: [`tag-${Math.floor(Math.random() * 50) + 1}`, `category-${Math.floor(Math.random() * 10) + 1}`],
      },
    };

    switch (type) {
      case 'image':
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
            size: `${Math.floor(Math.random() * 10) + 1}MB`,
            format: ['JPG', 'PNG', 'WebP', 'SVG'][Math.floor(Math.random() * 4)],
            resolution: ['1920x1080', '1280x720', '4K', '8K'][Math.floor(Math.random() * 4)],
          },
          thumbnail: `https://picsum.photos/200/150?random=${i}`,
        });
        break;
      case 'video':
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
            size: `${Math.floor(Math.random() * 500) + 50}MB`,
            format: ['MP4', 'WebM', 'AVI', 'MOV'][Math.floor(Math.random() * 4)],
            duration: `${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            resolution: ['1920x1080', '1280x720', '4K'][Math.floor(Math.random() * 3)],
          },
          thumbnail: `https://picsum.photos/200/150?random=${i + 200}`,
        });
        break;
      case 'document':
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
            size: `${Math.floor(Math.random() * 50) + 1}MB`,
            format: ['PDF', 'DOC', 'DOCX', 'TXT'][Math.floor(Math.random() * 4)],
            pages: Math.floor(Math.random() * 500) + 1,
          },
        });
        break;
      case 'text':
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
            words: Math.floor(Math.random() * 10000) + 100,
            format: 'TXT',
          },
          content: `This is sample text content for item ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        });
        break;
      case 'structured':
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
            format: ['JSON', 'XML', 'CSV', 'YAML'][Math.floor(Math.random() * 4)],
            size: `${Math.floor(Math.random() * 10) + 1}KB`,
          },
          content: JSON.stringify({ 
            data: `Structured data ${i}`, 
            value: Math.random() * 1000,
            timestamp: new Date().toISOString() 
          }, null, 2),
        });
        break;
      default:
        items.push({
          ...baseItem,
          metadata: {
            ...baseItem.metadata,
          },
        });
    }
  }
  
  return items;
};

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [vms, setVms] = useState<VMInstance[]>([]);
  const [tasks, setTasks] = useState<ScrapingTask[]>([]);
  const [scrapedData, setScrapedData] = useState<ScrapedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ScrapedItem | null>(null);

  // Initialize mock data
  useEffect(() => {
    setVms(generateMockVMs());
    setTasks(generateMockTasks());
    setScrapedData(generateMockScrapedData());
  }, []);

  // Filter scraped data
  const filteredData = useMemo(() => {
    return scrapedData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [scrapedData, searchTerm, filterType]);

  // Stats calculations
  const stats = useMemo(() => {
    const onlineVMs = vms.filter(vm => vm.status === 'online').length;
    const busyVMs = vms.filter(vm => vm.status === 'busy').length;
    const runningTasks = tasks.filter(task => task.status === 'running').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    
    return {
      onlineVMs,
      busyVMs,
      runningTasks,
      completedTasks,
      totalVMs: vms.length,
      totalTasks: tasks.length,
      totalScrapedItems: scrapedData.length,
    };
  }, [vms, tasks, scrapedData]);

  // Sidebar navigation
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'data', name: 'Data Management', icon: '📁' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'tasks', name: 'Task Queue', icon: '⚡' },
    { id: 'ai', name: 'AI Collaboration', icon: '🤖' },
  ];

  // Status indicators
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'busy': return 'text-yellow-400';
      case 'offline': return 'text-gray-400';
      case 'error': return 'text-red-400';
      case 'running': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'queued': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  // Render dashboard overview
  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">AI Scraper Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Online VMs</p>
              <p className="text-2xl font-bold text-green-400">{stats.onlineVMs}</p>
            </div>
            <div className="text-3xl">🟢</div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Busy VMs</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.busyVMs}</p>
            </div>
            <div className="text-3xl">🟡</div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Running Tasks</p>
              <p className="text-2xl font-bold text-blue-400">{stats.runningTasks}</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Scraped Items</p>
              <p className="text-2xl font-bold text-purple-400">{stats.totalScrapedItems}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* VM Grid */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">VM Fleet Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vms.slice(0, 12).map(vm => (
            <div key={vm.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{vm.id}</span>
                <span className={`${getStatusColor(vm.status)} text-sm font-medium`}>
                  {vm.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/70 text-sm">{vm.location}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">CPU:</span>
                  <span className="text-white">{vm.performance.cpu}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Memory:</span>
                  <span className="text-white">{vm.performance.memory}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Success:</span>
                  <span className="text-green-400">{vm.performance.successRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{task.id}</span>
                    <span className={`${getStatusColor(task.status)} text-sm font-medium`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{task.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{task.progress}%</p>
                  <p className="text-white/60 text-xs">{task.assignedVM}</p>
                </div>
              </div>
              {task.progress > 0 && task.progress < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render data management view
  const renderDataManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Data Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search scraped data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors w-full sm:w-64"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="url">URLs</option>
            <option value="text">Text</option>
            <option value="structured">Structured Data</option>
          </select>
        </div>
      </div>

      {/* Type Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {['image', 'video', 'document', 'url', 'text', 'structured'].map(type => {
          const count = scrapedData.filter(item => item.type === type).length;
          const icons = {
            image: '🖼️',
            video: '🎥',
            document: '📄',
            url: '🔗',
            text: '📝',
            structured: '📊'
          };
          
          return (
            <div key={type} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{icons[type as keyof typeof icons]}</div>
              <div className="text-white font-medium capitalize">{type}</div>
              <div className="text-white/70 text-sm">{count} items</div>
            </div>
          );
        })}
      </div>

      {/* Data Grid */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Scraped Content</h2>
          <span className="text-white/70">{filteredData.length} items</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.slice(0, 20).map(item => (
            <div 
              key={item.id} 
              className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {item.thumbnail && (
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {item.type === 'image' && '🖼️'}
                  {item.type === 'video' && '🎥'}
                  {item.type === 'document' && '📄'}
                  {item.type === 'url' && '🔗'}
                  {item.type === 'text' && '📝'}
                  {item.type === 'structured' && '📊'}
                </span>
                <span className="text-white font-medium text-sm truncate">{item.title}</span>
              </div>
              
              <p className="text-white/70 text-xs truncate mb-2">{item.url}</p>
              
              <div className="flex justify-between text-xs text-white/60">
                <span>{item.metadata.format}</span>
                <span>{item.metadata.size}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {item.metadata.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Other view renderers
  const renderAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <div className="glass-card p-6">
        <p className="text-white/70">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Task Queue</h1>
      <div className="glass-card p-6">
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-medium">{task.id}</span>
                    <span className={`${getStatusColor(task.status)} text-sm font-medium px-2 py-1 rounded`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{task.url}</p>
                  <p className="text-white/50 text-xs mt-1">Strategy: {task.strategy} | VM: {task.assignedVM}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{task.progress}%</div>
                  {task.progress > 0 && task.progress < 100 && (
                    <div className="w-20 bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">AI Collaboration</h1>
      <div className="glass-card p-6">
        <p className="text-white/70">AI collaboration interface coming soon...</p>
      </div>
    </div>
  );

  // Item detail modal
  const ItemDetailModal = ({ item, onClose }: { item: ScrapedItem; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">{item.title}</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        {item.thumbnail && (
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="space-y-3">
          <div>
            <span className="text-white/70 text-sm">URL:</span>
            <p className="text-white break-all">{item.url}</p>
          </div>
          
          <div>
            <span className="text-white/70 text-sm">Type:</span>
            <p className="text-white capitalize">{item.type}</p>
          </div>
          
          <div>
            <span className="text-white/70 text-sm">Source:</span>
            <p className="text-white">{item.metadata.source}</p>
          </div>
          
          <div>
            <span className="text-white/70 text-sm">Created:</span>
            <p className="text-white">{item.metadata.createdAt.toLocaleString()}</p>
          </div>
          
          {item.metadata.size && (
            <div>
              <span className="text-white/70 text-sm">Size:</span>
              <p className="text-white">{item.metadata.size}</p>
            </div>
          )}
          
          {item.metadata.format && (
            <div>
              <span className="text-white/70 text-sm">Format:</span>
              <p className="text-white">{item.metadata.format}</p>
            </div>
          )}
          
          <div>
            <span className="text-white/70 text-sm">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.metadata.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {item.content && (
            <div>
              <span className="text-white/70 text-sm">Content:</span>
              <pre className="text-white text-sm bg-black/20 p-3 rounded mt-1 whitespace-pre-wrap">
                {item.content}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen glass-sidebar border-r border-white/10">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-white">AI Scraper</h1>
            <p className="text-white/70 text-sm mt-1">Dashboard</p>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.id 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'data' && renderDataManagement()}
          {currentView === 'analytics' && renderAnalytics()}
          {currentView === 'tasks' && renderTasks()}
          {currentView === 'ai' && renderAI()}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}