import React, { useState } from 'react';
import MockTaskTimer from './tasks/MockTaskTimer';

const TestTimer: React.FC = () => {
  const [activeTimers, setActiveTimers] = useState<Array<{id: string, name: string, duration: number}>>([]);
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(1);

  const addTimer = () => {
    if (taskName.trim()) {
      const newTimer = {
        id: Date.now().toString(),
        name: taskName.trim(),
        duration: duration
      };
      setActiveTimers([...activeTimers, newTimer]);
      setTaskName('');
    }
  };

  const removeTimer = (id: string) => {
    setActiveTimers(activeTimers.filter(timer => timer.id !== id));
  };

  const quickAdd = (name: string, minutes: number) => {
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: minutes
    };
    setActiveTimers([...activeTimers, newTimer]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🎯 Task Timer Test
        </h1>

        {/* Quick Test Buttons */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Test Timers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => quickAdd('Test 30s', 0.5)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
            >
              30 giây
            </button>
            <button
              onClick={() => quickAdd('Test 1 phút', 1)}
              className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 text-sm"
            >
              1 phút
            </button>
            <button
              onClick={() => quickAdd('Test 2 phút', 2)}
              className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm"
            >
              2 phút
            </button>
            <button
              onClick={() => quickAdd('Test 5 phút', 5)}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
            >
              5 phút
            </button>
          </div>
        </div>

        {/* Custom Timer Form */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tạo Timer Tùy Chỉnh</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Task
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Nhập tên task..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (phút)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="0.5"
                max="60"
                step="0.5"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={addTimer}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Thêm Timer
            </button>
          </div>
        </div>

        {/* Active Timers */}
        <div className="space-y-6">
          {activeTimers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">⏰</div>
              <p>Chưa có timer nào. Hãy tạo timer để test!</p>
            </div>
          ) : (
            activeTimers.map(timer => (
              <div key={timer.id} className="relative">
                <button
                  onClick={() => removeTimer(timer.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                >
                  ×
                </button>
                <MockTaskTimer
                  taskName={timer.name}
                  durationMinutes={timer.duration}
                  onComplete={() => {
                    console.log(`Timer ${timer.name} completed!`);
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn test:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Nhấn "30 giây" để test nhanh notifications</li>
            <li>• Timer sẽ thông báo ở 10%, 25%, 50%, 75% và khi hoàn thành</li>
            <li>• Cho phép notifications trong browser để thấy thông báo</li>
            <li>• Có âm thanh beep và voice notifications</li>
            <li>• Progress bar và countdown timer real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestTimer;
