export const prompts = {
  summary: ({ name, title, experience, instructions }) =>
    `Write a professional resume summary for ${name || 'a candidate'}, a ${title || 'professional'} with ${experience || 'several years'} of experience. 
Make it 2-3 sentences, impactful, achievement-focused, and ATS-friendly. 
${instructions ? `\nUSER INSTRUCTIONS:\nYou MUST highly prioritize the following user directions: "${instructions}"\n` : ''}
Return ONLY the summary text, no preamble.`,

  enhanceBullet: (bullet) =>
    `Rewrite this resume bullet point to be more impactful, quantified where possible, and action-verb-led:
"${bullet}"
Write 2 distinct, highly professional variations. Format as a markdown list with bullet points. No conversational preamble.`,

  skillSuggestions: (title) =>
    `List 12 highly relevant technical and soft skills for a ${title || 'professional'} in a modern resume.
Return ONLY a JSON array of skill strings, e.g. ["Skill 1","Skill 2",...]. No other text.`,

  atsScore: (resumeText) =>
    `Analyze this resume for ATS (Applicant Tracking System) compatibility and overall quality:

${resumeText}

Return a JSON object with:
{
  "score": (number 0-100),
  "tips": [(array of 4-5 short actionable improvement tips as strings)]
}
Return ONLY the JSON, no other text.`,

  tailorToJob: (resumeText, jobDescription) =>
    `Act as an expert Recruiter and ATS system.
Compare the following resume snapshot to the provided Job Description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide specific tailoring advice. You MUST format your response entirely in standard Markdown. Use bold headers (##) and bullet points (-).
Include exactly three sections:
## 1. Missing Keywords
(list 4-6 crucial keywords or skills found in the JD but missing from the resume)

## 2. Bullet Point Optimizations
(Suggest rewrites for 2 specific accomplishments to explicitly match the phrasing in the JD)

## 3. Recommended Design Theme
(Briefly recommend whether they should use a Modern, Classic, Minimal, Executive, Startup, Academic, or Creative design based on the company vibe in the JD)`,

  chat: (history, message, resumeSummary) =>
    `You are an expert resume coach and career advisor. The user is building their resume.

Current resume snapshot:
${resumeSummary}

Conversation history:
${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}

User: ${message}

Give helpful, specific, and encouraging advice. MUST format your response in clean Markdown. Use bullet points and bold text where appropriate for readability. Do NOT use headers. Keep it concise.`,

  projectDescription: ({ name, role, tech, instructions }) =>
    `Write a 2-3 line resume project description for:
Project: ${name || 'a project'}
Role: ${role || 'Developer'}
Tech Stack: ${tech || 'various technologies'}
${instructions ? `\nUSER INSTRUCTIONS:\nYou MUST highly prioritize the following user directions: "${instructions}"\n` : ''}
Make it results-focused and impactful. Return ONLY the description text, using standard formatting, no markdown.`,

  expandExperience: ({ role, company, description, instructions }) =>
    `Expand and improve this work experience description for ${role || 'a role'} at ${company || 'a company'}:
"${description || 'No description provided'}"
${instructions ? `\nUSER INSTRUCTIONS:\nYou MUST highly prioritize the following user directions: "${instructions}"\n` : ''}
Write 3-4 strong bullet points with action verbs and quantified achievements where possible.
Return ONLY the bullet points, one per line starting with "•".`,
}
