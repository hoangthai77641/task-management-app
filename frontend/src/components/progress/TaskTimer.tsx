import React, { useState, useEffect, useRef } from 'react';
import type { Task, NotificationSettings } from '../../types/Task';

interface TaskTimerProps {
  task: Task;
  onProgressUpdate: (taskId: string, progress: number) => void;
  onTaskStart: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  notificationSettings: NotificationSettings;
}

const TaskTimer: React.FC<TaskTimerProps> = ({
  task,
  onProgressUpdate,
  onTaskStart,
  onTaskComplete,
  notificationSettings
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastNotificationRef = useRef<number>(0);

  // Initialize audio context for notifications
  useEffect(() => {
    if (notificationSettings.soundEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [notificationSettings.soundEnabled]);

  // Calculate initial time values
  useEffect(() => {
    if (task.deadline && task.estimatedDuration) {
      const deadlineTime = new Date(task.deadline).getTime();
      const now = Date.now();
      const startTime = task.startedAt ? new Date(task.startedAt).getTime() : now;
      
      setTimeRemaining(Math.max(0, deadlineTime - now));
      setTimeElapsed(now - startTime);
      setIsOverdue(now > deadlineTime);
      setIsRunning(!!task.startedAt && !task.completed);
    }
  }, [task]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !task.completed) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deadlineTime = task.deadline ? new Date(task.deadline).getTime() : 0;
        const startTime = task.startedAt ? new Date(task.startedAt).getTime() : now;
        
        const remaining = Math.max(0, deadlineTime - now);
        const elapsed = now - startTime;
        
        setTimeRemaining(remaining);
        setTimeElapsed(elapsed);
        setIsOverdue(remaining === 0 && deadlineTime > 0);
        
        // Calculate progress percentage
        if (task.estimatedDuration) {
          const estimatedMs = task.estimatedDuration * 60 * 1000;
          const progressPercent = Math.min(100, Math.max(0, (elapsed / estimatedMs) * 100));
          onProgressUpdate(task.id, Math.round(progressPercent));
          
          // Check for notifications
          checkNotifications(remaining > 0);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, task, onProgressUpdate]);

  const checkNotifications = (hasTimeLeft: boolean) => {
    if (!notificationSettings.enabled) return;
    
    const timeProgress = hasTimeLeft ? (100 - (timeRemaining / (task.estimatedDuration! * 60 * 1000)) * 100) : 100;
    
    for (const interval of notificationSettings.reminderIntervals) {
      if (timeProgress >= interval && lastNotificationRef.current < interval) {
        lastNotificationRef.current = interval;
        triggerNotification(interval, hasTimeLeft);
        break;
      }
    }
  };

  const triggerNotification = (percentage: number, hasTimeLeft: boolean) => {
    // Sound notification
    if (notificationSettings.soundEnabled) {
      playNotificationSound(percentage);
    }
    
    // Voice notification
    if (notificationSettings.voiceEnabled) {
      speakReminder(percentage, hasTimeLeft);
    }
    
    // Browser notification
    if (Notification.permission === 'granted') {
      const message = hasTimeLeft 
        ? `${percentage}% thời gian đã trôi qua cho task "${task.title}"`
        : `Task "${task.title}" đã quá hạn!`;
      
      new Notification('Task Reminder', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const playNotificationSound = (percentage: number) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Different frequencies for different urgency levels
    const frequency = percentage >= 90 ? 800 : percentage >= 75 ? 600 : 400;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  const speakReminder = (percentage: number, hasTimeLeft: boolean) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();
      
      if (!hasTimeLeft) {
        utterance.text = `Cảnh báo! Task ${task.title} đã quá hạn. Hãy hoàn thành ngay!`;
      } else if (percentage >= 90) {
        utterance.text = `Khẩn cấp! Chỉ còn 10% thời gian cho task ${task.title}. Tập trung hoàn thành ngay!`;
      } else if (percentage >= 75) {
        utterance.text = `Chú ý! Đã qua 75% thời gian cho task ${task.title}. Hãy tăng tốc!`;
      } else {
        utterance.text = `Nhắc nhở: Đã qua ${percentage}% thời gian cho task ${task.title}`;
      }
      
      utterance.lang = 'vi-VN';
      utterance.rate = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleStartTask = () => {
    setIsRunning(true);
    onTaskStart(task.id);
  };

  const handleCompleteTask = () => {
    setIsRunning(false);
    onTaskComplete(task.id);
    
    // Celebration sound
    if (notificationSettings.soundEnabled) {
      playCelebrationSound();
    }
    
    if (notificationSettings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(`Chúc mừng! Bạn đã hoàn thành task ${task.title}!`);
      utterance.lang = 'vi-VN';
      speechSynthesis.speak(utterance);
    }
  };

  const playCelebrationSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const frequencies = [523, 659, 784, 1047]; // C, E, G, C
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.2 + 0.3);
      
      oscillator.start(ctx.currentTime + index * 0.2);
      oscillator.stop(ctx.currentTime + index * 0.2 + 0.3);
    });
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (): string => {
    if (isOverdue) return 'bg-red-500';
    if (timeRemaining < (task.estimatedDuration || 0) * 60 * 1000 * 0.1) return 'bg-orange-500';
    if (timeRemaining < (task.estimatedDuration || 0) * 60 * 1000 * 0.25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!task.deadline || !task.estimatedDuration) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          {!isRunning && !task.completed && (
            <button
              onClick={handleStartTask}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Bắt đầu
            </button>
          )}
          {isRunning && !task.completed && (
            <button
              onClick={handleCompleteTask}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Tiến độ: {task.progressPercent}%</span>
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {isOverdue ? 'Quá hạn' : `Còn lại: ${formatTime(timeRemaining)}`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${task.progressPercent}%` }}
          />
        </div>
      </div>
      
      {/* Time Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Thời gian đã dùng:</span>
          <div className="font-medium">{formatTime(timeElapsed)}</div>
        </div>
        <div>
          <span className="text-gray-600">Ước tính:</span>
          <div className="font-medium">{task.estimatedDuration} phút</div>
        </div>
      </div>
    </div>
  );
};

export default TaskTimer;
