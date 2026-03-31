import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { useGemini } from '../../hooks/useGemini'
import { prompts } from '../../utils/aiPrompts'

function ProjectCard({ entry, idx }) {
  const { dispatch } = useResume()
  const { callGemini } = useGemini()
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [instructions, setInstructions] = useState('')

  function update(payload) { dispatch({ type: 'UPDATE_PROJECT', id: entry.id, payload }) }

  async function generateDescription() {
    setLoading(true); setSuggestion('')
    try {
      const text = await callGemini(prompts.projectDescription({ name: entry.name, role: entry.role, tech: entry.tech, instructions }))
      setSuggestion(text.trim())
    } catch (e) { setSuggestion(`Error: ${e.message}`) }
    finally { setLoading(false) }
  }

  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <span className="entry-card-title">{entry.name || `Project ${idx + 1}`}</span>
        <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_PROJECT', id: entry.id })}>Remove</button>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Project Name</label>
          <input type="text" value={entry.name} onChange={e => update({ name: e.target.value })} placeholder="SmartBudget App" />
        </div>
        <div className="field-group">
          <label>Your Role</label>
          <input type="text" value={entry.role} onChange={e => update({ role: e.target.value })} placeholder="Lead Developer" />
        </div>
      </div>

      <div className="field-group">
        <label>Tech Stack</label>
        <input type="text" value={entry.tech} onChange={e => update({ tech: e.target.value })} placeholder="React, Node.js, PostgreSQL, AWS" />
      </div>

      <div className="field-group">
        <label>URL <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
        <input type="url" value={entry.url} onChange={e => update({ url: e.target.value })} placeholder="https://github.com/username/project" />
      </div>

      <div className="field-group">
        <label>Description</label>
        <textarea value={entry.description} onChange={e => update({ description: e.target.value })}
          placeholder="Describe the project, your contributions, and the impact…" rows={3} />
      </div>

      <div className="field-group" style={{ marginBottom: 6, marginTop: 4 }}>
        <input
          type="text"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="✦ AI Edit Instructions (Optional). e.g., Focus on backend architecture…"
          style={{ fontSize: 12, border: '1px solid var(--border-blue)', background: 'var(--blue-mid)' }}
        />
      </div>

      <button className={`ai-btn ${loading ? 'loading' : ''}`} onClick={generateDescription} disabled={loading}>
        {loading ? <><span className="spin">⟳</span> Generating…</> : '✦ Generate Description'}
      </button>

      {suggestion && (
        <div className="ai-suggestion-card">
          <div className="ai-suggestion-label">✦ AI Suggestion</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{suggestion}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ fontSize: 12 }}
              onClick={() => { update({ description: suggestion }); setSuggestion('') }}>✓ Apply</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setSuggestion('')}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const { resume, dispatch } = useResume()
  return (
    <>
      <div className="editor-header">
        <h2>Projects</h2>
        <span className="badge badge-accent">{resume.projects.length}</span>
      </div>
      <div className="editor-body">
        {resume.projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
            Showcase your side projects and open source contributions.
          </div>
        )}
        {resume.projects.map((p, i) => <ProjectCard key={p.id} entry={p} idx={i} />)}
        <button className="add-entry-btn" onClick={() => dispatch({ type: 'ADD_PROJECT' })} id="add-project-btn">
          + Add Project
        </button>
      </div>
    </>
  )
}
