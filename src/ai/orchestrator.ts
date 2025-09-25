import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { MqttClient } from 'mqtt';

// Enums
export enum AITaskState {
  PLANNING = 'planning',
  EXECUTING = 'executing',
  EVALUATING = 'evaluating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AITaskType {
  SCRAPING = 'scraping',
  ANALYSIS = 'analysis',
  CONFIG = 'configuration',
}

// Types
export interface PlanStep {
  id: string;
  action: string;
  description: string;
  params: Record<string, any>;
  validation: {
    required: string[];
    conditions?: Record<string, any>;
  };
}

export interface AITask {
  id: string;
  type: AITaskType;
  title: string;
  description: string;
  state: AITaskState;
  params: Record<string, any>;
  plan?: PlanStep[];
  currentStepIndex?: number;
  error?: string;
  result?: any;
  startTime?: number;
  endTime?: number;
}

interface StoreState {
  tasks: Record<string, AITask>;
  activePlanId: string | null;
  mqttClient: MqttClient | null;
}

interface AIStore extends StoreState {
  // Task Management
  submitTask: (task: Omit<AITask, 'id' | 'state' | 'plan'>) => Promise<string>;
  generatePlan: (taskId: string) => Promise<PlanStep[]>;
  executeStep: (taskId: string, step: PlanStep) => Promise<boolean>;
  executeNextStep: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, result: any) => void;
  failTask: (taskId: string, error: string) => void;

  // Plan Generation
  generateScrapingPlan: (task: AITask) => Promise<PlanStep[]>;
  generateAnalysisPlan: (task: AITask) => Promise<PlanStep[]>;
  generateConfigPlan: (task: AITask) => Promise<PlanStep[]>;

  // Step Execution
  executeScrapeStep: (taskId: string, step: PlanStep) => Promise<boolean>;
  executeAnalyzeStep: (taskId: string, step: PlanStep) => Promise<boolean>;
  executeConfigureStep: (taskId: string, step: PlanStep) => Promise<boolean>;

  // MQTT
  setMqttClient: (client: MqttClient) => void;
  publishToMQTT: (topic: string, message: any) => Promise<void>;
}

// Create the store with persistence
export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // State
      tasks: {},
      activePlanId: null,
      mqttClient: null,

      // Task Management
      submitTask: async (taskData) => {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const task: AITask = {
          ...taskData,
          id: taskId,
          state: AITaskState.PLANNING,
          startTime: Date.now(),
        };

        // Add task to store
        set(produce((state) => {
          state.tasks[taskId] = task;
        }));

        // Generate plan
        const plan = await get().generatePlan(taskId);
        if (!plan || plan.length === 0) {
          get().failTask(taskId, 'Failed to generate plan');
          return taskId;
        }

        // Update task with plan
        set(produce((state) => {
          state.tasks[taskId].plan = plan;
          state.tasks[taskId].currentStepIndex = 0;
          state.tasks[taskId].state = AITaskState.EXECUTING;
        }));

        // Start execution
        get().executeNextStep(taskId);

        return taskId;
      },

      generatePlan: async (taskId: string) => {
        const task = get().tasks[taskId];
        if (!task) return [];

        try {
          // Generate plan based on task type
          let plan: PlanStep[] = [];
          
          switch (task.type) {
            case AITaskType.SCRAPING:
              plan = await get().generateScrapingPlan(task);
              break;
            case AITaskType.ANALYSIS:
              plan = await get().generateAnalysisPlan(task);
              break;
            case AITaskType.CONFIG:
              plan = await get().generateConfigPlan(task);
              break;
            default:
              throw new Error(`Unknown task type: ${task.type}`);
          }

          return plan;
        } catch (error) {
          console.error('Error generating plan:', error);
          return [];
        }
      },

      executeStep: async (taskId: string, step: PlanStep) => {
        const task = get().tasks[taskId];
        if (!task || task.state !== AITaskState.EXECUTING) return false;

        try {
          // Execute step based on action type
          let success = false;
          switch (step.action) {
            case 'scrape':
              success = await get().executeScrapeStep(taskId, step);
              break;
            case 'analyze':
              success = await get().executeAnalyzeStep(taskId, step);
              break;
            case 'configure':
              success = await get().executeConfigureStep(taskId, step);
              break;
            default:
              throw new Error(`Unknown step action: ${step.action}`);
          }

          // Validate step results
          if (success) {
            set(produce((state) => {
              const task = state.tasks[taskId];
              if (task.currentStepIndex !== undefined) {
                task.currentStepIndex++;
              }
              if (task.currentStepIndex === task.plan?.length) {
                task.state = AITaskState.COMPLETED;
                task.endTime = Date.now();
              }
            }));
          }

          return success;
        } catch (error) {
          console.error('Error executing step:', error);
          return false;
        }
      },

      executeNextStep: async (taskId: string) => {
        const task = get().tasks[taskId];
        if (!task || !task.plan || task.state !== AITaskState.EXECUTING) return;

        const currentStep = task.plan[task.currentStepIndex || 0];
        if (!currentStep) {
          get().completeTask(taskId, task.result || {});
          return;
        }

        const success = await get().executeStep(taskId, currentStep);
        if (!success) {
          get().failTask(taskId, `Failed to execute step: ${currentStep.description}`);
          return;
        }

        // Move to next step if there are more
        if ((task.currentStepIndex || 0) < task.plan.length - 1) {
          setTimeout(() => get().executeNextStep(taskId), 0);
        }
      },

      completeTask: (taskId: string, result: any) => {
        set(produce((state) => {
          const task = state.tasks[taskId];
          if (task) {
            task.state = AITaskState.COMPLETED;
            task.result = result;
            task.endTime = Date.now();
          }
        }));
      },

      failTask: (taskId: string, error: string) => {
        set(produce((state) => {
          const task = state.tasks[taskId];
          if (task) {
            task.state = AITaskState.FAILED;
            task.error = error;
            task.endTime = Date.now();
          }
        }));
      },

      // MQTT Integration
      setMqttClient: (client: MqttClient) => {
        set({ mqttClient: client });
      },

      publishToMQTT: async (topic: string, message: any) => {
        const { mqttClient } = get();
        if (!mqttClient) throw new Error('MQTT client not initialized');

        return new Promise((resolve, reject) => {
          mqttClient.publish(topic, JSON.stringify(message), (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      },

      // Plan Generation Helpers
      generateScrapingPlan: async (task: AITask): Promise<PlanStep[]> => {
        return [
          {
            id: `step_${Date.now()}_1`,
            action: 'scrape',
            description: 'Initialize browser and connect to target',
            params: {
              url: task.params?.url,
              timeout: 30000
            },
            validation: {
              required: ['browserInitialized', 'pageLoaded']
            }
          },
          {
            id: `step_${Date.now()}_2`,
            action: 'scrape',
            description: 'Extract target data',
            params: {
              selectors: task.params?.selectors || {},
              extractionRules: task.params?.rules || []
            },
            validation: {
              required: ['dataExtracted', 'validationPassed']
            }
          },
          {
            id: `step_${Date.now()}_3`,
            action: 'analyze',
            description: 'Analyze and validate extracted data',
            params: {
              validationRules: task.params?.validation || {}
            },
            validation: {
              required: ['analysisComplete', 'dataValidated']
            }
          }
        ];
      },

      generateAnalysisPlan: async (task: AITask): Promise<PlanStep[]> => {
        return [
          {
            id: `step_${Date.now()}_1`,
            action: 'analyze',
            description: 'Load and preprocess data',
            params: {
              data: task.params?.data,
              preprocessSteps: task.params?.preprocess || []
            },
            validation: {
              required: ['dataLoaded', 'preprocessingComplete']
            }
          },
          {
            id: `step_${Date.now()}_2`,
            action: 'analyze',
            description: 'Perform analysis',
            params: {
              analysisType: task.params?.analysisType,
              config: task.params?.analysisConfig
            },
            validation: {
              required: ['analysisComplete', 'resultsGenerated']
            }
          }
        ];
      },

      generateConfigPlan: async (task: AITask): Promise<PlanStep[]> => {
        return [
          {
            id: `step_${Date.now()}_1`,
            action: 'configure',
            description: 'Validate configuration parameters',
            params: {
              config: task.params?.config,
              rules: task.params?.validationRules
            },
            validation: {
              required: ['configValidated']
            }
          },
          {
            id: `step_${Date.now()}_2`,
            action: 'configure',
            description: 'Apply configuration',
            params: {
              config: task.params?.config,
              target: task.params?.target
            },
            validation: {
              required: ['configApplied', 'systemUpdated']
            }
          }
        ];
      },

      // Step Execution Helpers
      executeScrapeStep: async (taskId: string, step: PlanStep): Promise<boolean> => {
        const { mqttClient } = get();
        if (!mqttClient) return false;

        // Publish step to scraper VM
        await get().publishToMQTT('scraper/execute', {
          taskId,
          step
        });

        // Wait for result (simplified - should use proper message handling)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        return true; // Mock success - should check actual result
      },

      executeAnalyzeStep: async (taskId: string, step: PlanStep): Promise<boolean> => {
        // Implement analysis logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },

      executeConfigureStep: async (taskId: string, step: PlanStep): Promise<boolean> => {
        // Implement configuration logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
    }),
    {
      name: 'ai-orchestrator-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);