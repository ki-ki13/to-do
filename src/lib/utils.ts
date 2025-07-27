import { MainActivity, SubActivity } from './types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateProgress = (activities: MainActivity[]): {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
} => {
  let completedTasks = 0;
  let totalTasks = 0;

  activities.forEach(activity => {
    if (activity.subActivities.length > 0) {
      // Count sub-activities
      totalTasks += activity.subActivities.length;
      completedTasks += activity.subActivities.filter(sub => sub.completed).length;
    } else {
      // Count main activity if no sub-activities
      totalTasks += 1;
      if (activity.completed) completedTasks += 1;
    }
  });

  return {
    completedTasks,
    totalTasks,
    completionRate: totalTasks > 0 ? completedTasks / totalTasks : 0
  };
};

export const getUrgencyColor = (urgency: 'low' | 'medium' | 'high'): string => {
  switch (urgency) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};