import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { useGemini } from '../../hooks/useGemini'
import { prompts } from '../../utils/aiPrompts'

export default function Summary() {
  const { resume, dispatch } = useResume()
  const { callGemini } = useGemini()
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [instructions, setInstructions] = useState('')

  async function generateSummary() {
    setLoading(true)
    setSuggestion('')
    try {
      const p = resume.personal
      const expYears = resume.experience.length > 0
        ? `${resume.experience.length * 2}+ years`
        : 'several years'
      const text = await callGemini(prompts.summary({ name: p.name, title: p.title, experience: expYears, instructions }))
      setSuggestion(text.trim())
    } catch (e) {
      setSuggestion(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="editor-header">
        <h2>Professional Summary</h2>
      </div>
      <div className="editor-body">
        <div className="field-group">
          <label>Summary Statement</label>
          <textarea
            id="summary-text"
            value={resume.summary}
            onChange={e => dispatch({ type: 'SET_SUMMARY', payload: e.target.value })}
            placeholder="Write a compelling 2–3 sentence summary highlighting your expertise, key achievements, and what you bring to the role…"
            rows={5}
          />
        </div>

        <div className="field-group" style={{ marginBottom: 10 }}>
          <label style={{ color: 'var(--text-blue)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>✦</span> AI Edit Instructions <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
          </label>
          <input
            type="text"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="e.g., Focus on my leadership skills and Python experience…"
            style={{ fontSize: 12, border: '1px solid var(--border-blue)', background: 'var(--blue-mid)' }}
          />
        </div>

        <button
          className={`ai-btn w-full ${loading ? 'loading' : ''}`}
          onClick={generateSummary}
          disabled={loading}
          id="generate-summary-btn"
          style={{ justifyContent: 'center', padding: '9px' }}
        >
          {loading ? <><span className="spin">⟳</span> Generating…</> : '✦ Generate with AI'}
        </button>

        {suggestion && (
          <div className="ai-suggestion-card">
            <div className="ai-suggestion-label">✦ AI Suggestion</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
              {suggestion}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ fontSize: 12 }}
                onClick={() => { dispatch({ type: 'SET_SUMMARY', payload: suggestion }); setSuggestion('') }}>
                ✓ Apply
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={generateSummary}>↻ Retry</button>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setSuggestion('')}>✕</button>
            </div>
          </div>
        )}

        <div className="info-box">
          <strong>Tip:</strong> Include your years of experience, 2–3 key strengths, and one notable achievement. Keep it under 4 sentences.
        </div>
      </div>
    </>
  )
}
