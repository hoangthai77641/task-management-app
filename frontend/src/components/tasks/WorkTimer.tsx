import React, { useState, useEffect, useRef } from 'react';

interface WorkTimerProps {
  task: {
    id: string;
    title: string;
    estimatedDuration: number; // in minutes
  };
  onComplete: (taskId: string) => void;
}

const WorkTimer: React.FC<WorkTimerProps> = ({ task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(task.estimatedDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const totalTime = task.estimatedDuration * 60;

  // Tạo âm thanh thông báo
  const playNotificationSound = (frequency: number = 800, duration: number = 0.2) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // Thông báo giọng nói
  const speakProgress = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Thông báo trình duyệt
  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `work-timer-${task.id}`,
      });
    }
  };

  // Tính progress và kiểm tra milestone
  const checkProgressMilestones = (currentProgress: number) => {
    const milestones = [25, 50, 75, 100];
    const milestone = milestones.find(m => 
      Math.floor(progress) < m && Math.floor(currentProgress) >= m
    );

    if (milestone) {
      playNotificationSound(600 + milestone * 2, 0.3);
      
      if (milestone === 100) {
        speakProgress(`Chúc mừng! Bạn đã hoàn thành task ${task.title}`);
        showNotification('🎉 Hoàn thành!', `Task "${task.title}" đã xong!`);
      } else {
        speakProgress(`Bạn đã hoàn thành ${milestone}% task ${task.title}`);
        showNotification(`📈 Tiến độ ${milestone}%`, `Task: ${task.title}`);
      }
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          const newProgress = ((totalTime - newTimeLeft) / totalTime) * 100;
          
          checkProgressMilestones(newProgress);
          setProgress(newProgress);
          
          if (newTimeLeft <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTimeLeft;
        });
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
  }, [isRunning, timeLeft, totalTime, progress, task.title]);

  useEffect(() => {
    // Yêu cầu quyền thông báo
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    playNotificationSound(800, 0.1);
    speakProgress(`Bắt đầu làm việc: ${task.title}`);
  };

  const handleComplete = () => {
    setIsRunning(false);
    playNotificationSound(1000, 0.5);
    speakProgress(`Hoàn thành task: ${task.title}`);
    showNotification('✅ Hoàn thành sớm!', `Task "${task.title}" đã xong!`);
    onComplete(task.id);
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  return (
    <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            ⏱️ {task.title}
          </h3>
          <div className="text-sm text-gray-600">
            Thời gian: {task.estimatedDuration} phút
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-mono ${
            timeLeft <= 0 ? 'text-green-600' : 'text-blue-600'
          }`}>
            {timeLeft <= 0 ? 'Hoàn thành!' : formatTime(timeLeft)}
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(progress)}% hoàn thành
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isRunning && timeLeft > 0 && (
          <button
            onClick={handleStart}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
          >
            ▶️ Bắt đầu
          </button>
        )}
        
        {isRunning && (
          <div className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm text-center">
            🔄 Đang chạy...
          </div>
        )}
        
        <button
          onClick={handleComplete}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          ✅ Hoàn thành
        </button>
      </div>

      {timeLeft <= 0 && (
        <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
          🎉 Thời gian đã hết! Bạn đã hoàn thành xuất sắc!
        </div>
      )}
    </div>
  );
};

export default WorkTimer;
