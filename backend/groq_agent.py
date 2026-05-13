"""
AI-powered agent using Groq's Llama 3 model.
Falls back to rule-based if Groq fails or API key is missing.
"""

import os
import json
from typing import Dict, Any
import httpx

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"  # Free tier, very capable

# System prompt that tells Groq how to use tools
SYSTEM_PROMPT = """You are an AI agent with access to these tools:

1. **calculator** - For mathematical calculations
   - Use when user wants to add, subtract, multiply, divide, calculate percentages, etc.
   - Return format: {"tool": "calculator", "args": "the math expression"}

2. **get_time** - For current date and time
   - Use when user asks for current time, date, or "what time is it"
   - Return format: {"tool": "get_time", "args": ""}

3. **echo** - To repeat messages
   - Use when user wants you to say something back, or when no other tool fits
   - Return format: {"tool": "echo", "args": "the message to echo"}

IMPORTANT: Return ONLY valid JSON. No explanations, no extra text.

Examples:
- User: "What is 15 * 30?" → {"tool": "calculator", "args": "15 * 30"}
- User: "Calculate 25% of 200" → {"tool": "calculator", "args": "200 * 0.25"}
- User: "What time is it?" → {"tool": "get_time", "args": ""}
- User: "Say hello world" → {"tool": "echo", "args": "hello world"}
- User: "Hello" → {"tool": "echo", "args": "Hello!"}
"""

async def call_groq(prompt: str) -> Dict[str, Any]:
    """
    Call Groq API to determine which tool to use.
    
    Args:
        prompt: User's input text
    
    Returns:
        Dictionary with tool name and arguments
    """
    if not GROQ_API_KEY:
        print("⚠️ GROQ_API_KEY not set. Falling back to rule-based agent.")
        return None
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.1,  # Low for deterministic responses
                    "max_tokens": 150
                }
            )
            
            if response.status_code != 200:
                print(f"❌ Groq API error: {response.status_code}")
                return None
            
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            
            # Parse the JSON response
            result = json.loads(content)
            
            # Validate the response has required fields
            if "tool" not in result or "args" not in result:
                print(f"⚠️ Invalid Groq response: {result}")
                return None
            
            return result
            
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse Groq response as JSON: {e}")
        return None
    except httpx.TimeoutException:
        print("❌ Groq API timeout")
        return None
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        return None

async def run_ai_agent(prompt: str) -> Dict[str, Any]:
    """
    Run the AI-powered agent using Groq.
    Returns tool decision.
    """
    result = await call_groq(prompt)
    
    if result is None:
        # Fall back to rule-based if Groq fails
        from agent import parse_user_intent
        return parse_user_intent(prompt)
    
    return {
        "tool": result["tool"],
        "args": result["args"],
        "confidence": "high",
        "ai_powered": True
    }