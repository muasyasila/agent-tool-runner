<div align="center">



\# Agent Tool Runner



\### An AI-Powered Agent System with Natural Language Understanding



\[!\[Live Demo](https://img.shields.io/badge/Live\_Demo-vercel.app-black?style=for-the-badge\&logo=vercel)](https://agent-tool-runner.vercel.app)

\[!\[API Docs](https://img.shields.io/badge/API\_Docs-Render-green?style=for-the-badge\&logo=render)](https://agent-tool-runner.onrender.com/docs)

\[!\[GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/muasyasila/agent-tool-runner)



</div>



\---



\## 📖 Table of Contents



\- \[Overview](#-overview)

\- \[Live Demo](#-live-demo)

\- \[Key Features](#-key-features)

\- \[Architecture](#-architecture)

\- \[Technology Stack](#-technology-stack)

\- \[API Endpoints](#-api-endpoints)

\- \[Installation \& Setup](#-installation--setup)

\- \[Environment Variables](#-environment-variables)

\- \[Deployment](#-deployment)

\- \[Testing](#-testing-the-agent)



\---



\## 🎯 Overview



\*\*Agent Tool Runner\*\* is a production-grade, full-stack application that demonstrates how AI agents can understand natural language and execute tools.



\### What Can It Do?



| Category | Example | Result |

|----------|---------|--------|

| Math | "What's 15 percent of 200?" | 30 |

| Multi-step | "Add 5 and 7 then multiply by 2" | 24 |

| Time | "What time is it?" | Current date \& time |

| Echo | "Say hello world" | Echo: hello world |



\---



\## 🌐 Live Demo



| Service | URL |

|---------|-----|

| \*\*Frontend\*\* | \[agent-tool-runner.vercel.app](https://agent-tool-runner.vercel.app) |

| \*\*Backend API\*\* | \[agent-tool-runner.onrender.com](https://agent-tool-runner.onrender.com) |

| \*\*API Docs\*\* | \[agent-tool-runner.onrender.com/docs](https://agent-tool-runner.onrender.com/docs) |



\---



\## ✨ Key Features



\- \*\*Natural Language Understanding\*\* - No special syntax required

\- \*\*Tool Calling Pattern\*\* - AI decides which tool to use

\- \*\*Execution Tracing\*\* - See step-by-step what the agent did

\- \*\*Persistent History\*\* - Every run saved to PostgreSQL

\- \*\*Hybrid Architecture\*\* - AI mode with rule-based fallback



\---



\## 🏗️ Architecture

User → Vercel (React) → Render (FastAPI) → Groq AI (Llama 3)

↓

PostgreSQL (Aiven)



text



\---



\## 📚 Technology Stack



| Layer | Technologies |

|-------|--------------|

| \*\*Frontend\*\* | React 19, Vite, Tailwind CSS, Lucide Icons |

| \*\*Backend\*\* | FastAPI, Python 3.11, Uvicorn, Docker |

| \*\*Database\*\* | PostgreSQL, SQLAlchemy, Aiven |

| \*\*AI\*\* | Groq API, Llama 3 (70B) |

| \*\*Hosting\*\* | Vercel (frontend), Render (backend) |



\---



\## 📡 API Endpoints



\### Agent Execution



\*\*POST\*\* `/api/run`



\*\*Request Body:\*\*

```json

{

&#x20; "prompt": "What's 15 percent of 200?"

}

Response:



json

{

&#x20; "success": true,

&#x20; "final\_response": "30.0",

&#x20; "tool\_used": "calculator",

&#x20; "ai\_mode": true,

&#x20; "trace": \[

&#x20;   {

&#x20;     "step": 1,

&#x20;     "action": "parse\_intent",

&#x20;     "mode": "ai",

&#x20;     "tool\_chosen": "calculator"

&#x20;   },

&#x20;   {

&#x20;     "step": 2,

&#x20;     "action": "execute\_tool",

&#x20;     "success": true,

&#x20;     "raw\_result": "30.0"

&#x20;   }

&#x20; ]

}

History Endpoints

Method	Endpoint	Description

GET	/api/history	Get recent runs (default 20)

GET	/api/runs/{id}	Get specific run details

Utility Endpoints

Method	Endpoint	Description

GET	/health	Service health check

GET	/api/tools	List available tools

GET	/debug/ai-status	Check AI configuration

🚀 Installation \& Setup

Prerequisites

Python 3.11+



Node.js 18+



Git



Groq API Key (free at console.groq.com)



Clone the Repository

bash

git clone https://github.com/muasyasila/agent-tool-runner.git

cd agent-tool-runner

Backend Setup

bash

cd backend



\# Create virtual environment

python -m venv venv

source venv/bin/activate  # On Windows: venv\\Scripts\\activate



\# Install dependencies

pip install -r requirements.txt



\# Create .env file

echo "DATABASE\_URL=your\_postgresql\_url" > .env

echo "GROQ\_API\_KEY=your\_groq\_api\_key" >> .env

echo "USE\_AI=true" >> .env



\# Run the server

uvicorn main:app --reload

Backend runs at http://localhost:8000



Frontend Setup

bash

cd frontend



\# Install dependencies

npm install



\# Run development server

npm run dev

Frontend runs at http://localhost:5173



Local Database (SQLite)

For local development without Aiven:



python

\# In database.py, change DATABASE\_URL to:

DATABASE\_URL = "sqlite:///./agent\_runs.db"

🔐 Environment Variables

Backend (.env)

Variable	Required	Description

DATABASE\_URL	Yes	PostgreSQL connection string

GROQ\_API\_KEY	For AI mode	Your Groq API key

USE\_AI	No	Set "true" to enable AI mode

Render (Production)

Variable	Value

DATABASE\_URL	Your Aiven PostgreSQL URL

GROQ\_API\_KEY	Your Groq API key

USE\_AI	true

Vercel (Production)

Variable	Value

VITE\_API\_URL	https://agent-tool-runner.onrender.com

📦 Deployment

Backend (Render)

Push code to GitHub



Create new Web Service on Render



Select Docker as language



Set Root Directory to backend



Add environment variables



Deploy



Frontend (Vercel)

Push code to GitHub



Import project to Vercel



Set Root Directory to frontend



Add VITE\_API\_URL environment variable



Deploy



📂 Project Structure

text

agent-tool-runner/

├── backend/

│   ├── agent.py              # Hybrid agent (AI + rule-based)

│   ├── database.py           # PostgreSQL models

│   ├── groq\_agent.py         # Groq API integration

│   ├── main.py               # FastAPI application

│   ├── tools.py              # Tool implementations

│   ├── requirements.txt      # Python dependencies

│   └── Dockerfile            # Docker configuration

├── frontend/

│   ├── src/

│   │   ├── App.jsx           # Main React component

│   │   ├── index.css         # Tailwind styles

│   │   └── main.jsx          # Entry point

│   ├── package.json          # Node dependencies

│   └── vite.config.js        # Vite configuration

├── .gitignore

└── README.md

🧪 Testing the Agent

Using cURL

bash

\# Test calculator

curl -X POST http://localhost:8000/api/run \\

&#x20; -H "Content-Type: application/json" \\

&#x20; -d '{"prompt": "What is 15 percent of 200?"}'



\# Test time

curl -X POST http://localhost:8000/api/run \\

&#x20; -H "Content-Type: application/json" \\

&#x20; -d '{"prompt": "What time is it?"}'



\# Check history

curl http://localhost:8000/api/history

Sample Prompts

Prompt	Expected Tool	Expected Result

"What's 15 percent of 200?"	calculator	30

"Add 5 and 7 then multiply by 2"	calculator	24

"What time is it?"	get\_time	Current time

"Say hello"	echo	Echo: hello

"Calculate 10 factorial"	calculator	3628800

🗺️ Roadmap

Short Term

Add streaming responses



Add more tools (weather, currency)



Add user authentication



Long Term

Multi-model support (OpenAI, Anthropic)



Vector database for RAG



Agent memory across sessions



📚 Lessons Learned

Challenge	Solution

Python 3.14 compatibility	Pinned to Python 3.11 with Docker

Async event loop conflicts	Made agent functions fully async

Git push protection	Started fresh with .gitignore

Render deployment failures	Switched to Docker deployment

Key Takeaways

Always use .gitignore from day one - Secrets in Git history are painful



Containerize early - Docker eliminates environment issues



Design for fallbacks - AI is powerful but unreliable



Keep it deployable - Build with free tiers in mind



🙏 Acknowledgments

Groq for free Llama 3 API access



Render for free Docker hosting



Vercel for free frontend hosting



Aiven for free PostgreSQL tier



<div align="center">

Built with ☕ and 🧠 by Muasya Sila

⬆ Back to Top



</div>

