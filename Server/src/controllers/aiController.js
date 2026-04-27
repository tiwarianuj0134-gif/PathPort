const OpenAI = require('openai');
const User = require('../models/User');
const EvidenceCard = require('../models/EvidenceCard');
const SkillNode = require('../models/SkillNode');
const Job = require('../models/Job');
const { OPENAI_API_KEY } = require('../config/env');

// Only instantiate OpenAI client if key is present
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

/**
 * Rule-based fallback responses when OpenAI is unavailable.
 * Returns a helpful, profile-aware response without calling the API.
 */
const getFallbackResponse = (mode, user, skillNodes, evidenceCards, message) => {
  const name = user?.name?.split(' ')[0] || 'there';
  const goal = user?.careerGoal || 'your career goal';
  const skills = user?.skills?.map((s) => s.name) || [];
  const verifiedSkills = skillNodes?.filter((s) => s.status === 'verified').map((s) => s.name) || [];
  const inProgressSkills = skillNodes?.filter((s) => s.status === 'in_progress').map((s) => s.name) || [];

  switch (mode) {
    case 'profile_analysis':
      return `Hi ${name}! Here's a quick profile analysis:\n\n` +
        `• ${skills.length === 0 ? '⚠️ Add skills to your profile — recruiters filter by skills.' : `✅ You have ${skills.length} skills listed.`}\n` +
        `• ${!user?.headline ? '⚠️ Add a headline (e.g., "Aspiring Full-Stack Developer").' : `✅ Headline: "${user.headline}"`}\n` +
        `• ${!user?.about ? '⚠️ Write an "About" section — it\'s the first thing recruiters read.' : '✅ About section is filled.'}\n` +
        `• ${evidenceCards?.length === 0 ? '⚠️ Add Evidence Cards to prove your skills with real projects.' : `✅ You have ${evidenceCards.length} evidence card(s).`}\n` +
        `• ${!user?.careerGoal ? '⚠️ Set a career goal in your Skill Map to get personalized guidance.' : `✅ Career goal: ${goal}`}\n\n` +
        `💡 Tip: A complete profile gets 5x more recruiter views.`;

    case 'next_skills':
    const roadmaps = {
        'Frontend Developer': ['React', 'TypeScript', 'CSS/Tailwind', 'Git', 'REST APIs'],
        'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'Docker'],
        'Full-Stack Developer': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Git'],
        'Data Scientist': ['Python', 'Pandas', 'Machine Learning', 'SQL', 'Statistics'],
        'Data Analyst': ['SQL', 'Excel', 'Python', 'Tableau', 'Statistics'],
        'DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS'],
        'UI/UX Designer': ['Figma', 'User Research', 'Prototyping', 'CSS', 'Design Systems'],
      };
      const recommended = roadmaps[goal] || ['Communication', 'Problem Solving', 'Git', 'SQL', 'Python'];
      const missing = recommended.filter((s) => !skills.map((sk) => sk.toLowerCase()).includes(s.toLowerCase()));
      return `Based on your goal of **${goal}**, here are your next 3 skills to learn:\n\n` +
        missing.slice(0, 3).map((s, i) => `${i + 1}. **${s}** — Essential for ${goal} roles. Start with free resources on YouTube or freeCodeCamp.`).join('\n') +
        `\n\n${inProgressSkills.length > 0 ? `You're currently working on: ${inProgressSkills.join(', ')}. Keep going! 💪` : 'Add skills to your Skill Map to track progress.'}`;

    case 'project_ideas':
      return `Here are 3 project ideas to strengthen your portfolio for **${goal}**:\n\n` +
        `1. **Personal Portfolio Website** — Showcase your skills, projects, and resume. Deploy on Vercel/Netlify (free).\n\n` +
        `2. **Full-Stack CRUD App** — Build something you'd actually use (task manager, expense tracker, etc.). Use your current stack.\n\n` +
        `3. **Open Source Contribution** — Find a beginner-friendly issue on GitHub. Shows collaboration skills to recruiters.\n\n` +
        `💡 After each project, create an Evidence Card on PathPort to document what you built and learned.`;

    case 'cover_letter':
      return `Here's a cover letter template based on your profile:\n\n` +
        `Dear Hiring Manager,\n\n` +
        `I am ${user?.name || '[Your Name]'}, ${user?.headline || 'a passionate student'} with experience in ${skills.slice(0, 3).join(', ') || 'relevant technologies'}.\n\n` +
        `${user?.about ? user.about.slice(0, 200) + '...' : 'I am eager to contribute my skills and grow with your organization.'}\n\n` +
        `I have ${evidenceCards?.length || 0} documented projects on my PathPort portfolio that demonstrate my practical abilities. I am confident I can add value to your team.\n\n` +
        `Thank you for considering my application.\n\nBest regards,\n${user?.name || '[Your Name]'}`;

    default:
      return `Hi ${name}! I'm Jarvis, your AI career co-pilot. 🤖\n\n` +
        `I can help you with:\n` +
        `• **Profile Analysis** — Review your profile and suggest improvements\n` +
        `• **Next Skills** — Tell you what to learn based on your career goal\n` +
        `• **Project Ideas** — Suggest projects to build your portfolio\n` +
        `• **Cover Letter** — Draft a cover letter for a job\n\n` +
        `Use the quick action buttons above, or type your question!\n\n` +
        `${message ? `You asked: "${message}" — Please use the quick action buttons or ask a specific career question.` : ''}`;
  }
};

/**
 * POST /api/ai/jarvis
 * Modes: profile_analysis | next_skills | project_ideas | cover_letter | general_question
 * Falls back to rule-based responses if OpenAI quota is exceeded or key is missing.
 */
const jarvis = async (req, res, next) => {
  try {
    const { mode, message, jobId } = req.body;

    const user = await User.findById(req.user._id).select('-passwordHash');
    const evidenceCards = await EvidenceCard.find({ userId: req.user._id }).limit(10);
    const skillNodes = await SkillNode.find({ userId: req.user._id });

    // If no OpenAI key configured, use fallback immediately
    if (!openai || !OPENAI_API_KEY) {
      const fallback = getFallbackResponse(mode, user, skillNodes, evidenceCards, message);
      return res.json({ message: fallback, source: 'fallback' });
    }

    let jobContext = '';
    if (mode === 'cover_letter' && jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobContext = `\n\nTarget Job:\nTitle: ${job.title}\nCompany: ${job.companyName}\nDescription: ${job.description}\nRequired Skills: ${job.requiredSkills.join(', ')}`;
      }
    }

    const profileSummary = `
Student Profile:
Name: ${user.name}
Headline: ${user.headline || 'Not set'}
About: ${user.about || 'Not set'}
Career Goal: ${user.careerGoal || 'Not set'}
Skills: ${user.skills.map((s) => `${s.name} (${s.level})`).join(', ') || 'None listed'}
Education: ${user.education.map((e) => `${e.degree} at ${e.college}`).join('; ') || 'Not set'}
Skill Map: ${skillNodes.map((s) => `${s.name} [${s.status}]`).join(', ') || 'None'}
Evidence Cards: ${evidenceCards.map((e) => `${e.title} (${e.type})`).join(', ') || 'None'}
${jobContext}
    `.trim();

    const systemPrompt = `You are Jarvis — a sharp, friendly, futuristic AI career co-pilot built into PathPort, a professional development platform for students.
Your personality: concise, encouraging, practical. Like a senior mentor who respects the student's time.
Always base advice on the student's actual profile data. Never fabricate facts.
Keep responses under 150 words unless writing a cover letter. Use bullet points when listing items.`;

    const modePrompts = {
      profile_analysis: 'Analyze my profile and give me 3–5 specific, actionable improvements I can make right now.',
      next_skills: 'Based on my current skills and career goal, suggest the next 2–3 skills I should learn and explain why each matters.',
      project_ideas: 'Suggest 3 project ideas that would strengthen my weak areas and impress recruiters in my target field.',
      cover_letter: 'Write a personalized, professional cover letter for the job described above based on my profile.',
      general_question: message || 'How can I improve my career prospects?',
    };

    const userPrompt = modePrompts[mode] || message || 'Give me career advice.';

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${profileSummary}\n\nRequest: ${userPrompt}` },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });
      return res.json({ message: completion.choices[0].message.content, source: 'openai' });
    } catch (openaiErr) {
      // Handle quota exceeded (429) and other OpenAI errors gracefully
      const errCode = openaiErr?.status || openaiErr?.response?.status;
      if (errCode === 429 || errCode === 402) {
        // Quota exceeded — use intelligent fallback
        const fallback = getFallbackResponse(mode, user, skillNodes, evidenceCards, message);
        return res.json({
          message: fallback,
          source: 'fallback',
          notice: 'AI quota exceeded. Showing smart fallback response.',
        });
      }
      throw openaiErr; // Re-throw other errors
    }
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/support
 * Platform support chatbot — auth optional
 * Falls back to static FAQ if OpenAI unavailable.
 */
const support = async (req, res, next) => {
  try {
    const { message } = req.body;
    const lowerMsg = (message || '').toLowerCase();

    // If no OpenAI key, use static FAQ matching
    if (!openai || !OPENAI_API_KEY) {
      return res.json({ message: getStaticSupportResponse(lowerMsg), source: 'fallback' });
    }

    const systemPrompt = `You are PathPort's support assistant. PathPort is a futuristic professional development platform for higher-education students.
You help users understand platform features: Skill Map, Evidence Cards, OQI scores, AI Jarvis, Journal, Job applications, Mentor Pods, Simulation Rooms.
Also explain career terms: internship, stipend, CGPA, OQI, ATS, KPI, etc.
Rules: Only answer PathPort or career-related questions. Keep answers under 80 words. Never make up platform data.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 200,
        temperature: 0.5,
      });
      return res.json({ message: completion.choices[0].message.content, source: 'openai' });
    } catch (openaiErr) {
      const errCode = openaiErr?.status || openaiErr?.response?.status;
      if (errCode === 429 || errCode === 402) {
        return res.json({ message: getStaticSupportResponse(lowerMsg), source: 'fallback' });
      }
      throw openaiErr;
    }
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/translate
 * Career Translator — converts casual/Hinglish project descriptions to professional English bullets.
 */
const translate = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required.' });

    if (!openai || !OPENAI_API_KEY) {
      // Simple rule-based translation fallback
      const lines = text.split(/[.!?\n]+/).filter((l) => l.trim().length > 5);
      const bullets = lines.slice(0, 4).map((line) =>
        `• ${line.trim().charAt(0).toUpperCase() + line.trim().slice(1)}.`
      );
      return res.json({
        bullets: bullets.join('\n') || `• ${text.trim()}.`,
        source: 'fallback',
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume writer. Convert the user's casual description (may include Hinglish or informal language) into 3-4 concise, ATS-friendly professional English bullet points. Start each bullet with a strong action verb. Be specific and quantify where possible.`,
          },
          { role: 'user', content: text },
        ],
        max_tokens: 200,
        temperature: 0.4,
      });
      return res.json({ bullets: completion.choices[0].message.content, source: 'openai' });
    } catch (openaiErr) {
      const errCode = openaiErr?.status || openaiErr?.response?.status;
      if (errCode === 429 || errCode === 402) {
        const lines = text.split(/[.!?\n]+/).filter((l) => l.trim().length > 5);
        const bullets = lines.slice(0, 4).map((line) =>
          `• ${line.trim().charAt(0).toUpperCase() + line.trim().slice(1)}.`
        );
        return res.json({ bullets: bullets.join('\n') || `• ${text.trim()}.`, source: 'fallback' });
      }
      throw openaiErr;
    }
  } catch (err) {
    next(err);
  }
};

/** Static FAQ responses for support chatbot fallback */
const getStaticSupportResponse = (msg) => {
  if (msg.includes('oqi') || msg.includes('quality index')) {
    return 'OQI (Opportunity Quality Index) is a 0–100 score on each job/internship based on student reviews. Green = good (70+), Yellow = average (40–69), Red = caution (<40). It helps you avoid exploitative opportunities.';
  }
  if (msg.includes('skill map') || msg.includes('skill pathway')) {
    return 'The Skill Map is an interactive graph showing your skills and their status (To Learn / In Progress / Verified). Set a career goal and PathPort recommends which skills to add next.';
  }
  if (msg.includes('evidence') || msg.includes('portfolio') || msg.includes('proof')) {
    return 'Evidence Cards are your proof of work — add projects, courses, hackathons, and internship tasks. Each card has a title, description, skills used, and links. This builds your Proof Ledger.';
  }
  if (msg.includes('jarvis') || msg.includes('ai')) {
    return 'Jarvis is your AI career co-pilot. It can analyze your profile, suggest next skills, generate project ideas, and write cover letters. Use voice input (click the orb) or type your question.';
  }
  if (msg.includes('journal')) {
    return 'The Reflection Journal lets you write private or public entries about your learning journey. Add tags and mood. Your journal entries appear on your growth timeline.';
  }
  if (msg.includes('internship') || msg.includes('stipend')) {
    return 'An internship is a short-term work experience (usually 1–6 months). Stipend is the monthly payment you receive. PathPort shows OQI scores so you can judge the quality before applying.';
  }
  if (msg.includes('cgpa') || msg.includes('gpa')) {
    return 'CGPA (Cumulative Grade Point Average) is your overall academic score on a 10-point scale. Many companies set a minimum CGPA cutoff (e.g., 7.0+) for applications.';
  }
  if (msg.includes('connection') || msg.includes('network')) {
    return 'Send connection requests to other students, mentors, and recruiters. Once connected, you can message each other. Connections help you grow your professional network.';
  }
  if (msg.includes('mentor pod') || msg.includes('pod')) {
    return 'Mentor Pods are small groups (up to 5 students) led by a mentor for 4 weeks. Each pod has a goal, weekly tasks, and group chat. Great for focused skill development.';
  }
  if (msg.includes('simulation') || msg.includes('shadow')) {
    return 'Simulation Rooms are short practice projects (e.g., 3-hour frontend sprint). Complete them to auto-generate an Evidence Card and prove your skills without needing a real internship.';
  }
  return 'Hi! I\'m PathPort\'s support assistant. I can help with: Skill Map, Evidence Cards, OQI scores, AI Jarvis, Journal, Jobs, Mentor Pods, and career terms. What would you like to know?';
};

module.exports = { jarvis, support, translate };
