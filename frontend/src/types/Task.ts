export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedDuration?: number; // Duration in minutes
  startedAt?: string;
  completedAt?: string;
  deadline?: string; // Hard deadline for completion
  reminderEnabled: boolean;
  lastReminderAt?: string;
  progressPercent: number; // 0-100
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  
  // Anti-procrastination fields
  procrastinationRisk?: number;
  energyRequired?: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  difficultyLevel?: number;
  lifeGoalId?: string;
  habitId?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedDuration?: number;
  deadline?: string;
  reminderEnabled?: boolean;
  categoryId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedDuration?: number;
  startedAt?: string;
  completedAt?: string;
  deadline?: string;
  reminderEnabled?: boolean;
  progressPercent?: number;
  categoryId?: string;
}

// Progress Monitoring interfaces
export interface TaskProgress {
  taskId: string;
  timeRemaining: number; // milliseconds
  progressPercent: number;
  isOverdue: boolean;
  timeElapsed: number; // milliseconds
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  reminderIntervals: number[]; // percentages: [75, 50, 25, 10]
}
