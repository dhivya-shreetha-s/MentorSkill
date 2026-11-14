# MentorSkill — Complete AI-Powered Career Development Platform

> **"Your Skills. Your Career. Your AI Mentor."**  
> *Autonomous Multi-Agent Career Guidance, Dynamic Readiness Scoring & Performance-Adaptive Learning Roadmaps.*

---

## 🌟 Executive Summary

**MentorSkill** is a production-grade, full-stack AI career development SaaS that solves a fundamental challenge: *traditional learning platforms recommend the same generic courses to everyone without understanding their actual proficiency, skill gaps, or evolving career trajectories.*

MentorSkill employs a collaborative **6-Agent Multi-AI System** powered by **Groq LPU hardware and LLaMA 3.3 / GPT-OSS high-throughput models** orchestrated through a central coordinator. The platform analyzes self-reported and assessment-tested abilities, maps gaps against authoritative industry catalogs, creates dynamic 4-stage roadmaps, and adapts curricula in real time when assessment performance drops below thresholds.

---

## 🤖 Multi-Agent AI Architecture

MentorSkill implements six specialized agents collaborating through a central orchestrator:

```
                    ┌─────────────────────────┐
                    │    Central AI Engine    │
                    │      (Orchestrator)     │
                    └───────────┬─────────────┘
                                │
   ┌────────────────┬───────────┼───────────┬────────────────┐
   │                │           │           │                │
┌──▼───────┐ ┌──────▼─────┐ ┌───▼─────┐ ┌───▼──────────┐ ┌───▼──────────┐ ┌──────────────┐
│  Agent 1 │ │   Agent 2  │ │ Agent 3 │ │   Agent 4    │ │   Agent 5    │ │   Agent 6    │
│  Skill   │ │   Career   │ │ Roadmap │ │   Learning   │ │  Assessment  │ │  AI Mentor   │
│ Analyzer │ │Intelligence│ │ Planner │ │   Resource   │ │  & Progress  │ │ & Adaptation │
└──────────┘ └────────────┘ └─────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

1. **Skill Analyzer Agent (`skillAnalyzer.js`)**: Evaluates user profile, certifications, projects, and assessment evidence. Distinguishes verified vs self-reported skills, assigning calibrated confidence scores (0.0 – 1.0).
2. **Career Intelligence Agent (`careerIntelligence.js`)**: Analyzes industry criteria for 8 technical roles. Executes mathematical gap calculations, prioritizing missing vs weak skills and computing an authoritative **Career Readiness Index (%)**.
3. **Roadmap Planner Agent (`roadmapPlanner.js`)**: Synthesizes a structured 4-stage learning path (*Beginner → Intermediate → Advanced → Industry Readiness*). Sequences prerequisite skills, calculates estimated hours, and pairs milestones with practical coding exercises and completion criteria.
4. **Learning Resource Agent (`learningResource.js`)**: Curates verified tutorials, interactive courses, documentation, and videos from trusted providers (MDN, freeCodeCamp, React Docs, Node.js Docs, Python Docs, W3Schools). Never invents fabricated URLs.
5. **Assessment & Progress Agent (`assessmentAgent.js`)**: Dynamically grades assessments, identifies weak topics, and determines if the learner meets threshold requirements (Passing threshold: 70%, Remedial threshold: <50%).
6. **AI Mentor & Adaptation Agent (`mentorAgent.js`)**: Context-aware conversational mentor that answers career strategy questions, detects poor quiz performance, updates proficiency levels, and injects remedial milestones into active roadmaps.

---

## 🛠 Technology Stack

- **Frontend:** React 18, Vite, JavaScript/JSX, Tailwind CSS, React Router DOM v6, Lucide React icons, Recharts (Radar, Line, Bar charts), Axios, Supabase JS SDK.
- **Backend:** Node.js v24, Express.js (ES Modules), Groq SDK (`groq-sdk`), Supabase SDK (`@supabase/supabase-js`), CORS, Dotenv.
- **AI Acceleration:** Groq Cloud LPU API (`openai/gpt-oss-120b` / `llama-3.3-70b-versatile`).
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) policies, JWT bearer authentication, fallback in-memory store for high-availability hackathon demonstration resilience.

---

## 📁 Project Structure

```
MentorSkill/
├── backend/
│   ├── agents/                   # The 6 Specialized AI Agents
│   │   ├── skillAnalyzer.js
│   │   ├── careerIntelligence.js
│   │   ├── roadmapPlanner.js
│   │   ├── learningResource.js
│   │   ├── assessmentAgent.js
│   │   └── mentorAgent.js
│   ├── orchestrator/             # Agent Orchestration Workflows
│   │   ├── agentOrchestrator.js
│   │   └── workflowManager.js
│   ├── controllers/              # REST API Controllers
│   ├── routes/                   # Express Routers
│   ├── services/                 # Groq & Supabase SDK Wrappers
│   ├── middleware/               # Auth & Error Handlers
│   ├── data/                     # Authoritative Seed Catalog
│   ├── utils/                    # High-Availability Store
│   ├── supabase/migrations/      # SQL Schema & Seed Migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_seed_data.sql
│   │   └── FULL_DATABASE_SETUP.sql
│   ├── server.js                 # Express Application Entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Layout, Sidebar, TopNav, AgentActivityPanel
│   │   ├── contexts/             # AuthContext with 1-Click Demo Profile Switcher
│   │   ├── lib/                  # Supabase & Axios Clients
│   │   ├── pages/                # 12 Functional Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── OnboardingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SkillAssessmentPage.jsx
│   │   │   ├── CareerExplorerPage.jsx
│   │   │   ├── SkillGapPage.jsx
│   │   │   ├── RoadmapPage.jsx
│   │   │   ├── LearningHubPage.jsx
│   │   │   ├── AIMentorPage.jsx
│   │   │   └── ProgressPage.jsx
│   │   ├── App.jsx
│   │   └── index.css             # Dark Navy (#020817) & Violet Glassmorphism
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm installed

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*The backend server will start on `http://localhost:5000`.*
*Health Check endpoint: `http://localhost:5000/health`.*

### 2. Frontend Setup
```bash
cd frontend
pnpm install # or npm install
npm run dev
```
*The Vite frontend will run at `http://localhost:5173`.*

---

## ⚡ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
SUPABASE_URL=https://qejmpopvibkjwaarexsg.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_C60SCo0D4UR7Wow4eDFIWg_PlzweXBL
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://qejmpopvibkjwaarexsg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_C60SCo0D4UR7Wow4eDFIWg_PlzweXBL
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Database Setup Instructions

All 15 tables, indexes, triggers, and comprehensive seed data (8 career tracks, 64+ assessment questions, 28+ verified learning resources) are pre-packaged in:
```
backend/supabase/migrations/FULL_DATABASE_SETUP.sql
```

To run migrations directly in Supabase:
1. Open your project at [Supabase Dashboard](https://supabase.com/dashboard/project/qejmpopvibkjwaarexsg).
2. Navigate to **SQL Editor** in the left sidebar.
3. Paste the contents of `backend/supabase/migrations/FULL_DATABASE_SETUP.sql`.
4. Click **Run**. All tables, RLS security policies, and seed data will be created instantly.

---

## 👤 Sample Demonstration Learner (Alex Johnson)

A pre-configured demo learner is built into the application for immediate hackathon evaluation:
- **Name:** Alex Johnson
- **Academic:** Senior (4th Year), Stanford University, Computer Science
- **Target Career:** Full Stack Developer
- **Existing Skills:** Python (Advanced), SQL (Intermediate), HTML (Beginner)
- **Identified Gaps:** JavaScript, React, Node.js, CSS, REST APIs, Git
- **Career Readiness Score:** 42.5% (Baseline)

*To explore directly without creating a new email account, visit `/auth` and click the violet **"Explore as Alex Johnson (Demo Profile)"** button!*

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server uptime & service status |
| `GET` | `/api/careers` | 8 Industry career tracks with required competencies |
| `GET` | `/api/assessments` | Interactive quiz catalogue with difficulty and questions |
| `POST`| `/api/assessments/submit` | Grade assessment, record result & trigger adaptation |
| `GET` | `/api/profile` | Learner profile and current career goal |
| `PUT` | `/api/profile` | Update profile information |
| `GET` | `/api/skills` | User skills inventory with proficiency tags |
| `POST`| `/api/skills` | Add new skill (self-reported or verified) |
| `POST`| `/api/analysis/run` | Trigger 4-agent Initial Career Analysis pipeline |
| `GET` | `/api/analysis/logs` | Real-time agent execution telemetry logs |
| `GET` | `/api/roadmaps/current` | Active 4-stage personalized roadmap & milestones |
| `PUT` | `/api/roadmaps/milestones/:id` | Update milestone completion status |
| `GET` | `/api/resources` | Curated documentation & course links |
| `POST`| `/api/mentor/chat` | Real-time Groq LLM conversational career guidance |
| `GET` | `/api/progress` | Learning velocity, quiz history & readiness trend |

---

## 🏆 Key Differentiating Features

- **Adaptive Learning Engine:** Automatically inserts remedial milestones and flags weak topics whenever an assessment score falls below 50%.
- **Live Groq LPU Integration:** 100% real LLM execution with sub-second response times for complex career mentoring and structured roadmap planning.
- **Career Readiness Radar:** Visual Recharts radar diagram comparing user proficiency against industry job benchmarks.
- **Transparent Agent Activity Panel:** Telemetry log showing exact agent names, workflows, input/output summaries, and millisecond execution times.
- **High-Availability Hybrid Architecture:** Seamless failover between Supabase and resilient in-memory store so the application functions flawlessly under any network condition.

---
*MentorSkill — Built with precision for the 8-Hour Solo Hackathon.*
