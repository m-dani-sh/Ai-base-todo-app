# Smart Todo List with AI Integration

A comprehensive full-stack web application for intelligent task management with AI-powered features including task prioritization, deadline suggestions, and context-aware recommendations.

## 📋 Features

### Core Functionality
- ✅ **Task Management**: Complete CRUD operations for tasks with priority scoring
- 📝 **Context Processing**: Analyze daily context (messages, emails, notes) for task insights
- 🤖 **AI Integration**: OpenAI/Claude/Gemini APIs or local LLM support via LM Studio
- 📊 **Smart Categorization**: Auto-suggest task categories and tags
- ⚡ **Priority Scoring**: AI-powered task prioritization (0-100 scale)
- 📅 **Deadline Suggestions**: Intelligent deadline recommendations
- 🎯 **Context-Aware**: Extract tasks from daily context automatically

### AI-Powered Features
- **Task Prioritization**: Use AI to rank tasks based on urgency and context
- **Deadline Suggestions**: Recommend realistic deadlines based on task complexity
- **Smart Categorization**: Auto-suggest task categories and tags
- **Task Enhancement**: Improve task descriptions with context-aware details
- **Context Analysis**: Process daily context to understand user's schedule and priorities

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx         # Dashboard page
│   │   └── ...              # Additional dashboard pages
│   ├── context/
│   │   ├── page.tsx         # Context page
│   │   └── ...              # Additional context pages
│   ├── task/
│   │   ├── page.tsx         # Task page
│   │   └── ...              # Additional task pages
│   └── ...                  # Other app-level routes
├── components/              # Reusable components
│   ├── navigation.tsx       # Navigation component
│   ├── quick-add-task.tsx   # Quick add task component
│   ├── task-card.tsx        # Task card component
│   ├── theme-toggle.tsx     # Theme toggle component
│   └── ...                  # Other components
├── lib/                     # API helpers and configs
│   ├── node_modules/        # Node modules (if applicable)
│   ├── public/              # Static assets
│   └── ...                  # Other lib files
├── styles/                  # Tailwind & global styles
│   ├── globals.css          # Global styles
│   └── ...                  # Other style files
├── tailwind.config.ts       # Tailwind configuration
└── README.md                # Project documentation
backend/
├── smart_todo/              # Main Django project settings
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py          # Project configuration
│   ├── urls.py              # URL routing
│   └── wsgi.py
├── tasks/                   # Task management app
│   ├── __init__.py
│   ├── admin.py             # Admin panel configuration
│   ├── apps.py
│   ├── context/             # Daily context sub-app
│   │   ├── __init__.py
│   │   ├── models.py        # Context models
│   │   ├── views.py         # Context views
│   │   └── ...              # Other context files
│   ├── ai_integration/      # AI service module
│   │              
│   ├── migrations/          # Database migrations
│   ├── models.py            # Task models
│   ├── serializers.py       # API serializers
│   ├── tests.py             # Test cases
│   ├── urls.py              # App URL routing
│   ├── views.py             # Task views
│   └── ...                  # Other task files
├── manage.py                # Django management script
├── requirements-simple.txt  # Project dependencies
└── README.md                # Project documentation
```

## 🛠️ Tech Stack
### Frontend 
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context/Redux Toolkit
- **UI Components**: Modern responsive design



### Backend
- **Framework**: Django 4.2.7 + Django REST Framework 3.14.0
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI Integration**: Google Gemini 
- **Authentication**: Django Session Authentication
- **API Documentation**: DRF built-in docs

## 🚀 Quick Start
### Frontend Setup 

. **Clone and navigate to backend**:
   ```bash
   cd frontend
  then
   npm install 


   ```
Frontend available at: `http://localhost:3000`

### Backend Setup

1. **Clone and navigate to backend**:
   ```bash
   cd backend 
   
   cd smart_todo

   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements-simple.txt
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```
4. **.env file Add api key**:
<br>

 ```bash

GEMINI_API_KEY = your actual key 
 ```

5. **Start development server**:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## UI Screenshots

### Dashboard
![Dashboard UI](https://github.com/m-dani-sh/Ai-base-todo-app/tree/main/frontend/images/dashboard.png)

### Task Page
![Task UI](https://github.com/m-dani-sh/Ai-base-todo-app/tree/main/frontend/images/addtask.png)

### Context Page
![Task UI](https://github.com/m-dani-sh/Ai-base-todo-app/tree/main/frontend/images/context.png)


## 🗄️ Database Schema

### Tasks App
- **Task**: Main task model with AI-enhanced fields
- **Category**: Task categories and tags
- **TaskComment**: Comments and updates on tasks

### Context App
- **ContextEntry**: Daily context data (messages, emails, notes)
- **ContextInsight**: AI-extracted insights from context
- **ContextProcessingLog**: Processing activity logs

### AI Integration App
- **AIProvider**: AI service provider configurations
- **AIRequest**: Track AI API requests and responses
- **UserAIPreferences**: User AI settings and preferences
- **TaskAIAnalysis**: AI analysis results for tasks




---

**📌 Final Notes**: 
Backend is fully functional and supports real and mock AI integration.

Frontend is actively in development — all API-ready features can be wired in.

LM Studio recommended for private AI task processing without API keys.

Built as a robust showcase of AI x productivity web app development.

🧑‍💻 Author
Muhammad Danish 
<br>
[LinkedIn](https://www.linkedin.com/in/muhammad-danish-2256522a1/) | [GitHub](https://github.com/m-dani-sh)