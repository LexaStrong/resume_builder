import React from 'react'
import { useResume } from '../../context/ResumeContext'

function ProfileImage({ image }) {
  if (!image) return null
  return (
    <div className="theme-profile-wrap" style={{ marginBottom: 15 }}>
      <img src={image} alt="Profile" className="theme-profile-img" />
    </div>
  )
}

function ModernTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills, projects: proj } = resume
  return (
    <div className="resume-page theme-modern" id="resume-preview">
      <div className="mod-left">
        <ProfileImage image={p.image} />
        <div className="mod-name">{p.name || 'Your Name'}</div>
        <div className="mod-title">{p.title || 'Professional Title'}</div>

        <div className="mod-contact">
          {p.email && <div className="mod-contact-item">✉ {p.email}</div>}
          {p.phone && <div className="mod-contact-item">☎ {p.phone}</div>}
          {p.location && <div className="mod-contact-item">📍 {p.location}</div>}
          {p.linkedin && <div className="mod-contact-item">🔗 {p.linkedin}</div>}
          {p.website && <div className="mod-contact-item">🌐 {p.website}</div>}
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: 35 }}>
            <div className="mod-section-title">Skills</div>
            <div className="mod-skills">
              {skills.map(s => <span key={s} className="mod-skill">{s}</span>)}
            </div>
          </div>
        )}

        {edu.length > 0 && (
          <div>
            <div className="mod-section-title">Education</div>
            {edu.map(e => (
              <div key={e.id} style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{e.degree} {e.field && <span style={{ fontWeight: 400 }}>in {e.field}</span>}</div>
                <div style={{ fontSize: 11, color: '#3b82f6', marginBottom: 2 }}>{e.school}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{e.start && `${e.start} – ${e.end || 'Present'}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mod-right">
        {summary && (
          <div style={{ marginBottom: 35 }}>
            <div className="mod-section-title">Summary</div>
            <div className="mod-summary">{summary}</div>
          </div>
        )}

        {exp.length > 0 && (
          <div style={{ marginBottom: 35 }}>
            <div className="mod-section-title">Experience</div>
            {exp.map(e => (
              <div key={e.id} className="mod-entry">
                <div className="mod-entry-head">
                  <span className="mod-role">{e.role} <span className="mod-company">at {e.company}</span></span>
                  <span className="mod-date">{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</span>
                </div>
                {e.description && (
                  <div className="mod-desc">
                    {e.description.includes('•') || e.description.includes('-') ? (
                      <ul>{e.description.split('\n').map((l, i) => l.trim() && <li key={i}>{l.replace(/^[•\-]\s*/, '')}</li>)}</ul>
                    ) : e.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {proj.length > 0 && (
          <div>
            <div className="mod-section-title">Projects</div>
            {proj.map(p => (
              <div key={p.id} className="mod-entry" style={{ marginBottom: 15 }}>
                <div className="mod-entry-head">
                  <span className="mod-role">{p.name} {p.role && <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>— {p.role}</span>}</span>
                </div>
                {p.tech && <div style={{ fontSize: 11, color: '#3b82f6', marginBottom: 4 }}>{p.tech}</div>}
                {p.description && <div className="mod-desc">{p.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClassicTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills, projects: proj } = resume
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join('  |  ')

  return (
    <div className="resume-page theme-classic" id="resume-preview">
      <div className="cla-header">
        <ProfileImage image={p.image} />
        <div className="cla-name">{p.name || 'Your Name'}</div>
        {contact && <div className="cla-contact">{contact}</div>}
      </div>

      {summary && (
        <div className="cla-section">
          <div className="cla-section-title">Professional Summary</div>
          <div className="cla-desc">{summary}</div>
        </div>
      )}

      {exp.length > 0 && (
        <div className="cla-section">
          <div className="cla-section-title">Experience</div>
          {exp.map(e => (
            <div key={e.id} className="cla-entry">
              <div className="cla-entry-head">
                <span className="cla-title">{e.role}, {e.company}</span>
                <span className="cla-date">{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</span>
              </div>
              {e.description && (
                <div className="cla-desc">
                  {e.description.includes('•') || e.description.includes('-') ? (
                    <ul>{e.description.split('\n').map((l, i) => l.trim() && <li key={i}>{l.replace(/^[•\-]\s*/, '')}</li>)}</ul>
                  ) : e.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {edu.length > 0 && (
        <div className="cla-section">
          <div className="cla-section-title">Education</div>
          {edu.map(e => (
            <div key={e.id} className="cla-entry">
              <div className="cla-entry-head">
                <span className="cla-title">{e.school}</span>
                <span className="cla-date">{e.start && `${e.start} – ${e.end || 'Present'}`}</span>
              </div>
              <div className="cla-subtitle">{e.degree} {e.field && `in ${e.field}`}</div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="cla-section">
          <div className="cla-section-title">Skills</div>
          <div className="cla-desc">{skills.join(' • ')}</div>
        </div>
      )}
    </div>
  )
}

function MinimalTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills } = resume

  return (
    <div className="resume-page theme-minimal" id="resume-preview">
      <div className="min-header">
        <ProfileImage image={p.image} />
        <div>
          <div className="min-name">{p.name || 'Your Name'}</div>
          <div className="min-title">{p.title || 'Professional Title'}</div>
          <div className="min-contact">
            {[p.email, p.phone, p.location].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>
      </div>

      {summary && (
        <div className="min-grid">
          <div className="min-section-title">Summary</div>
          <div className="min-desc">{summary}</div>
        </div>
      )}

      {exp.length > 0 && (
        <div className="min-grid">
          <div className="min-section-title">Experience</div>
          <div>
            {exp.map(e => (
              <div key={e.id} className="min-entry">
                <div className="min-role">{e.role}</div>
                <div className="min-company">{e.company}</div>
                <div className="min-date">{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</div>
                {e.description && <div className="min-desc">{e.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {edu.length > 0 && (
        <div className="min-grid">
          <div className="min-section-title">Education</div>
          <div>
            {edu.map(e => (
              <div key={e.id} className="min-entry">
                <div className="min-role">{e.degree} {e.field && `in ${e.field}`}</div>
                <div className="min-company">{e.school}</div>
                <div className="min-date">{e.start && `${e.start} – ${e.end || 'Present'}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="min-grid">
          <div className="min-section-title">Skills</div>
          <div className="min-desc">{skills.join(', ')}</div>
        </div>
      )}
    </div>
  )
}

function BoldTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills } = resume

  return (
    <div className="resume-page theme-bold" id="resume-preview">
      <div className="bld-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProfileImage image={p.image} />
          <div>
            <div className="bld-name">{p.name || 'YOUR NAME'}</div>
            <div className="bld-title">{p.title?.toUpperCase() || 'TITLE'}</div>
          </div>
        </div>
        <div className="bld-contact">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>

      <div className="bld-body">
        {summary && (
          <div className="bld-section">
            <div className="bld-section-title">Profile</div>
            <div className="bld-desc" style={{ fontSize: 13, fontWeight: 500 }}>{summary}</div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="bld-section">
            <div className="bld-section-title">Experience</div>
            {exp.map(e => (
              <div key={e.id} className="bld-entry">
                <div className="bld-entry-head">
                  <div>
                    <span className="bld-role">{e.role}</span>
                    <span className="bld-company"> // {e.company}</span>
                  </div>
                  <span className="bld-date">{e.start && `${e.start} - ${e.current ? 'PRESENT' : e.end?.toUpperCase()}`}</span>
                </div>
                {e.description && <div className="bld-desc">{e.description}</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          {edu.length > 0 && (
            <div className="bld-section">
              <div className="bld-section-title">Education</div>
              {edu.map(e => (
                <div key={e.id} className="bld-entry">
                  <div className="bld-role">{e.degree}</div>
                  <div className="bld-company">{e.school}</div>
                  <div className="bld-date" style={{ display: 'inline-block', marginTop: 5 }}>{e.end || e.start}</div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div className="bld-section">
              <div className="bld-section-title">Skills</div>
              <div className="bld-desc" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map(s => <span key={s} style={{ background: '#e2e8f0', padding: '3px 8px', borderRadius: 3, fontWeight: 700 }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExecutiveTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills } = resume
  const contact = [p.email, p.phone, p.location].filter(Boolean).join('  |  ')

  return (
    <div className="resume-page theme-exec" id="resume-preview">
      <div className="exec-header">
        <ProfileImage image={p.image} />
        <div>
          <div className="exec-name">{p.name || 'Your Name'}</div>
          {contact && <div className="exec-contact">{contact}</div>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: 20 }}>
          <div className="exec-section-title">Executive Summary</div>
          <div className="exec-desc">{summary}</div>
        </div>
      )}

      {exp.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="exec-section-title">Professional Experience</div>
          {exp.map(e => (
            <div key={e.id} className="exec-entry">
              <div className="exec-entry-head">
                <span className="exec-role">{e.role} <span className="exec-company">at {e.company}</span></span>
                <span className="exec-date">{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</span>
              </div>
              {e.description && <div className="exec-desc">{e.description}</div>}
            </div>
          ))}
        </div>
      )}

      {edu.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="exec-section-title">Education & Credentials</div>
          {edu.map(e => (
            <div key={e.id} className="exec-entry" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><span className="exec-role">{e.degree} {e.field}</span> — <span className="exec-company">{e.school}</span></div>
              <span className="exec-date">{e.end || e.start}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="exec-section-title">Core Competencies</div>
          <div className="exec-desc">{skills.join(' • ')}</div>
        </div>
      )}
    </div>
  )
}

function StartupTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills } = resume

  return (
    <div className="resume-page theme-startup" id="resume-preview">
      <div className="sup-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProfileImage image={p.image} />
          <div>
            <div className="sup-name">{p.name || 'Your Name'}</div>
            <div className="sup-title">{p.title || 'Tech Professional'}</div>
          </div>
        </div>
        <div className="sup-contact">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>

      {summary && (
        <div className="sup-section">
          <div className="sup-section-title">{'<about>'}</div>
          <div className="sup-desc">{summary}</div>
        </div>
      )}

      {exp.length > 0 && (
        <div className="sup-section">
          <div className="sup-section-title">{'<experience>'}</div>
          {exp.map(e => (
            <div key={e.id} className="sup-entry">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div><span className="sup-role">{e.role}</span> @ <span className="sup-company">{e.company}</span></div>
                <div className="sup-date">{e.start && `${e.start} -> ${e.current ? 'present' : e.end}`}</div>
              </div>
              {e.description && <div className="sup-desc">{e.description}</div>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="sup-section">
          <div className="sup-section-title">{'<stack>'}</div>
          <div className="sup-desc">{skills.map(s => `[${s}] `)}</div>
        </div>
      )}
    </div>
  )
}

function AcademicTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, projects: proj } = resume
  const contactParts = [p.email, p.phone, p.location, p.website].filter(Boolean).join(' • ')

  return (
    <div className="resume-page theme-academic" id="resume-preview">
      <div className="aca-header">
        <ProfileImage image={p.image} />
        <div className="aca-name">{p.name || 'Your Name'}</div>
        <div className="aca-contact">{contactParts}</div>
      </div>

      {summary && (
        <div>
          <div className="aca-section-title">Research Overview</div>
          <div className="aca-content">{summary}</div>
        </div>
      )}

      {edu.length > 0 && (
        <div>
          <div className="aca-section-title">Education</div>
          {edu.map(e => (
            <div key={e.id} className="aca-entry">
              <div className="aca-date">{e.start && `${e.start} – ${e.end || 'Present'}`}</div>
              <div className="aca-content">
                <span className="aca-title">{e.degree} {e.field && `in ${e.field}`}</span><br/>
                <span className="aca-subtitle">{e.school}</span>
                {e.description && <div style={{ marginTop: 4 }}>{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {exp.length > 0 && (
        <div>
          <div className="aca-section-title">Academic & Professional Appointments</div>
          {exp.map(e => (
            <div key={e.id} className="aca-entry">
              <div className="aca-date">{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</div>
              <div className="aca-content">
                <span className="aca-title">{e.role}</span><br/>
                <span className="aca-subtitle">{e.company}</span>
                {e.description && <div style={{ marginTop: 4 }}>{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {proj.length > 0 && (
        <div>
          <div className="aca-section-title">Publications & Selected Works</div>
          {proj.map(p => (
            <div key={p.id} className="aca-entry" style={{ display: 'block' }}>
              <div className="aca-content">
                <strong>{p.role || p.name}</strong>. {p.description || p.tech}. {p.url}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreativeTheme({ resume }) {
  const { personal: p, summary, experience: exp, education: edu, skills, projects: proj } = resume

  return (
    <div className="resume-page theme-creative" id="resume-preview">
      <div className="cre-left">
        <ProfileImage image={p.image} />
        <div className="cre-name">{p.name || 'Your Name'}</div>
        <div className="cre-title" style={{ marginBottom: 30 }}>{p.title || 'Creative Professional'}</div>
        
        <div className="cre-section-title">Contact</div>
        <div className="cre-contact">
          {[p.email, p.phone, p.location, p.website].filter(Boolean).map((c, i) => <div key={i}>{c}</div>)}
        </div>

        {skills.length > 0 && (
          <div>
            <div className="cre-section-title">Expertise</div>
            <div className="cre-skills">
              {skills.map(s => <span key={s} className="cre-skill">{s}</span>)}
            </div>
          </div>
        )}

        {edu.length > 0 && (
          <div>
            <div className="cre-section-title">Education</div>
            {edu.map(e => (
              <div key={e.id} style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#5a32fa' }}>{e.degree}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#2b1c50' }}>{e.school}</div>
                <div style={{ fontSize: 10, color: '#8c7abf' }}>{e.end || e.start}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="cre-right">
        {summary && (
          <div style={{ marginBottom: 30 }}>
             <div className="cre-section-title">Profile</div>
             <div className="cre-desc">{summary}</div>
          </div>
        )}

        {exp.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <div className="cre-section-title">Experience</div>
            {exp.map(e => (
              <div key={e.id} className="cre-entry">
                 <div className="cre-role">{e.role}</div>
                 <div className="cre-company">{e.company} <span style={{ fontSize: 11, color: '#8c7abf', fontWeight: 400, marginLeft: 6 }}>{e.start && `${e.start} – ${e.current ? 'Present' : e.end}`}</span></div>
                 {e.description && <div className="cre-desc" style={{ marginTop: 6 }}>{e.description}</div>}
              </div>
            ))}
          </div>
        )}

        {proj.length > 0 && (
          <div>
            <div className="cre-section-title">Featured Work</div>
            {proj.map(p => (
              <div key={p.id} className="cre-entry">
                <div className="cre-role">{p.name}</div>
                <div className="cre-company">{p.role}</div>
                {p.description && <div className="cre-desc" style={{ marginTop: 6 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResumePreview() {
  const { resume, theme } = useResume()

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <div className="preview-toolbar-left">
          <span className="preview-label">Live Preview</span>
          <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{theme} Theme</span>
        </div>
      </div>
      <div className="preview-body">
        <div className="resume-page-wrap">
          {theme === 'modern' && <ModernTheme resume={resume} />}
          {theme === 'classic' && <ClassicTheme resume={resume} />}
          {theme === 'minimal' && <MinimalTheme resume={resume} />}
          {theme === 'bold' && <BoldTheme resume={resume} />}
          {theme === 'executive' && <ExecutiveTheme resume={resume} />}
          {theme === 'startup' && <StartupTheme resume={resume} />}
          {theme === 'academic' && <AcademicTheme resume={resume} />}
          {theme === 'creative' && <CreativeTheme resume={resume} />}
        </div>
      </div>
    </div>
  )
}
