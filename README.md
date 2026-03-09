# AI Support Agent Platform

An AI-powered customer support platform that automatically classifies user intent, answers frequently asked questions, and escalates complex issues to human agents — built with FastAPI, LangGraph, and React.

## Live Demo

- Frontend: [YOUR_VERCEL_URL]
- Backend API: [YOUR_RAILWAY_URL]

---

## Architecture
```
User → React Chat UI → FastAPI POST /chat
              ↓
       LangGraph Pipeline
              ↓
   ┌─── Intent Classifier ───┐
   ↓                         ↓
 faq / greeting / goodbye   billing / technical / complaint
   ↓                         ↓
 FAQ Agent              Escalation Agent
   ↓                         ↓
   └────── Summary Agent ────┘
              ↓
     MongoDB (messages + tickets)
              ↓
     Response → React Chat UI
```

---

## Features

- Multi-agent AI pipeline using LangGraph with 5 specialized nodes
- Intent classification using Groq LLM (llama-3.1-8b-instant)
- Automatic FAQ answering with conversation history context
- Smart escalation routing for billing, technical, and complaint issues
- Session-based conversational memory persisted in MongoDB
- React chat UI with typing indicator and escalation alerts
- Admin dashboard with ticket stats, filters, and status tracking

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python + FastAPI | REST API backend |
| LangGraph | Multi-agent orchestration |
| LangChain + Groq | LLM integration |
| MongoDB | Message and ticket storage |
| React + Vite | Frontend chat UI and dashboard |
| Railway | Backend deployment |
| Vercel | Frontend deployment |
| MongoDB Atlas | Cloud database |

---

## Project Structure
```
ai-support-agent/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── agents/
│   │   ├── state.py             # AgentState TypedDict
│   │   ├── graph.py             # LangGraph pipeline
│   │   └── nodes.py             # All 5 agent node functions
│   ├── api/
│   │   └── routes.py            # /chat and /api/tickets endpoints
│   ├── db/
│   │   ├── mongodb.py           # MongoDB connection and queries
│   │   └── models.py            # Pydantic request/response models
│   ├── data/
│   │   └── faqs.py              # FAQ list
│   └── seed/
│       └── seed_data.py         # Demo data generator
└── frontend/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── pages/
        │   ├── ChatPage.jsx     # Main chat interface
        │   └── AdminPage.jsx    # Admin ticket dashboard
        ├── components/
        │   ├── ChatBox.jsx      # Scrollable message list
        │   ├── Message.jsx      # Individual message bubble
        │   ├── InputBox.jsx     # Text input and send button
        │   └── TicketDashboard.jsx  # Ticket table
        └── services/
            └── api.js           # Backend API calls
```

---

## Local Setup

### Backend
```bash
git clone https://github.com/YOUR_USERNAME/ai-support-agent.git
cd ai-support-agent/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=ai_support_agent
SECRET_KEY=any_random_string
```
```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Seed Demo Data (optional)
```bash
cd backend
python seed/seed_data.py
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/chat` | Send a message, get AI response |
| GET | `/api/tickets` | Get all support tickets |

### POST /chat — Example

Request:
```json
{
  "session_id": "abc123",
  "message": "How do I reset my password?"
}
```

Response:
```json
{
  "response": "You can reset your password by clicking Forgot Password...",
  "intent": "faq",
  "escalated": false
}
```

---

## Agent Pipeline

| Node | Role |
|------|------|
| classify_intent | LLM classifies message into: greeting, faq, billing, technical, complaint, goodbye |
| route_intent | Routes to faq_agent or escalation_agent based on intent |
| faq_agent | Answers from FAQ list or escalates if no match found |
| escalation_agent | Sets escalated=true and generates handoff message |
| summary_agent | Safety fallback — ensures response is never empty |

---

## Getting Free API Keys

| Service | Link | Free Tier |
|---------|------|-----------|
| Groq API | console.groq.com | Permanently free |
| MongoDB Atlas | mongodb.com/atlas | 512MB free |
| Railway | railway.app | Free starter |
| Vercel | vercel.app | Always free |