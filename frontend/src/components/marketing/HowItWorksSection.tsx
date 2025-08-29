import React from 'react';
import { 
  UserPlus, 
  Target, 
  Brain, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Sign Up & Set Goals",
      description: "Create your account and define your life goals using our SMART framework. Our AI analyzes your objectives to create a personalized roadmap.",
      icon: <UserPlus className="w-8 h-8" />,
      features: ["Quick 2-minute setup", "SMART goal framework", "Personal assessment"],
      color: "from-blue-500 to-blue-600"
    },
    {
      step: 2,
      title: "AI Learns Your Patterns",
      description: "Our intelligent system observes your behavior, identifies procrastination triggers, and learns your productivity patterns to provide personalized insights.",
      icon: <Brain className="w-8 h-8" />,
      features: ["Behavioral analysis", "Pattern recognition", "Trigger identification"],
      color: "from-purple-500 to-purple-600"
    },
    {
      step: 3,
      title: "Get Smart Interventions",
      description: "Receive real-time coaching, proactive alerts, and personalized strategies exactly when you need them to stay on track and overcome procrastination.",
      icon: <Zap className="w-8 h-8" />,
      features: ["Real-time coaching", "Proactive alerts", "Custom strategies"],
      color: "from-green-500 to-green-600"
    },
    {
      step: 4,
      title: "Track & Achieve",
      description: "Monitor your progress with detailed analytics, celebrate milestones, and watch as you consistently achieve your goals faster than ever before.",
      icon: <TrendingUp className="w-8 h-8" />,
      features: ["Progress tracking", "Milestone celebrations", "Achievement analytics"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal-Oriented Approach",
      description: "Every feature is designed to help you achieve your specific life goals"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Intelligence",
      description: "Advanced algorithms provide personalized insights and recommendations"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data-Driven Results",
      description: "Make decisions based on real behavioral data and productivity metrics"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How GoalMaster Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our scientifically-backed approach combines AI technology with behavioral psychology 
            to create the most effective anti-procrastination system.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200"></div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-200">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-10">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <div className="w-8 h-8 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-600 rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why This Approach Works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our methodology is based on proven psychological principles and enhanced with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {benefit.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Success Timeline</h3>
            <p className="text-blue-100">See results from day one, with major improvements in just weeks</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">Day 1</div>
              <div className="text-blue-100 text-sm">Setup complete, AI starts learning</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Week 1</div>
              <div className="text-blue-100 text-sm">First insights and pattern recognition</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Week 2</div>
              <div className="text-blue-100 text-sm">Personalized interventions begin</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Month 1</div>
              <div className="text-blue-100 text-sm">Significant productivity improvements</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
