import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { useGemini } from '../../hooks/useGemini'
import { prompts } from '../../utils/aiPrompts'

export default function Skills() {
  const { resume, dispatch } = useResume()
  const { callGemini } = useGemini()
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiChips, setAiChips] = useState([])

  function addSkill(s) {
    const trimmed = s.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_SKILL', payload: trimmed })
    setInputVal('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputVal)
    }
  }

  async function suggestSkills() {
    setLoading(true)
    setAiChips([])
    try {
      const jobTitle = resume.personal.title || 'Professional'
      const text = await callGemini(prompts.skillSuggestions(jobTitle))
      const cleaned = text.trim().replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed)) setAiChips(parsed.filter(s => !resume.skills.includes(s)))
    } catch {
      const fallback = ['Communication', 'Leadership', 'Problem Solving', 'Collaboration', 'Time Management', 'Project Management']
      setAiChips(fallback.filter(s => !resume.skills.includes(s)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="editor-header">
        <h2>Skills</h2>
        <span className="badge badge-accent">{resume.skills.length}</span>
      </div>
      <div className="editor-body">
        <div className="field-group">
          <label>Add a Skill</label>
          <div className="skill-input-row">
            <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Type skill and press Enter…" id="skill-input" />
            <button className="btn btn-secondary" onClick={() => addSkill(inputVal)} style={{ flexShrink: 0 }}>+ Add</button>
          </div>
        </div>

        {resume.skills.length > 0 && (
          <div className="field-group">
            <label>Current Skills</label>
            <div className="skills-list">
              {resume.skills.map(s => (
                <div key={s} className="skill-tag">
                  {s}
                  <button className="skill-remove" onClick={() => dispatch({ type: 'REMOVE_SKILL', payload: s })}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className={`ai-btn w-full ${loading ? 'loading' : ''}`} onClick={suggestSkills}
          disabled={loading} id="suggest-skills-btn" style={{ justifyContent: 'center', padding: '9px' }}>
          {loading ? <><span className="spin">⟳</span> Finding suggestions…</> : '✦ Suggest Skills for My Role'}
        </button>

        {aiChips.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-blue)', marginBottom: 8 }}>
              Click to add
            </div>
            <div className="suggestion-chips">
              {aiChips.map(s => (
                <button key={s} className="chip"
                  onClick={() => { dispatch({ type: 'ADD_SKILL', payload: s }); setAiChips(prev => prev.filter(c => c !== s)) }}>
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="info-box">
          <strong>Tip:</strong> Include a mix of technical and soft skills. Aim for 8–15 relevant skills. AI suggestions are based on your job title.
        </div>
      </div>
    </>
  )
}
