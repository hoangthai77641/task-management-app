import React, { useState, useEffect } from 'react';
import { GoalCategory, Frequency } from '../../types/LifeGoal';

interface AnalyticsData {
  productivity: {
    tasksCompleted: number;
    tasksCompletedLastWeek: number;
    averageCompletionTime: number;
    procrastinationRate: number;
    peakProductivityHours: number[];
  };
  goals: {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    goalsByCategory: Record<GoalCategory, number>;
    averageGoalCompletionTime: number;
  };
  habits: {
    totalHabits: number;
    activeHabits: number;
    averageStreak: number;
    longestStreak: number;
    habitCompletionRate: number;
    habitsByFrequency: Record<Frequency, number>;
  };
  timeTracking: {
    totalTimeSpent: number;
    averageDailyTime: number;
    timeByCategory: Record<string, number>;
    mostProductiveDays: string[];
  };
  insights: {
    topStrengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
    motivationalMessage: string;
  };
}

const ProgressAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockData: AnalyticsData = {
        productivity: {
          tasksCompleted: 127,
          tasksCompletedLastWeek: 23,
          averageCompletionTime: 45, // minutes
          procrastinationRate: 0.15, // 15%
          peakProductivityHours: [9, 10, 14, 15]
        },
        goals: {
          totalGoals: 12,
          completedGoals: 8,
          inProgressGoals: 4,
          goalsByCategory: {
            [GoalCategory.HEALTH_FITNESS]: 3,
            [GoalCategory.CAREER_PROFESSIONAL]: 4,
            [GoalCategory.EDUCATION_LEARNING]: 2,
            [GoalCategory.PERSONAL_DEVELOPMENT]: 2,
            [GoalCategory.FINANCIAL]: 1,
            [GoalCategory.RELATIONSHIPS_SOCIAL]: 0,
            [GoalCategory.HOBBIES_INTERESTS]: 0,
            [GoalCategory.TRAVEL_ADVENTURE]: 0,
            [GoalCategory.FAMILY]: 0,
            [GoalCategory.SPIRITUAL_MINDFULNESS]: 0
          },
          averageGoalCompletionTime: 45 // days
        },
        habits: {
          totalHabits: 6,
          activeHabits: 5,
          averageStreak: 12,
          longestStreak: 25,
          habitCompletionRate: 0.78, // 78%
          habitsByFrequency: {
            [Frequency.DAILY]: 4,
            [Frequency.WEEKLY]: 1,
            [Frequency.MONTHLY]: 1,
            [Frequency.CUSTOM]: 0
          }
        },
        timeTracking: {
          totalTimeSpent: 2340, // minutes
          averageDailyTime: 78, // minutes
          timeByCategory: {
            'Work': 45,
            'Health': 20,
            'Learning': 15,
            'Personal': 20
          },
          mostProductiveDays: ['Monday', 'Tuesday', 'Thursday']
        },
        insights: {
          topStrengths: [
            'Consistent habit tracking',
            'Strong goal completion rate',
            'Good morning productivity'
          ],
          areasForImprovement: [
            'Reduce procrastination on complex tasks',
            'Improve afternoon focus',
            'Better time estimation'
          ],
          recommendations: [
            'Schedule difficult tasks during peak hours (9-10 AM)',
            'Use Pomodoro technique for better focus',
            'Set smaller milestones for large goals',
            'Take breaks during afternoon productivity dips'
          ],
          motivationalMessage: "You're making excellent progress! Your consistency is paying off. Keep building on your strengths while working on those improvement areas."
        }
      };
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCategoryIcon = (category: GoalCategory) => {
    const icons = {
      [GoalCategory.HEALTH_FITNESS]: '💪',
      [GoalCategory.CAREER_PROFESSIONAL]: '💼',
      [GoalCategory.EDUCATION_LEARNING]: '📚',
      [GoalCategory.PERSONAL_DEVELOPMENT]: '🌱',
      [GoalCategory.FINANCIAL]: '💰',
      [GoalCategory.RELATIONSHIPS_SOCIAL]: '👥',
      [GoalCategory.HOBBIES_INTERESTS]: '🎨',
      [GoalCategory.TRAVEL_ADVENTURE]: '✈️',
      [GoalCategory.FAMILY]: '👨‍👩‍👧‍👦',
      [GoalCategory.SPIRITUAL_MINDFULNESS]: '🧘'
    };
    return icons[category];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Progress Analytics</h1>
            <p className="text-gray-600 mt-2">Insights into your productivity and growth</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Tasks Completed</p>
              <p className="text-3xl font-bold">{analyticsData.productivity.tasksCompleted}</p>
              <p className="text-sm text-blue-100">+{analyticsData.productivity.tasksCompletedLastWeek} this week</p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Goal Success Rate</p>
              <p className="text-3xl font-bold">
                {getCompletionRate(analyticsData.goals.completedGoals, analyticsData.goals.totalGoals)}%
              </p>
              <p className="text-sm text-green-100">{analyticsData.goals.completedGoals}/{analyticsData.goals.totalGoals} goals</p>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Habit Completion</p>
              <p className="text-3xl font-bold">{Math.round(analyticsData.habits.habitCompletionRate * 100)}%</p>
              <p className="text-sm text-purple-100">Avg streak: {analyticsData.habits.averageStreak} days</p>
            </div>
            <div className="text-4xl opacity-80">🔄</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Procrastination Rate</p>
              <p className="text-3xl font-bold">{Math.round(analyticsData.productivity.procrastinationRate * 100)}%</p>
              <p className="text-sm text-orange-100">Lower is better</p>
            </div>
            <div className="text-4xl opacity-80">⏰</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Goals by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Goals by Category</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.goals.goalsByCategory)
              .filter(([_, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getCategoryIcon(category as GoalCategory)}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(analyticsData.goals.goalsByCategory))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Time Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.timeTracking.timeByCategory).map(([category, percentage]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total time tracked:</span>
              <span className="font-semibold">{formatTime(analyticsData.timeTracking.totalTimeSpent)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Daily average:</span>
              <span className="font-semibold">{formatTime(analyticsData.timeTracking.averageDailyTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌟 Peak Productivity Hours</h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i;
              const isPeak = analyticsData.productivity.peakProductivityHours.includes(hour);
              return (
                <div
                  key={hour}
                  className={`p-2 text-center text-xs rounded ${
                    isPeak 
                      ? 'bg-yellow-100 text-yellow-800 font-semibold' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Your most productive hours are highlighted. Consider scheduling important tasks during these times.
          </p>
        </div>

        {/* Habit Frequency */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Habit Frequency Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.habits.habitsByFrequency)
              .filter(([_, count]) => count > 0)
              .map(([frequency, count]) => (
                <div key={frequency} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {frequency.charAt(0) + frequency.slice(1).toLowerCase()}
                  </span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.habits.totalHabits) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <span className="text-indigo-600 text-2xl mr-4">🤖</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">AI-Powered Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-indigo-700 mb-2">💪 Your Top Strengths</h4>
                <ul className="space-y-1">
                  {analyticsData.insights.topStrengths.map((strength, index) => (
                    <li key={index} className="text-sm text-indigo-600 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-indigo-700 mb-2">🎯 Areas for Improvement</h4>
                <ul className="space-y-1">
                  {analyticsData.insights.areasForImprovement.map((area, index) => (
                    <li key={index} className="text-sm text-indigo-600 flex items-center">
                      <span className="text-orange-500 mr-2">→</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-indigo-700 mb-2">💡 Personalized Recommendations</h4>
              <ul className="space-y-1">
                {analyticsData.insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-indigo-600 flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
              <p className="text-sm text-indigo-800 font-medium">
                💬 {analyticsData.insights.motivationalMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Export & Share</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📊 Export PDF Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📈 Export CSV Data
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            📱 Share Progress
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            📧 Email Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
