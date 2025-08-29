import React, { useState, useEffect } from 'react';
import type { Task, NotificationSettings } from '../../types/Task';
import { tasksAPI } from '../../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskTimer from '../progress/TaskTimer';
import NotificationSystem from '../progress/NotificationSystem';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    voiceEnabled: true,
    reminderIntervals: [75, 50, 25, 10]
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await tasksAPI.getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleProgressUpdate = async (taskId: string, progress: number) => {
    try {
      const updatedTask = await tasksAPI.updateTask(taskId, { progressPercent: progress });
      handleTaskUpdated(updatedTask);
    } catch (err) {
      console.error('Failed to update task progress:', err);
    }
  };

  const handleTaskStart = async (taskId: string) => {
    try {
      const updatedTask = await tasksAPI.updateTask(taskId, { 
        startedAt: new Date().toISOString() 
      });
      handleTaskUpdated(updatedTask);
    } catch (err) {
      console.error('Failed to start task:', err);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const updatedTask = await tasksAPI.updateTask(taskId, { 
        completed: true,
        completedAt: new Date().toISOString(),
        progressPercent: 100
      });
      handleTaskUpdated(updatedTask);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const activeTimerTasks = pendingTasks.filter(task => task.deadline && task.estimatedDuration);
  const regularTasks = pendingTasks.filter(task => !task.deadline || !task.estimatedDuration);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🔔 Notifications
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showNotificationSettings && (
        <div className="mb-8">
          <NotificationSystem
            settings={notificationSettings}
            onSettingsChange={setNotificationSettings}
          />
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Active Timer Tasks */}
      {activeTimerTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Active Progress Tracking ({activeTimerTasks.length})
          </h2>
          <div className="space-y-4">
            {activeTimerTasks.map(task => (
              <TaskTimer
                key={task.id}
                task={task}
                onProgressUpdate={handleProgressUpdate}
                onTaskStart={handleTaskStart}
                onTaskComplete={handleTaskComplete}
                notificationSettings={notificationSettings}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Regular Tasks ({regularTasks.length})
        </h2>
        {regularTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No regular tasks. All tasks have progress tracking! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ✅ Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        </div>
      )}

      {pendingTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">All tasks completed!</h3>
          <p>Great job! You're staying productive.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
