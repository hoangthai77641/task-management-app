import React, { useState, useEffect } from 'react';
import {type CreateLifeGoalRequest, GoalCategory, GoalStatus, type LifeGoal} from '../../types/LifeGoal';
import LifeGoalForm from './LifeGoalForm';
import LifeGoalCard from './LifeGoalCard';

const LifeGoalDashboard: React.FC = () => {
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<GoalStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockGoals: LifeGoal[] = [
        {
          id: '1',
          title: 'Learn Spanish Fluently',
          description: 'Achieve conversational fluency in Spanish to enhance career opportunities and travel experiences.',
          category: 'EDUCATION_LEARNING',
          timeframe: 'MEDIUM_TERM',
          importance: 8,
          difficulty: 7,
          status: 'ACTIVE',
          progressPercent: 35,
          targetDate: '2024-12-31',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
          userId: 'user1',
          milestones: [],
          tasks: [],
          aiInsights: [{
            id: 'ai1',
            type: 'MOTIVATION_BOOST',
            title: 'Great Progress!',
            content: 'You\'re making excellent progress! Consider adding daily conversation practice to accelerate your learning.',
            confidence: 0.8,
            actionable: true,
            dismissed: false,
            createdAt: '2024-01-15',
            userId: 'user1'
          }]
        },
        {
          id: '2',
          title: 'Run a Half Marathon',
          description: 'Complete a 21K half marathon to improve fitness and mental resilience.',
          category: 'HEALTH_FITNESS',
          timeframe: 'SHORT_TERM',
          importance: 9,
          difficulty: 6,
          status: 'ACTIVE',
          progressPercent: 60,
          targetDate: '2024-06-15',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
          userId: 'user1',
          milestones: [],
          tasks: [],
          aiInsights: []
        }
      ];
      setGoals(mockGoals);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleGoalCreated = (goalData: CreateLifeGoalRequest) => {
    // In real app, this would call API
    const newGoal: LifeGoal = {
      id: Date.now().toString(),
      ...goalData,
      status: GoalStatus.ACTIVE,
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1',
      milestones: [],
      tasks: [],
      aiInsights: []
    };
    
    setGoals([newGoal, ...goals]);
    setShowForm(false);
  };

  const handleEdit = (goal: LifeGoal) => {
    console.log('Edit goal:', goal);
    // TODO: Implement edit functionality
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const handleAddMilestone = (goalId: string) => {
    console.log('Add milestone for goal:', goalId);
    // TODO: Implement milestone functionality
  };

  const handleViewDetails = (goal: LifeGoal) => {
    console.log('View details for goal:', goal);
    // TODO: Implement detailed view
  };

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = selectedCategory === 'ALL' || goal.category === selectedCategory;
    const statusMatch = selectedStatus === 'ALL' || goal.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getGoalStats = () => {
    const active = goals.filter(g => g.status === GoalStatus.ACTIVE).length;
    const completed = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
    const avgProgress = goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + g.progressPercent, 0) / goals.length)
      : 0;
    
    return { active, completed, avgProgress, total: goals.length };
  };

  const stats = getGoalStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎯 Life Goals</h1>
          <p className="text-gray-600 mt-1">Transform your dreams into achievable milestones</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <span>✨</span>
          Create New Goal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GoalCategory | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value={GoalCategory.HEALTH_FITNESS}>💪 Health & Fitness</option>
              <option value={GoalCategory.CAREER_PROFESSIONAL}>🚀 Career & Professional</option>
              <option value={GoalCategory.EDUCATION_LEARNING}>🧠 Education & Learning</option>
              <option value={GoalCategory.RELATIONSHIPS_SOCIAL}>❤️ Relationships & Social</option>
              <option value={GoalCategory.FINANCIAL}>💸 Financial</option>
              <option value={GoalCategory.PERSONAL_DEVELOPMENT}>✨ Personal Development</option>
              <option value={GoalCategory.HOBBIES_INTERESTS}>🎯 Hobbies & Interests</option>
              <option value={GoalCategory.TRAVEL_ADVENTURE}>🌍 Travel & Adventure</option>
              <option value={GoalCategory.FAMILY}>🏠 Family</option>
              <option value={GoalCategory.SPIRITUAL_MINDFULNESS}>☯️ Spiritual & Mindfulness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as GoalStatus | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={GoalStatus.ACTIVE}>🟢 Active</option>
              <option value={GoalStatus.PAUSED}>🟡 Paused</option>
              <option value={GoalStatus.COMPLETED}>🔵 Completed</option>
              <option value={GoalStatus.CANCELLED}>🔴 Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <LifeGoalForm
              onGoalCreated={handleGoalCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-6">
            {goals.length === 0 
              ? "Start your journey by creating your first life goal!"
              : "Try adjusting your filters to see more goals."
            }
          </p>
          {goals.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              ✨ Create Your First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <LifeGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddMilestone={handleAddMilestone}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* AI Coach Floating Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <span className="text-2xl">🤖</span>
        </button>
      </div>
    </div>
  );
};

export default LifeGoalDashboard;
