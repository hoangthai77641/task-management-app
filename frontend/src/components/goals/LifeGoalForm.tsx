import React, { useState } from 'react';
import {type CreateLifeGoalRequest, GoalCategory, TimeFrame,} from '../../types/LifeGoal';

interface LifeGoalFormProps {
  onGoalCreated: (goal: CreateLifeGoalRequest) => void;
  onCancel: () => void;
}

const LifeGoalForm: React.FC<LifeGoalFormProps> = ({ onGoalCreated, onCancel }) => {
  const [formData, setFormData] = useState<CreateLifeGoalRequest>({
    title: '',
    description: '',
    category: GoalCategory.PERSONAL_DEVELOPMENT,
    timeframe: TimeFrame.MEDIUM_TERM,
    importance: 5,
    difficulty: 5,
    targetDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onGoalCreated({
      ...formData,
      description: formData.description || undefined,
      targetDate: formData.targetDate || undefined
    });
  };

  const categoryOptions = [
    { value: GoalCategory.HEALTH_FITNESS, label: '🏃‍♂️ Health & Fitness', icon: '💪' },
    { value: GoalCategory.CAREER_PROFESSIONAL, label: '💼 Career & Professional', icon: '🚀' },
    { value: GoalCategory.EDUCATION_LEARNING, label: '📚 Education & Learning', icon: '🧠' },
    { value: GoalCategory.RELATIONSHIPS_SOCIAL, label: '👥 Relationships & Social', icon: '❤️' },
    { value: GoalCategory.FINANCIAL, label: '💰 Financial', icon: '💸' },
    { value: GoalCategory.PERSONAL_DEVELOPMENT, label: '🌱 Personal Development', icon: '✨' },
    { value: GoalCategory.HOBBIES_INTERESTS, label: '🎨 Hobbies & Interests', icon: '🎯' },
    { value: GoalCategory.TRAVEL_ADVENTURE, label: '✈️ Travel & Adventure', icon: '🌍' },
    { value: GoalCategory.FAMILY, label: '👨‍👩‍👧‍👦 Family', icon: '🏠' },
    { value: GoalCategory.SPIRITUAL_MINDFULNESS, label: '🧘‍♀️ Spiritual & Mindfulness', icon: '☯️' }
  ];

  const timeframeOptions = [
    { value: TimeFrame.SHORT_TERM, label: 'Short-term (1-3 months)', description: 'Quick wins and immediate goals' },
    { value: TimeFrame.MEDIUM_TERM, label: 'Medium-term (3-12 months)', description: 'Significant achievements' },
    { value: TimeFrame.LONG_TERM, label: 'Long-term (1-3 years)', description: 'Major life changes' },
    { value: TimeFrame.LIFE_LONG, label: 'Life-long (3+ years)', description: 'Legacy and life purpose' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎯 Create Life Goal</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Goal Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Learn Spanish fluently, Run a marathon, Start my own business"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            📝 Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe your goal in detail, why it's important to you, and what success looks like..."
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            📂 Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⏰ Timeframe
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeframeOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.timeframe === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="timeframe"
                  value={option.value}
                  checked={formData.timeframe === option.value}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as TimeFrame })}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Importance and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-2">
              ⭐ Importance: {formData.importance}/10
            </label>
            <input
              type="range"
              id="importance"
              min="1"
              max="10"
              value={formData.importance}
              onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              🎚️ Difficulty: {formData.difficulty}/10
            </label>
            <input
              type="range"
              id="difficulty"
              min="1"
              max="10"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Easy</span>
              <span>Challenging</span>
            </div>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
            📅 Target Date (Optional)
          </label>
          <input
            type="date"
            id="targetDate"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* AI Suggestion Box */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-purple-600 mr-3">🤖</div>
            <div>
              <h4 className="font-medium text-purple-800 mb-1">AI Coach Suggestion</h4>
              <p className="text-sm text-purple-700">
                Based on your goal category and timeframe, I recommend breaking this down into 3-5 smaller milestones. 
                Would you like me to suggest some milestones after you create this goal?
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            🚀 Create Life Goal
          </button>
        </div>
      </form>
    </div>
  );
};

export default LifeGoalForm;
