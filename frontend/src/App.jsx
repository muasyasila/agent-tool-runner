import { useState, useEffect } from 'react'
import { Send, History, Clock, Calculator, MessageSquare, Trash2 } from 'lucide-react'
import './index.css'

const API_URL = 'https://agent-tool-runner.onrender.com'

function App() {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentResponse, setCurrentResponse] = useState(null)
    const [history, setHistory] = useState([])
    const [showHistory, setShowHistory] = useState(true)
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
            setShowHistory(false) // Hide history on mobile when showing a run
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Agent Tool Runner
                            </h1>
                            <p className="text-gray-400 text-sm">
                                AI-powered agent with tools
                            </p>
                        </div>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white"
                        >
                            <History className="w-4 h-4" />
                            {showHistory ? 'Hide' : 'Show'} History
                        </button>
                    </div>
                </div>
            </header>

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
                                        placeholder="Examples:&#10;• calc: 15 * 30&#10;• What time is it?&#10;• Say hello world"
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading || !prompt.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
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
                                        onClick={() => setPrompt("calc: 25 * 4")}
                                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition"
                                    >
                                        calc: 25 * 4
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
                                        Say hello world
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
                                <h2 className="text-lg font-semibold text-white mb-4">Result</h2>

                                {/* Final Answer */}
                                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                                    <p className="text-gray-300 text-sm mb-1">Final Answer:</p>
                                    <p className="text-white text-lg font-medium">{currentResponse.final_response}</p>
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
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <p className="text-gray-500 text-xs">
                                        Run ID: {currentResponse.id} • {new Date(currentResponse.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Welcome Message */}
                        {!currentResponse && !loading && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        Welcome to Agent Tool Runner
                                    </h2>
                                    <p className="text-gray-400">
                                        Type a prompt above to see the agent in action!
                                    </p>
                                    <p className="text-gray-500 text-sm mt-4">
                                        Try: calc: 15 * 30 • What time is it? • Say hello
                                    </p>
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