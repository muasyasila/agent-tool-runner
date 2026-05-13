from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

# Import our modules
from agent import run_agent
from database import init_db, get_db, save_run, get_recent_runs, get_run_by_id

# Create FastAPI app
app = FastAPI(title="Agent Tool Runner API")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Create database tables when the app starts"""
    init_db()
    print("✅ Database initialized")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class RunRequest(BaseModel):
    prompt: str

class RunResponse(BaseModel):
    success: bool
    final_response: str
    trace: List[Dict[str, Any]]
    tool_used: str
    user_prompt: str
    timestamp: str

class HistoryResponse(BaseModel):
    id: int
    prompt: str
    final_response: str
    tool_used: str
    created_at: str

# ========== HEALTH & ROOT ==========

@app.get("/health")
def health():
    return {"status": "healthy", "message": "Agent Tool Runner API is running"}

@app.get("/")
def root():
    return {"message": "Agent Tool Runner API is running!", "docs": "/docs"}

# ========== DEBUG ENDPOINT ==========

@app.get("/debug/ai-status")
async def debug_ai_status():
    """Debug endpoint to check AI configuration and Groq API status"""
    import os
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    use_ai = os.getenv("USE_AI")
    
    debug_info = {
        "use_ai_env": use_ai,
        "use_ai_parsed": str(use_ai).lower() == "true" if use_ai else False,
        "groq_api_key_set": bool(groq_api_key),
        "groq_api_key_preview": groq_api_key[:10] + "..." if groq_api_key else None,
    }
    
    # Try to initialize Groq client and make a test call
    if groq_api_key:
        try:
            from groq import Groq
            client = Groq(api_key=groq_api_key)
            # Make a simple test call
            test_response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": "Say 'AI is working'"}],
                temperature=0,
                max_tokens=20
            )
            debug_info["groq_test"] = "success"
            debug_info["groq_response"] = test_response.choices[0].message.content
        except Exception as e:
            debug_info["groq_test"] = "failed"
            debug_info["groq_error"] = str(e)
    else:
        debug_info["groq_test"] = "skipped (no API key)"
    
    # Also check if groq_agent module can be imported
    try:
        from groq_agent import run_ai_agent
        debug_info["groq_agent_import"] = "success"
    except ImportError as e:
        debug_info["groq_agent_import"] = f"failed: {str(e)}"
    
    return debug_info

# ========== TOOLS ==========

@app.get("/api/tools")
def get_tools():
    """List all available tools."""
    return {
        "tools": [
            {
                "name": "calculator",
                "description": "Evaluate mathematical expressions",
                "example": "calc: 15 * 30"
            },
            {
                "name": "get_time",
                "description": "Get current date and time",
                "example": "What time is it?"
            },
            {
                "name": "echo",
                "description": "Repeat back a message",
                "example": "Say hello"
            }
        ]
    }

# ========== AGENT RUN (WITH DATABASE SAVE) ==========

@app.post("/api/run", response_model=RunResponse)
async def run_agent_endpoint(request: RunRequest, db: Session = Depends(get_db)):
    """
    Run the agent with a user prompt and save to database.
    
    Example prompts:
    - "calc: 25 * 4"
    - "What is 100 / 10?"
    - "What time is it?"
    - "Say hello world"
    """
    # Run the agent
    result = run_agent(request.prompt)
    
    # Save to database
    saved_run = save_run(
        db=db,
        prompt=request.prompt,
        final_response=result["final_response"],
        tool_used=result["tool_used"],
        success=result["success"],
        trace=result["trace"]
    )
    
    print(f"✅ Saved run {saved_run.id}: {request.prompt}")
    
    # Add timestamp to response
    result["timestamp"] = datetime.now().isoformat()
    
    return result

# ========== HISTORY ENDPOINTS ==========

@app.get("/api/history", response_model=List[HistoryResponse])
async def get_history(limit: int = 20, db: Session = Depends(get_db)):
    """Get the 20 most recent agent runs"""
    runs = get_recent_runs(db, limit=limit)
    
    return [
        {
            "id": run.id,
            "prompt": run.prompt,
            "final_response": run.final_response,
            "tool_used": run.tool_used,
            "created_at": run.created_at.isoformat()
        }
        for run in runs
    ]

@app.get("/api/runs/{run_id}")
async def get_run(run_id: int, db: Session = Depends(get_db)):
    """Get a specific run by its ID"""
    run = get_run_by_id(db, run_id)
    
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return {
        "id": run.id,
        "prompt": run.prompt,
        "final_response": run.final_response,
        "tool_used": run.tool_used,
        "success": bool(run.success),
        "trace": run.trace,
        "created_at": run.created_at.isoformat()
    }