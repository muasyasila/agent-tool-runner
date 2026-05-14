import { useState, useEffect } from 'react'
import { Send, History, Clock, Calculator, MessageSquare, Info, X, ExternalLink } from 'lucide-react'
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

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/history`)
            const data = await response.json()
            setHistory(data)
        } catch (err) {
            console.error('Failed to load history:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setLoading(true)
        setError(null)
        setCurrentResponse(null)

        try {
            const response = await fetch(`${API_URL}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }),
            })

            if (!response.ok) throw new Error('Failed to get response')
            const data = await response.json()
            setCurrentResponse(data)
            await loadHistory()
            setPrompt('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const loadRunFromHistory = async (runId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_URL}/api/runs/${runId}`)
            if (!response.ok) throw new Error('Failed to load run')
            const data = await response.json()
            setCurrentResponse(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getToolIcon = (toolName) => {
        switch (toolName) {
            case 'calculator': return <Calculator className="w-4 h-4" />
            case 'get_time': return <Clock className="w-4 h-4" />
            default: return <MessageSquare className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Agent Tool Runner</h1>
                            <p className="text-gray-400 text-sm">AI-powered agent with tools</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowAbout(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white">
                                <Info className="w-4 h-4" />
                                About
                            </button>
                            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white">
                                <History className="w-4 h-4" />
                                {showHistory ? 'Hide' : 'Show'} History
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {showAbout && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
                    <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 border border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">About Agent Tool Runner</h2>
                            <button onClick={() => setShowAbout(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <p className="text-gray-300 mb-4">AI-powered agent that understands natural language and executes tools like calculator, time, and echo.</p>
                        <div className="bg-gray-900 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-400 mb-1">✨ Features:</p>
                            <ul className="text-sm text-gray-300 space-y-1 ml-4">
                                <li>• Natural language understanding (Groq Llama 3)</li>
                                <li>• Calculator, Time, and Echo tools</li>
                                <li>• Persistent history with PostgreSQL</li>
                                <li>• Execution traces show step-by-step logic</li>
                            </ul>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">🎯 Try: "What's 15 percent of 200?" or "Add 5 and 7 then multiply by 2"</p>
                        <div className="flex gap-3 pt-2 border-t border-gray-700">
                            <a href="https://github.com/muasyasila/agent-tool-runner" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300">
                                GitHub Repository
                            </a>
                            <a href="https://agent-tool-runner.onrender.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                                <ExternalLink className="w-4 h-4" />
                                API Docs
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {showHistory && (
                        <div className="lg:w-1/3 xl:w-1/4">
                            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><History className="w-5 h-5" />Recent Runs</h2>
                                {history.length === 0 ? <p className="text-gray-400 text-sm">No runs yet. Try the agent!</p> : (
                                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                        {history.map((run) => (
                                            <button key={run.id} onClick={() => loadRunFromHistory(run.id)} className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
                                                <p className="text-white text-sm font-medium truncate">{run.prompt}</p>
                                                <p className="text-gray-400 text-xs mt-1">{getToolIcon(run.tool_used)}<span className="ml-1">{run.tool_used}</span></p>
                                                <p className="text-gray-500 text-xs mt-1">{new Date(run.created_at).toLocaleString()}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Examples:&#10;• What's 15 percent of 200?&#10;• Add 5 and 7 then multiply by 2" rows="3" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white" disabled={loading} />
                                <button type="submit" disabled={loading || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg">
                                    {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Thinking...</> : <><Send className="w-4 h-4" />Run Agent</>}
                                </button>
                            </form>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setPrompt("What's 15 percent of 200?")} className="text-xs px-3 py-1 bg-gray-700 rounded-full text-gray-300">15% of 200</button>
                                    <button onClick={() => setPrompt("Add 5 and 7 then multiply by 2")} className="text-xs px-3 py-1 bg-gray-700 rounded-full text-gray-300">Add 5+7 then ×2</button>
                                    <button onClick={() => setPrompt("What time is it?")} className="text-xs px-3 py-1 bg-gray-700 rounded-full text-gray-300">What time is it?</button>
                                </div>
                            </div>
                        </div>

                        {error && <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6"><p className="text-red-200 text-sm">{error}</p></div>}

                        {currentResponse && (
                            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-white">Result</h2>{currentResponse.ai_mode && <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">AI Mode</span>}</div>
                                <div className="bg-gray-900 rounded-lg p-4 mb-4 border-l-4 border-blue-500"><p className="text-gray-300 text-sm mb-1">Final Answer:</p><p className="text-white text-xl font-medium">{currentResponse.final_response}</p></div>
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700"><span className="text-gray-400 text-sm">Tool used:</span><span className="flex items-center gap-1 px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm">{getToolIcon(currentResponse.tool_used)}{currentResponse.tool_used}</span></div>
                                <div><h3 className="text-sm font-semibold text-gray-300 mb-3">Execution Trace:</h3><div className="space-y-3">{currentResponse.trace?.map((step, idx) => (<div key={idx} className="bg-gray-900 rounded-lg p-3"><p className="text-blue-400 text-xs mb-2">Step {step.step}: {step.action}</p><div className="space-y-1 text-sm">{step.tool_chosen && <p className="text-gray-400"><span className="text-gray-500">→ Tool:</span> {step.tool_chosen}</p>}{step.arguments && <p className="text-gray-400"><span className="text-gray-500">→ Arguments:</span> {step.arguments}</p>}{step.raw_result && <p className="text-gray-400"><span className="text-gray-500">→ Raw result:</span> {step.raw_result}</p>}{step.success !== undefined && <p className={`text-sm ${step.success ? 'text-green-400' : 'text-red-400'}`}>{step.success ? '✓ Success' : '✗ Failed'}</p>}</div></div>))}</div></div>
                            </div>
                        )}

                        {!currentResponse && !loading && (
                            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-12 text-center">
                                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 mx-auto"><MessageSquare className="w-8 h-8 text-blue-400" /></div>
                                <h2 className="text-xl font-semibold text-white mb-2">Welcome to Agent Tool Runner</h2>
                                <p className="text-gray-400">Type a prompt above to see the AI agent in action!</p>
                                <button onClick={() => setShowAbout(true)} className="mt-6 text-blue-400 hover:text-blue-300 text-sm underline">Learn more about this project →</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App