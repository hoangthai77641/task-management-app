import React, { useState, useEffect, useRef } from 'react';

interface MockTaskTimerProps {
  taskName: string;
  durationMinutes: number;
  onComplete?: () => void;
}

const MockTaskTimer: React.FC<MockTaskTimerProps> = ({ 
  taskName, 
  durationMinutes, 
  onComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // seconds
  const [progress, setProgress] = useState(0);
  const [hasNotified75, setHasNotified75] = useState(false);
  const [hasNotified50, setHasNotified50] = useState(false);
  const [hasNotified25, setHasNotified25] = useState(false);
  const [hasNotified10, setHasNotified10] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const totalSeconds = durationMinutes * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          const newProgress = ((totalSeconds - newTimeLeft) / totalSeconds) * 100;
          setProgress(newProgress);

          // Check for notifications
          if (newProgress >= 75 && !hasNotified75) {
            showNotification('75% completed! Keep going! 💪');
            playBeep();
            setHasNotified75(true);
          } else if (newProgress >= 50 && !hasNotified50) {
            showNotification('Halfway there! 🎯');
            playBeep();
            setHasNotified50(true);
          } else if (newProgress >= 25 && !hasNotified25) {
            showNotification('25% done! Great start! 🚀');
            playBeep();
            setHasNotified25(true);
          } else if (newProgress >= 10 && !hasNotified10) {
            showNotification('Task started! Let\'s do this! ⚡');
            playBeep();
            setHasNotified10(true);
          }

          if (newTimeLeft <= 0) {
            showNotification('🎉 Task completed! Great job!');
            playSuccessSound();
            speakText('Task completed! Great job!');
            setIsRunning(false);
            onComplete?.();
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
  }, [isRunning, timeLeft, hasNotified75, hasNotified50, hasNotified25, hasNotified10, totalSeconds, onComplete]);

  const showNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Timer', {
        body: message,
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Task Timer', {
            body: message,
            icon: '/favicon.ico'
          });
        }
      });
    }
    console.log('Notification:', message);
  };

  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const playSuccessSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContextRef.current.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContextRef.current.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, audioContextRef.current.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    showNotification(`Started task: ${taskName}`);
    speakText(`Task ${taskName} started!`);
  };

  const handlePause = () => {
    setIsRunning(false);
    showNotification('Task paused');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setProgress(0);
    setHasNotified75(false);
    setHasNotified50(false);
    setHasNotified25(false);
    setHasNotified10(false);
  };

  const handleComplete = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setProgress(100);
    showNotification('🎉 Task marked as completed!');
    playSuccessSound();
    speakText('Task completed! Great job!');
    onComplete?.();
  };

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🎯 {taskName}</h3>
        <div className="text-sm text-gray-500">
          Created: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-indigo-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-500">
          {durationMinutes} minute task
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ▶️ Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            ⏸️ Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          🔄 Reset
        </button>
        
        <button
          onClick={handleComplete}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          ✅ Complete
        </button>
      </div>

      {/* Status */}
      <div className="mt-4 text-center text-sm">
        {isRunning ? (
          <span className="text-green-600 font-medium">🟢 Timer Running</span>
        ) : timeLeft === 0 ? (
          <span className="text-purple-600 font-medium">🎉 Completed!</span>
        ) : (
          <span className="text-gray-500">⏸️ Paused</span>
        )}
      </div>
    </div>
  );
};

export default MockTaskTimer;
