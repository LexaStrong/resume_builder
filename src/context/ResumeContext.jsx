import React, { createContext, useContext, useReducer, useEffect } from 'react'

const defaultResume = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', image: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
}

const ResumeContext = createContext(null)

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } }
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload }
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, { id: Date.now(), company: '', role: '', start: '', end: '', current: false, location: '', description: '' }] }
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: state.experience.map(e => e.id === action.id ? { ...e, ...action.payload } : e) }
    case 'REMOVE_EXPERIENCE':
      return { ...state, experience: state.experience.filter(e => e.id !== action.id) }
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, { id: Date.now(), school: '', degree: '', field: '', start: '', end: '', gpa: '', description: '' }] }
    case 'UPDATE_EDUCATION':
      return { ...state, education: state.education.map(e => e.id === action.id ? { ...e, ...action.payload } : e) }
    case 'REMOVE_EDUCATION':
      return { ...state, education: state.education.filter(e => e.id !== action.id) }
    case 'ADD_SKILL':
      if (!action.payload || state.skills.includes(action.payload)) return state
      return { ...state, skills: [...state.skills, action.payload] }
    case 'REMOVE_SKILL':
      return { ...state, skills: state.skills.filter(s => s !== action.payload) }
    case 'SET_SKILLS':
      return { ...state, skills: action.payload }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, { id: Date.now(), name: '', role: '', url: '', description: '', tech: '' }] }
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.id ? { ...p, ...action.payload } : p) }
    case 'REMOVE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.id) }
    default:
      return state
  }
}

export function ResumeProvider({ children }) {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('ai-resume-data')) } catch { return null }
  })()
  const storedTheme = localStorage.getItem('ai-resume-theme') || 'modern'

  const [resume, dispatch] = useReducer(resumeReducer, stored || defaultResume)
  const [activeSection, setActiveSection] = React.useState('personal')
  const [theme, setTheme] = React.useState(storedTheme)

  useEffect(() => { localStorage.setItem('ai-resume-data', JSON.stringify(resume)) }, [resume])
  useEffect(() => { localStorage.setItem('ai-resume-theme', theme) }, [theme])

  return (
    <ResumeContext.Provider value={{ resume, dispatch, activeSection, setActiveSection, theme, setTheme }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  return useContext(ResumeContext)
}
