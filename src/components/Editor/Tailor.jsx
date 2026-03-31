import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useResume } from '../../context/ResumeContext'
import { useGemini } from '../../hooks/useGemini'
import { prompts } from '../../utils/aiPrompts'

function buildResumeTextForTailoring(resume) {
  const { personal, summary, experience, education, skills, projects } = resume
  let text = `${personal.name} | ${personal.title}\n\nSUMMARY\n${summary}\n\n`
  if (experience.length) {
    experience.forEach(e => text += `${e.role} at ${e.company}\n${e.description}\n\n`)
  }
  if (skills.length) text += `SKILLS\n${skills.join(', ')}\n`
  return text
}

export default function Tailor() {
  const { resume } = useResume()
  const { callGemini } = useGemini()
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function tailorResume() {
    if (!jobDescription.trim()) return
    setLoading(true)
    setResult('')
    try {
      const resumeText = buildResumeTextForTailoring(resume)
      const raw = await callGemini(prompts.tailorToJob(resumeText, jobDescription))
      setResult(raw)
    } catch (e) {
      setResult(`**Analysis failed:** ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="editor-header">
        <h2>A.I. Job Tailor</h2>
      </div>
      <div className="editor-body">
        <div className="info-box" style={{ marginBottom: 12 }}>
          Paste the description of the job you are applying for. The AI will cross-reference it with your resume and suggest missing keywords, bullet point rewrites, and the best theme to use.
        </div>

        <div className="field-group">
          <label>Job Description</label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting here (responsibilities, requirements, about the company)…"
            rows={8}
            style={{ fontSize: 11 }}
          />
        </div>

        <button 
          className="btn btn-primary w-full" 
          onClick={tailorResume} 
          disabled={loading || !jobDescription.trim()}
          style={{ justifyContent: 'center', padding: 10, marginTop: 4 }}
        >
          {loading ? <><span className="spin">⟳</span> Generating Strategy…</> : '🎯 Analyze & Tailor Resume'}
        </button>

        {result && (
          <div className="md-content" style={{ marginTop: 24, padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderTop: '4px solid var(--blue)', borderRadius: 'var(--radius-sm)' }}>
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {result}
             </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  )
}
