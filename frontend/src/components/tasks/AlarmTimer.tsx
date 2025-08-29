import React, { useState, useEffect, useRef } from 'react';

interface AlarmTimerProps {
  task: {
    id: string;
    title: string;
    deadline: string; // ISO string
  };
  onComplete: (taskId: string) => void;
}

const AlarmTimer: React.FC<AlarmTimerProps> = ({ task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Tạo âm thanh báo thức
  const playAlarmSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  // Thông báo giọng nói
  const speakAlarm = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Thông báo trình duyệt
  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `alarm-${task.id}`,
      });
    }
  };

  // Tính thời gian còn lại
  const calculateTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) {
      if (!isAlarmTriggered) {
        setIsAlarmTriggered(true);
        
        // Kích hoạt báo thức
        playAlarmSound();
        speakAlarm(`Báo thức: ${task.title}`);
        showNotification('⏰ Báo thức', `Đã đến giờ: ${task.title}`);
        
        // Lặp lại báo thức mỗi 30 giây cho đến khi user tắt
        const alarmInterval = setInterval(() => {
          playAlarmSound();
          speakAlarm(`Nhắc nhở: ${task.title}`);
        }, 30000);

        // Tự động dừng sau 5 phút
        setTimeout(() => {
          clearInterval(alarmInterval);
        }, 300000);
      }
      return 'Đã đến giờ!';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Yêu cầu quyền thông báo
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [task.deadline, isAlarmTriggered]);

  const formatDeadlineTime = () => {
    const deadline = new Date(task.deadline);
    return deadline.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDismiss = () => {
    setIsAlarmTriggered(false);
    onComplete(task.id);
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isAlarmTriggered 
        ? 'border-red-500 bg-red-50 animate-pulse' 
        : 'border-blue-300 bg-blue-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            🔔 {task.title}
          </h3>
          <div className="text-sm text-gray-600">
            Báo thức: {formatDeadlineTime()}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-mono ${
            isAlarmTriggered ? 'text-red-600 font-bold' : 'text-blue-600'
          }`}>
            {timeLeft}
          </div>
          
          {isAlarmTriggered && (
            <button
              onClick={handleDismiss}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Tắt báo thức
            </button>
          )}
        </div>
      </div>
      
      {isAlarmTriggered && (
        <div className="mt-3 p-2 bg-red-100 rounded text-red-800 text-sm">
          ⚠️ Báo thức đang kêu! Nhấn "Tắt báo thức" để dừng.
        </div>
      )}
    </div>
  );
};

export default AlarmTimer;
