import React from 'react';
import {GoalCategory, TimeFrame, GoalStatus, type LifeGoal} from '../../types/LifeGoal';

interface LifeGoalCardProps {
  goal: LifeGoal;
  onEdit: (goal: LifeGoal) => void;
  onDelete: (goalId: string) => void;
  onAddMilestone: (goalId: string) => void;
  onViewDetails: (goal: LifeGoal) => void;
}

const LifeGoalCard: React.FC<LifeGoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onAddMilestone,
  onViewDetails
}) => {
  const getCategoryIcon = (category: GoalCategory) => {
    const icons = {
      [GoalCategory.HEALTH_FITNESS]: '💪',
      [GoalCategory.CAREER_PROFESSIONAL]: '🚀',
      [GoalCategory.EDUCATION_LEARNING]: '🧠',
      [GoalCategory.RELATIONSHIPS_SOCIAL]: '❤️',
      [GoalCategory.FINANCIAL]: '💸',
      [GoalCategory.PERSONAL_DEVELOPMENT]: '✨',
      [GoalCategory.HOBBIES_INTERESTS]: '🎯',
      [GoalCategory.TRAVEL_ADVENTURE]: '🌍',
      [GoalCategory.FAMILY]: '🏠',
      [GoalCategory.SPIRITUAL_MINDFULNESS]: '☯️'
    };
    return icons[category] || '🎯';
  };

  const getTimeframeColor = (timeframe: TimeFrame) => {
    const colors = {
      [TimeFrame.SHORT_TERM]: 'bg-green-100 text-green-800',
      [TimeFrame.MEDIUM_TERM]: 'bg-blue-100 text-blue-800',
      [TimeFrame.LONG_TERM]: 'bg-purple-100 text-purple-800',
      [TimeFrame.LIFE_LONG]: 'bg-indigo-100 text-indigo-800'
    };
    return colors[timeframe] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: GoalStatus) => {
    const colors = {
      [GoalStatus.ACTIVE]: 'bg-green-500',
      [GoalStatus.PAUSED]: 'bg-yellow-500',
      [GoalStatus.COMPLETED]: 'bg-blue-500',
      [GoalStatus.CANCELLED]: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTimeframe = (timeframe: TimeFrame) => {
    const labels = {
      [TimeFrame.SHORT_TERM]: 'Short-term',
      [TimeFrame.MEDIUM_TERM]: 'Medium-term',
      [TimeFrame.LONG_TERM]: 'Long-term',
      [TimeFrame.LIFE_LONG]: 'Life-long'
    };
    return labels[timeframe];
  };

  const getDaysUntilTarget = () => {
    if (!goal.targetDate) return null;
    const target = new Date(goal.targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilTarget();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getCategoryIcon(goal.category as GoalCategory)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(goal.timeframe as TimeFrame)}`}>
                  {formatTimeframe(goal.timeframe as TimeFrame)}
                </span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(goal.status as GoalStatus)}`} />
              </div>
            </div>
          </div>
          
          {/* Actions Menu */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(goal)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit goal"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete goal"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{goal.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(goal.progressPercent)}`}
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-indigo-600">⭐ {goal.importance}</div>
            <div className="text-xs text-gray-500">Importance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">🎚️ {goal.difficulty}</div>
            <div className="text-xs text-gray-500">Difficulty</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">📋 {goal.tasks?.length || 0}</div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
        </div>

        {/* Target Date */}
        {goal.targetDate && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">🎯 Target Date:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(goal.targetDate).toLocaleDateString()}
              </span>
            </div>
            {daysLeft !== null && (
              <div className="mt-1 text-xs text-center">
                {daysLeft > 0 ? (
                  <span className={`${daysLeft <= 30 ? 'text-red-600' : 'text-green-600'}`}>
                    {daysLeft} days remaining
                  </span>
                ) : daysLeft === 0 ? (
                  <span className="text-red-600 font-bold">Due today!</span>
                ) : (
                  <span className="text-red-600 font-bold">{Math.abs(daysLeft)} days overdue</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Insights Preview */}
        {goal.aiInsights && goal.aiInsights.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
            <div className="flex items-center mb-1">
              <span className="text-purple-600 mr-2">🤖</span>
              <span className="text-sm font-medium text-purple-800">AI Insight</span>
            </div>
            <p className="text-xs text-purple-700 line-clamp-2">
              {goal.aiInsights[0].content}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(goal)}
            className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            📊 View Details
          </button>
          <button
            onClick={() => onAddMilestone(goal.id)}
            className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🎯 Add Milestone
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeGoalCard;
