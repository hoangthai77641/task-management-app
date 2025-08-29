import React, { useState, useEffect, useRef } from 'react';
import { InsightType, EmotionalState } from '../../types/LifeGoal';

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  insightType?: InsightType;
}

const AICoach: React.FC<AICoachProps> = ({ isOpen, onClose, userId }) => {
  // Use userId for future API calls
  console.log('AI Coach initialized for user:', userId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<EmotionalState>(EmotionalState.MOTIVATED);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `👋 Hi there! I'm your AI Life Coach. I'm here to help you overcome procrastination and achieve your goals. 

How are you feeling today? I can help you with:
• 🎯 Setting and breaking down goals
• 💪 Building motivation and momentum  
• 🧠 Overcoming procrastination patterns
• 📈 Tracking your progress
• 🎉 Celebrating your wins

What would you like to work on?`,
        timestamp: new Date(),
        insightType: InsightType.MOTIVATION_BOOST
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock AI responses based on user input
  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let insightType: InsightType = InsightType.MOTIVATION_BOOST;

    // Procrastination detection
    if (lowerMessage.includes('procrastinating') || lowerMessage.includes('lazy') || lowerMessage.includes('avoiding')) {
      response = `I understand you're struggling with procrastination. This is completely normal! 🤗

Here's what I recommend:
• **Start tiny**: Pick just ONE small task (2-5 minutes)
• **Use the 2-minute rule**: If it takes less than 2 minutes, do it now
• **Remove barriers**: Make it as easy as possible to start
• **Reward yourself**: Plan something nice after completing the task

What's one small thing you could do right now to move forward?`;
      insightType = InsightType.PROCRASTINATION_WARNING;
    }
    // Goal setting help
    else if (lowerMessage.includes('goal') || lowerMessage.includes('achieve') || lowerMessage.includes('want to')) {
      response = `Great that you're thinking about goals! 🎯

Let's make it SMART:
• **Specific**: What exactly do you want to achieve?
• **Measurable**: How will you know you've succeeded?
• **Achievable**: Is this realistic given your current situation?
• **Relevant**: Why is this important to you?
• **Time-bound**: When do you want to achieve this?

Can you tell me more about what you want to accomplish?`;
      insightType = InsightType.GOAL_ADJUSTMENT;
    }
    // Motivation boost
    else if (lowerMessage.includes('motivated') || lowerMessage.includes('energy') || lowerMessage.includes('tired')) {
      response = `I hear you need some motivation! 💪 Remember:

✨ **You've already taken the first step** by reaching out
🌱 **Progress isn't always linear** - small steps count
🏆 **You've overcome challenges before** - you can do this too
🎯 **Your future self** will thank you for starting today

What's one thing you're proud of accomplishing recently? Let's build on that momentum!`;
      insightType = InsightType.MOTIVATION_BOOST;
    }
    // Habit formation
    else if (lowerMessage.includes('habit') || lowerMessage.includes('routine') || lowerMessage.includes('daily')) {
      response = `Building habits is a superpower! 🦸‍♀️

**The Habit Loop**:
1. **Cue** (trigger) → 2. **Routine** (behavior) → 3. **Reward** (benefit)

**Pro tips**:
• Start with 1% better each day
• Stack new habits onto existing ones
• Track your streaks visually
• Celebrate small wins

What habit would you like to build? Let's start with the tiniest version!`;
      insightType = InsightType.HABIT_SUGGESTION;
    }
    // Overwhelm/anxiety
    else if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('anxious') || lowerMessage.includes('stressed')) {
      response = `Feeling overwhelmed is a sign you care deeply about your goals. 🤗

**Let's break it down**:
• **Brain dump**: Write everything down to clear your mind
• **Prioritize**: What's truly urgent vs. important?
• **Chunk it**: Break big tasks into smaller pieces
• **Breathe**: Take 3 deep breaths right now

Remember: You don't have to do everything at once. What's ONE thing you could focus on today?`;
      insightType = InsightType.PROCRASTINATION_WARNING;
    }
    // Progress celebration
    else if (lowerMessage.includes('completed') || lowerMessage.includes('finished') || lowerMessage.includes('done')) {
      response = `🎉 AMAZING! You completed something! 

This is HUGE because:
• You followed through on a commitment
• You built momentum for the next task
• You proved to yourself you can do it
• You're literally rewiring your brain for success

How does it feel to have accomplished this? What would you like to tackle next?`;
      insightType = InsightType.PROGRESS_CELEBRATION;
    }
    // Default response
    else {
      response = `I'm here to help you succeed! 🌟

Based on what you're sharing, I can offer personalized advice on:
• Overcoming procrastination
• Setting achievable goals
• Building positive habits
• Managing overwhelm
• Staying motivated

What specific challenge are you facing right now? The more details you share, the better I can help!`;
      insightType = InsightType.MOTIVATION_BOOST;
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      insightType
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInsightIcon = (type?: InsightType) => {
    const icons = {
      [InsightType.PROCRASTINATION_WARNING]: '⚠️',
      [InsightType.MOTIVATION_BOOST]: '💪',
      [InsightType.GOAL_ADJUSTMENT]: '🎯',
      [InsightType.HABIT_SUGGESTION]: '🔄',
      [InsightType.PROGRESS_CELEBRATION]: '🎉',
      [InsightType.PATTERN_RECOGNITION]: '🧠',
      [InsightType.ENERGY_OPTIMIZATION]: '⚡'
    };
    return type ? icons[type] || '🤖' : '🤖';
  };

  const quickActions = [
    { text: "I'm procrastinating", emoji: "😅" },
    { text: "Help me set a goal", emoji: "🎯" },
    { text: "I need motivation", emoji: "💪" },
    { text: "I feel overwhelmed", emoji: "😰" },
    { text: "I completed a task!", emoji: "🎉" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl">
              🤖
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">AI Life Coach</h3>
              <p className="text-sm text-gray-500">Your personal anti-procrastination assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Mood Selector */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Current mood:</span>
            <select
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value as EmotionalState)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={EmotionalState.MOTIVATED}>😊 Motivated</option>
              <option value={EmotionalState.ANXIOUS}>😰 Anxious</option>
              <option value={EmotionalState.OVERWHELMED}>😵 Overwhelmed</option>
              <option value={EmotionalState.FOCUSED}>🎯 Focused</option>
              <option value={EmotionalState.DISTRACTED}>😵‍💫 Distracted</option>
              <option value={EmotionalState.TIRED}>😴 Tired</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">{getInsightIcon(message.insightType)}</span>
                    <span className="text-xs font-medium text-gray-600">AI Coach</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🤖</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {action.emoji} {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about achieving your goals..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
