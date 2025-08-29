import React, { useState, useEffect } from 'react';
import { procrastinationDetector, type ProcrastinationAnalysis } from '../../utils/procrastinationDetection';
import { EmotionalState } from '../../types/LifeGoal';
import { type Task } from '../../types/Task';

interface ProcrastinationInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionTaken: (action: string) => void;
  currentTask?: Task;
  currentMood?: EmotionalState;
}

const ProcrastinationInterventionModal: React.FC<ProcrastinationInterventionModalProps> = ({
  isOpen,
  onClose,
  onActionTaken,
  currentTask,
  currentMood
}) => {
  const [analysis, setAnalysis] = useState<ProcrastinationAnalysis | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const procrastinationAnalysis = procrastinationDetector.analyzeProcrastinationRisk(currentTask, currentMood);
      setAnalysis(procrastinationAnalysis);
    }
  }, [isOpen, currentTask, currentMood]);

  if (!isOpen || !analysis) return null;

  const intervention = procrastinationDetector.getPersonalizedIntervention(analysis);
  
  const getRiskColor = (score: number) => {
    if (score > 0.7) return 'text-red-600 bg-red-50 border-red-200';
    if (score > 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '💪';
    }
  };

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    onActionTaken(action);
    
    // Auto-close after action selection with delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const motivationalQuotes = [
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "A year from now you may wish you had started today. - Karen Lamb",
    "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
    "The secret of getting ahead is getting started. - Mark Twain"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{getUrgencyIcon(intervention.urgency)}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{intervention.title}</h2>
                <p className="text-sm text-gray-600">AI-Powered Intervention</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Risk Score */}
        <div className="p-6 pb-4">
          <div className={`p-4 rounded-lg border ${getRiskColor(analysis.riskScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Procrastination Risk Score</span>
              <span className="font-bold text-lg">{Math.round(analysis.riskScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.riskScore > 0.7 ? 'bg-red-500' :
                  analysis.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${analysis.riskScore * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="px-6 pb-4">
          <p className="text-gray-700 leading-relaxed">{intervention.message}</p>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3">🎯 Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {intervention.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                  selectedAction === action
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{action}</div>
                {selectedAction === action && (
                  <div className="text-xs text-indigo-600 mt-1">✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-purple-600 text-xl mr-3">💡</span>
              <div>
                <h4 className="font-medium text-purple-800 mb-1">Motivation Boost</h4>
                <p className="text-sm text-purple-700 italic">"{randomQuote}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis (Collapsible) */}
        <div className="px-6 pb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <span className="mr-2">{showDetails ? '🔽' : '▶️'}</span>
            View Detailed Analysis ({analysis.signals.length} signals detected)
          </button>
          
          {showDetails && (
            <div className="mt-3 space-y-2">
              {analysis.signals.map((signal, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{signal.description}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      signal.severity === 'high' ? 'bg-red-100 text-red-800' :
                      signal.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {signal.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{signal.suggestedIntervention}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">Confidence: {Math.round(signal.confidence * 100)}%</span>
                    <span>Type: {signal.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="px-6 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3">📋 AI Recommendations</h3>
          <ul className="space-y-2">
            {analysis.recommendations.slice(0, 4).map((rec, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                // Open AI Coach for more detailed help
                onActionTaken('open_ai_coach');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              🤖 Get More Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcrastinationInterventionModal;
