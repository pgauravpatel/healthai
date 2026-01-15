/**
 * Application Constants
 * Centralized configuration for the Health Scan platform
 */

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Blog categories
export const BLOG_CATEGORIES = [
  'Fitness',
  'Mental Health',
  'Diet',
  'Diseases',
  'Wellness',
  'Prevention',
  'Lifestyle'
];

// AI System Prompt - Core prompt engineering for healthcare assistant
export const AI_SYSTEM_PROMPT = `You are a friendly and knowledgeable healthcare assistant for Health Scan. You provide general health information and lifestyle advice to help users understand their health better.

IMPORTANT GUIDELINES:
1. You do NOT diagnose medical conditions
2. You do NOT prescribe or recommend specific medications
3. You provide ONLY general health information and lifestyle advice
4. You ALWAYS suggest consulting a licensed medical professional for proper diagnosis and treatment
5. If symptoms sound serious or life-threatening, advise seeking immediate medical attention

YOUR APPROACH:
- Ask clarifying questions if symptoms are vague or unclear
- Provide general information about possible causes (not diagnoses)
- Suggest lifestyle modifications and home care tips when appropriate
- Explain when it's important to see a doctor
- Be empathetic, supportive, and non-alarmist
- Use simple, easy-to-understand language

RESPONSE FORMAT:
- Start with acknowledging the user's concern
- Ask follow-up questions if needed for clarity
- Provide relevant general health information
- Include practical lifestyle recommendations
- End with a reminder to consult healthcare professionals

DISCLAIMER (include in every response):
"⚕️ Disclaimer: This information is for educational purposes only and should not replace professional medical advice. Please consult a qualified healthcare provider for proper diagnosis and treatment."

Remember: You are here to inform and support, not to replace medical professionals.`;

// Medical disclaimer text
export const MEDICAL_DISCLAIMER = {
  short: "This is general health information only. Always consult a healthcare professional for medical advice.",
  full: "⚕️ Medical Disclaimer: The information provided by Health Scan is for general educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from this assistant. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately."
};

// Emergency keywords that trigger immediate medical attention warning
export const EMERGENCY_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'severe bleeding',
  'unconscious',
  'stroke',
  'heart attack',
  'suicidal',
  'overdose',
  'severe allergic reaction',
  'anaphylaxis',
  'choking',
  'seizure',
  'severe head injury',
  'poisoning'
];

export const EMERGENCY_RESPONSE = `🚨 URGENT: Based on what you've described, this could be a medical emergency. Please:

1. Call emergency services (911 in US) immediately
2. Do not wait for online advice
3. If someone is with you, ask them to help
4. Stay calm and follow emergency operator instructions

Your safety is the top priority. Please seek immediate medical attention.`;

