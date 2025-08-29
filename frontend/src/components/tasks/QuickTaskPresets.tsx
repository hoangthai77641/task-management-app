import React from 'react';

interface QuickTaskPresetsProps {
  onPresetSelect: (preset: TaskPreset) => void;
}

interface TaskPreset {
  name: string;
  icon: string;
  estimatedDuration: number; // minutes
  deadline: Date;
  description: string;
}

const QuickTaskPresets: React.FC<QuickTaskPresetsProps> = ({ onPresetSelect }) => {
  const now = new Date();
  
  const getPresets = (): TaskPreset[] => {
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const lunchTime = new Date(today);
    lunchTime.setHours(12, 0, 0, 0);
    const eveningTime = new Date(today);
    eveningTime.setHours(18, 0, 0, 0);

    return [
      {
        name: 'Quick Task',
        icon: '⚡',
        estimatedDuration: 15,
        deadline: in2Hours,
        description: 'Hoàn thành trong 15 phút, deadline 2 tiếng'
      },
      {
        name: 'Short Task',
        icon: '🎯',
        estimatedDuration: 30,
        deadline: in4Hours,
        description: 'Task ngắn 30 phút, deadline 4 tiếng'
      },
      {
        name: 'Medium Task',
        icon: '📝',
        estimatedDuration: 60,
        deadline: in6Hours,
        description: 'Task trung bình 1 tiếng, deadline 6 tiếng'
      },
      {
        name: 'Before Lunch',
        icon: '🍽️',
        estimatedDuration: 90,
        deadline: lunchTime.getTime() > now.getTime() ? lunchTime : in4Hours,
        description: 'Hoàn thành trước giờ ăn trưa'
      },
      {
        name: 'Before Evening',
        icon: '🌆',
        estimatedDuration: 120,
        deadline: eveningTime.getTime() > now.getTime() ? eveningTime : endOfDay,
        description: 'Hoàn thành trước 6 giờ chiều'
      },
      {
        name: 'End of Day',
        icon: '🌙',
        estimatedDuration: 180,
        deadline: endOfDay,
        description: 'Hoàn thành trước cuối ngày'
      }
    ];
  };

  const presets = getPresets();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUrgencyColor = (deadline: Date): string => {
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline <= 2) return 'border-red-300 bg-red-50 hover:bg-red-100';
    if (hoursUntilDeadline <= 4) return 'border-orange-300 bg-orange-50 hover:bg-orange-100';
    if (hoursUntilDeadline <= 6) return 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100';
    return 'border-green-300 bg-green-50 hover:bg-green-100';
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        ⏰ Quick Presets - Hoàn thành trong ngày
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onPresetSelect(preset)}
            className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${getUrgencyColor(preset.deadline)}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{preset.icon}</span>
              <span className="font-medium text-sm text-gray-900">{preset.name}</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>⏱️ {preset.estimatedDuration} phút</div>
              <div>🎯 {formatTime(preset.deadline)}</div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Chọn preset để tự động điền thời gian ước tính và deadline
      </p>
    </div>
  );
};

export default QuickTaskPresets;
