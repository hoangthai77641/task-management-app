import React from 'react';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic productivity features",
      features: [
        "Basic task management",
        "Simple goal tracking",
        "Limited AI insights (5/month)",
        "Basic habit tracking",
        "Mobile web access",
        "Community support"
      ],
      cta: "Get Started Free",
      popular: false,
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "Advanced features for serious goal achievers and productivity enthusiasts",
      features: [
        "Everything in Free",
        "Unlimited AI coaching",
        "Advanced procrastination detection",
        "Detailed analytics & insights",
        "Custom habit templates",
        "Priority support",
        "Offline access",
        "Export data"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "per month",
      description: "Complete solution for teams and organizations focused on productivity",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Admin dashboard",
        "Custom integrations",
        "Advanced reporting",
        "SSO authentication",
        "Dedicated support",
        "Custom training"
      ],
      cta: "Contact Sales",
      popular: false,
      icon: <Crown className="w-6 h-6" />
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Success Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core anti-procrastination features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${
                plan.popular 
                  ? 'ring-2 ring-blue-600 scale-105 z-10' 
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                    <div className="text-sm text-gray-500">{plan.period}</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <span>✓ SSL Security</span>
            <span>✓ GDPR Compliant</span>
            <span>✓ 99.9% Uptime</span>
            <span>✓ Money-back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
