import { TodoData, DailyGoal } from "./types";

const STORAGE_KEY = "dailyTodos";

export const TodoStorage = {
  save: (data: TodoData): void => {
    if (typeof window !== undefined) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }
  },

  load: (): TodoData => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);

          return {
            currentGoal: parsed.currentGoal
              ? {
                  ...parsed.currentGoal,
                  createdAt: new Date(parsed.currentGoal.createdAt),
                  activities: parsed.currentGoal.activities.map(
                    (activity: any) => ({
                      ...activity,
                      createdAt: new Date(activity.createdAt),
                      subActivities: activity.subActivities.map((sub: any) => ({
                        ...sub,
                        createdAt: new Date(sub.createdAt),
                      })),
                    })
                  ),
                }
              : null,
            history: parsed.history.map((goal: any) => ({
              ...goal,
              createdAt: new Date(goal.createdAt),
              activities: goal.activities.map((activity: any) => ({
                ...activity,
                createdAt: new Date(activity.createdAt),
                subActivities: activity.subActivities.map((sub: any) => ({
                  ...sub,
                  createdAt: new Date(sub.createdAt),
                })),
              })),
            })),
          };
        }
      } catch (error) {
        console.error("Failed to load from localStorage:", error);
      }
    }

    return {
      currentGoal: null,
      history: [],
    };
  },

  clear: (): void => {
    if(typeof window !== 'undefined'){
        localStorage.removeItem(STORAGE_KEY);
    }
  },

  getTodayDate: (): string => {
    return new Date().toISOString().split("T")[0];
  },
  isCurrentGoalToday: (currentGoal: DailyGoal | null): boolean => {
    if (!currentGoal) return false;
    return currentGoal.date === TodoStorage.getTodayDate();
  },
};
