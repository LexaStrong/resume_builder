import React from 'react'
import { useResume } from '../../context/ResumeContext'

function EducationCard({ entry, idx }) {
  const { dispatch } = useResume()

  function update(payload) {
    dispatch({ type: 'UPDATE_EDUCATION', id: entry.id, payload })
  }

  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <span className="entry-card-title">
          {entry.school || `Education #${idx + 1}`}
        </span>
        <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_EDUCATION', id: entry.id })}>✕</button>
      </div>

      <div className="field-group">
        <label>School / University</label>
        <input type="text" value={entry.school} onChange={e => update({ school: e.target.value })} placeholder="MIT" />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Degree</label>
          <input type="text" value={entry.degree} onChange={e => update({ degree: e.target.value })} placeholder="Bachelor of Science" />
        </div>
        <div className="field-group">
          <label>Field of Study</label>
          <input type="text" value={entry.field} onChange={e => update({ field: e.target.value })} placeholder="Computer Science" />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Start Year</label>
          <input type="text" value={entry.start} onChange={e => update({ start: e.target.value })} placeholder="2018" />
        </div>
        <div className="field-group">
          <label>End Year</label>
          <input type="text" value={entry.end} onChange={e => update({ end: e.target.value })} placeholder="2022" />
        </div>
      </div>

      <div className="field-group">
        <label>GPA (optional)</label>
        <input type="text" value={entry.gpa} onChange={e => update({ gpa: e.target.value })} placeholder="3.8 / 4.0" />
      </div>

      <div className="field-group">
        <label>Notable Achievements / Activities (optional)</label>
        <textarea
          value={entry.description}
          onChange={e => update({ description: e.target.value })}
          placeholder="Dean's List, Thesis: Machine Learning in Healthcare, Robotics Club President…"
          rows={3}
        />
      </div>
    </div>
  )
}

export default function Education() {
  const { resume, dispatch } = useResume()
  return (
    <>
      <div className="editor-header">
        <h2>🎓 Education</h2>
        <span className="badge badge-accent">{resume.education.length} entries</span>
      </div>
      <div className="editor-body">
        {resume.education.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
            Add your education history
          </div>
        )}
        {resume.education.map((e, i) => <EducationCard key={e.id} entry={e} idx={i} />)}
        <button className="add-entry-btn" onClick={() => dispatch({ type: 'ADD_EDUCATION' })} id="add-education-btn">
          ＋ Add Education
        </button>
      </div>
    </>
  )
}
