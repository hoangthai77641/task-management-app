import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'consistency' | 'milestone' | 'special';
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalTasksCompleted: number;
  totalGoalsAchieved: number;
  longestStreak: number;
  currentStreak: number;
  totalHabitsLogged: number;
  level: number;
  experience: number;
  experienceToNext: number;
  coins: number;
}

const RewardSystem: React.FC = () => {
  const [userStats] = useState<UserStats>({
    totalTasksCompleted: 127,
    totalGoalsAchieved: 8,
    longestStreak: 25,
    currentStreak: 12,
    totalHabitsLogged: 89,
    level: 15,
    experience: 2850,
    experienceToNext: 150,
    coins: 340
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newAchievement] = useState<Achievement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      // Streak Achievements
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first task',
        icon: '🌱',
        category: 'completion',
        requirement: 1,
        currentProgress: 127,
        isUnlocked: true,
        unlockedAt: '2024-01-01T00:00:00Z',
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Getting Started',
        description: 'Complete 10 tasks',
        icon: '🚀',
        category: 'completion',
        requirement: 10,
        currentProgress: 127,
        isUnlocked: true,
        unlockedAt: '2024-01-03T00:00:00Z',
        rarity: 'common'
      },
      {
        id: '3',
        title: 'Task Master',
        description: 'Complete 100 tasks',
        icon: '🏆',
        category: 'completion',
        requirement: 100,
        currentProgress: 127,
        isUnlocked: true,
        unlockedAt: '2024-01-20T00:00:00Z',
        rarity: 'rare'
      },
      {
        id: '4',
        title: 'Productivity Legend',
        description: 'Complete 500 tasks',
        icon: '👑',
        category: 'completion',
        requirement: 500,
        currentProgress: 127,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: '5',
        title: 'Streak Starter',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 7,
        currentProgress: 25,
        isUnlocked: true,
        unlockedAt: '2024-01-08T00:00:00Z',
        rarity: 'common'
      },
      {
        id: '6',
        title: 'On Fire',
        description: 'Maintain a 30-day streak',
        icon: '🌟',
        category: 'streak',
        requirement: 30,
        currentProgress: 25,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: '7',
        title: 'Consistency King',
        description: 'Log habits for 30 consecutive days',
        icon: '👑',
        category: 'consistency',
        requirement: 30,
        currentProgress: 12,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: '8',
        title: 'Goal Crusher',
        description: 'Complete your first life goal',
        icon: '🎯',
        category: 'milestone',
        requirement: 1,
        currentProgress: 8,
        isUnlocked: true,
        unlockedAt: '2024-01-15T00:00:00Z',
        rarity: 'rare'
      },
      {
        id: '9',
        title: 'Dream Achiever',
        description: 'Complete 10 life goals',
        icon: '✨',
        category: 'milestone',
        requirement: 10,
        currentProgress: 8,
        isUnlocked: false,
        rarity: 'legendary'
      },
      {
        id: '10',
        title: 'Early Bird',
        description: 'Complete a task before 6 AM',
        icon: '🌅',
        category: 'special',
        requirement: 1,
        currentProgress: 0,
        isUnlocked: false,
        rarity: 'rare'
      }
    ];

    setAchievements(mockAchievements);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityTextColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-700',
      rare: 'text-blue-700',
      epic: 'text-purple-700',
      legendary: 'text-yellow-700'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') return achievements;
    if (selectedCategory === 'unlocked') return achievements.filter(a => a.isUnlocked);
    if (selectedCategory === 'locked') return achievements.filter(a => !a.isUnlocked);
    return achievements.filter(a => a.category === selectedCategory);
  };

  const getLevelProgress = () => {
    return (userStats.experience / (userStats.experience + userStats.experienceToNext)) * 100;
  };

  const categories = [
    { id: 'all', label: 'All', icon: '🏅' },
    { id: 'unlocked', label: 'Unlocked', icon: '✅' },
    { id: 'locked', label: 'Locked', icon: '🔒' },
    { id: 'completion', label: 'Tasks', icon: '📋' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
    { id: 'consistency', label: 'Habits', icon: '🔄' },
    { id: 'milestone', label: 'Goals', icon: '🎯' },
    { id: 'special', label: 'Special', icon: '⭐' }
  ];

  const recentRewards = [
    { type: 'achievement', title: 'Task Master unlocked!', time: '2 hours ago', icon: '🏆' },
    { type: 'coins', title: '+50 coins earned', time: '1 day ago', icon: '🪙' },
    { type: 'level', title: 'Level 15 reached!', time: '3 days ago', icon: '⬆️' },
    { type: 'streak', title: '25-day streak milestone!', time: '1 week ago', icon: '🔥' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🏆 Rewards & Achievements</h1>
        <p className="text-gray-600 mt-2">Track your progress and unlock achievements</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Level & XP */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-100">Level</p>
              <p className="text-3xl font-bold">{userStats.level}</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-indigo-100">
              <span>XP</span>
              <span>{userStats.experience}/{userStats.experience + userStats.experienceToNext}</span>
            </div>
            <div className="w-full bg-indigo-400 rounded-full h-2 mt-1">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-indigo-100">{userStats.experienceToNext} XP to next level</p>
        </div>

        {/* Coins */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coins</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.coins}</p>
            </div>
            <div className="text-3xl">🪙</div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>

        {/* Total Completed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Done</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalTasksCompleted}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Recent Rewards */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎉 Recent Rewards</h3>
        <div className="space-y-3">
          {recentRewards.map((reward, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{reward.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{reward.title}</p>
                  <p className="text-sm text-gray-500">{reward.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredAchievements().map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
              achievement.isUnlocked 
                ? getRarityColor(achievement.rarity)
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
          >
            {/* Achievement Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className={`text-4xl mr-3 ${achievement.isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.isUnlocked ? achievement.icon : '🔒'}
                </span>
                <div>
                  <h3 className={`font-semibold ${
                    achievement.isUnlocked ? getRarityTextColor(achievement.rarity) : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              
              {achievement.isUnlocked && (
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                  achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                  achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {achievement.rarity}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-600">
                  {Math.min(achievement.currentProgress, achievement.requirement)}/{achievement.requirement}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    achievement.isUnlocked ? 'bg-green-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${getProgressPercentage(achievement)}%` }}
                />
              </div>
            </div>

            {/* Achievement Footer */}
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div className="text-xs text-gray-500">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
            
            {!achievement.isUnlocked && (
              <div className="text-xs text-gray-500">
                {achievement.requirement - achievement.currentProgress} more to unlock
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Achievement Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {achievements.filter(a => a.isUnlocked && a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-600">Legendary</div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h2>
            <div className="text-4xl mb-4">{newAchievement.icon}</div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">{newAchievement.title}</h3>
            <p className="text-gray-600 mb-6">{newAchievement.description}</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Awesome! 🎊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardSystem;
