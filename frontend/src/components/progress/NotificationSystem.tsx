import React, { useState, useEffect } from 'react';
import type { NotificationSettings } from '../../types/Task';

interface NotificationSystemProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  settings,
  onSettingsChange
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check notification permission on mount
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
    }
  };

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Task Management App', {
        body: 'Thông báo test thành công! 🎉',
        icon: '/favicon.ico'
      });
    }
  };

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Đây là test giọng nói cho ứng dụng quản lý task');
      utterance.lang = 'vi-VN';
      utterance.rate = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateReminderInterval = (index: number, value: number) => {
    const newIntervals = [...settings.reminderIntervals];
    newIntervals[index] = value;
    updateSettings({ reminderIntervals: newIntervals });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
      
      {/* Permission Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Browser Notifications</h4>
            <p className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                permissionStatus === 'granted' ? 'text-green-600' : 
                permissionStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {permissionStatus === 'granted' ? 'Allowed' : 
                 permissionStatus === 'denied' ? 'Blocked' : 'Not requested'}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            {permissionStatus !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Enable
              </button>
            )}
            {permissionStatus === 'granted' && (
              <button
                onClick={testNotification}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => updateSettings({ enabled: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Enable all notifications
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              disabled={!settings.enabled}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Sound notifications
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
              disabled={!settings.enabled}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Voice reminders
            </span>
          </label>
          {settings.voiceEnabled && (
            <button
              onClick={testVoice}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
            >
              Test Voice
            </button>
          )}
        </div>
      </div>

      {/* Reminder Intervals */}
      {settings.enabled && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Reminder Intervals</h4>
          <p className="text-sm text-gray-600 mb-3">
            Set when to receive reminders based on time elapsed (%)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {settings.reminderIntervals.map((interval, index) => (
              <div key={index} className="flex items-center space-x-2">
                <label className="text-sm text-gray-700 w-20">
                  Alert {index + 1}:
                </label>
                <input
                  type="number"
                  value={interval}
                  onChange={(e) => updateReminderInterval(index, Number(e.target.value))}
                  min="1"
                  max="100"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Example: 75% means alert when 75% of estimated time has passed
          </p>
        </div>
      )}

      {/* Audio Context Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Audio Features</h4>
        <p className="text-xs text-blue-700">
          Sound notifications use Web Audio API. Voice reminders use Speech Synthesis API.
          Both require user interaction to activate initially.
        </p>
      </div>
    </div>
  );
};

export default NotificationSystem;
