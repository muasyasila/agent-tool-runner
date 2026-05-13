import { useState, useEffect } from 'react'
import { Send, History, Clock, Calculator, MessageSquare, Info, X, Github, ExternalLink, Zap, Database, Brain, Cloud, Code } from 'lucide-react'
import './index.css'

const API_URL = 'https://agent-tool-runner.onrender.com'

function App() {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentResponse, setCurrentResponse] = useState(null)
    const [history, setHistory] = useState([])
    const [showHistory, setShowHistory] = useState(true)
    const [showAbout, setShowAbout] = useState(false)
    const [error, setError] = useState(null)

    // Load history when app starts
    useEffect(() => {
        loadHistory()
    }, [])

    // Fetch history from backend
    const loadHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/history`)
            const data = await response.json()
            setHistory(data)
        } catch (err) {
            console.error('Failed to load history:', err)
        }
    }

    // Run the agent with user's prompt
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setLoading(true)
        setError(null)
        setCurrentResponse(null)

        try {
            const response = await fetch(`${API_URL}/api/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response from agent')
            }

            const data = await response.json()
            setCurrentResponse(data)

            // Refresh history to show the new run
            await loadHistory()

            // Clear the input
            setPrompt('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Load a specific run from history
    const loadRunFromHistory = async (runId) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/api/runs/${runId}`)
            if (!response.ok) throw new Error('Failed to load run')
            const data = await response.json()
            setCurrentResponse(data)
            setShowHistory(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Get icon for tool type
    const getToolIcon = (toolName) => {
        switch (toolName) {
            case 'calculator': return <Calculator className="w-4 h-4" />
            case 'get_time': return <Clock className="w-4 h-4" />
            default: return <MessageSquare className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Agent Tool Runner
                            </h1>
                            <p className="text-gray-400 text-sm">
                                AI-powered agent with tools
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAbout(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white"
                            >
                                <Info className="w-4 h-4" />
                                About
                            </button>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white"
                            >
                                <History className="w-4 h-4" />
                                {showHistory ? 'Hide' : 'Show'} History
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* About Modal */}
            {showAbout && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
                    <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">About Agent Tool Runner</h2>
                            <button onClick={() => setShowAbout(false)} className="p-1 hover:bg-gray-700 rounded-lg transition">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Overview */}
                            <section>
                                <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    What is this?
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Agent Tool Runner is a production-grade, AI-powered agent system that understands natural language and executes tools based on your requests. It demonstrates the same architecture used by leading AI labs for agent-based systems.
                                </p>
                            </section>

                            {/* Architecture */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                    <Cloud className="w-5 h-5" />
                                    Architecture
                                </h3>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                                    <div className="space-y-2">
                                        <div className="text-blue-400">┌─────────────────┐</div>
                                        <div className="text-blue-400">│  React Frontend │ ← Vercel (CDN)</div>
                                        <div className="text-blue-400">│  (Tailwind CSS) │</div>
                                        <div className="text-blue-400">└────────┬────────┘</div>
                                        <div className="text-blue-400">         │ HTTPS</div>
                                        <div className="text-blue-400">         ▼</div>
                                        <div className="text-green-400">┌─────────────────┐</div>
                                        <div className="text-green-400">│  FastAPI Backend│ ← Render (Docker)</div>
                                        <div className="text-green-400">│  (Python 3.11)  │</div>
                                        <div className="text-green-400">└────────┬────────┘</div>
                                        <div className="text-green-400">         │</div>
                                        <div className="text-green-400">    ┌────┴────┬────────┐</div>
                                        <div className="text-green-400">    ▼         ▼        ▼</div>
                                        <div className="text-yellow-400">┌────────┐ ┌──────┐ ┌──────┐</div>
                                        <div className="text-yellow-400">│ Groq AI│ │Tools │ │Post- │</div>
                                        <div className="text-yellow-400">│ (Llama │ │(Calc,│ │greSQL│</div>
                                        <div className="text-yellow-400">│   3)   │ │Time, │ │(Aiven│</div>
                                        <div className="text-yellow-400">└────────┘ │ Echo)│ │  )   │</div>
                                        <div className="text-yellow-400">          └──────┘ └──────┘</div>
                                    </div>
                                </div>
                            </section>

                            {/* Features */}
                            <section>
                                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Features
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">🧠 Natural Language Understanding</div>
                                        <p className="text-gray-400 text-sm">Uses Groq's Llama 3 to understand "15 percent of 200" without special syntax</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">🔧 Tool Calling</div>
                                        <p className="text-gray-400 text-sm">Calculator, time lookup, echo - easily extensible</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">💾 Persistent History</div>
                                        <p className="text-gray-400 text-sm">All agent runs saved to PostgreSQL with execution traces</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">🔄 Fallback System</div>
                                        <p className="text-gray-400 text-sm">Rule-based fallback if AI fails - always reliable</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">📊 Execution Trace</div>
                                        <p className="text-gray-400 text-sm">See exactly what the agent did, step by step</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">🎨 Beautiful UI</div>
                                        <p className="text-gray-400 text-sm">Dark theme with glassmorphism, responsive design</p>
                                    </div>
                                </div>
                            </section>

                            {/* Tech Stack */}
                            <section>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">React 19</span>
                                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">Vite</span>
                                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">Tailwind CSS</span>
                                    <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">FastAPI</span>
                                    <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">Python 3.11</span>
                                    <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">Docker</span>
                                    <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">PostgreSQL</span>
                                    <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">SQLAlchemy</span>
                                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm">Groq (Llama 3)</span>
                                    <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm">Vercel</span>
                                    <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm">Render</span>
                                    <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm">Aiven</span>
                                </div>
                            </section>

                            {/* Example Prompts */}
                            <section>
                                <h3 className="text-lg font-semibold text-blue-400 mb-3">📝 Try These Examples</h3>
                                <div className="space-y-2">
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <span className="text-green-400">✓</span>
                                        <span className="text-white ml-2">"What's 15 percent of 200?"</span>
                                        <span className="text-gray-500 text-sm ml-2">→ Understands percentages</span>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <span className="text-green-400">✓</span>
                                        <span className="text-white ml-2">"Add 5 and 7 then multiply by 2"</span>
                                        <span className="text-gray-500 text-sm ml-2">→ Multi-step instructions</span>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <span className="text-green-400">✓</span>
                                        <span className="text-white ml-2">"What time is it?"</span>
                                        <span className="text-gray-500 text-sm ml-2">→ Gets current time</span>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3">
                                        <span className="text-green-400">✓</span>
                                        <span className="text-white ml-2">"Say hello world"</span>
                                        <span className="text-gray-500 text-sm ml-2">→ Echoes your message</span>
                                    </div>
                                </div>
                            </section>

                            {/* Links */}
                            <section className="pt-4 border-t border-gray-700">
                                <div className="flex justify-center gap-4">
                                    <a
                                        href="https://github.com/muasyasila/agent-tool-runner"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                                    >
                                        <Github className="w-5 h-5" />
                                        GitHub Repository
                                    </a>
                                    <a
                                        href="https://agent-tool-runner.onrender.com/docs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        API Documentation
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* History Sidebar */}
                    {showHistory && (
                        <div className="lg:w-1/3 xl:w-1/4">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Recent Runs
                                </h2>

                                {history.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No runs yet. Try the agent!</p>
                                ) : (
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                        {history.map((run) => (
                                            <button
                                                key={run.id}
                                                onClick={() => loadRunFromHistory(run.id)}
                                                className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition group"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-white text-sm font-medium truncate">
                                                            {run.prompt}
                                                        </p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {getToolIcon(run.tool_used)}
                                                            <span className="ml-1">{run.tool_used}</span>
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {new Date(run.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main Chat Area */}
                    <div className="flex-1">
                        {/* Input Form */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        What would you like to do?
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Examples:&#10;• What's 15 percent of 200?&#10;• Add 5 and 7 then multiply by 2&#10;• What time is it?&#10;• Say hello world"
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading || !prompt.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Thinking...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Run Agent
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Example Prompts */}
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setPrompt("What's 15 percent of 200?")}
                                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition"
                                    >
                                        15% of 200
                                    </button>
                                    <button
                                        onClick={() => setPrompt("Add 5 and 7 then multiply by 2")}
                                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition"
                                    >
                                        Add 5+7 then ×2
                                    </button>
                                    <button
                                        onClick={() => setPrompt("What time is it?")}
                                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition"
                                    >
                                        What time is it?
                                    </button>
                                    <button
                                        onClick={() => setPrompt("Say hello world")}
                                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition"
                                    >
                                        Say hello
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Response Display */}
                        {currentResponse && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-white">Result</h2>
                                    {currentResponse.ai_mode && (
                                        <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                                            🤖 AI Mode
                                        </span>
                                    )}
                                </div>

                                {/* Final Answer */}
                                <div className="bg-gradient-to-r from-gray-900 to-gray-900/50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                                    <p className="text-gray-300 text-sm mb-1">Final Answer:</p>
                                    <p className="text-white text-xl font-medium">{currentResponse.final_response}</p>
                                </div>

                                {/* Tool Used */}
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                                    <span className="text-gray-400 text-sm">Tool used:</span>
                                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm">
                                        {getToolIcon(currentResponse.tool_used)}
                                        {currentResponse.tool_used}
                                    </span>
                                </div>

                                {/* Execution Trace */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Execution Trace:</h3>
                                    <div className="space-y-3">
                                        {currentResponse.trace?.map((step, idx) => (
                                            <div key={idx} className="bg-gray-900 rounded-lg p-3">
                                                <p className="text-blue-400 text-xs mb-2">Step {step.step}: {step.action}</p>
                                                <div className="space-y-1 text-sm">
                                                    {step.mode && (
                                                        <p className="text-gray-400">
                                                            <span className="text-gray-500">→ Mode:</span> {step.mode}
                                                        </p>
                                                    )}
                                                    {step.tool_chosen && (
                                                        <p className="text-gray-400">
                                                            <span className="text-gray-500">→ Tool:</span> {step.tool_chosen}
                                                        </p>
                                                    )}
                                                    {step.arguments && (
                                                        <p className="text-gray-400">
                                                            <span className="text-gray-500">→ Arguments:</span> {step.arguments}
                                                        </p>
                                                    )}
                                                    {step.raw_result && (
                                                        <p className="text-gray-400">
                                                            <span className="text-gray-500">→ Raw result:</span> {step.raw_result}
                                                        </p>
                                                    )}
                                                    {step.success !== undefined && (
                                                        <p className={`text-sm ${step.success ? 'text-green-400' : 'text-red-400'}`}>
                                                            {step.success ? '✓ Success' : '✗ Failed'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Metadata */}
                                {currentResponse.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-gray-500 text-xs">
                                            Run ID: {currentResponse.id} • {new Date(currentResponse.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Welcome Message */}
                        {!currentResponse && !loading && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        Welcome to Agent Tool Runner
                                    </h2>
                                    <p className="text-gray-400">
                                        Type a prompt above to see the AI agent in action!
                                    </p>
                                    <p className="text-gray-500 text-sm mt-4">
                                        Try: "What's 15 percent of 200?" • "Add 5 and 7 then multiply by 2" • "What time is it?"
                                    </p>
                                    <button
                                        onClick={() => setShowAbout(true)}
                                        className="mt-6 text-blue-400 hover:text-blue-300 text-sm underline"
                                    >
                                        Learn more about this project →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App