import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AI providers
let gemini = null;
let openai = null;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Interview context for AI
function getSystemPrompt(role, lang) {
  const langInstruction =
    lang === 'hi'
      ? 'Respond in Hindi (Devanagari script). Mix some English technical terms if needed.'
      : 'Respond in English.';

  return `You are "Falcon", a warm, professional, and intelligent AI interviewer for a ${role} position.

CRITICAL RULES:
- ALWAYS respond DIRECTLY to what the candidate just said. Never ignore their message.
- If they say "hello", "hi", or short greeting → reply warmly like "Hello! Nice to meet you [Name]!" then smoothly ask the first question.
- Give short encouraging feedback first, then ask ONE relevant follow-up question.
- Sound like a real human interviewer — natural, friendly, and conversational.
- Keep replies short (2-4 sentences max).
- Never use canned phrases like "That's a great question" unless it really fits.

${langInstruction}

Example for greeting:
User: hello
You: Hello Monesh! Nice to meet you. I'm excited to learn about your journey into software development. Shall we begin?

Now start the interview naturally.`;
}

// Store conversation history per session
const conversationHistory = new Map();

// Generate AI response
export async function generateAIResponse({
  sessionId,
  role,
  userMessage,
  lang = 'en',
  questionIndex = 0,
  totalQuestions = 5,
}) {
  const provider = process.env.AI_PROVIDER || 'gemini';

  // Get or create conversation history
  if (!conversationHistory.has(sessionId)) {
    conversationHistory.set(sessionId, []);
  }
  const history = conversationHistory.get(sessionId);

  // Add user message to history
  history.push({ role: 'user', content: userMessage });

  const systemPrompt = getSystemPrompt(role, lang);

  // Add context about progress
  const progressContext = `\n\nInterview progress: Question ${questionIndex + 1} of ${totalQuestions}. ${
    questionIndex + 1 >= totalQuestions
      ? 'This is the last answer. Wrap up the interview with a brief positive summary.'
      : 'After your feedback, ask the next relevant follow-up question.'
  }`;

  try {
    let aiReply = '';

    if (provider === 'gemini' && gemini) {
      aiReply = await callGemini(systemPrompt + progressContext, history);
    } else if (provider === 'openai' && openai) {
      aiReply = await callOpenAI(systemPrompt + progressContext, history);
    } else {
      // Fallback — generate a simple response
      aiReply = generateFallbackResponse(userMessage, role, questionIndex);
    }

    // Add AI response to history
    history.push({ role: 'assistant', content: aiReply });

    // Keep history manageable (last 20 messages)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    return {
      success: true,
      reply: aiReply,
      provider,
    };
  } catch (error) {
    console.error('AI Service Error:', error.message);

    // Fallback response
    const fallback = generateFallbackResponse(userMessage, role, questionIndex);
    history.push({ role: 'assistant', content: fallback });

    return {
      success: true,
      reply: fallback,
      provider: 'fallback',
    };
  }
}

// Call Google Gemini
async function callGemini(systemPrompt, history) {
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = gemini.startChat({
    history: formattedHistory.slice(0, -1), // All except last message
    systemInstruction: systemPrompt,
  });

  const lastMessage = history[history.length - 1].content;
  const result = await chat.sendMessage(lastMessage);
  const response = result.response;

  return response.text();
}

// Call OpenAI
async function callOpenAI(systemPrompt, history) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 200,
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
}

// Fallback when no AI is available
function generateFallbackResponse(userMessage, role, questionIndex) {
  const responses = {
    'Software Developer': [
      "That's a solid answer! Your technical understanding shows. Can you tell me about a time you had to optimize code performance?",
      "Great explanation! I can see you have hands-on experience. How do you approach learning new technologies?",
      "Interesting perspective! How do you handle code reviews and feedback from senior developers?",
      "Good point! Can you walk me through your debugging process when you encounter a tricky bug?",
      "Excellent! You've shown strong technical skills throughout this interview. Thank you for your time!",
    ],
    Marketing: [
      "Nice approach! Your marketing instincts are sharp. How do you measure ROI on your campaigns?",
      "That's a creative strategy! How would you handle a campaign that's underperforming?",
      "Great insight! What tools do you use for analytics and tracking?",
      "Interesting! How do you stay updated with the latest marketing trends?",
      "Wonderful answers! You clearly have a passion for marketing. Thank you for this interview!",
    ],
    HR: [
      "That shows great people skills! How do you handle a situation where two employees have a conflict?",
      "Good approach! What's your strategy for retaining top talent?",
      "Thoughtful answer! How do you ensure diversity and inclusion in hiring?",
      "Nice! How do you measure employee satisfaction and engagement?",
      "Great responses throughout! Your HR knowledge is impressive. Thank you!",
    ],
    'Startup Founder': [
      "Bold vision! How do you plan to differentiate from competitors?",
      "Smart strategy! What's your approach to building the initial team?",
      "Interesting! How would you handle running out of runway?",
      "Good thinking! What metrics are you tracking for product-market fit?",
      "Impressive vision and execution plan! Thank you for sharing your startup journey!",
    ],
  };

  const roleResponses = responses[role] || responses['Software Developer'];
  const index = Math.min(questionIndex, roleResponses.length - 1);

  return roleResponses[index];
}

// Clear session history
export function clearSessionHistory(sessionId) {
  conversationHistory.delete(sessionId);
}

// Generate interview score based on conversation
export async function generateInterviewScore(sessionId, role) {
  const history = conversationHistory.get(sessionId) || [];

  const userAnswers = history
    .filter((msg) => msg.role === 'user')
    .map((msg) => msg.content);

  if (userAnswers.length === 0) {
    return {
      overall: 75,
      confidence: 7.0,
      clarity: 7.5,
      technical: 7.0,
      tips: 'Practice more to get a detailed assessment!',
    };
  }

  const provider = process.env.AI_PROVIDER || 'gemini';

  try {
    const scoringPrompt = `You are an interview scoring AI. 
Analyze these interview answers for a ${role} position and provide scores.

Candidate's answers:
${userAnswers.map((a, i) => `Answer ${i + 1}: "${a}"`).join('\n')}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{"overall":85,"confidence":8.5,"clarity":8.0,"technical":7.5,"tips":"Your specific feedback here in 2 sentences."}

Score rules:
- overall: 0-100
- confidence, clarity, technical: 0.0-10.0
- Be fair but encouraging
- Give specific actionable tips`;

    let scoreText = '';

    if (provider === 'gemini' && gemini) {
      const result = await gemini.generateContent(scoringPrompt);
      scoreText = result.response.text();
    } else if (provider === 'openai' && openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: scoringPrompt }],
        max_tokens: 200,
      });
      scoreText = completion.choices[0].message.content;
    }

    // Parse JSON from response
    const jsonMatch = scoreText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const scores = JSON.parse(jsonMatch[0]);
      return {
        overall: Math.min(100, Math.max(0, scores.overall || 75)),
        confidence: Math.min(10, Math.max(0, scores.confidence || 7.0)),
        clarity: Math.min(10, Math.max(0, scores.clarity || 7.5)),
        technical: Math.min(10, Math.max(0, scores.technical || 7.0)),
        tips: scores.tips || 'Great effort! Keep practicing.',
      };
    }
  } catch (error) {
    console.error('Scoring error:', error.message);
  }

  // Fallback scores
  const base = 70 + Math.floor(Math.random() * 20);
  return {
    overall: base,
    confidence: ((base - 5 + Math.random() * 10) / 10).toFixed(1),
    clarity: ((base + Math.random() * 10) / 10).toFixed(1),
    technical: ((base - 10 + Math.random() * 15) / 10).toFixed(1),
    tips: 'Good job! Try adding more specific examples from your experience next time.',
  };
}