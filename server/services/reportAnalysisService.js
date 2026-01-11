import OpenAI from 'openai';

/**
 * Report Analysis AI Service
 * Handles LLM-based analysis of medical lab reports
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

// System prompt for health report analysis
const SYSTEM_PROMPT = `You are a Health Report Analysis Assistant.
Your role is to help users understand medical laboratory reports in simple, non-technical language.

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

// User prompt template
const getUserPrompt = (extractedText, userProfile) => {
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

  return `Please analyze the following medical laboratory report and provide a comprehensive yet easy-to-understand explanation.${profileInfo}

EXTRACTED LAB REPORT TEXT:
"""
${extractedText}
"""

Please provide your analysis in the following JSON structure ONLY (no additional text outside the JSON):
{
  "summary": "A brief 2-3 sentence overview of the report in simple language",
  "keyFindings": [
    {
      "test": "Name of the test",
      "value": "The value found in the report",
      "normalRange": "The typical normal range for reference",
      "status": "normal OR high OR low OR critical_high OR critical_low"
    }
  ],
  "explanations": [
    {
      "test": "Name of test with abnormal or notable value",
      "meaning": "What this value may indicate in simple terms (use cautious language)"
    }
  ],
  "lifestyleSuggestions": [
    "General lifestyle and dietary suggestions that may help (educational only)"
  ],
  "doctorConsultationAdvice": "Clear guidance on when and why to consult a healthcare provider",
  "disclaimer": "A comprehensive medical disclaimer"
}

Remember:
- Extract ALL test values you can identify from the report
- Use "may", "might", "can be associated with" - never definitive diagnostic language
- If you cannot identify certain values, acknowledge the limitation
- Be thorough but keep explanations accessible to non-medical readers`;
};

class ReportAnalysisService {
  constructor() {
    this.model = 'gpt-4o-mini';
    this.maxTokens = 2000;
    this.temperature = 0.3; // Lower temperature for more consistent, factual responses
  }

  /**
   * Analyze a medical lab report
   * @param {string} extractedText - OCR-extracted text from the report
   * @param {Object} userProfile - Optional user profile (age, gender, conditions)
   * @returns {Promise<Object>} - Structured analysis result
   */
  async analyzeReport(extractedText, userProfile = null) {
    try {
      const startTime = Date.now();
      
      // Validate input
      if (!extractedText || extractedText.trim().length < 20) {
        throw new Error('Extracted text is too short to analyze. Please ensure the report image/PDF is clear and readable.');
      }

      console.log('Starting report analysis...');
      console.log(`Text length: ${extractedText.length} characters`);

      const completion = await getOpenAIClient().chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: getUserPrompt(extractedText, userProfile) }
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
          analysisResult[field] = this.getDefaultValue(field);
        }
      }

      // Ensure disclaimer is always present and comprehensive
      if (!analysisResult.disclaimer || analysisResult.disclaimer.length < 50) {
        analysisResult.disclaimer = this.getDefaultDisclaimer();
      }

      const processingTime = Date.now() - startTime;
      console.log(`Report analysis completed in ${processingTime}ms`);

      return {
        success: true,
        analysis: analysisResult,
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
   * Get default value for missing fields
   */
  getDefaultValue(field) {
    const defaults = {
      summary: 'Unable to generate summary. Please consult a healthcare provider for interpretation.',
      keyFindings: [],
      explanations: [],
      lifestyleSuggestions: ['Maintain a balanced diet', 'Stay physically active', 'Get adequate sleep', 'Stay hydrated'],
      doctorConsultationAdvice: 'Please consult a qualified healthcare provider to discuss these results and get proper medical advice.',
      disclaimer: this.getDefaultDisclaimer()
    };
    return defaults[field];
  }

  /**
   * Get comprehensive default disclaimer
   */
  getDefaultDisclaimer() {
    return `⚕️ MEDICAL DISCLAIMER: This analysis is for educational and informational purposes only. It is NOT a medical diagnosis and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Laboratory values can be influenced by many factors, and only a qualified healthcare provider can properly interpret these results in the context of your complete medical history. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding your health. If you have concerns about any values in this report, please consult a healthcare professional promptly.`;
  }
}

// Export singleton instance
export default new ReportAnalysisService();

