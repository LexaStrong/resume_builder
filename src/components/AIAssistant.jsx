import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useResume } from '../context/ResumeContext'
import { useGemini } from '../hooks/useGemini'
import { prompts } from '../utils/aiPrompts'

function getResumeSummary(resume) {
  return `Name: ${resume.personal.name || 'N/A'}
Title: ${resume.personal.title || 'N/A'}
Summary: ${resume.summary || 'N/A'}
Experience: ${resume.experience.map(e => `${e.role} at ${e.company}`).join(', ') || 'N/A'}
Skills: ${resume.skills.join(', ') || 'N/A'}`
}

const QUICK_PROMPTS = [
  'How do I make my resume stand out?',
  'What should I put in my summary?',
  'How long should my resume be?',
]

export default function AIAssistant({ isOpen, onClose }) {
  const { resume } = useResume()
  const { callGemini } = useGemini()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "Hello! I'm your AI resume coach. Ask me anything about improving your resume, tailoring it for a specific role, or resume best practices." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function sendMessage(text) {
    const msgText = text || input.trim()
    if (!msgText || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: msgText }
    const history = messages.slice(-6)
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const prompt = prompts.chat(history, msgText, getResumeSummary(resume))
      const reply = await callGemini(prompt)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, isMarkdown: true }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: `Sorry, I ran into an error: ${err.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (!isOpen) return null

  return (
    <div className="ai-panel" id="ai-assistant-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <div className="dot" />
          AI Resume Coach
        </div>
        <button className="ai-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="ai-messages">
        {messages.map(m => (
          <div key={m.id} className={`ai-message ${m.role} ${m.isMarkdown ? 'md-content' : ''}`}>
             {m.isMarkdown && m.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
             ) : (
                m.content
             )}
          </div>
        ))}
        {loading && (
          <div className="ai-message assistant loading">
            <div className="dots"><span>●</span><span>●</span><span>●</span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div style={{ padding: '0 10px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {QUICK_PROMPTS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                fontSize: 11, padding: '6px 10px', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Inter, sans-serif', transition: 'var(--transition)', borderRadius: 'var(--radius-sm)'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--text-blue)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="ai-input-row">
        <textarea
          className="ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for resume advice…"
          rows={2}
          id="ai-chat-input"
        />
        <button className="ai-send-btn" onClick={() => sendMessage()} disabled={loading}>➤</button>
      </div>
    </div>
  )
}
