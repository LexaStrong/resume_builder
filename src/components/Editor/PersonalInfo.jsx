import React, { useRef } from 'react'
import { useResume } from '../../context/ResumeContext'

const fields = [
  { id: 'name', label: 'Full Name', placeholder: 'Jane Doe', col: 'full' },
  { id: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer', col: 'full' },
  { id: 'email', label: 'Email', placeholder: 'jane@example.com', col: 'half' },
  { id: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', col: 'half' },
  { id: 'location', label: 'Location', placeholder: 'New York, NY', col: 'half' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jane', col: 'half' },
  { id: 'website', label: 'Website / Portfolio', placeholder: 'jane.dev', col: 'full' },
]

export default function PersonalInfo() {
  const { resume, dispatch } = useResume()
  const p = resume.personal
  const fileInputRef = useRef(null)

  function handleChange(id, value) {
    dispatch({ type: 'SET_PERSONAL', payload: { [id]: value } })
  }

  // Compress image so it fits comfortably in local storage
  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 300
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        handleChange('image', compressedBase64)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    handleChange('image', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const halves = []
  const rows = []
  fields.forEach(f => {
    if (f.col === 'full') {
      if (halves.length) { rows.push({ type: 'pair', pair: [...halves] }); halves.length = 0 }
      rows.push({ type: 'full', field: f })
    } else {
      halves.push(f)
      if (halves.length === 2) { rows.push({ type: 'pair', pair: [...halves] }); halves.length = 0 }
    }
  })
  if (halves.length) rows.push({ type: 'pair', pair: [...halves] })

  return (
    <>
      <div className="editor-header">
        <h2>Personal Information</h2>
      </div>
      <div className="editor-body">
        {/* Profile Image Uploader */}
        <div className="field-group" style={{ marginBottom: 12 }}>
          <label>Profile Photo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
            {p.image ? (
              <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src={p.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-input)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--text-muted)' }}>
                👤
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
                id="photo-upload" 
              />
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              {p.image && (
                <button 
                  className="btn btn-ghost" 
                  style={{ fontSize: 11, padding: '4px 10px', color: '#e55' }}
                  onClick={removeImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {rows.map((row, i) =>
          row.type === 'full'
            ? (
              <div key={i} className="field-group">
                <label htmlFor={`pi-${row.field.id}`}>{row.field.label}</label>
                <input id={`pi-${row.field.id}`} type="text" value={p[row.field.id] || ''}
                  onChange={e => handleChange(row.field.id, e.target.value)} placeholder={row.field.placeholder} />
              </div>
            ) : (
              <div key={i} className="field-row">
                {row.pair.map(f => (
                  <div key={f.id} className="field-group">
                    <label htmlFor={`pi-${f.id}`}>{f.label}</label>
                    <input id={`pi-${f.id}`} type="text" value={p[f.id] || ''}
                      onChange={e => handleChange(f.id, e.target.value)} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
            )
        )}
        <div className="info-box" style={{ marginTop: 8 }}>
          <strong>Tip:</strong> Include a photo only if it is customary in your industry or region. Make sure details perfectly match your LinkedIn.
        </div>
      </div>
    </>
  )
}
