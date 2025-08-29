// Life Goal Management Types

// Task interface for LifeGoal relations
export interface TaskRef {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedDuration?: number;
  lifeGoalId?: string;
  habitId?: string;
}
export interface LifeGoal {
  id: string;
  title: string;
  description?: string;
  category: string;
  timeframe: string;
  importance: number; // 1-10
  difficulty: number; // 1-10
  status: string;
  targetDate?: string;
  completedAt?: string;
  progressPercent: number; // 0-100
  createdAt: string;
  updatedAt: string;
  userId: string;
  milestones: Milestone[];
  tasks: TaskRef[];
  aiInsights: AIInsight[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completedAt?: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  lifeGoalId: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  difficulty: number; // 1-10
  energyRequired: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  habitLogs: HabitLog[];
}

export interface HabitLog {
  id: string;
  completed: boolean;
  notes?: string;
  mood?: number; // 1-10
  energy?: number; // 1-10
  loggedAt: string;
  habitId: string;
}

export interface BehaviorData {
  id: string;
  action: string;
  context?: any;
  emotionalState?: string;
  procrastinationRisk: number; // 0.0-1.0
  interventionTaken: string[];
  timestamp: string;
  userId: string;
}

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  content: string;
  confidence: number; // 0.0-1.0
  actionable: boolean;
  dismissed: boolean;
  createdAt: string;
  userId: string;
  lifeGoalId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  personalityType?: string;
  motivationStyle: string;
  procrastinationTriggers: string[];
  energyPatterns?: any;
  preferredRewards: string[];
  createdAt: string;
  updatedAt: string;
}

// Enums
export const GoalCategory = {
  HEALTH_FITNESS: 'HEALTH_FITNESS',
  CAREER_PROFESSIONAL: 'CAREER_PROFESSIONAL',
  EDUCATION_LEARNING: 'EDUCATION_LEARNING',
  RELATIONSHIPS_SOCIAL: 'RELATIONSHIPS_SOCIAL',
  FINANCIAL: 'FINANCIAL',
  PERSONAL_DEVELOPMENT: 'PERSONAL_DEVELOPMENT',
  HOBBIES_INTERESTS: 'HOBBIES_INTERESTS',
  TRAVEL_ADVENTURE: 'TRAVEL_ADVENTURE',
  FAMILY: 'FAMILY',
  SPIRITUAL_MINDFULNESS: 'SPIRITUAL_MINDFULNESS'
} as const;

export type GoalCategory = typeof GoalCategory[keyof typeof GoalCategory];

export const TimeFrame = {
  SHORT_TERM: 'SHORT_TERM',
  MEDIUM_TERM: 'MEDIUM_TERM',
  LONG_TERM: 'LONG_TERM',
  LIFE_LONG: 'LIFE_LONG'
} as const;

export type TimeFrame = typeof TimeFrame[keyof typeof TimeFrame];

export const GoalStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type GoalStatus = typeof GoalStatus[keyof typeof GoalStatus];

export const EnergyLevel = {
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH'
} as const;

export type EnergyLevel = typeof EnergyLevel[keyof typeof EnergyLevel];

export const Frequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  CUSTOM: 'CUSTOM'
} as const;

export type Frequency = typeof Frequency[keyof typeof Frequency];

export const MotivationStyle = {
  INTRINSIC: 'INTRINSIC',
  EXTRINSIC: 'EXTRINSIC',
  MIXED: 'MIXED'
} as const;

export type MotivationStyle = typeof MotivationStyle[keyof typeof MotivationStyle];

export const RewardType = {
  SOCIAL_RECOGNITION: 'SOCIAL_RECOGNITION',
  PERSONAL_TREAT: 'PERSONAL_TREAT',
  BREAK_TIME: 'BREAK_TIME',
  ENTERTAINMENT: 'ENTERTAINMENT',
  ACHIEVEMENT_BADGE: 'ACHIEVEMENT_BADGE',
  PROGRESS_VISUALIZATION: 'PROGRESS_VISUALIZATION'
} as const;

export type RewardType = typeof RewardType[keyof typeof RewardType];

export const UserAction = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_STARTED: 'TASK_STARTED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_POSTPONED: 'TASK_POSTPONED',
  GOAL_CREATED: 'GOAL_CREATED',
  GOAL_UPDATED: 'GOAL_UPDATED',
  HABIT_LOGGED: 'HABIT_LOGGED',
  PROCRASTINATION_DETECTED: 'PROCRASTINATION_DETECTED',
  INTERVENTION_DISMISSED: 'INTERVENTION_DISMISSED',
  AI_ADVICE_REQUESTED: 'AI_ADVICE_REQUESTED'
} as const;

export type UserAction = typeof UserAction[keyof typeof UserAction];

export const EmotionalState = {
  MOTIVATED: 'MOTIVATED',
  ANXIOUS: 'ANXIOUS',
  OVERWHELMED: 'OVERWHELMED',
  FOCUSED: 'FOCUSED',
  DISTRACTED: 'DISTRACTED',
  CONFIDENT: 'CONFIDENT',
  DOUBTFUL: 'DOUBTFUL',
  ENERGETIC: 'ENERGETIC',
  TIRED: 'TIRED'
} as const;

export type EmotionalState = typeof EmotionalState[keyof typeof EmotionalState];

export const InsightType = {
  PROCRASTINATION_WARNING: 'PROCRASTINATION_WARNING',
  MOTIVATION_BOOST: 'MOTIVATION_BOOST',
  GOAL_ADJUSTMENT: 'GOAL_ADJUSTMENT',
  HABIT_SUGGESTION: 'HABIT_SUGGESTION',
  PROGRESS_CELEBRATION: 'PROGRESS_CELEBRATION',
  PATTERN_RECOGNITION: 'PATTERN_RECOGNITION',
  ENERGY_OPTIMIZATION: 'ENERGY_OPTIMIZATION'
} as const;

export type InsightType = typeof InsightType[keyof typeof InsightType];

// API Request/Response Types
export interface CreateLifeGoalRequest {
  title: string;
  description?: string;
  category: string;
  timeframe: string;
  importance: number;
  difficulty: number;
  targetDate?: string;
}

// Alias for backward compatibility
export type LifeGoalRequest = CreateLifeGoalRequest;

export interface UpdateLifeGoalRequest extends Partial<CreateLifeGoalRequest> {
  status?: string;
  progressPercent?: number;
}

export interface CreateHabitRequest {
  title: string;
  description?: string;
  frequency: string;
  targetCount: number;
  difficulty: number;
  energyRequired: string;
}

export interface LogHabitRequest {
  habitId: string;
  completed: boolean;
  notes?: string;
  mood?: number;
  energy?: number;
}
