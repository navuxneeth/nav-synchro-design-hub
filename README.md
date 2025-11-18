# Nav Synchro Design Hub

A collaborative design feedback and task management platform with AI-powered insights, built for design teams to streamline their workflow.

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Backend Services](#backend-services)
- [Frontend Components](#frontend-components)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

## 🎯 Overview

Nav Synchro Design Hub is a design collaboration platform that helps teams:
- **Communicate** through real-time chat with frame-specific context
- **Give & Receive Feedback** on design frames
- **Manage Tasks** with a kanban board interface
- **Get AI Insights** for design analysis and improvements
- **Track Progress** through comprehensive reports

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Supabase   │ ◄─────► │ AI Gateway  │
│ (React/Vite)│         │   Backend    │         │  (Lovable)  │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        ├── PostgreSQL Database
      │                        ├── Authentication (Auth.users)
      │                        └── Edge Functions (Deno)
      │
      └── UI Components (shadcn-ui + Tailwind)
```

### Component Architecture
```
Frontend (React + TypeScript)
├── Pages
│   ├── Index (Main App)
│   ├── Auth (Login/Signup)
│   ├── ExternalFeedback
│   └── NotFound
│
├── Plugin UI (Main Interface)
│   ├── Chat Tab
│   ├── Feedback Tab
│   ├── Ask AI Tab
│   ├── Tasks Tab
│   └── Reports Tab
│
└── Core Services
    ├── Supabase Client (Database & Auth)
    ├── React Query (State Management)
    └── React Router (Navigation)
```

## 🔄 How It Works

### Complete Workflow Explained

#### 1. **User Authentication Flow**
```
User visits app → Redirected to /auth
     ↓
User signs up/logs in → Supabase Auth creates user
     ↓
Profile created in profiles table → User redirected to main app (/)
     ↓
Session persisted in localStorage → Auto-login on return visits
```

#### 2. **Chat & Collaboration Flow**
```
User opens Chat tab → Selects a frame (e.g., "Home Page")
     ↓
User types message → Message stored in messages table
     ↓
Can @mention team members → Mentions stored in mentions array
     ↓
Messages displayed in real-time → React Query polls for new messages
     ↓
AI can be mentioned → Triggers AI response via chat-ai function
```

#### 3. **Feedback Flow**
```
User opens Feedback tab → Chooses "Give Feedback"
     ↓
Fills feedback form:
  - Selects frame
  - Chooses recipient
  - Provides details
     ↓
Optional: Use AI to clarify feedback → clarify-feedback function refines text
     ↓
Feedback saved to database → Recipient can view in "Received" section
     ↓
Can convert feedback to task → Creates entry in tasks table
```

#### 4. **AI Analysis Flow**
```
User opens Ask AI tab → Selects frame to analyze
     ↓
Chooses analysis type:
  - Layout
  - Typography
  - Color Theory
  - Accessibility
     ↓
Request sent to analyze-frame function
     ↓
AI (Gemini 2.5 Flash) analyzes frame → Returns structured issues
     ↓
Results displayed with:
  - Issue description
  - Severity level
  - Actionable suggestions
     ↓
Results stored in analysis_results table
```

#### 5. **Task Management Flow**
```
User opens Tasks tab → Views in List or Board view
     ↓
Can create task:
  - From chat message
  - From feedback
  - From AI analysis
  - Manually
     ↓
Task details:
  - Title
  - Frame
  - Assignee
  - Status (todo/progress/review/done)
  - Due date
     ↓
Tasks can be:
  - Dragged between columns (Board view)
  - Updated/deleted
  - Filtered by assignee
```

#### 6. **Reports & Analytics Flow**
```
User opens Reports tab → Views team activity
     ↓
Two views:
  1. People View → See tasks by person
  2. Sections View → See tasks by status
     ↓
Click on person → View detailed breakdown:
  - Tasks assigned
  - Tasks by status
  - Feedback received
```

## 💻 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development & optimized builds)
- **UI Library**: shadcn-ui (accessible component library)
- **Styling**: Tailwind CSS (utility-first CSS)
- **State Management**: TanStack React Query (server state)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Platform**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL (relational database)
- **Authentication**: Supabase Auth (JWT-based)
- **Edge Functions**: Deno runtime (serverless functions)
- **AI Integration**: Lovable AI Gateway (Gemini 2.5 Flash)

### Database Tables
1. **profiles** - User information (username, avatar color)
2. **frames** - Design frames (Home Page, Products, etc.)
3. **messages** - Chat messages with mentions
4. **feedback** - Feedback between users
5. **tasks** - Task management with status tracking
6. **analysis_results** - AI-generated design analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun package manager

### Local Development Setup

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd nav-synchro-design-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. **Start development server**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

## 🔧 Backend Services

### Supabase Edge Functions

#### 1. **chat-ai** (`/supabase/functions/chat-ai`)
- **Purpose**: Powers AI assistant in chat
- **Input**: User messages + context (frame info)
- **Process**: 
  - Sends messages to Lovable AI Gateway
  - Uses Gemini 2.5 Flash model
  - Provides design-focused assistance
- **Output**: AI-generated response
- **Use Cases**: Design advice, accessibility tips, layout suggestions

#### 2. **analyze-frame** (`/supabase/functions/analyze-frame`)
- **Purpose**: Analyzes design frames for issues
- **Input**: Frame name + analysis type
- **Process**:
  - AI analyzes based on type (layout, typography, color, accessibility)
  - Returns structured JSON with issues
- **Output**: Array of issues with severity and suggestions
- **Use Cases**: Design audits, accessibility checks, best practice reviews

#### 3. **clarify-feedback** (`/supabase/functions/clarify-feedback`)
- **Purpose**: Refines vague feedback into actionable items
- **Input**: Raw feedback + area + issue + expectation
- **Process**: AI rewrites feedback to be clear and constructive
- **Output**: Refined, professional feedback text
- **Use Cases**: Improving feedback quality, reducing ambiguity

### Database Row Level Security (RLS)

All tables use Supabase RLS for security:
- **Public Read**: Frames (anyone can view design frames)
- **Authenticated Actions**: Messages, feedback, tasks (only logged-in users)
- **User-Specific**: Profiles (users can only edit their own)

## 🎨 Frontend Components

### Main Components

#### PluginUI
Central hub with tabbed interface:
- Chat Tab → Team communication
- Feedback Tab → Give/receive feedback
- Ask AI Tab → Get AI design insights
- Tasks Tab → Manage tasks (list/board views)
- Reports Tab → Team analytics

#### Authentication
- Login/Signup forms
- OAuth integration (via Supabase)
- Session management
- Protected routes

#### Task Management
- **ListView**: Table view with sorting/filtering
- **BoardView**: Kanban board with drag-and-drop
- **CreateTaskDialog**: Modal for creating tasks

#### Feedback System
- **GiveFeedback**: Form with AI clarification
- **ReceivedFeedback**: Inbox for feedback
- Convert feedback to tasks

## 📊 Database Schema

```sql
-- User Profiles
profiles (id, username, avatar_color, created_at, updated_at)

-- Design Frames
frames (id, name, description, created_at)

-- Chat Messages
messages (id, user_id, author_name, content, type, frame_id, mentions[], created_at)

-- Feedback
feedback (id, from_user_id, to_user_id, frame_id, summary, details, area, created_at)

-- Tasks
tasks (id, title, frame_id, assignee_id, status, origin, due_date, created_at, updated_at)

-- AI Analysis Results
analysis_results (id, frame_id, analysis_type, issue, severity, suggestion, created_at)
```

## 🌐 Deployment

### Via Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/fe866c61-ed42-4c00-a809-826e7a265395)
2. Click Share → Publish
3. Your app is live!

### Custom Domain
Navigate to Project > Settings > Domains and connect your domain.
[Learn more](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Manual Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform
4. Configure Supabase URL in production

## 🔐 Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

Backend (Edge Functions):
- `LOVABLE_API_KEY` - API key for AI services (set in Supabase dashboard)

## 📝 Development Workflow

### Making Changes

**Via Lovable (Recommended)**
- Visit [Lovable Project](https://lovable.dev/projects/fe866c61-ed42-4c00-a809-826e7a265395)
- Use natural language prompts
- Changes auto-commit to this repo

**Via Local IDE**
```bash
# Make changes locally
git checkout -b feature/your-feature
# ... make changes ...
git commit -m "Your changes"
git push origin feature/your-feature
# Changes sync with Lovable
```

**Via GitHub**
- Edit files directly in GitHub
- Changes automatically deploy

**Via GitHub Codespaces**
- Click Code → Codespaces → New codespace
- Full development environment in browser

## 🧪 Testing & Linting

```bash
# Run linter
npm run lint

# Build for production (validates TypeScript)
npm run build
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn-ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.
