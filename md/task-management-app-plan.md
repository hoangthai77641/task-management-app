# Task Management App - Complete Development Plan

## 🎯 Project Overview
**Goal**: Build a full-stack task management application to showcase end-to-end development skills
**Timeline**: 4 weeks (MVP in 2 weeks, advanced features in weeks 3-4)
**Tech Stack**: React + Node.js + PostgreSQL + Docker

## 📋 Tech Stack Details
```
Frontend: React 18 + TypeScript + Tailwind CSS + Vite
Backend: Node.js + Express + TypeScript + Prisma ORM
Database: PostgreSQL (Docker container)
Authentication: JWT + bcrypt
Testing: Jest + React Testing Library + Supertest
Deployment: Vercel (Frontend) + Railway (Backend)
Tools: WebStorm (Frontend) + VS Code (Backend) + Docker Desktop
```

## 🗓️ Week-by-Week Breakdown

### **WEEK 1: Foundation & MVP Backend**

#### Day 1: Project Setup & Environment (2-3 hours)
**Tools**: VS Code + Docker Desktop

1. **Create project structure**:
```
task-management-app/
├── frontend/          # React app (WebStorm)
├── backend/           # Node.js API (VS Code)
├── docker-compose.yml # Database setup
└── README.md
```

2. **Setup PostgreSQL with Docker**:
```bash
# Create docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: taskmanager
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

3. **Initialize backend** (VS Code):
```bash
cd backend
npm init -y
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install -D @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken typescript ts-node nodemon
npm install prisma @prisma/client
```

4. **Setup TypeScript config**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### Day 2: Database Schema & Models (2-3 hours)
**Tool**: VS Code + Prisma

1. **Initialize Prisma**:
```bash
npx prisma init
```

2. **Define database schema** (`prisma/schema.prisma`):
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
}

model Category {
  id    String @id @default(cuid())
  name  String
  color String @default("#3B82F6")
  tasks Task[]
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

3. **Generate Prisma client & migrate**:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Day 3: Authentication API (3-4 hours)
**Tool**: VS Code

1. **Create auth middleware** (`src/middleware/auth.ts`):
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};
```

2. **Create auth routes** (`src/routes/auth.ts`):
```typescript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

#### Day 4: Tasks CRUD API (3-4 hours)
**Tool**: VS Code

1. **Create tasks routes** (`src/routes/tasks.ts`):
```typescript
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks for user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create task
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { title, description, priority, dueDate, categoryId } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId,
        userId: req.userId
      },
      include: { category: true }
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate, categoryId } = req.body;
    
    const task = await prisma.task.update({
      where: { id, userId: req.userId },
      data: {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId
      },
      include: { category: true }
    });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id, userId: req.userId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

#### Day 5: Server Setup & Testing (2-3 hours)
**Tool**: VS Code

1. **Main server file** (`src/index.ts`):
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. **Environment variables** (`.env`):
```
DATABASE_URL="postgresql://admin:password123@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
```

3. **Package.json scripts**:
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### **WEEK 2: Frontend Development**

#### Day 6-7: React Setup & Authentication UI (4-6 hours)
**Tool**: WebStorm

1. **Create React app**:
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios react-router-dom @types/react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Tailwind config** (`tailwind.config.js`):
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **Auth context** (`src/contexts/AuthContext.tsx`):
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token validity here
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email,
      username,
      password
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Day 8-9: Task Management UI (4-6 hours)
**Tool**: WebStorm

1. **Task interface & hooks** (`src/types/Task.ts`):
```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}
```

2. **Task components** (`src/components/TaskCard.tsx`):
```typescript
import React from 'react';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
```

#### Day 10: Integration & Testing (3-4 hours)
**Tools**: WebStorm + VS Code

1. **Connect frontend to backend**
2. **Test all CRUD operations**
3. **Fix bugs and polish UI**
4. **Add loading states and error handling**

### **WEEK 3: Advanced Features**

#### Day 11-12: Categories & Filtering (4-5 hours)
1. **Add categories CRUD API**
2. **Category management UI**
3. **Advanced filtering (by category, priority, date)**
4. **Search functionality**

#### Day 13-14: Enhanced UX (4-5 hours)
1. **Dark/Light mode toggle**
2. **Drag & drop task reordering**
3. **Bulk operations (select multiple tasks)**
4. **Task statistics dashboard**

### **WEEK 4: Polish & Deployment**

#### Day 15-16: Testing & Documentation (4-5 hours)
1. **Unit tests for API endpoints**
2. **Component testing with React Testing Library**
3. **API documentation with Swagger**
4. **README with screenshots and setup instructions**

#### Day 17-18: Deployment (3-4 hours)
1. **Deploy backend to Railway**
2. **Deploy frontend to Vercel**
3. **Environment configuration**
4. **Performance optimization**

## 🚀 Getting Started Commands

### Start Development Environment:
```bash
# Terminal 1: Start database
docker-compose up -d

# Terminal 2: Start backend (VS Code)
cd backend
npm run dev

# Terminal 3: Start frontend (WebStorm)
cd frontend
npm run dev
```

## 📝 Daily Checklist Template

### Each Development Day:
- [ ] Git commit with meaningful message
- [ ] Update progress in project README
- [ ] Test new features manually
- [ ] Check responsive design on mobile
- [ ] Review code for best practices

## 🎯 Success Metrics

### MVP Success (End of Week 2):
- [ ] User can register/login
- [ ] User can create, read, update, delete tasks
- [ ] Tasks persist in database
- [ ] Responsive design works on mobile
- [ ] Basic error handling implemented

### Final Success (End of Week 4):
- [ ] All advanced features working
- [ ] Deployed and accessible online
- [ ] Clean, documented code
- [ ] Professional UI/UX
- [ ] Ready for portfolio showcase

## 📚 Learning Resources

### Documentation:
- [React Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Best Practices:
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)

---

**Next Step**: Start with Day 1 setup. Let me know when you're ready to begin and I'll help you with any specific implementation details!
