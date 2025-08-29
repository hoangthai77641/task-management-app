import React, { useState } from 'react';

interface TimePickerComponentProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
  showQuickOptions?: boolean;
}

const TimePickerComponent: React.FC<TimePickerComponentProps> = ({
  label,
  value,
  onChange,
  minTime,
  maxTime,
  showQuickOptions = true
}) => {
  const [showQuickPicker, setShowQuickPicker] = useState(false);

  const getQuickOptions = () => {
    const now = new Date();
    const options = [];
    
    // Add test options (1-5 minutes from now for testing)
    for (let i = 1; i <= 5; i++) {
      const time = new Date(now.getTime() + i * 60 * 1000);
      options.push({
        label: `+${i}min (Test)`,
        value: time.toISOString().slice(0, 16)
      });
    }
    
    // Add options for next few hours
    for (let i = 1; i <= 6; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      if (time.getDate() === now.getDate()) { // Same day only
        options.push({
          label: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
          value: time.toISOString().slice(0, 16)
        });
      }
    }
    
    // Add specific times if they're in the future today
    const specificTimes = [
      { hour: 12, minute: 0, label: 'Trưa (12:00)' },
      { hour: 15, minute: 0, label: 'Chiều (15:00)' },
      { hour: 18, minute: 0, label: 'Tối (18:00)' },
      { hour: 21, minute: 0, label: 'Tối muộn (21:00)' },
      { hour: 23, minute: 59, label: 'Cuối ngày (23:59)' }
    ];

    specificTimes.forEach(time => {
      const timeDate = new Date(now);
      timeDate.setHours(time.hour, time.minute, 0, 0);
      
      if (timeDate > now) {
        options.push({
          label: time.label,
          value: timeDate.toISOString().slice(0, 16)
        });
      }
    });

    return options;
  };

  const quickOptions = getQuickOptions();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minTime}
          max={maxTime}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        
        {showQuickOptions && quickOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setShowQuickPicker(!showQuickPicker)}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            ⚡
          </button>
        )}
      </div>

      {showQuickPicker && quickOptions.length > 0 && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border">
          <div className="text-xs font-medium text-gray-700 mb-2">Quick Select:</div>
          <div className="grid grid-cols-2 gap-1">
            {quickOptions.map((option: {label: string, value: string}, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setShowQuickPicker(false);
                }}
                className="text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePickerComponent;
