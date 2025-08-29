import {UserAction, type BehaviorData} from '../types/LifeGoal';
import type {Task} from "../types/Task.ts";

export interface ProcrastinationSignal {
  type: 'pattern' | 'behavioral' | 'temporal' | 'emotional';
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
  description: string;
  suggestedIntervention: string;
  triggers: string[];
}

export interface ProcrastinationAnalysis {
  riskScore: number; // 0-1
  signals: ProcrastinationSignal[];
  recommendations: string[];
  interventionNeeded: boolean;
}

export class ProcrastinationDetector {
  private behaviorHistory: BehaviorData[] = [];
  private taskHistory: Task[] = [];
  private userPatterns: Map<string, number> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Common procrastination patterns with weights
    this.userPatterns.set('task_postponement_frequency', 0);
    this.userPatterns.set('deadline_pressure_tendency', 0);
    this.userPatterns.set('perfectionism_score', 0);
    this.userPatterns.set('overwhelm_frequency', 0);
    this.userPatterns.set('distraction_susceptibility', 0);
    this.userPatterns.set('energy_mismatch_frequency', 0);
  }

  public addBehaviorData(data: BehaviorData) {
    this.behaviorHistory.push(data);
    this.updatePatterns(data);
    
    // Keep only last 100 behavior entries for performance
    if (this.behaviorHistory.length > 100) {
      this.behaviorHistory = this.behaviorHistory.slice(-100);
    }
  }

  public addTaskData(task: Task) {
    this.taskHistory.push(task);
    
    // Keep only last 50 tasks for analysis
    if (this.taskHistory.length > 50) {
      this.taskHistory = this.taskHistory.slice(-50);
    }
  }

  private updatePatterns(data: BehaviorData) {
    const now = new Date();
    const dataTime = new Date(data.timestamp);
    const hoursSince = (now.getTime() - dataTime.getTime()) / (1000 * 60 * 60);

    // Only consider recent behavior (last 24 hours for pattern updates)
    if (hoursSince > 24) return;

    switch (data.action) {
      case UserAction.TASK_POSTPONED:
        this.incrementPattern('task_postponement_frequency', 0.1);
        break;
      case UserAction.PROCRASTINATION_DETECTED:
        this.incrementPattern('deadline_pressure_tendency', 0.2);
        break;
      case UserAction.INTERVENTION_DISMISSED:
        this.incrementPattern('distraction_susceptibility', 0.15);
        break;
    }

    // Emotional state patterns
    if (data.emotionalState === 'OVERWHELMED') {
      this.incrementPattern('overwhelm_frequency', 0.1);
    } else if (data.emotionalState === 'ANXIOUS') {
      this.incrementPattern('perfectionism_score', 0.05);
    }
  }

  private incrementPattern(pattern: string, increment: number) {
    const current = this.userPatterns.get(pattern) || 0;
    this.userPatterns.set(pattern, Math.min(1, current + increment));
  }

  public analyzeProcrastinationRisk(currentTask?: Task, currentMood?: string): ProcrastinationAnalysis {
    const signals: ProcrastinationSignal[] = [];
    let riskScore = 0;

    // 1. Temporal Pattern Analysis
    const temporalSignals = this.analyzeTemporalPatterns(currentTask);
    signals.push(...temporalSignals);

    // 2. Behavioral Pattern Analysis
    const behavioralSignals = this.analyzeBehavioralPatterns();
    signals.push(...behavioralSignals);

    // 3. Emotional State Analysis
    if (currentMood) {
      const emotionalSignals = this.analyzeEmotionalState(currentMood);
      signals.push(...emotionalSignals);
    }

    // 4. Task Characteristics Analysis
    if (currentTask) {
      const taskSignals = this.analyzeTaskCharacteristics(currentTask);
      signals.push(...taskSignals);
    }

    // Calculate overall risk score
    riskScore = this.calculateRiskScore(signals);

    // Generate recommendations
    const recommendations = this.generateRecommendations(signals, riskScore);

    return {
      riskScore,
      signals,
      recommendations,
      interventionNeeded: riskScore > 0.6
    };
  }

  private analyzeTemporalPatterns(currentTask?: Task): ProcrastinationSignal[] {
    const signals: ProcrastinationSignal[] = [];
    const now = new Date();

    // Check for deadline pressure
    if (currentTask?.deadline) {
      const deadline = new Date(currentTask.deadline);
      const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilDeadline < 24 && currentTask.progressPercent < 50) {
        signals.push({
          type: 'temporal',
          severity: 'high',
          confidence: 0.8,
          description: 'Task deadline approaching with low progress',
          suggestedIntervention: 'Break task into smaller chunks and start immediately',
          triggers: ['deadline_pressure', 'low_progress']
        });
      }
    }

    // Check for time-of-day patterns
    const currentHour = now.getHours();
    const recentPostponements = this.behaviorHistory
      .filter(b => b.action === UserAction.TASK_POSTPONED)
      .filter(b => {
        const behaviorHour = new Date(b.timestamp).getHours();
        return Math.abs(behaviorHour - currentHour) <= 2;
      });

    if (recentPostponements.length >= 2) {
      signals.push({
        type: 'temporal',
        severity: 'medium',
        confidence: 0.6,
        description: 'Frequent postponements during this time of day',
        suggestedIntervention: 'Consider scheduling tasks at your peak energy hours',
        triggers: ['time_pattern', 'energy_mismatch']
      });
    }

    return signals;
  }

  private analyzeBehavioralPatterns(): ProcrastinationSignal[] {
    const signals: ProcrastinationSignal[] = [];

    // Check postponement frequency
    const postponementScore = this.userPatterns.get('task_postponement_frequency') || 0;
    if (postponementScore > 0.5) {
      signals.push({
        type: 'behavioral',
        severity: postponementScore > 0.7 ? 'high' : 'medium',
        confidence: postponementScore,
        description: 'High frequency of task postponements detected',
        suggestedIntervention: 'Try the 2-minute rule: if it takes less than 2 minutes, do it now',
        triggers: ['postponement_pattern']
      });
    }

    // Check perfectionism patterns
    const perfectionismScore = this.userPatterns.get('perfectionism_score') || 0;
    if (perfectionismScore > 0.4) {
      signals.push({
        type: 'behavioral',
        severity: 'medium',
        confidence: perfectionismScore,
        description: 'Perfectionism tendencies may be causing delays',
        suggestedIntervention: 'Set "good enough" standards and focus on progress over perfection',
        triggers: ['perfectionism', 'analysis_paralysis']
      });
    }

    // Check overwhelm patterns
    const overwhelmScore = this.userPatterns.get('overwhelm_frequency') || 0;
    if (overwhelmScore > 0.3) {
      signals.push({
        type: 'behavioral',
        severity: 'medium',
        confidence: overwhelmScore,
        description: 'Frequent overwhelm episodes detected',
        suggestedIntervention: 'Break large tasks into smaller, manageable pieces',
        triggers: ['overwhelm', 'task_complexity']
      });
    }

    return signals;
  }

  private analyzeEmotionalState(mood: string): ProcrastinationSignal[] {
    const signals: ProcrastinationSignal[] = [];

    const riskStates: Record<string, { severity: 'low' | 'medium' | 'high'; confidence: number; intervention: string }> = {
      'OVERWHELMED': {
        severity: 'high',
        confidence: 0.8,
        intervention: 'Take 5 deep breaths and list just 3 priority tasks'
      },
      'ANXIOUS': {
        severity: 'medium',
        confidence: 0.7,
        intervention: 'Start with the easiest task to build momentum'
      },
      'DISTRACTED': {
        severity: 'medium',
        confidence: 0.6,
        intervention: 'Remove distractions and use a focus timer'
      },
      'TIRED': {
        severity: 'low',
        confidence: 0.5,
        intervention: 'Consider taking a short break or doing lighter tasks'
      },
      'DOUBTFUL': {
        severity: 'medium',
        confidence: 0.6,
        intervention: 'Review your why and past successes for motivation'
      }
    };

    const riskState = riskStates[mood];
    if (riskState) {
      signals.push({
        type: 'emotional',
        severity: riskState.severity,
        confidence: riskState.confidence,
        description: `Current emotional state (${mood}) increases procrastination risk`,
        suggestedIntervention: riskState.intervention,
        triggers: ['emotional_state', mood.toLowerCase()]
      });
    }

    return signals;
  }

  private analyzeTaskCharacteristics(task: Task): ProcrastinationSignal[] {
    const signals: ProcrastinationSignal[] = [];

    // High difficulty tasks
    if (task.difficultyLevel && task.difficultyLevel > 7) {
      signals.push({
        type: 'pattern',
        severity: 'medium',
        confidence: 0.6,
        description: 'High-difficulty task may trigger avoidance behavior',
        suggestedIntervention: 'Break this complex task into smaller, easier steps',
        triggers: ['high_difficulty', 'task_complexity']
      });
    }

    // Vague or unclear tasks
    if (!task.description || task.description.length < 20) {
      signals.push({
        type: 'pattern',
        severity: 'low',
        confidence: 0.4,
        description: 'Unclear task definition may cause procrastination',
        suggestedIntervention: 'Define specific, actionable steps for this task',
        triggers: ['unclear_task', 'lack_of_clarity']
      });
    }

    // High energy requirement vs current energy
    if (task.energyRequired === 'VERY_HIGH' || task.energyRequired === 'HIGH') {
      const currentHour = new Date().getHours();
      // Assume low energy periods: early morning (6-8) and afternoon crash (14-16)
      if ((currentHour >= 6 && currentHour <= 8) || (currentHour >= 14 && currentHour <= 16)) {
        signals.push({
          type: 'pattern',
          severity: 'medium',
          confidence: 0.5,
          description: 'High-energy task during typical low-energy time',
          suggestedIntervention: 'Schedule this task during your peak energy hours',
          triggers: ['energy_mismatch', 'timing_issue']
        });
      }
    }

    return signals;
  }

  private calculateRiskScore(signals: ProcrastinationSignal[]): number {
    if (signals.length === 0) return 0;

    const severityWeights = { low: 0.2, medium: 0.5, high: 0.8 };
    
    let totalScore = 0;
    let totalWeight = 0;

    signals.forEach(signal => {
      const weight = severityWeights[signal.severity];
      totalScore += signal.confidence * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.min(1, totalScore / totalWeight) : 0;
  }

  private generateRecommendations(signals: ProcrastinationSignal[], riskScore: number): string[] {
    const recommendations: string[] = [];

    if (riskScore > 0.7) {
      recommendations.push('🚨 High procrastination risk detected - take immediate action');
      recommendations.push('🎯 Start with just 2 minutes of work on your most important task');
      recommendations.push('📱 Remove all distractions from your workspace');
    } else if (riskScore > 0.4) {
      recommendations.push('⚠️ Moderate procrastination risk - be proactive');
      recommendations.push('⏰ Use a timer to create urgency and focus');
      recommendations.push('🏆 Set up a small reward for task completion');
    } else {
      recommendations.push('✅ Low procrastination risk - you\'re doing well!');
      recommendations.push('📈 Maintain your current momentum');
    }

    // Add specific recommendations based on signals
    const uniqueInterventions = [...new Set(signals.map(s => s.suggestedIntervention))];
    recommendations.push(...uniqueInterventions.slice(0, 3));

    return recommendations;
  }

  public getPersonalizedIntervention(analysis: ProcrastinationAnalysis): {
    title: string;
    message: string;
    actions: string[];
    urgency: 'low' | 'medium' | 'high';
  } {
    const { riskScore, signals } = analysis;
    const highRiskSignals = signals.filter(s => s.severity === 'high');
    
    if (riskScore > 0.7 || highRiskSignals.length > 0) {
      return {
        title: '🚨 Procrastination Alert!',
        message: 'I notice you might be avoiding this task. That\'s totally normal, but let\'s tackle it together!',
        actions: [
          'Start with just 2 minutes',
          'Break it into tiny steps',
          'Remove one distraction',
          'Ask for help'
        ],
        urgency: 'high'
      };
    } else if (riskScore > 0.4) {
      return {
        title: '⚠️ Gentle Nudge',
        message: 'You\'re at risk of procrastinating. Let\'s prevent that with some quick action!',
        actions: [
          'Set a 15-minute timer',
          'Choose the easiest part first',
          'Clear your workspace',
          'Play focus music'
        ],
        urgency: 'medium'
      };
    } else {
      return {
        title: '💪 Keep Going!',
        message: 'You\'re doing great! Here are some tips to maintain momentum:',
        actions: [
          'Celebrate small wins',
          'Take regular breaks',
          'Track your progress',
          'Stay hydrated'
        ],
        urgency: 'low'
      };
    }
  }

  public exportPatterns(): Record<string, number> {
    return Object.fromEntries(this.userPatterns);
  }

  public importPatterns(patterns: Record<string, number>) {
    Object.entries(patterns).forEach(([key, value]) => {
      this.userPatterns.set(key, value);
    });
  }
}

// Singleton instance
export const procrastinationDetector = new ProcrastinationDetector();
