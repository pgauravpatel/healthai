import OpenAI from 'openai';

/**
 * Report Analysis AI Service
 * Handles LLM-based analysis of medical lab reports
 * Supports multilingual output (English, Hindi, Spanish)
 */

// Lazy initialization of OpenAI client
let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

// Language name mapping for AI prompts
const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish'
};

// Static disclaimers in each language (NOT dynamically translated by AI for safety)
const STATIC_DISCLAIMERS = {
  en: `⚕️ MEDICAL DISCLAIMER: This analysis is for educational and informational purposes only. It is NOT a medical diagnosis and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Laboratory values can be influenced by many factors, and only a qualified healthcare provider can properly interpret these results in the context of your complete medical history. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding your health. If you have concerns about any values in this report, please consult a healthcare professional promptly.`,
  hi: `⚕️ चिकित्सा अस्वीकरण: यह विश्लेषण केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है। यह कोई चिकित्सा निदान नहीं है और इसे पेशेवर चिकित्सा सलाह, निदान या उपचार के विकल्प के रूप में उपयोग नहीं किया जाना चाहिए। प्रयोगशाला मान कई कारकों से प्रभावित हो सकते हैं, और केवल एक योग्य स्वास्थ्य सेवा प्रदाता ही आपके पूर्ण चिकित्सा इतिहास के संदर्भ में इन परिणामों की सही व्याख्या कर सकता है। अपने स्वास्थ्य के बारे में किसी भी प्रश्न के लिए हमेशा अपने चिकित्सक या अन्य योग्य स्वास्थ्य प्रदाता की सलाह लें। यदि इस रिपोर्ट में किसी भी मान के बारे में आपकी चिंता है, तो कृपया तुरंत किसी स्वास्थ्य पेशेवर से परामर्श करें।`,
  es: `⚕️ AVISO MÉDICO: Este análisis es solo para fines educativos e informativos. NO es un diagnóstico médico y NO debe usarse como sustituto del consejo médico profesional, diagnóstico o tratamiento. Los valores de laboratorio pueden verse influenciados por muchos factores, y solo un proveedor de atención médica calificado puede interpretar correctamente estos resultados en el contexto de su historial médico completo. Siempre busque el consejo de su médico u otro proveedor de salud calificado con cualquier pregunta que pueda tener sobre su salud. Si tiene preocupaciones sobre cualquier valor en este informe, consulte a un profesional de la salud de inmediato.`
};

/**
 * Generate system prompt with language instruction
 * @param {string} language - Language code (en, hi, es)
 */
const getSystemPrompt = (language = 'en') => {
  const languageName = LANGUAGE_NAMES[language] || 'English';
  
  return `You are a Health Report Analysis Assistant.
Your role is to help users understand medical laboratory reports in simple, non-technical language.

CRITICAL LANGUAGE REQUIREMENT:
- All your responses MUST be written in ${languageName}.
- If medical terms are used, provide simple explanations in ${languageName}.
- Keep JSON keys in English, but ALL text values must be in ${languageName}.

STRICT RULES YOU MUST FOLLOW:
1. You must NOT diagnose any medical condition
2. You must NOT prescribe or recommend any medication
3. You must NOT suggest stopping any current treatments
4. Always use cautious, non-definitive language like "may indicate", "can be associated with", "might suggest"
5. For ANY abnormal values, recommend consulting a qualified healthcare provider
6. If values appear critically abnormal, strongly advise immediate medical consultation
7. Always include a comprehensive medical disclaimer
8. Focus on educational explanations and lifestyle suggestions only

Your response must be helpful, accurate, and safe. You are NOT a replacement for professional medical advice.`;
};

/**
 * Generate user prompt with language instruction
 * @param {string} extractedText - OCR-extracted text from the report
 * @param {Object} userProfile - Optional user profile
 * @param {string} language - Language code
 */
const getUserPrompt = (extractedText, userProfile, language = 'en') => {
  const languageName = LANGUAGE_NAMES[language] || 'English';
  
  let profileInfo = '';
  if (userProfile) {
    const parts = [];
    if (userProfile.age) parts.push(`Age: ${userProfile.age}`);
    if (userProfile.gender) parts.push(`Gender: ${userProfile.gender}`);
    if (userProfile.conditions?.length) parts.push(`Known conditions: ${userProfile.conditions.join(', ')}`);
    if (parts.length > 0) {
      profileInfo = `\n\nUser Profile:\n${parts.join('\n')}`;
    }
  }

  return `Please analyze the following medical laboratory report and provide a comprehensive yet easy-to-understand explanation.
  
IMPORTANT: Write ALL text content in ${languageName}. Keep JSON keys in English.${profileInfo}

EXTRACTED LAB REPORT TEXT:
"""
${extractedText}
"""

Please provide your analysis in the following JSON structure ONLY (no additional text outside the JSON):
{
  "summary": "A brief 2-3 sentence overview of the report in simple ${languageName}",
  "keyFindings": [
    {
      "test": "Name of the test (in ${languageName})",
      "value": "The value found in the report",
      "normalRange": "The typical normal range for reference",
      "status": "normal OR high OR low OR critical_high OR critical_low"
    }
  ],
  "explanations": [
    {
      "test": "Name of test (in ${languageName})",
      "meaning": "What this value may indicate in simple ${languageName} (use cautious language)"
    }
  ],
  "lifestyleSuggestions": [
    "General lifestyle and dietary suggestions in ${languageName} (educational only)"
  ],
  "doctorConsultationAdvice": "Clear guidance in ${languageName} on when and why to consult a healthcare provider",
  "disclaimer": "Write 'USE_STATIC_DISCLAIMER' - this will be replaced with a proper disclaimer"
}

Remember:
- Write ALL text values in ${languageName}
- Extract ALL test values you can identify from the report
- Use cautious language ("may", "might", "can be associated with") - never definitive diagnostic language
- If you cannot identify certain values, acknowledge the limitation
- Be thorough but keep explanations accessible to non-medical readers`;
};

class ReportAnalysisService {
  constructor() {
    this.model = 'gpt-4o-mini';
    this.maxTokens = 2500; // Increased for multilingual content
    this.temperature = 0.3; // Lower temperature for more consistent, factual responses
  }

  /**
   * Analyze a medical lab report
   * @param {string} extractedText - OCR-extracted text from the report
   * @param {Object} userProfile - Optional user profile (age, gender, conditions)
   * @param {string} language - Language code for output (en, hi, es)
   * @returns {Promise<Object>} - Structured analysis result
   */
  async analyzeReport(extractedText, userProfile = null, language = 'en') {
    try {
      const startTime = Date.now();
      
      // Validate language
      if (!LANGUAGE_NAMES[language]) {
        language = 'en';
      }
      
      // Validate input
      if (!extractedText || extractedText.trim().length < 20) {
        throw new Error('Extracted text is too short to analyze. Please ensure the report image/PDF is clear and readable.');
      }

      console.log(`Starting report analysis in ${LANGUAGE_NAMES[language]}...`);
      console.log(`Text length: ${extractedText.length} characters`);

      const completion = await getOpenAIClient().chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: getSystemPrompt(language) },
          { role: 'user', content: getUserPrompt(extractedText, userProfile, language) }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content;
      
      // Parse the JSON response
      let analysisResult;
      try {
        analysisResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', responseText);
        throw new Error('AI response was not in the expected format. Please try again.');
      }

      // Validate required fields
      const requiredFields = ['summary', 'keyFindings', 'explanations', 'lifestyleSuggestions', 'doctorConsultationAdvice', 'disclaimer'];
      for (const field of requiredFields) {
        if (!(field in analysisResult)) {
          analysisResult[field] = this.getDefaultValue(field, language);
        }
      }

      // ALWAYS replace disclaimer with static translated version (for medical safety)
      analysisResult.disclaimer = STATIC_DISCLAIMERS[language] || STATIC_DISCLAIMERS.en;

      const processingTime = Date.now() - startTime;
      console.log(`Report analysis completed in ${processingTime}ms (Language: ${language})`);

      return {
        success: true,
        analysis: analysisResult,
        language,
        processingTime,
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        }
      };

    } catch (error) {
      console.error('Report Analysis Error:', error);

      if (error.code === 'rate_limit_exceeded') {
        throw new Error('Service is temporarily busy. Please try again in a moment.');
      }

      if (error.code === 'context_length_exceeded') {
        throw new Error('The report is too long to analyze. Please try uploading a smaller section.');
      }

      throw error;
    }
  }

  /**
   * Get default value for missing fields in specified language
   * @param {string} field - Field name
   * @param {string} language - Language code
   */
  getDefaultValue(field, language = 'en') {
    const defaults = {
      en: {
        summary: 'Unable to generate summary. Please consult a healthcare provider for interpretation.',
        keyFindings: [],
        explanations: [],
        lifestyleSuggestions: ['Maintain a balanced diet', 'Stay physically active', 'Get adequate sleep', 'Stay hydrated'],
        doctorConsultationAdvice: 'Please consult a qualified healthcare provider to discuss these results and get proper medical advice.',
        disclaimer: STATIC_DISCLAIMERS.en
      },
      hi: {
        summary: 'सारांश उत्पन्न करने में असमर्थ। कृपया व्याख्या के लिए स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
        keyFindings: [],
        explanations: [],
        lifestyleSuggestions: ['संतुलित आहार बनाए रखें', 'शारीरिक रूप से सक्रिय रहें', 'पर्याप्त नींद लें', 'हाइड्रेटेड रहें'],
        doctorConsultationAdvice: 'कृपया इन परिणामों पर चर्चा करने और उचित चिकित्सा सलाह प्राप्त करने के लिए किसी योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
        disclaimer: STATIC_DISCLAIMERS.hi
      },
      es: {
        summary: 'No se puede generar el resumen. Por favor consulte a un proveedor de salud para interpretación.',
        keyFindings: [],
        explanations: [],
        lifestyleSuggestions: ['Mantener una dieta equilibrada', 'Mantenerse físicamente activo', 'Dormir lo suficiente', 'Mantenerse hidratado'],
        doctorConsultationAdvice: 'Por favor consulte a un proveedor de atención médica calificado para discutir estos resultados y obtener asesoramiento médico adecuado.',
        disclaimer: STATIC_DISCLAIMERS.es
      }
    };
    
    const langDefaults = defaults[language] || defaults.en;
    return langDefaults[field];
  }

  /**
   * Get static disclaimer in specified language
   * @param {string} language - Language code
   */
  getStaticDisclaimer(language = 'en') {
    return STATIC_DISCLAIMERS[language] || STATIC_DISCLAIMERS.en;
  }
}

// Export singleton instance
export default new ReportAnalysisService();
