import React, { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { useGemini } from '../hooks/useGemini'
import { prompts } from '../utils/aiPrompts'

function buildResumeText(resume) {
  const { personal, summary, experience, education, skills, projects } = resume
  let text = `${personal.name} | ${personal.title}\n${personal.email} | ${personal.phone} | ${personal.location}\n\n`
  if (summary) text += `SUMMARY\n${summary}\n\n`
  if (experience.length) {
    text += `EXPERIENCE\n`
    experience.forEach(e => text += `${e.role} at ${e.company} (${e.start} - ${e.current ? 'Present' : e.end})\n${e.description}\n\n`)
  }
  if (education.length) {
    text += `EDUCATION\n`
    education.forEach(e => text += `${e.degree} in ${e.field}, ${e.school} (${e.start}-${e.end})\n`)
    text += '\n'
  }
  if (skills.length) text += `SKILLS\n${skills.join(', ')}\n\n`
  if (projects.length) {
    text += `PROJECTS\n`
    projects.forEach(p => text += `${p.name}: ${p.description}\n`)
  }
  return text
}

export default function ATSScore() {
  const { resume } = useResume()
  const { callGemini } = useGemini()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function analyze() {
    setLoading(true); setError(''); setResult(null)
    try {
      const resumeText = buildResumeText(resume)
      const raw = await callGemini(prompts.atsScore(resumeText))
      const cleaned = raw.trim().replace(/```json\n?|\n?```/g, '').trim()
      setResult(JSON.parse(cleaned))
    } catch (e) { setError(`Analysis failed: ${e.message}`) }
    finally { setLoading(false) }
  }

  const scoreColor = result
    ? result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#f59e0b' : '#ef4444'
    : 'var(--blue)'

  return (
    <>
      <div className="editor-header">
        <h2>ATS Score Analyzer</h2>
      </div>
      <div className="editor-body">
        <div className="info-box">
          ATS (Applicant Tracking Systems) filter resumes before humans review them. Get an AI score and targeted tips to improve your pass rate.
        </div>

        <button className="btn btn-primary w-full" onClick={analyze} disabled={loading}
          id="analyze-ats-btn" style={{ justifyContent: 'center', padding: 10 }}>
          {loading ? <><span className="spin">⟳</span> Analyzing…</> : '🔍 Run ATS Analysis'}
        </button>

        {error && (
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #ef4444', fontSize: 12, color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Score Card */}
            <div style={{ padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: `4px solid ${scoreColor}` }}>
              <div className="ats-score-header">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 6 }}>
                    ATS Compatibility
                  </div>
                  <div className="ats-score-num" style={{ color: scoreColor }}>
                    {result.score}<span style={{ fontSize: 18, fontWeight: 400, color: 'var(--text-muted)' }}>/100</span>
                  </div>
                </div>
                <div style={{ fontSize: 36 }}>
                  {result.score >= 80 ? '🏆' : result.score >= 60 ? '⚡' : '💪'}
                </div>
              </div>
              <div className="ats-bar">
                <div className="ats-bar-fill" style={{ width: `${result.score}%`, background: scoreColor }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                {result.score >= 80 ? 'Excellent — highly optimized for ATS systems.'
                  : result.score >= 60 ? 'Good — a few improvements will strengthen it.'
                  : 'Needs work — follow the recommendations below.'}
              </div>
            </div>

            {/* Tips */}
            {result.tips?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-blue)', marginBottom: 8 }}>
                  Recommendations
                </div>
                <div className="ats-tips">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="ats-tip">
                      <span style={{ fontSize: 15, flexShrink: 0 }}>
                        {['01', '02', '03', '04', '05'][i]}
                      </span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-ghost w-full" style={{ justifyContent: 'center', fontSize: 12 }} onClick={analyze}>
              ↻ Re-analyze
            </button>
          </div>
        )}
      </div>
    </>
  )
}
