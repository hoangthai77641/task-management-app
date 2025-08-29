import React, { useState, useEffect } from 'react';
import type { CreateTaskRequest } from '../../types/Task';
import { tasksAPI } from '../../services/api';
import QuickTaskPresets from './QuickTaskPresets';
import TimePickerComponent from './TimePickerComponent';

interface TaskFormProps {
  onTaskCreated: (task: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [deadline, setDeadline] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-calculate duration when deadline changes
  useEffect(() => {
    if (deadline) {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));
      
      if (diffMinutes > 0 && diffMinutes <= 1440) { // Max 24 hours
        setEstimatedDuration(diffMinutes);
      }
    }
  }, [deadline]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const taskData: CreateTaskRequest = {
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
      estimatedDuration,
      deadline: deadline || undefined,
      reminderEnabled,
    };

    // Store form data for offline mode
    (window as any).lastTaskFormData = {
      estimatedDuration: estimatedDuration > 0 ? estimatedDuration : null,
      deadline: deadline || null
    };

    try {
      const newTask = await tasksAPI.createTask(taskData);
      onTaskCreated(newTask);
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      setEstimatedDuration(60);
      setDeadline('');
      setReminderEnabled(true);
      setShowAdvanced(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter task description (optional)"
          />
        </div>

        {/* Quick Presets */}
        <QuickTaskPresets 
          onPresetSelect={(preset) => {
            setEstimatedDuration(preset.estimatedDuration);
            setDeadline(preset.deadline.toISOString().slice(0, 16));
          }}
        />

        {/* Simple Mode - Always show basic fields */}
        {!showAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                  ⏱️ Duration (minutes)
                  {deadline && (
                    <span className="text-xs text-green-600 ml-2">
                      (Auto-calculated from deadline)
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  id="estimatedDuration"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  min="1"
                  max="1440"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="60"
                />
                {deadline && (
                  <div className="text-xs text-gray-500 mt-1">
                    Time until deadline: {estimatedDuration} minutes
                  </div>
                )}
              </div>
              
              <TimePickerComponent
                label="🎯 Deadline"
                value={deadline}
                onChange={setDeadline}
              />
            </div>
          </div>
        )}

        {/* Advanced Options Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showAdvanced ? '📁 Hide Advanced Options' : '⚙️ Show Advanced Options'}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="reminderEnabled"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="reminderEnabled" className="ml-2 block text-sm text-gray-900">
                Enable progress reminders and notifications
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
