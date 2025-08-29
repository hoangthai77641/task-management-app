import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import type { Task } from '../../types/Task';
import TaskForm from './TaskForm';
import AlarmTimer from './AlarmTimer';
import WorkTimer from './WorkTimer';
import TaskItem from './TaskItem';

interface TimerTask {
  id: string;
  title: string;
  description?: string;
  estimatedDuration: number; // minutes
  deadline: string;
  createdAt: string;
  type: 'alarm' | 'work'; // alarm for specific time, work for duration
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  reminderIntervals: number[];
}

const TaskListWithTimer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timerTasks, setTimerTasks] = useState<TimerTask[]>([]);
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
      setError('Backend not available - using offline mode');
      console.log('Backend error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setShowForm(false);
    
    // For offline mode, create timer task if form had deadline and duration
    const formData = (window as any).lastTaskFormData;
    if (formData && formData.deadline && formData.estimatedDuration) {
      const timerType = determineTimerType(formData.deadline, formData.estimatedDuration);
      const timerTask: TimerTask = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        estimatedDuration: formData.estimatedDuration,
        deadline: formData.deadline,
        createdAt: new Date().toISOString(),
        type: timerType
      };
      setTimerTasks([...timerTasks, timerTask]);
      // Clear form data
      delete (window as any).lastTaskFormData;
    } else if (newTask.deadline && newTask.estimatedDuration) {
      // Backend online case
      const timerType = determineTimerType(newTask.deadline, newTask.estimatedDuration);
      const timerTask: TimerTask = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        estimatedDuration: newTask.estimatedDuration,
        deadline: newTask.deadline,
        createdAt: new Date().toISOString(),
        type: timerType
      };
      setTimerTasks([...timerTasks, timerTask]);
    } else {
      // Add to regular tasks
      setTasks([newTask, ...tasks]);
    }
  };

  // Determine timer type based on deadline and duration
  const determineTimerType = (deadline: string, estimatedDuration: number): 'alarm' | 'work' => {
    const deadlineTime = new Date(deadline);
    const now = new Date();
    const timeDiffMinutes = Math.floor((deadlineTime.getTime() - now.getTime()) / (1000 * 60));
    
    // If deadline is set to a specific future time and duration matches closely, it's an alarm
    // If user manually set duration different from auto-calculated, it's work timer
    const isSpecificTime = Math.abs(timeDiffMinutes - estimatedDuration) < 2; // within 2 minutes tolerance
    
    return isSpecificTime ? 'alarm' : 'work';
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTimerTaskComplete = (timerTaskId: string) => {
    setTimerTasks(timerTasks.filter(task => task.id !== timerTaskId));
  };

  const removeTimerTask = (timerTaskId: string) => {
    setTimerTasks(timerTasks.filter(task => task.id !== timerTaskId));
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showNotificationSettings && (
        <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-3">🔔 Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => setNotificationSettings({...notificationSettings, enabled: e.target.checked})}
                className="mr-2"
              />
              Enable notifications
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.soundEnabled}
                onChange={(e) => setNotificationSettings({...notificationSettings, soundEnabled: e.target.checked})}
                className="mr-2"
              />
              Enable sound alerts
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.voiceEnabled}
                onChange={(e) => setNotificationSettings({...notificationSettings, voiceEnabled: e.target.checked})}
                className="mr-2"
              />
              Enable voice announcements
            </label>
          </div>
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

      {/* Timer Tasks */}
      {timerTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Active Progress Tracking ({timerTasks.length})
          </h2>
          <div className="space-y-6">
            {timerTasks.map(timerTask => (
              <div key={timerTask.id} className="relative">
                <button
                  onClick={() => removeTimerTask(timerTask.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                >
                  ×
                </button>
                {timerTask.type === 'alarm' ? (
                  <AlarmTimer
                    task={{
                      id: timerTask.id,
                      title: timerTask.title,
                      deadline: timerTask.deadline
                    }}
                    onComplete={() => handleTimerTaskComplete(timerTask.id)}
                  />
                ) : (
                  <WorkTimer
                    task={{
                      id: timerTask.id,
                      title: timerTask.title,
                      estimatedDuration: timerTask.estimatedDuration
                    }}
                    onComplete={() => handleTimerTaskComplete(timerTask.id)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Regular Tasks ({pendingTasks.length})
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No regular tasks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
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

      {pendingTasks.length === 0 && timerTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">All tasks completed!</h3>
          <p>Great job! You're staying productive.</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn sử dụng:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Alarm Timer:</strong> Đặt giờ cụ thể → báo thức khi đến giờ</li>
          <li>• <strong>Work Timer:</strong> Đặt theo phút → có nút Start/Complete, không có Pause</li>
          <li>• Tasks thường sẽ hiển thị trong Regular Tasks</li>
          <li>• Timer có notifications, âm thanh và voice alerts</li>
          <li>• Cho phép notifications trong browser để nhận thông báo</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskListWithTimer;
