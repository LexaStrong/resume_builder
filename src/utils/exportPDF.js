import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(elementId = 'resume-preview', filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 10

    const x = (pdfWidth - imgWidth * ratio / 10) / 2
    const y = 0

    pdf.addImage(imgData, 'PNG', x, y, imgWidth * ratio / 10, imgHeight * ratio / 10)
    pdf.save(filename)
    return true
  } catch (err) {
    console.error('PDF export error:', err)
    throw err
  }
}
