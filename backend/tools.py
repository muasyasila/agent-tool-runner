"""
Tools that the agent can use.
Each tool is a simple function that takes arguments and returns a result.
"""

import datetime
import math
import re
from typing import Dict, Any

def calculator(expression: str) -> Dict[str, Any]:
    """
    Safely evaluate a mathematical expression.
    
    Args:
        expression: A math expression like "2 + 2" or "15 * 30"
    
    Returns:
        Dictionary with success status and result or error message
    """
    try:
        # Remove any dangerous characters
        safe_expression = re.sub(r'[^0-9+\-*/().]', '', expression)
        
        # Evaluate the expression safely
        result = eval(safe_expression)
        
        return {
            "success": True,
            "result": str(result),
            "tool": "calculator",
            "args": expression
        }
    except ZeroDivisionError:
        return {
            "success": False,
            "result": "Error: Cannot divide by zero",
            "tool": "calculator",
            "args": expression
        }
    except Exception as e:
        return {
            "success": False,
            "result": f"Error: Could not calculate '{expression}'",
            "tool": "calculator",
            "args": expression
        }

def get_time() -> Dict[str, Any]:
    """
    Get the current time.
    
    Returns:
        Dictionary with success status and current time
    """
    now = datetime.datetime.now()
    current_time = now.strftime("%I:%M %p")
    current_date = now.strftime("%B %d, %Y")
    
    return {
        "success": True,
        "result": f"{current_date} at {current_time}",
        "tool": "get_time",
        "args": "none"
    }

def echo(message: str) -> Dict[str, Any]:
    """
    Echo back whatever message was sent.
    
    Args:
        message: The message to echo back
    
    Returns:
        Dictionary with success status and echoed message
    """
    return {
        "success": True,
        "result": f"Echo: {message}",
        "tool": "echo",
        "args": message
    }

# Dictionary to easily call tools by name
AVAILABLE_TOOLS = {
    "calculator": calculator,
    "get_time": get_time,
    "echo": echo
}

def execute_tool(tool_name: str, args: str) -> Dict[str, Any]:
    """
    Execute a tool by name with the given arguments.
    
    Args:
        tool_name: Name of the tool to execute
        args: Arguments to pass to the tool
    
    Returns:
        Result from the tool function
    """
    if tool_name not in AVAILABLE_TOOLS:
        return {
            "success": False,
            "result": f"Error: Unknown tool '{tool_name}'",
            "tool": tool_name,
            "args": args
        }
    
    tool_func = AVAILABLE_TOOLS[tool_name]
    
    # Different tools need different argument handling
    if tool_name == "get_time":
        return tool_func()
    elif tool_name == "calculator":
        return tool_func(args)
    elif tool_name == "echo":
        return tool_func(args)
    else:
        return tool_func(args)