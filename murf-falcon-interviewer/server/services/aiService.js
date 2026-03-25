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

// 1. IMPROVED SYSTEM PROMPT
// Dynamically adjusts based on role and language to prevent repetitive phrasing
function getSystemPrompt(role, lang, questionIndex, totalQuestions) {
  const langInstruction =
    lang === 'hi'
      ? 'Respond primarily in natural conversational Hindi (Devanagari script), blending common English technical terms smoothly.'
      : 'Respond entirely in natural, professional English.';

  const flowInstruction = questionIndex + 1 >= totalQuestions
    ? 'This is the final interaction. Provide a brief, warm closing statement thanking the candidate for their time.'
    : 'Start by acknowledging their answer naturally (varying your phrasing—do NOT use repetitive terms like "Solid answer" or "Great"). Then, ask ONE highly relevant, probing follow-up question related to what they just said.';

  return `You are "Falcon", an elite, warm, and highly intelligent AI technical interviewer conducting an interview for the "${role}" position.

CRITICAL BEHAVIORAL RULES:
1. AVOID CANNED RESPONSES: Never repeatedly say "That's a solid answer", "Great", or "Interesting". Vary your acknowledgments naturally based on the exact context of their reply.
2. HANDLING GREETINGS: If the candidate says "hello", "hi", or a brief greeting, reply warmly (e.g., "Hello! It's wonderful to meet you. Let's get started.") and immediately ask the first opening question about their background.
3. CONVERSATIONAL TONE: Speak like a real human director—professional, engaging, and slightly challenging but highly supportive.
4. LENGTH LIMIT: Keep your responses strictly between 2 to 4 short sentences. Do not monologue.
5. CONTEXTUAL AWARENESS: Carefully read the conversation history. If their previous answer was weak, gently probe deeper. If it was strong, validate a specific point they made before moving on.
6. INTERVIEW FLOW: ${flowInstruction}
7. LANGUAGE: ${langInstruction}

Remember: You are evaluating a candidate for the ${role} role. Tailor your technical depth precisely to this position.`;
}

// Store conversation history per session
const conversationHistory = new Map();

// 2. IMPROVED GENERATIVE FUNCTION
// Better history handling and robust fallbacks
export async function generateAIResponse({
  sessionId,
  role,
  userMessage,
  lang = 'en',
  questionIndex = 0,
  totalQuestions = 5,
}) {
  const provider = process.env.AI_PROVIDER || 'gemini';

  // Retrieve or initialize strict session history tracking
  if (!conversationHistory.has(sessionId)) {
    conversationHistory.set(sessionId, []);
  }
  const history = conversationHistory.get(sessionId);

  // Append user interaction to contextual memory
  history.push({ role: 'user', content: userMessage });

  // Generate dynamic system prompt injected with precise progression state
  const systemPrompt = getSystemPrompt(role, lang, questionIndex, totalQuestions);

  try {
    let aiReply = '';

    // Evaluate against available providers
    if (provider === 'gemini' && gemini) {
      aiReply = await callGemini(systemPrompt, history);
    } else if (provider === 'openai' && openai) {
      aiReply = await callOpenAI(systemPrompt, history);
    } else {
      // Intentional degraded fallback if API keys are missing completely
      console.warn("AI configuration missing. Firing dynamic fallback arrays.");
      aiReply = generateFallbackResponse(userMessage, role, questionIndex, totalQuestions, lang);
    }

    // Append AI completion to contextual memory
    history.push({ role: 'assistant', content: aiReply });

    // Truncate history to preserve token limits (Keeping last 15 messages)
    if (history.length > 15) {
      history.splice(0, history.length - 15);
    }

    return {
      success: true,
      reply: aiReply,
      provider,
    };
  } catch (error) {
    console.error('AI Generation Error:', error.message);

    // Graceful degraded failure bypass
    const fallback = generateFallbackResponse(userMessage, role, questionIndex, totalQuestions, lang);
    history.push({ role: 'assistant', content: fallback });

    return {
      success: true,
      reply: fallback,
      provider: 'fallback',
    };
  }
}

// Call Google Gemini API
async function callGemini(systemPrompt, history) {
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = gemini.startChat({
    history: formattedHistory.slice(0, -1),
    systemInstruction: systemPrompt,
  });

  const lastMessage = history[history.length - 1].content;
  const result = await chat.sendMessage(lastMessage);

  return result.response.text();
}

// Call OpenAI API
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
    max_tokens: 250,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// 3. IMPROVED DYNAMIC FALLBACK SYSTEM
// Replaces repetitive strings with randomized matrices if the LLM crashes or keys are absent
function generateFallbackResponse(userMessage, role, questionIndex, totalQuestions, lang = 'en') {
  const lowerMsg = String(userMessage).toLowerCase().trim();
  const isGreeting = lowerMsg === 'hello' || lowerMsg === 'hi' || lowerMsg.startsWith('hi ') || lowerMsg.startsWith('hello');

  // Intercept pure greetings instantly
  if (isGreeting) {
    const greetings = lang === 'hi' ? [
      `नमस्ते! आपसे मिलकर बहुत अच्छा लगा। मैं ${role} भूमिका के लिए आपकी पृष्ठभूमि जानने के लिए उत्सुक हूं। क्या आप अपनी पहली प्रतिक्रिया के लिए तैयार हैं?`,
      `नमस्ते! आज मेरे साथ जुड़ने के लिए धन्यवाद। हमारे पास ${role} टीम के लिए बहुत कुछ कवर करने के लिए है। क्या हम शुरू करें?`,
      `आपका स्वागत है! मैं फाल्कन हूँ। आइए आपके बारे में जानना शुरू करें।`
    ] : [
      `Hello there! It's fantastic to meet you. I'm excited to explore your background for the ${role} position. Ready for the first question?`,
      `Hi! Thanks for joining me today. We have a lot of ground to cover regarding your fit for the ${role} team. Shall we begin?`,
      `Welcome! I'm Falcon. I've been looking forward to our chat about the ${role} opportunity. Tell me about your background to kick things off.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Intercept interview completion boundaries
  if (questionIndex + 1 >= totalQuestions) {
    return lang === 'hi' 
      ? "आज अपने विचार साझा करने के लिए धन्यवाद। यहाँ हमारे औपचारिक प्रश्न समाप्त होते हैं। हमारी टीम जल्द ही आपका मूल्यांकन करेगी!"
      : "Thank you for sharing your insights today. This concludes our formal questions. Our team will evaluate your telemetry and follow up shortly!";
  }

  // Randomized conversational openers to prevent repetition
  const openers = lang === 'hi' ? [
    "मैं आपकी बात समझता हूँ।",
    "यह बहुत ही तार्किक है।",
    "मुझे आपका दृष्टिकोण समझ आ रहा है।",
    "स्पष्ट करने के लिए धन्यवाद।",
    "यह कुछ दिलचस्प कौशल को उजागर करता है।",
    "समझ गया। चलिए विषय वस्तु बदलते हैं।"
  ] : [
    "I appreciate that breakdown.",
    "That makes a lot of sense.",
    "I see your methodology there.",
    "Thank you for clarifying your approach.",
    "That highlights some interesting skills.",
    "Understood. Let's pivot slightly."
  ];

  // Role-specific targeted follow-ups
  const targetedFollowUps = lang === 'hi' ? {
    'Software Developer': [
      "आप कोड लिखते समय आने वाली समस्याओं को कैसे संभालते हैं?",
      "क्या आप मजबूत, परीक्षण योग्य कोड लिखने के अपने तरीके का वर्णन कर सकते हैं?",
      "आप उत्पाद की समय सीमा के दबाव में तकनीकी ऋण (technical debt) को कैसे संतुलित करते हैं?",
      "गंभीर सिस्टम विफलता का सामना करते समय आप प्राथमिकता कैसे तय करते हैं?"
    ],
    'Marketing': [
      "आप कई चैनलों पर विपणन अभियान को कैसे ट्रैक करते हैं?",
      "उस समय के बारे में बताएं जब कोई अभियान पूरी तरह विफल हो गया। आपने कैसे प्रतिक्रिया दी?",
      "श्रोताओं को लक्षित करने के लिए आप किस मेट्रिक्स पर भरोसा करते हैं?"
    ],
    'Startup Founder': [
      "जब संसाधन गंभीर रूप से सीमित हों तो आप अपनी योजनाओं को कैसे प्राथमिकता देते हैं?",
      "प्रारंभिक चरण वाली कंपनी की संस्कृति स्थापित करने पर आपकी क्या राय है?",
      "बाजार में गिरावट के दौरान कंपनी को सुरक्षित रखने की आपकी रणनीति क्या है?"
    ]
  } : {
    'Software Developer': [
      "Could you elaborate on how you handle unexpected architectural bottlenecks during deployment?",
      "Can you describe your specific approach to writing resilient, testable code?",
      "How do you usually balance technical debt against aggressive product deadlines?",
      "What is your preferred debugging workflow when facing a severe production outage?"
    ],
    'Marketing': [
      "How do you accurately track attribution across multi-channel campaigns?",
      "Tell me about a time a campaign completely missed its KPIs. How did you pivot?",
      "What analytics frameworks do you rely on most heavily for audience segmentation?"
    ],
    'Startup Founder': [
      "How do you prioritize your roadmap when resources are critically constrained?",
      "Can you explain your philosophy on establishing an early-stage company culture?",
      "What is your strategy for maintaining runway during unpredictable market cycle shifts?"
    ]
  };

  const selectedOpener = openers[Math.floor(Math.random() * openers.length)];
  const followUpArray = targetedFollowUps[role] || targetedFollowUps['Software Developer'];

  // Safely index the questions to ensure they don't overflow the array
  const safeIndex = questionIndex % followUpArray.length;
  const selectedFollowUp = followUpArray[safeIndex];

  return `${selectedOpener} ${selectedFollowUp}`;
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
      tips: 'Practice speaking more extensively to generate a detailed assessment payload!',
    };
  }

  const provider = process.env.AI_PROVIDER || 'gemini';

  try {
    const scoringPrompt = `You are a strict but fair AI evaluator. 
Analyze these candidate responses for the ${role} position and generate quantitative metrics.

Candidate Transcript:
${userAnswers.map((a, i) => `Answer ${i + 1}: "${a}"`).join('\n')}

Format your response EXACTLY as this strict JSON string (no markdown ticks or extra formatting, just the raw object):
{"overall":85,"confidence":8.5,"clarity":8.0,"technical":7.5,"tips":"Your precise, actionable feedback here."}`;

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

    // Safely extract the JSON payload
    const jsonMatch = scoreText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const scores = JSON.parse(jsonMatch[0]);
      return {
        overall: Math.min(100, Math.max(0, scores.overall || 75)),
        confidence: Math.min(10, Math.max(0, scores.confidence || 7.0)),
        clarity: Math.min(10, Math.max(0, scores.clarity || 7.5)),
        technical: Math.min(10, Math.max(0, scores.technical || 7.0)),
        tips: scores.tips || 'Excellent effort. Keep practicing your delivery.',
      };
    }
  } catch (error) {
    console.error('Error securely generating intelligence evaluation metrics:', error.message);
  }

  // Graceful degradation scoring algorithm
  const base = 70 + Math.floor(Math.random() * 20);
  return {
    overall: base,
    confidence: ((base - 5 + Math.random() * 10) / 10).toFixed(1),
    clarity: ((base + Math.random() * 10) / 10).toFixed(1),
    technical: ((base - 10 + Math.random() * 15) / 10).toFixed(1),
    tips: 'Good job overall! To improve, try incorporating more structured, specific examples detailing your direct impact from past experiences.',
  };
}
