import React, { useState } from 'react';
import { type Habit, type HabitLog, Frequency, EnergyLevel } from '../../types/LifeGoal';

interface HabitCardProps {
  habit: Habit;
  onLogHabit: (habitId: string, completed: boolean, notes?: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  recentLogs: HabitLog[];
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onLogHabit,
  onEdit,
  onDelete,
  recentLogs
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [logNotes, setLogNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getFrequencyIcon = (frequency: Frequency) => {
    const icons = {
      [Frequency.DAILY]: '📅',
      [Frequency.WEEKLY]: '📆',
      [Frequency.MONTHLY]: '🗓️',
      [Frequency.CUSTOM]: '⚙️'
    };
    return icons[frequency];
  };

  const getEnergyIcon = (energy: EnergyLevel) => {
    const icons = {
      [EnergyLevel.VERY_LOW]: '🪫',
      [EnergyLevel.LOW]: '🔋',
      [EnergyLevel.MEDIUM]: '🔋',
      [EnergyLevel.HIGH]: '🔋',
      [EnergyLevel.VERY_HIGH]: '⚡'
    };
    return icons[energy];
  };

  const getEnergyColor = (energy: EnergyLevel) => {
    const colors = {
      [EnergyLevel.VERY_LOW]: 'text-gray-500',
      [EnergyLevel.LOW]: 'text-blue-500',
      [EnergyLevel.MEDIUM]: 'text-green-500',
      [EnergyLevel.HIGH]: 'text-yellow-500',
      [EnergyLevel.VERY_HIGH]: 'text-red-500'
    };
    return colors[energy];
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-100';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-600';
    if (streak < 7) return 'text-blue-600';
    if (streak < 30) return 'text-green-600';
    if (streak < 100) return 'text-purple-600';
    return 'text-yellow-600';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '😴';
    if (streak < 7) return '🌱';
    if (streak < 30) return '🔥';
    if (streak < 100) return '💪';
    return '🏆';
  };

  const getTodayProgress = () => {
    const today = new Date().toDateString();
    const todayLogs = recentLogs.filter(log => 
      new Date(log.loggedAt).toDateString() === today && log.completed
    );
    return Math.min(todayLogs.length, habit.targetCount);
  };

  const handleLogHabit = (completed: boolean) => {
    onLogHabit(habit.id, completed, logNotes);
    setLogNotes('');
    setShowLogModal(false);
  };

  const todayProgress = getTodayProgress();
  const progressPercentage = (todayProgress / habit.targetCount) * 100;
  const isCompleted = todayProgress >= habit.targetCount;

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md border-l-4 p-6 transition-all hover:shadow-lg ${
        isCompleted ? 'border-green-500 bg-green-50' : 'border-indigo-500'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 mr-2">{habit.title}</h3>
              {isCompleted && <span className="text-green-500 text-xl">✅</span>}
            </div>
            {habit.description && (
              <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(habit)}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Edit habit"
            >
              ✏️
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-600 p-1"
              title="Delete habit"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Today's Progress: {todayProgress}/{habit.targetCount}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Habit Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-lg mr-2">{getFrequencyIcon(habit.frequency as Frequency)}</span>
            <div>
              <div className="text-sm font-medium text-gray-700">Frequency</div>
              <div className="text-xs text-gray-500">
                {habit.frequency.toLowerCase().replace('_', ' ')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className={`text-lg mr-2 ${getEnergyColor(habit.energyRequired as EnergyLevel)}`}>
              {getEnergyIcon(habit.energyRequired as EnergyLevel)}
            </span>
            <div>
              <div className="text-sm font-medium text-gray-700">Energy</div>
              <div className="text-xs text-gray-500">
                {habit.energyRequired.toLowerCase().replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Streaks and Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStreakColor(habit.currentStreak)}`}>
              {habit.currentStreak}
            </div>
            <div className="text-xs text-gray-500">Current Streak</div>
            <div className="text-lg">{getStreakEmoji(habit.currentStreak)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {habit.longestStreak}
            </div>
            <div className="text-xs text-gray-500">Best Streak</div>
            <div className="text-lg">🏅</div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(habit.difficulty)}`}>
              {habit.difficulty}/10
            </div>
            <div className="text-xs text-gray-500 mt-1">Difficulty</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isCompleted ? (
            <>
              <button
                onClick={() => setShowLogModal(true)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                ✅ Mark Done
              </button>
              <button
                onClick={() => handleLogHabit(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ❌ Skip
              </button>
            </>
          ) : (
            <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
              🎉 Completed for today!
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Recent Activity</div>
            <div className="flex space-x-1">
              {recentLogs.slice(0, 7).map((log, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    log.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                  title={`${new Date(log.loggedAt).toLocaleDateString()}: ${log.completed ? 'Completed' : 'Skipped'}`}
                >
                  {log.completed ? '✓' : '×'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Log Habit: {habit.title}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="How did it go? Any observations?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogHabit(true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ✅ Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Habit
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{habit.title}"? This action cannot be undone and will remove all associated logs.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(habit.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitCard;
