# Agent Tool Runner

### An AI-Powered Agent System with Natural Language Understanding

[![Live Demo](https://img.shields.io/badge/Live_Demo-vercel.app-black?style=for-the-badge&logo=vercel)](https://agent-tool-runner.vercel.app)
[![API Docs](https://img.shields.io/badge/API_Docs-Render-green?style=for-the-badge&logo=render)](https://agent-tool-runner.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/muasyasila/agent-tool-runner)

---

## Table of Contents

- [Overview](#-overview)
- [What Can It Do?](#-what-can-it-do)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Testing](#-testing-the-agent)
- [Acknowledgments](#-acknowledgments)

---

## Overview

**Agent Tool Runner** is a production-grade full-stack AI application that demonstrates how intelligent agents can understand natural language, dynamically choose tools, and execute tasks step-by-step.

The project combines:

- Natural language understanding
- AI-powered tool execution
- Persistent execution history
- Transparent execution tracing
- Hybrid AI + rule-based architecture

This creates a reliable and scalable AI agent system that continues functioning even when AI services fail.

---

## What Can It Do?

| Category | Example Prompt | Result |
|----------|----------------|--------|
| Math | `"What's 15 percent of 200?"` | `30` |
| Multi-step Reasoning | `"Add 5 and 7 then multiply by 2"` | `24` |
| Time | `"What time is it?"` | Current date & time |
| Echo | `"Say hello world"` | `Echo: hello world` |

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [agent-tool-runner.vercel.app](https://agent-tool-runner.vercel.app) |
| **Backend API** | [agent-tool-runner.onrender.com](https://agent-tool-runner.onrender.com) |
| **API Documentation** | [agent-tool-runner.onrender.com/docs](https://agent-tool-runner.onrender.com/docs) |

---

## Key Features

### Natural Language Understanding
Users interact with the system using plain English without needing any special syntax.

### Dynamic Tool Calling
The AI automatically determines which tool to use based on the user’s intent.

### Execution Tracing
Every action performed by the agent is logged step-by-step for transparency and debugging.

### Persistent History
All agent runs are stored in PostgreSQL for retrieval and future analysis.

### Hybrid AI Architecture
Combines AI-first reasoning with fallback rule-based execution for improved reliability.

### Interactive API Documentation
FastAPI Swagger docs included out of the box.

---

## Architecture

```text
User
  ↓
Vercel Frontend (React)
  ↓
Render Backend (FastAPI)
  ↓
Groq API (Llama 3)
  ↓
PostgreSQL Database (Aiven)
```

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI, Python 3.11, Uvicorn, Docker |
| **Database** | PostgreSQL, SQLAlchemy, Aiven |
| **AI Layer** | Groq API, Llama 3 (70B) |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## API Endpoints

## Execute Agent

### `POST /api/run`

Executes an AI agent task.

### Request Body

```json
{
  "prompt": "What's 15 percent of 200?"
}
```

### Response Example

```json
{
  "success": true,
  "final_response": "30.0",
  "tool_used": "calculator",
  "ai_mode": true,
  "trace": [
    {
      "step": 1,
      "action": "parse_intent",
      "mode": "ai",
      "tool_chosen": "calculator"
    },
    {
      "step": 2,
      "action": "execute_tool",
      "success": true,
      "raw_result": "30.0"
    }
  ]
}
```

---

## History Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/history` | Get recent runs (default: 20) |
| `GET` | `/api/runs/{id}` | Get specific run details |

---

## Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/api/tools` | List available tools |
| `GET` | `/debug/ai-status` | Check AI configuration |

---

## Installation & Setup

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Groq API Key

---

## 1️⃣ Clone Repository & Setup Backend

```bash
git clone https://github.com/muasyasila/agent-tool-runner.git

cd agent-tool-runner/backend

python -m venv venv
```

### Activate Virtual Environment

#### Linux / macOS

```bash
source venv/bin/activate
```

#### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Create `.env`

```env
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key
```

---

## Run Backend Server

```bash
uvicorn main:app --reload
```

---

## 2️⃣ Frontend Setup

```bash
cd ../frontend

npm install

npm run dev
```

---

## 📂 Project Structure

```plaintext
agent-tool-runner/
├── backend/            # FastAPI backend & AI logic
├── frontend/           # React frontend & Tailwind UI
├── .gitignore          # Secrets protection
└── README.md           # Documentation
```

---

## Testing the Agent

| Prompt | Expected Tool | Result |
|--------|----------------|--------|
| `"15 percent of 200"` | `calculator` | `30` |
| `"What time is it?"` | `get_time` | `HH:MM` |
| `"Say hello"` | `echo` | `Echo: hello` |

---

## Acknowledgments

- Groq for providing access to the Llama 3 API
- Render & Vercel for deployment infrastructure
- FastAPI for the excellent backend framework

---

## Author

Built by **Muasya Sila**

---
