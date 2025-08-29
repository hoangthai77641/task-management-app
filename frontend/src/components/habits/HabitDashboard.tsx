import React, { useState, useEffect } from 'react';
import { type Habit, type HabitLog, Frequency, EnergyLevel, type CreateHabitRequest } from '../../types/LifeGoal';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';

const HabitDashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [filterFrequency, setFilterFrequency] = useState<Frequency | 'ALL'>('ALL');
  const [filterActive, setFilterActive] = useState<boolean | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockHabits: Habit[] = [
      {
        id: '1',
        title: 'Drink 8 glasses of water',
        description: 'Stay hydrated throughout the day for better health and energy',
        frequency: Frequency.DAILY,
        targetCount: 8,
        currentStreak: 12,
        longestStreak: 25,
        difficulty: 3,
        energyRequired: EnergyLevel.LOW,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        userId: 'user1',
        habitLogs: []
      },
      {
        id: '2',
        title: 'Exercise for 30 minutes',
        description: 'Daily workout to maintain fitness and mental health',
        frequency: Frequency.DAILY,
        targetCount: 1,
        currentStreak: 5,
        longestStreak: 18,
        difficulty: 7,
        energyRequired: EnergyLevel.HIGH,
        isActive: true,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        userId: 'user1',
        habitLogs: []
      },
      {
        id: '3',
        title: 'Read for 20 minutes',
        description: 'Daily reading to expand knowledge and improve focus',
        frequency: Frequency.DAILY,
        targetCount: 1,
        currentStreak: 0,
        longestStreak: 7,
        difficulty: 4,
        energyRequired: EnergyLevel.MEDIUM,
        isActive: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        userId: 'user1',
        habitLogs: []
      },
      {
        id: '4',
        title: 'Meditate',
        description: 'Weekly meditation sessions for mindfulness and stress relief',
        frequency: Frequency.WEEKLY,
        targetCount: 3,
        currentStreak: 2,
        longestStreak: 8,
        difficulty: 5,
        energyRequired: EnergyLevel.MEDIUM,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        userId: 'user1',
        habitLogs: []
      }
    ];

    const mockLogs: HabitLog[] = [
      // Recent logs for water habit
      { id: '1', completed: true, notes: 'Feeling great!', mood: 8, energy: 7, loggedAt: new Date().toISOString(), habitId: '1' },
      { id: '2', completed: true, notes: '', mood: 7, energy: 6, loggedAt: new Date(Date.now() - 86400000).toISOString(), habitId: '1' },
      { id: '3', completed: false, notes: 'Forgot to track', mood: 5, energy: 5, loggedAt: new Date(Date.now() - 172800000).toISOString(), habitId: '1' },
      // Recent logs for exercise habit
      { id: '4', completed: true, notes: '30 min cardio', mood: 9, energy: 8, loggedAt: new Date().toISOString(), habitId: '2' },
      { id: '5', completed: true, notes: 'Weight training', mood: 8, energy: 7, loggedAt: new Date(Date.now() - 86400000).toISOString(), habitId: '2' },
    ];

    setHabits(mockHabits);
    setHabitLogs(mockLogs);
  };

  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const newHabit: Habit = {
        id: Date.now().toString(),
        ...habitData,
        currentStreak: 0,
        longestStreak: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
        habitLogs: []
      };
      
      setHabits(prev => [...prev, newHabit]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHabit = async (habitData: CreateHabitRequest) => {
    if (!editingHabit) return;
    
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const updatedHabit: Habit = {
        ...editingHabit,
        ...habitData,
        updatedAt: new Date().toISOString()
      };
      
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? updatedHabit : h));
      setEditingHabit(null);
    } catch (error) {
      console.error('Error updating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogHabit = async (habitId: string, completed: boolean, notes?: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const newLog: HabitLog = {
        id: Date.now().toString(),
        completed,
        notes,
        mood: completed ? 8 : 5,
        energy: completed ? 7 : 5,
        loggedAt: new Date().toISOString(),
        habitId
      };
      
      setHabitLogs(prev => [...prev, newLog]);
      
      // Update streak
      if (completed) {
        setHabits(prev => prev.map(habit => {
          if (habit.id === habitId) {
            const newStreak = habit.currentStreak + 1;
            return {
              ...habit,
              currentStreak: newStreak,
              longestStreak: Math.max(habit.longestStreak, newStreak)
            };
          }
          return habit;
        }));
      } else {
        setHabits(prev => prev.map(habit => 
          habit.id === habitId ? { ...habit, currentStreak: 0 } : habit
        ));
      }
    } catch (error) {
      console.error('Error logging habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setHabitLogs(prev => prev.filter(l => l.habitId !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredHabits = () => {
    return habits.filter(habit => {
      const frequencyMatch = filterFrequency === 'ALL' || habit.frequency === filterFrequency;
      const activeMatch = filterActive === 'ALL' || habit.isActive === filterActive;
      return frequencyMatch && activeMatch;
    });
  };

  const getHabitLogs = (habitId: string) => {
    return habitLogs.filter(log => log.habitId === habitId).slice(0, 7);
  };

  const getStats = () => {
    const activeHabits = habits.filter(h => h.isActive).length;
    const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const avgStreak = activeHabits > 0 ? Math.round(totalStreaks / activeHabits) : 0;
    const todayLogs = habitLogs.filter(log => 
      new Date(log.loggedAt).toDateString() === new Date().toDateString()
    );
    const completedToday = todayLogs.filter(log => log.completed).length;
    
    return { activeHabits, avgStreak, completedToday, totalHabits: habits.length };
  };

  const stats = getStats();
  const filteredHabits = getFilteredHabits();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔄 Habit Tracker</h1>
            <p className="text-gray-600 mt-2">Build positive habits and track your progress</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            ➕ New Habit
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Habits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeHabits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgStreak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Habits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHabits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value as Frequency | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ALL">All Frequencies</option>
              <option value={Frequency.DAILY}>Daily</option>
              <option value={Frequency.WEEKLY}>Weekly</option>
              <option value={Frequency.MONTHLY}>Monthly</option>
              <option value={Frequency.CUSTOM}>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterActive.toString()}
              onChange={(e) => setFilterActive(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ALL">All Habits</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-6">Start building positive habits to achieve your goals!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onLogHabit={handleLogHabit}
              onEdit={setEditingHabit}
              onDelete={handleDeleteHabit}
              recentLogs={getHabitLogs(habit.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingHabit) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <HabitForm
              onSubmit={editingHabit ? handleEditHabit : handleCreateHabit}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingHabit(null);
              }}
              initialData={editingHabit || undefined}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitDashboard;
