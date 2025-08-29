import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import TaskListWithTimer from './components/tasks/TaskListWithTimer';
import LifeGoalDashboard from './components/goals/LifeGoalDashboard';
import HabitCard from './components/habits/HabitCard';
import AICoach from './components/ai/AICoach';
import RewardSystem from './components/rewards/RewardSystem';
import ProgressAnalytics from './components/analytics/ProgressAnalytics';
import LandingPage from './pages/LandingPage';
import ProcrastinationInterventionModal from './components/ai/ProcrastinationInterventionModal';
import Header from './components/layout/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isProcrastinationModalOpen, setIsProcrastinationModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/tasks" replace /> : <AuthPage />} 
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-8">
                  <TaskListWithTimer />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-8">
                  <LifeGoalDashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-8">
                  <HabitCard 
                    habit={{
                      id: '1',
                      title: 'Sample Habit',
                      description: 'Sample habit description',
                      frequency: 'DAILY',
                      targetCount: 1,
                      currentStreak: 0,
                      longestStreak: 0,
                      difficulty: 5,
                      energyRequired: 'LOW',
                      isActive: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      userId: 'current-user',
                      habitLogs: []
                    }}
                    onLogHabit={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    recentLogs={[]}
                  />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-8">
                  <RewardSystem />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-8">
                  <ProgressAnalytics />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Navigate to="/tasks" replace />} />
      </Routes>

      {/* AI Coach Modal */}
      <AICoach
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        userId="current-user" // This should come from auth context
      />

      {/* Procrastination Intervention Modal */}
      <ProcrastinationInterventionModal
        isOpen={isProcrastinationModalOpen}
        onClose={() => setIsProcrastinationModalOpen(false)}
        onActionTaken={(action) => {
          console.log('Procrastination action taken:', action);
          if (action === 'open_ai_coach') {
            setIsAICoachOpen(true);
          }
        }}
      />

      {/* Floating AI Coach Button */}
      {isAuthenticated && (
        <button
          onClick={() => setIsAICoachOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-xl z-40"
          title="Open AI Life Coach"
        >
          🤖
        </button>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
