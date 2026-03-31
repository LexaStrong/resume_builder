import React from 'react'
import { useResume } from '../context/ResumeContext'

const THEMES = [
  { id: 'modern', label: 'Modern', style: 'mod' },
  { id: 'classic', label: 'Classic', style: 'cla' },
  { id: 'minimal', label: 'Minimal', style: 'min' },
  { id: 'bold', label: 'Bold', style: 'bld' },
  { id: 'executive', label: 'Executive', style: 'exe' },
  { id: 'startup', label: 'Startup', style: 'sup' },
  { id: 'academic', label: 'Academic', style: 'aca' },
  { id: 'creative', label: 'Creative', style: 'cre' },
]

export default function ThemePicker() {
  const { theme, setTheme } = useResume()

  function getThumbStyle(id) {
    if (id === 'classic') return { background: '#fff', borderTop: '2px solid #333' }
    if (id === 'minimal') return { background: '#fff' }
    if (id === 'bold') return { background: '#1a202c' }
    if (id === 'executive') return { background: '#fff', borderBottom: '1px solid #777' }
    if (id === 'startup') return { background: '#fff', fontFamily: 'monospace' }
    if (id === 'academic') return { background: '#fff', textAlign: 'center' }
    if (id === 'creative') return { background: '#f4f0ff', color: '#5a32fa' }
    return { background: '#f8fafc', borderRight: '10px solid white' }
  }

  return (
    <>
      <div className="editor-header">
        <h2>Appearance</h2>
      </div>
      <div className="editor-body">
        <div className="info-box" style={{ marginBottom: 15 }}>
          Choose a design that aligns with your industry. Traditional fields prefer Classic or Executive, while tech favors Modern or Startup.
        </div>
        
        <div className="theme-grid">
          {THEMES.map(t => (
            <div
              key={t.id}
              className={`theme-card ${theme === t.id ? 'selected' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              {theme === t.id && (
                <div className="selected-badge">✓</div>
              )}
              <div className="theme-preview-thumb">
                <div className="theme-thumb-header" style={getThumbStyle(t.id)} />
                <div className="theme-thumb-body">
                  <div className="theme-thumb-line short" />
                  <div className="theme-thumb-line med" />
                  <div className="theme-thumb-line med" style={{ marginTop: 4 }} />
                  <div className="theme-thumb-line full" />
                </div>
              </div>
              <div className="theme-card-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
