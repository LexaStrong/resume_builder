import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType, Table, TableRow,
  TableCell, WidthType, VerticalAlign, UnderlineType, Tab
} from 'docx'

function safeText(val) {
  return val ? String(val) : ''
}

function descLines(desc) {
  if (!desc) return []
  return desc.split('\n').filter(l => l.trim()).map(l => l.replace(/^[•\-]\s*/, '').trim())
}

export async function exportToDOCX(resume, filename = 'resume.docx') {
  const { personal, summary, experience, education, skills, projects } = resume

  const ACCENT = '1E6ABF'
  const DARK = '0D1B2A'
  const GRAY = '64748B'
  const LIGHT_GRAY = 'F1F5F9'

  function sectionHeading(text) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 20,
          color: ACCENT,
          font: 'Calibri',
        }),
      ],
      spacing: { before: 240, after: 80 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: ACCENT,
        },
      },
    })
  }

  function entryRow(title, subtitle, dateStr) {
    const children = []
    if (title) children.push(new TextRun({ text: title, bold: true, size: 22, color: DARK, font: 'Calibri' }))
    if (subtitle) children.push(new TextRun({ text: `  |  ${subtitle}`, size: 20, color: ACCENT, font: 'Calibri' }))
    if (dateStr) children.push(new TextRun({ text: `     ${dateStr}`, size: 18, color: GRAY, font: 'Calibri', italics: true }))

    return new Paragraph({
      children,
      spacing: { before: 120, after: 40 },
    })
  }

  function bullet(text) {
    return new Paragraph({
      children: [new TextRun({ text, size: 20, color: '374151', font: 'Calibri' })],
      bullet: { level: 0 },
      spacing: { after: 30 },
    })
  }

  function bodyText(text) {
    return new Paragraph({
      children: [new TextRun({ text, size: 20, color: '374151', font: 'Calibri', italics: true })],
      spacing: { after: 60 },
    })
  }

  function spacer(size = 80) {
    return new Paragraph({ children: [new TextRun('')], spacing: { before: size } })
  }

  const contactParts = [
    personal.email, personal.phone, personal.location, personal.linkedin, personal.website
  ].filter(Boolean)

  const children = [
    // Header — Name
    new Paragraph({
      children: [
        new TextRun({
          text: safeText(personal.name) || 'Your Name',
          bold: true,
          size: 56,
          color: DARK,
          font: 'Calibri',
        }),
      ],
      spacing: { after: 40 },
    }),
    // Title
    ...(personal.title ? [new Paragraph({
      children: [new TextRun({ text: personal.title, size: 26, color: ACCENT, font: 'Calibri', bold: false })],
      spacing: { after: 80 },
    })] : []),
    // Contact line
    ...(contactParts.length > 0 ? [new Paragraph({
      children: [new TextRun({ text: contactParts.join('  ·  '), size: 18, color: GRAY, font: 'Calibri' })],
      spacing: { after: 120 },
    })] : []),

    // Divider
    new Paragraph({
      children: [new TextRun('')],
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: ACCENT } },
      spacing: { after: 160 },
    }),

    // Summary
    ...(summary ? [
      sectionHeading('Professional Summary'),
      bodyText(summary),
    ] : []),

    // Experience
    ...(experience.length > 0 ? [
      sectionHeading('Work Experience'),
      ...experience.flatMap(e => {
        const dateStr = e.start
          ? `${e.start} – ${e.current ? 'Present' : (e.end || '')}`
          : ''
        const lines = descLines(e.description)
        return [
          entryRow(e.role, [e.company, e.location].filter(Boolean).join(', '), dateStr),
          ...lines.map(l => bullet(l)),
          spacer(60),
        ]
      }),
    ] : []),

    // Education
    ...(education.length > 0 ? [
      sectionHeading('Education'),
      ...education.flatMap(e => {
        const deg = [e.degree, e.field].filter(Boolean).join(' in ')
        const dateStr = e.start ? `${e.start} – ${e.end || ''}` : ''
        const lines = descLines(e.description)
        return [
          entryRow(e.school, deg || '', dateStr),
          ...(e.gpa ? [new Paragraph({ children: [new TextRun({ text: `GPA: ${e.gpa}`, size: 18, color: GRAY, font: 'Calibri' })], spacing: { after: 30 } })] : []),
          ...lines.map(l => bullet(l)),
          spacer(60),
        ]
      }),
    ] : []),

    // Skills
    ...(skills.length > 0 ? [
      sectionHeading('Skills'),
      new Paragraph({
        children: [new TextRun({ text: skills.join('  ·  '), size: 20, color: '374151', font: 'Calibri' })],
        spacing: { after: 120 },
      }),
    ] : []),

    // Projects
    ...(projects.length > 0 ? [
      sectionHeading('Projects'),
      ...projects.flatMap(p => [
        entryRow(p.name, p.role || '', p.tech || ''),
        ...(p.description ? [bodyText(p.description)] : []),
        ...(p.url ? [new Paragraph({ children: [new TextRun({ text: p.url, size: 18, color: ACCENT, font: 'Calibri' })], spacing: { after: 30 } })] : []),
        spacer(60),
      ]),
    ] : []),
  ]

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
