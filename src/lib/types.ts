export interface SubActivity{
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface MainActivity {
  id: string;
  title: string;
  urgency: 'low' | 'medium' | 'high';
  completed: boolean;
  subActivities: SubActivity[];
  createdAt: Date;
}

export interface DailyGoal {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  activities: MainActivity[];
  createdAt: Date;
}

export interface TodoData {
  currentGoal: DailyGoal | null;
  history: DailyGoal[];
}

export interface MemeData {
  text: string;
  template: string;
  type: 'roast' | 'praise';
}