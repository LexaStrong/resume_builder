import React, { useState } from 'react'
import { useResume } from '../context/ResumeContext'

export default function APIKeyModal() {
  const { showApiModal, setShowApiModal, apiKey, setApiKey } = useResume()
  const [input, setInput] = useState(apiKey || '')
  const [show, setShow] = useState(false)

  if (!showApiModal) return null

  function save() {
    if (!input.trim()) return
    setApiKey(input.trim())
    setShowApiModal(false)
  }

  function skip() {
    setShowApiModal(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && skip()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔑</div>
        <h2 id="api-modal-title">Connect Gemini AI</h2>
        <p>
          Enter your Google Gemini API key to unlock AI-powered features. Your key is stored locally in your browser and never sent to our servers.
        </p>

        <div className="modal-features">
          {[
            ['✨', 'Generate professional summaries instantly'],
            ['💪', 'Enhance bullet points with strong action verbs'],
            ['🎯', 'Get skill suggestions tailored to your role'],
            ['📊', 'Score your resume for ATS compatibility'],
            ['🤖', 'Chat with your AI resume coach anytime'],
          ].map(([icon, label]) => (
            <div key={label} className="modal-feature">
              <span className="feat-icon">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="api-input-wrap">
          <input
            id="api-key-input"
            type={show ? 'text' : 'password'}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="AIza…"
            onKeyDown={e => e.key === 'Enter' && save()}
            autoComplete="off"
          />
          <button className="api-toggle-vis" onClick={() => setShow(s => !s)} type="button" title="Toggle visibility">
            {show ? '🙈' : '👁'}
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          Get your free API key at{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-accent)' }}>
            aistudio.google.com/apikey
          </a>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={save} disabled={!input.trim()} id="save-api-key-btn">
            🔒 Save & Enable AI
          </button>
          <button className="btn btn-ghost" onClick={skip}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
