"""
Agent that decides which tool to use based on user input.
Supports both rule-based and AI-powered (Groq) modes.
"""

import os
import asyncio
from typing import Dict, Any, List
from tools import execute_tool

# Check if AI mode is enabled
USE_AI = os.getenv("USE_AI", "false").lower() == "true"

def parse_user_intent(prompt: str) -> Dict[str, Any]:
    """
    Parse user prompt to determine which tool to use.
    Rule-based system - fallback when AI is disabled or fails.
    
    Args:
        prompt: User's input text
    
    Returns:
        Dictionary with tool name and arguments
    """
    prompt_lower = prompt.lower().strip()
    
    # Check for calculator usage
    calc_patterns = ['calc:', 'calculate', 'what is', 'what\'s']
    for pattern in calc_patterns:
        if prompt_lower.startswith(pattern):
            expression = prompt[len(pattern):].strip()
            return {
                "tool": "calculator",
                "args": expression,
                "confidence": "high"
            }
    
    # Check for simple math expressions
    import re
    math_pattern = r'^[\d\s\+\-\*\/\(\)\.]+$'
    if re.match(math_pattern, prompt_lower):
        return {
            "tool": "calculator",
            "args": prompt,
            "confidence": "medium"
        }
    
    # Check for time request
    time_keywords = ['time', 'what time', 'current time', 'clock']
    if any(keyword in prompt_lower for keyword in time_keywords):
        return {
            "tool": "get_time",
            "args": "none",
            "confidence": "high"
        }
    
    # Default to echo
    return {
        "tool": "echo",
        "args": prompt,
        "confidence": "low"
    }

async def run_agent_async(prompt: str) -> Dict[str, Any]:
    """
    Run agent asynchronously (for AI mode).
    """
    from groq_agent import run_ai_agent
    return await run_ai_agent(prompt)

def run_agent(prompt: str) -> Dict[str, Any]:
    """
    Main agent function that processes user input and returns result.
    Uses AI if USE_AI=true, otherwise uses rule-based.
    """
    # Step 1: Get intent (either AI or rule-based)
    if USE_AI:
        # Run async function in sync context
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            intent = loop.run_until_complete(run_agent_async(prompt))
            loop.close()
            ai_mode = True
        except Exception as e:
            print(f"❌ AI mode failed: {e}, falling back to rule-based")
            intent = parse_user_intent(prompt)
            ai_mode = False
    else:
        intent = parse_user_intent(prompt)
        ai_mode = False
    
    # Step 2: Execute the chosen tool
    tool_result = execute_tool(intent["tool"], intent["args"])
    
    # Step 3: Build the execution trace
    trace = [
        {
            "step": 1,
            "action": "parse_intent",
            "mode": "ai" if ai_mode else "rule-based",
            "tool_chosen": intent["tool"],
            "arguments": intent["args"],
            "confidence": intent.get("confidence", "unknown")
        },
        {
            "step": 2,
            "action": "execute_tool",
            "tool": tool_result["tool"],
            "arguments": tool_result["args"],
            "success": tool_result["success"],
            "raw_result": tool_result["result"]
        }
    ]
    
    # Step 4: Format the final response
    if tool_result["success"]:
        final_response = tool_result["result"]
    else:
        final_response = f"Sorry, I couldn't do that. {tool_result['result']}"
    
    return {
        "success": tool_result["success"],
        "final_response": final_response,
        "trace": trace,
        "tool_used": intent["tool"],
        "user_prompt": prompt,
        "ai_mode": ai_mode
    }