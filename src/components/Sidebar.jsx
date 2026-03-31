import React, { useState, useRef, useEffect } from 'react'
import { useResume } from '../context/ResumeContext'
import { exportToPDF } from '../utils/exportPDF'
import { exportToDOCX } from '../utils/exportDOCX'

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'summary', label: 'Summary', icon: '📝' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
]

export default function Sidebar({ onOpenAI }) {
  const { activeSection, setActiveSection, resume } = useResume()
  const [exporting, setExporting] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setExportOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleExportPDF() {
    setExportOpen(false)
    setExporting('pdf')
    try { await exportToPDF('resume-preview', `${resume.personal.name || 'resume'}.pdf`) }
    catch { alert('PDF export failed. Please try again.') }
    finally { setExporting(false) }
  }

  async function handleExportDOCX() {
    setExportOpen(false)
    setExporting('docx')
    try { await exportToDOCX(resume, `${resume.personal.name || 'resume'}.docx`) }
    catch (e) { alert(`DOCX export failed: ${e.message}`) }
    finally { setExporting(false) }
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>
          <span className="logo-mark">R</span>
          ResumeAI Pro
        </h1>
        <p>AI-Powered Resume Builder</p>
      </div>

      {/* Sections */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Resume Sections</div>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`sidebar-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Design */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Design & Optimization</div>
        <button className={`sidebar-btn ${activeSection === 'themes' ? 'active' : ''}`} onClick={() => setActiveSection('themes')}>
          <span className="icon">🎨</span>Themes
        </button>
        <button className={`sidebar-btn ${activeSection === 'ats' ? 'active' : ''}`} onClick={() => setActiveSection('ats')}>
          <span className="icon">📊</span>ATS Score
        </button>
        <button className={`sidebar-btn ${activeSection === 'tailor' ? 'active' : ''}`} onClick={() => setActiveSection('tailor')}>
          <span className="icon">🎯</span>AI Tailor
        </button>
      </div>

      {/* AI */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">AI Tools</div>
        <button className="sidebar-btn" onClick={onOpenAI}>
          <span className="icon">🤖</span>AI Coach
          <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>Live</span>
        </button>
      </div>

      {/* Export */}
      <div className="sidebar-footer">
        <div className="export-menu-wrap" ref={menuRef}>
          {exportOpen && (
            <div className="export-menu">
              <button className="export-option" onClick={handleExportPDF} id="export-pdf-btn">
                <span className="opt-icon">📄</span>
                <span>
                  <span className="opt-label">Export as PDF</span>
                  <span className="opt-desc">Best for sharing & printing</span>
                </span>
              </button>
              <button className="export-option" onClick={handleExportDOCX} id="export-docx-btn">
                <span className="opt-icon">📝</span>
                <span>
                  <span className="opt-label">Export as DOCX</span>
                  <span className="opt-desc">Editable in Microsoft Word</span>
                </span>
              </button>
            </div>
          )}
          <button
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', position: 'relative' }}
            onClick={() => setExportOpen(o => !o)}
            disabled={!!exporting}
            id="export-btn-main"
          >
            {exporting === 'pdf' && <span className="spin">⟳</span>}
            {exporting === 'docx' && <span className="spin">⟳</span>}
            {!exporting && '⬇'}
            {exporting === 'pdf' ? ' Exporting PDF…' : exporting === 'docx' ? ' Exporting DOCX…' : ' Export Resume ▲'}
          </button>
        </div>
      </div>
    </aside>
  )
}
