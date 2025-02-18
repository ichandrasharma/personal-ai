import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const encodedMessage = encodeURIComponent(message)
      const res = await fetch(`http://localhost:8080/api/${encodedMessage}`)
      
      if (!res.ok) {
        throw new Error('Failed to get response')
      }
      
      const text = await res.text()

      // Remove <think> tags and Markdown characters but keep content
      let cleanedResponse = text
        .replace(/<think>/g, 'Thinking: ') // Replace <think> with "Thinking: "
        .replace(/<\/think>/g, '\n')       // Replace </think> with a new line
        .replace(/[#*]+/g, '')             // Remove # and ** but keep -
        .trim()

      setResponse(cleanedResponse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>
        <img src="/bot_4712139.png" alt="AI Logo" />
        <span>Your Personal AI</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>

      <div className="response-wrapper">
        {error && <div className="error">{error}</div>}
        
        {response && (
          <div className="response">
            <h2>Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
