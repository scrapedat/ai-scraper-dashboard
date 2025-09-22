// MQTT Client for AI Scraper Dashboard
// Handles both simulation mode and real MQTT connections

interface MQTTMessage {
  topic: string;
  payload: any;
  timestamp: Date;
}

interface MQTTClient {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  subscribe: (topic: string, callback: (message: MQTTMessage) => void) => void;
  publish: (topic: string, payload: any) => void;
  isConnected: () => boolean;
}

class SimulatedMQTTClient implements MQTTClient {
  private connected = false;
  private subscriptions = new Map<string, (message: MQTTMessage) => void>();

  async connect(): Promise<void> {
    this.connected = true;
    console.log('✅ MQTT Simulator connected');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('📴 MQTT Simulator disconnected');
  }

  subscribe(topic: string, callback: (message: MQTTMessage) => void): void {
    this.subscriptions.set(topic, callback);
    console.log(`📡 Subscribed to topic: ${topic}`);
  }

  publish(topic: string, payload: any): void {
    console.log(`📤 Publishing to ${topic}:`, payload);
    
    // Simulate message delivery
    const callback = this.subscriptions.get(topic);
    if (callback) {
      callback({
        topic,
        payload,
        timestamp: new Date(),
      });
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Simulate receiving messages from external sources
  simulateMessage(topic: string, payload: any): void {
    const callback = this.subscriptions.get(topic);
    if (callback) {
      callback({
        topic,
        payload,
        timestamp: new Date(),
      });
    }
  }
}

// Create singleton client instance
export const mqttClient = new SimulatedMQTTClient();

// Auto-connect when in simulation mode
if (typeof window !== 'undefined') {
  mqttClient.connect().catch(console.error);
}