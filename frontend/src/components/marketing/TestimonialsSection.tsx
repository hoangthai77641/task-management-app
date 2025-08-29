import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "GoalMaster completely transformed how I approach my goals. The AI coach feels like having a personal productivity expert available 24/7. I've achieved more in 3 months than I did in the entire previous year!",
      rating: 5,
      achievement: "Completed MBA while working full-time"
    },
    {
      name: "Marcus Rodriguez",
      role: "Entrepreneur",
      company: "StartupXYZ",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The procrastination detection is incredible. It catches me before I even realize I'm avoiding tasks. The gamification keeps me motivated, and I love seeing my progress streaks grow.",
      rating: 5,
      achievement: "Launched 2 successful products"
    },
    {
      name: "Emily Watson",
      role: "Graduate Student",
      company: "Stanford University",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "As someone who struggled with ADHD and procrastination, this app has been life-changing. The personalized interventions and habit tracking helped me finish my thesis ahead of schedule.",
      rating: 5,
      achievement: "Finished PhD thesis 6 months early"
    },
    {
      name: "David Kim",
      role: "Software Engineer",
      company: "Google",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The analytics dashboard gives me insights I never had before. I can see exactly when I'm most productive and plan my day accordingly. The AI recommendations are spot-on.",
      rating: 5,
      achievement: "Promoted to Senior Engineer"
    },
    {
      name: "Lisa Thompson",
      role: "Fitness Coach",
      company: "FitLife Studios",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "I use GoalMaster for both personal goals and helping my clients. The habit tracking and reward system keeps everyone motivated. My client retention has increased by 40%!",
      rating: 5,
      achievement: "Built 6-figure coaching business"
    },
    {
      name: "Alex Johnson",
      role: "Creative Director",
      company: "Design Agency",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content: "The real-time progress tracking and deadline alerts saved my career. I went from missing deadlines to being the most reliable person on my team. The AI coach understands my work style perfectly.",
      rating: 5,
      achievement: "Won 'Employee of the Year'"
    }
  ];

  const stats = [
    { number: "94%", label: "Report improved productivity" },
    { number: "87%", label: "Achieve their goals faster" },
    { number: "92%", label: "Reduce procrastination significantly" },
    { number: "89%", label: "Would recommend to others" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Results from Real People
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful individuals who have transformed their lives with GoalMaster
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Achievement Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="text-sm font-medium text-green-800">
                  🏆 {testimonial.achievement}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-blue-600">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join These Success Stories?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your transformation today with our 14-day free trial. 
              No credit card required, cancel anytime.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Start Your Success Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
