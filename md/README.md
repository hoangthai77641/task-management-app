# 🚀 Anti-Procrastination Life Goal Achievement App

A comprehensive AI-powered productivity platform designed to help you overcome procrastination, build positive habits, and achieve meaningful life goals.

## ✨ Features

### 🎯 **Life Goal Management**
- Create and track long-term life goals across multiple categories
- Break down goals into actionable milestones
- AI-powered goal suggestions and optimization
- Progress visualization with completion tracking

### 📋 **Smart Task Management**
- Advanced task creation with deadlines and duration estimation
- Two distinct timer types:
  - **Alarm Timer**: For specific deadline tasks with notification alerts
  - **Work Timer**: For duration-based tasks with progress tracking
- Real-time progress monitoring with visual indicators
- Audio and voice notifications for deadline alerts

### 🔄 **Habit Tracking System**
- Build positive daily, weekly, and monthly habits
- Streak tracking with gamification elements
- Habit difficulty and energy requirement assessment
- Visual progress indicators and completion rates

### 🤖 **AI Life Coach**
- Personalized motivation and guidance
- Real-time procrastination detection and intervention
- Contextual advice based on your behavior patterns
- Emotional state tracking and mood-based recommendations

### 🏆 **Rewards & Gamification**
- Achievement system with multiple rarity levels
- Experience points and leveling system
- Virtual coins and reward unlocking
- Progress celebration and milestone recognition

### 📊 **Progress Analytics**
- Comprehensive productivity insights and statistics
- Peak performance hour identification
- Goal completion rate analysis
- Habit consistency tracking
- AI-powered personalized recommendations

### 🧠 **Procrastination Detection**
- Advanced behavioral pattern analysis
- Real-time risk assessment
- Personalized intervention strategies
- Trigger identification and prevention

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Router** for seamless navigation
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **Prisma ORM** with PostgreSQL database
- **JWT Authentication** for secure user sessions
- **RESTful API** design

### AI Integration (Planned)
- **OpenAI GPT-4** for natural language coaching
- **Local AI models** for privacy-sensitive analysis
- **Behavioral prediction algorithms**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/anti-procrastination-app.git
cd anti-procrastination-app
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/antiprocrastination"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
```

5. **Set up the database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

6. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`

## 📱 Usage Guide

### Getting Started
1. **Sign up** for a new account or **log in** to existing account
2. Complete the **onboarding process** to set your preferences
3. Start by creating your first **life goal** or **task**

### Creating Life Goals
1. Navigate to **🎯 Life Goals** section
2. Click **"+ New Goal"** button
3. Fill in goal details:
   - Title and description
   - Category (Health, Career, Education, etc.)
   - Timeframe (Short-term, Medium-term, Long-term)
   - Importance and difficulty levels
   - Target completion date
4. Add **milestones** to break down your goal
5. Track progress and receive AI insights

### Managing Tasks
1. Go to **📋 Tasks** section
2. Create new tasks with:
   - Title and description
   - Priority level
   - Deadline (for Alarm Timer)
   - Estimated duration (for Work Timer)
3. Use timers to stay focused:
   - **Alarm Timer**: Set for specific deadline tasks
   - **Work Timer**: Use for time-boxed work sessions
4. Enable notifications for deadline alerts

### Building Habits
1. Visit **🔄 Habits** section
2. Create habits by specifying:
   - Habit title and description
   - Frequency (Daily, Weekly, Monthly)
   - Target count per period
   - Difficulty and energy requirements
3. Log daily progress and maintain streaks
4. View habit analytics and completion rates

### AI Coach Interaction
1. Click the **🤖 AI Coach** floating button
2. Share your current mood and challenges
3. Receive personalized advice and motivation
4. Get real-time procrastination interventions
5. Follow AI recommendations for better productivity

### Tracking Progress
1. Check **📊 Analytics** for comprehensive insights
2. View productivity metrics and trends
3. Identify peak performance hours
4. Review goal and habit completion rates
5. Get AI-powered improvement suggestions

### Earning Rewards
1. Complete tasks and goals to earn experience points
2. Maintain habit streaks for bonus rewards
3. Unlock achievements across different categories
4. Level up and earn virtual coins
5. View progress in **🏆 Rewards** section

## 🎨 User Interface

### Navigation
- **📋 Tasks**: Task management with smart timers
- **🎯 Life Goals**: Long-term goal planning and tracking
- **🔄 Habits**: Daily habit building and monitoring
- **🏆 Rewards**: Achievement system and gamification
- **📊 Analytics**: Progress insights and recommendations

### Key Components
- **Smart Timers**: Alarm and Work timer modes
- **AI Coach Modal**: Interactive coaching interface
- **Procrastination Alerts**: Real-time intervention system
- **Progress Dashboards**: Visual analytics and insights
- **Achievement System**: Gamified reward tracking

## 🔧 Configuration

### Notification Settings
- Enable/disable audio notifications
- Configure voice reminder preferences
- Set notification intervals and timing
- Customize alert sounds and messages

### AI Coach Preferences
- Set coaching style and tone
- Configure intervention sensitivity
- Choose preferred motivation techniques
- Customize behavioral analysis depth

### Privacy Settings
- Control data sharing preferences
- Manage AI analysis permissions
- Set habit and goal visibility
- Configure analytics data retention

## 🚦 Development

### Project Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── goals/
│   │   │   ├── habits/
│   │   │   ├── rewards/
│   │   │   └── tasks/
│   │   ├── contexts/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run test suite

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Tasks:**
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Goals:**
- `GET /api/goals` - Get life goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

**Habits:**
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `POST /api/habits/:id/log` - Log habit completion

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration capabilities
- React and TypeScript communities
- Tailwind CSS for beautiful styling
- Prisma for excellent database tooling

## 📞 Support

For support, email support@antiprocrastination-app.com or join our Discord community.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core task management with smart timers
- ✅ Life goal planning and tracking
- ✅ Habit building system
- ✅ AI coach integration
- ✅ Reward and achievement system
- ✅ Progress analytics dashboard

### Phase 2 (Upcoming)
- 🔄 Social accountability features
- 🔄 Mindfulness and focus tools
- 🔄 Advanced AI recommendations
- 🔄 Mobile app development
- 🔄 Team collaboration features

### Phase 3 (Future)
- 📱 Native mobile applications
- 🌐 Web extension for browser integration
- 🤝 Third-party app integrations
- 📊 Advanced analytics and reporting
- 🎯 Enterprise features

---

**Made with ❤️ for productivity enthusiasts and goal achievers**