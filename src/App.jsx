import React, { useState } from 'react'
import { ResumeProvider } from './context/ResumeContext'
import Sidebar from './components/Sidebar'
import ThemePicker from './components/ThemePicker'
import AIAssistant from './components/AIAssistant'
import ATSScore from './components/ATSScore'
import ResumePreview from './components/Preview/ResumePreview'
import PersonalInfo from './components/Editor/PersonalInfo'
import Summary from './components/Editor/Summary'
import Experience from './components/Editor/Experience'
import Education from './components/Editor/Education'
import Skills from './components/Editor/Skills'
import Projects from './components/Editor/Projects'
import Tailor from './components/Editor/Tailor'
import { useResume } from './context/ResumeContext'
import './themes.css'

function EditorPanel() {
  const { activeSection } = useResume()
  const sectionMap = {
    personal: <PersonalInfo />,
    summary: <Summary />,
    experience: <Experience />,
    education: <Education />,
    skills: <Skills />,
    projects: <Projects />,
    themes: <ThemePicker />,
    ats: <ATSScore />,
    tailor: <Tailor />,
  }
  return (
    <div className="editor-panel">
      {sectionMap[activeSection] || <PersonalInfo />}
    </div>
  )
}

function AppInner() {
  const [aiOpen, setAiOpen] = useState(false)
  return (
    <div className="app">
      <Sidebar onOpenAI={() => setAiOpen(true)} />
      <EditorPanel />
      <ResumePreview />
      <div className="ai-assistant">
        <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
        <button
          className="ai-fab"
          onClick={() => setAiOpen(o => !o)}
          id="ai-fab-btn"
        >
          {aiOpen ? '✕ Close' : '🤖 AI Coach'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ResumeProvider>
      <AppInner />
    </ResumeProvider>
  )
}
