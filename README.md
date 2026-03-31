# ResumeAI Pro — AI-Powered Resume Builder

A highly structured, browser-based AI resume builder designed to help professionals create perfectly formatted, ATS-friendly resumes in minutes. Built with **React** and **Vite**, featuring intelligent integration with the **Google Gemini API**.

## 🌟 Key Features

- **Live Preview:** See your resume formatting update instantly as you type.
- **8 Professional Themes:** Including Modern, Classic, Minimal, Bold, Executive, Startup, Academic, and Creative styles. 
- **AI "Job Tailor":** Paste a Job Description to get targeted advice on missing keywords and bullet point rewrites.
- **AI Content Generation:** 
    - Professional Summary writer
    - Experience bullet point enhancer
    - Smart skill suggestions based on your job title
- **Floating AI Coach:** Get live resume advice and best practices right in the editor.
- **ATS Analysis:** Scan your resume against common Applicant Tracking Systems to get a compatibility score and improvement tips.
- **Export Options:** Download your finished resume as a pixel-perfect **PDF** or an editable **DOCX** file.
- **Local Persistence:** All your data safely saves directly to your browser's local storage.
- **Auto-Compressing Image Upload:** Safely add your profile picture; large images are automatically scaled down before storing to save memory.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Vanilla CSS (CSS Variables, Responsive Grids)
- **AI Integration:** Google Gemini API (`gemini-2.0-flash`)
- **Document Export:** 
  - `html2canvas` & `jspdf` (for PDF)
  - `docx` (for Word)
- **Markdown Rendering:** `react-markdown`, `remark-gfm`

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LexaStrong/resume_builder.git
   cd "ai resume builder"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to start building your resume!

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
