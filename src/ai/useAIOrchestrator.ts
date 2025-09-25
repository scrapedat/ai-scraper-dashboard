import { useCallback } from 'react';
import { useAIStore, type AITask, AITaskType } from './orchestrator';

export function useAIOrchestrator() {
  const {
    tasks,
    activePlanId,
    submitTask,
    completeTask,
    failTask
  } = useAIStore();

  // Submit a new scraping task
  const startScraping = useCallback(async (url: string, selectors: Record<string, string>) => {
    return await submitTask({
      type: AITaskType.SCRAPING,
      title: `Scrape ${url}`,
      description: `Extract data from ${url} using provided selectors`,
      params: {
        url,
        selectors
      }
    });
  }, [submitTask]);

  // Submit a new analysis task
  const startAnalysis = useCallback(async (data: any, analysisType: string, config: any) => {
    return await submitTask({
      type: AITaskType.ANALYSIS,
      title: `Analyze data using ${analysisType}`,
      description: `Perform ${analysisType} analysis on provided data`,
      params: {
        data,
        analysisType,
        analysisConfig: config
      }
    });
  }, [submitTask]);

  // Submit a new configuration task
  const startConfiguration = useCallback(async (config: any, target: string) => {
    return await submitTask({
      type: AITaskType.CONFIG,
      title: `Configure ${target}`,
      description: `Apply configuration to ${target}`,
      params: {
        config,
        target
      }
    });
  }, [submitTask]);

  // Get active task
  const getActiveTask = useCallback((): AITask | null => {
    if (!activePlanId) return null;
    return tasks[activePlanId] || null;
  }, [activePlanId, tasks]);

  // Get task progress
  const getTaskProgress = useCallback((taskId: string): number => {
    const task = tasks[taskId];
    if (!task || !task.plan) return 0;
    
    const totalSteps = task.plan.length;
    const completedSteps = task.currentStepIndex || 0;
    return (completedSteps / totalSteps) * 100;
  }, [tasks]);

  return {
    // State
    tasks,
    activePlanId,
    activeTask: getActiveTask(),

    // Actions
    startScraping,
    startAnalysis,
    startConfiguration,
    completeTask,
    failTask,

    // Utilities
    getTaskProgress,
  };
}