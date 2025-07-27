'use client';
import { useState, useEffect, useCallback } from 'react';
import { DailyGoal, TodoData, MainActivity } from '@/lib/types';
import { TodoStorage } from '@/lib/storage';
import { calculateProgress } from '@/lib/utils';

export const useTodos = () => {
  const [todoData, setTodoData] = useState<TodoData>({ currentGoal: null, history: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedData = TodoStorage.load();
    
    // Check if current goal is for today, if not move to history
    if (loadedData.currentGoal && !TodoStorage.isCurrentGoalToday(loadedData.currentGoal)) {
      const updatedData: TodoData = {
        currentGoal: null,
        history: [loadedData.currentGoal, ...loadedData.history]
      };
      setTodoData(updatedData);
      TodoStorage.save(updatedData);
    } else {
      setTodoData(loadedData);
    }
    
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever todoData changes
  useEffect(() => {
    if (isLoaded) {
      TodoStorage.save(todoData);
    }
  }, [todoData, isLoaded]);

  // Set or update the current goal
  const setGoal = useCallback((goal: DailyGoal) => {
    setTodoData(prev => ({
      ...prev,
      currentGoal: goal
    }));
  }, []);

  // Update activities for current goal
  const updateActivities = useCallback((activities: MainActivity[]) => {
    setTodoData(prev => {
      if (!prev.currentGoal) return prev;
      
      return {
        ...prev,
        currentGoal: {
          ...prev.currentGoal,
          activities
        }
      };
    });
  }, []);

  // Add a new activity
  const addActivity = useCallback((activity: MainActivity) => {
    setTodoData(prev => {
      if (!prev.currentGoal) return prev;
      
      return {
        ...prev,
        currentGoal: {
          ...prev.currentGoal,
          activities: [...prev.currentGoal.activities, activity]
        }
      };
    });
  }, []);

  // Update a specific activity
  const updateActivity = useCallback((activityId: string, updates: Partial<MainActivity>) => {
    setTodoData(prev => {
      if (!prev.currentGoal) return prev;
      
      const updatedActivities = prev.currentGoal.activities.map(activity =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      );
      
      return {
        ...prev,
        currentGoal: {
          ...prev.currentGoal,
          activities: updatedActivities
        }
      };
    });
  }, []);

  // Delete a specific activity
  const deleteActivity = useCallback((activityId: string) => {
    setTodoData(prev => {
      if (!prev.currentGoal) return prev;
      
      const updatedActivities = prev.currentGoal.activities.filter(
        activity => activity.id !== activityId
      );
      
      return {
        ...prev,
        currentGoal: {
          ...prev.currentGoal,
          activities: updatedActivities
        }
      };
    });
  }, []);

  // Complete the current day (move to history)
  const completeDay = useCallback(() => {
    setTodoData(prev => {
      if (!prev.currentGoal) return prev;
      
      return {
        currentGoal: null,
        history: [prev.currentGoal, ...prev.history]
      };
    });
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    TodoStorage.clear();
    setTodoData({ currentGoal: null, history: [] });
  }, []);

  // Get progress for current goal
  const getProgress = useCallback(() => {
    if (!todoData.currentGoal) {
      return { completedTasks: 0, totalTasks: 0, completionRate: 0 };
    }
    
    return calculateProgress(todoData.currentGoal.activities);
  }, [todoData.currentGoal]);

  // Get statistics
  const getStats = useCallback(() => {
    const totalGoals = todoData.history.length + (todoData.currentGoal ? 1 : 0);
    const completedGoals = todoData.history.filter(goal => {
      const { completionRate } = calculateProgress(goal.activities);
      return completionRate === 1;
    }).length;
    
    const averageCompletion = todoData.history.length > 0 
      ? todoData.history.reduce((acc, goal) => {
          const { completionRate } = calculateProgress(goal.activities);
          return acc + completionRate;
        }, 0) / todoData.history.length
      : 0;
    
    return {
      totalGoals,
      completedGoals,
      averageCompletion: Math.round(averageCompletion * 100),
      currentStreak: calculateCurrentStreak(todoData.history)
    };
  }, [todoData]);

  return {
    // State
    todoData,
    isLoaded,
    isLoading,
    
    // Actions
    setGoal,
    updateActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    completeDay,
    clearAllData,
    
    // Computed values
    currentGoal: todoData.currentGoal,
    history: todoData.history,
    progress: getProgress(),
    stats: getStats(),
    
    // Helpers
    hasGoalForToday: !!todoData.currentGoal,
    isGoalComplete: todoData.currentGoal ? getProgress().completionRate === 1 : false,
  };
};

// Helper function to calculate current streak
const calculateCurrentStreak = (history: DailyGoal[]): number => {
  let streak = 0;
  
  for (const goal of history) {
    const { completionRate } = calculateProgress(goal.activities);
    if (completionRate === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};