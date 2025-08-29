import React, { useState } from 'react';
import { type Habit, Frequency, EnergyLevel, type CreateHabitRequest } from '../../types/LifeGoal';

interface HabitFormProps {
  onSubmit: (habit: CreateHabitRequest) => void;
  onCancel: () => void;
  initialData?: Partial<Habit>;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<CreateHabitRequest>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    frequency: initialData?.frequency || Frequency.DAILY,
    targetCount: initialData?.targetCount || 1,
    difficulty: initialData?.difficulty || 5,
    energyRequired: initialData?.energyRequired || EnergyLevel.MEDIUM
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Habit title is required';
    }

    if (formData.targetCount < 1) {
      newErrors.targetCount = 'Target count must be at least 1';
    }

    if (formData.difficulty < 1 || formData.difficulty > 10) {
      newErrors.difficulty = 'Difficulty must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateHabitRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const frequencyOptions = [
    { value: Frequency.DAILY, label: 'Daily', icon: '📅' },
    { value: Frequency.WEEKLY, label: 'Weekly', icon: '📆' },
    { value: Frequency.MONTHLY, label: 'Monthly', icon: '🗓️' },
    { value: Frequency.CUSTOM, label: 'Custom', icon: '⚙️' }
  ];

  const energyOptions = [
    { value: EnergyLevel.VERY_LOW, label: 'Very Low', icon: '🪫', color: 'text-gray-500' },
    { value: EnergyLevel.LOW, label: 'Low', icon: '🔋', color: 'text-blue-500' },
    { value: EnergyLevel.MEDIUM, label: 'Medium', icon: '🔋', color: 'text-green-500' },
    { value: EnergyLevel.HIGH, label: 'High', icon: '🔋', color: 'text-yellow-500' },
    { value: EnergyLevel.VERY_HIGH, label: 'Very High', icon: '⚡', color: 'text-red-500' }
  ];

  const difficultyLabels = [
    'Very Easy', 'Easy', 'Quite Easy', 'Manageable', 'Moderate',
    'Challenging', 'Difficult', 'Hard', 'Very Hard', 'Extremely Hard'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? '✏️ Edit Habit' : '➕ Create New Habit'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habit Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Drink 8 glasses of water, Exercise for 30 minutes"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Why is this habit important to you? How will you do it?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('frequency', option.value)}
                className={`p-3 border rounded-lg text-left transition-all ${
                  formData.frequency === option.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Count per {formData.frequency.toLowerCase().replace('_', ' ')} *
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="100"
              value={formData.targetCount}
              onChange={(e) => handleInputChange('targetCount', parseInt(e.target.value) || 1)}
              className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.targetCount ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600">
              times per {formData.frequency.toLowerCase().replace('_', ' ')}
            </span>
          </div>
          {errors.targetCount && (
            <p className="mt-1 text-sm text-red-600">{errors.targetCount}</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level: {formData.difficulty}/10 - {difficultyLabels[formData.difficulty - 1]}
          </label>
          <div className="px-3">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Very Easy)</span>
              <span>5 (Moderate)</span>
              <span>10 (Extremely Hard)</span>
            </div>
          </div>
          {errors.difficulty && (
            <p className="mt-1 text-sm text-red-600">{errors.difficulty}</p>
          )}
        </div>

        {/* Energy Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Energy Required *
          </label>
          <div className="grid grid-cols-5 gap-2">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('energyRequired', option.value)}
                className={`p-2 border rounded-lg text-center transition-all ${
                  formData.energyRequired === option.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className={`text-lg ${option.color}`}>{option.icon}</div>
                <div className="text-xs font-medium mt-1">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-purple-600 text-xl mr-3">🤖</span>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">AI Habit Coach Suggestions</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Start small - aim for 1-2 minutes initially to build momentum</li>
                <li>• Stack this habit with an existing routine (habit stacking)</li>
                <li>• Set up environmental cues to trigger the habit</li>
                <li>• Plan for obstacles and have backup strategies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {initialData ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
