import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { useGemini } from '../../hooks/useGemini'
import { prompts } from '../../utils/aiPrompts'

function ExperienceCard({ entry, idx }) {
  const { dispatch } = useResume()
  const { callGemini } = useGemini()
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [instructions, setInstructions] = useState('')

  function update(payload) {
    dispatch({ type: 'UPDATE_EXPERIENCE', id: entry.id, payload })
  }

  async function enhanceDescription() {
    setLoading(true)
    setSuggestion('')
    try {
      const text = await callGemini(prompts.expandExperience({
        role: entry.role, company: entry.company, description: entry.description, instructions
      }))
      setSuggestion(text.trim())
    } catch (e) {
      setSuggestion(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <span className="entry-card-title">
          {entry.role || entry.company
            ? `${entry.role || 'Role'} — ${entry.company || 'Company'}`
            : `Entry ${idx + 1}`}
        </span>
        <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', id: entry.id })}>Remove</button>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Job Title</label>
          <input type="text" value={entry.role} onChange={e => update({ role: e.target.value })} placeholder="Software Engineer" />
        </div>
        <div className="field-group">
          <label>Company</label>
          <input type="text" value={entry.company} onChange={e => update({ company: e.target.value })} placeholder="Acme Corp" />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Start Date</label>
          <input type="text" value={entry.start} onChange={e => update({ start: e.target.value })} placeholder="Jan 2022" />
        </div>
        <div className="field-group">
          <label>End Date</label>
          <input type="text" value={entry.current ? 'Present' : entry.end} onChange={e => update({ end: e.target.value })} placeholder="Present" disabled={entry.current} />
        </div>
      </div>

      <div className="field-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id={`cur-${entry.id}`} checked={!!entry.current}
          onChange={e => update({ current: e.target.checked })} style={{ width: 'auto' }} />
        <label htmlFor={`cur-${entry.id}`} style={{ marginBottom: 0, textTransform: 'none', fontSize: 12 }}>Currently working here</label>
      </div>

      <div className="field-group">
        <label>Location <span style={{ fontWeight:400, textTransform:'none' }}>(optional)</span></label>
        <input type="text" value={entry.location} onChange={e => update({ location: e.target.value })} placeholder="Remote / New York, NY" />
      </div>

      <div className="field-group">
        <label>Responsibilities & Achievements</label>
        <textarea value={entry.description} onChange={e => update({ description: e.target.value })}
          placeholder="• Led development of payment service, reducing checkout time by 40%&#10;• Mentored 5 junior engineers…"
          rows={4} />
      </div>

      <div className="field-group" style={{ marginBottom: 6, marginTop: 4 }}>
        <input
          type="text"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="✦ AI Edit Instructions (Optional). e.g., Make it sound more technical…"
          style={{ fontSize: 12, border: '1px solid var(--border-blue)', background: 'var(--blue-mid)' }}
        />
      </div>

      <button className={`ai-btn ${loading ? 'loading' : ''}`} onClick={enhanceDescription} disabled={loading}>
        {loading ? <><span className="spin">⟳</span> Enhancing…</> : '✦ Enhance with AI'}
      </button>

      {suggestion && (
        <div className="ai-suggestion-card">
          <div className="ai-suggestion-label">✦ AI-Enhanced Bullets</div>
          <pre style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>
            {suggestion}
          </pre>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ fontSize: 12 }}
              onClick={() => { update({ description: suggestion }); setSuggestion('') }}>✓ Apply</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setSuggestion('')}>✕ Dismiss</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Experience() {
  const { resume, dispatch } = useResume()
  return (
    <>
      <div className="editor-header">
        <h2>Work Experience</h2>
        <span className="badge badge-accent">{resume.experience.length}</span>
      </div>
      <div className="editor-body">
        {resume.experience.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💼</div>
            No experience entries yet. Add your work history below.
          </div>
        )}
        {resume.experience.map((e, i) => <ExperienceCard key={e.id} entry={e} idx={i} />)}
        <button className="add-entry-btn" onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })} id="add-experience-btn">
          + Add Work Experience
        </button>
      </div>
    </>
  )
}
