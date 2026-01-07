import OpenAI from 'openai';
import { AI_SYSTEM_PROMPT, EMERGENCY_KEYWORDS, EMERGENCY_RESPONSE, MEDICAL_DISCLAIMER } from '../config/constants.js';

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

/**
 * AI Healthcare Chat Service
 * Handles communication with OpenAI API for healthcare assistance
 */
class AIService {
  constructor() {
    this.model = 'gpt-4o-mini'; // Cost-effective model
    this.maxTokens = 1000;
    this.temperature = 0.7;
  }

  /**
   * Check if message contains emergency keywords
   * @param {string} message - User message
   * @returns {boolean} - True if emergency detected
   */
  checkForEmergency(message) {
    const lowerMessage = message.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Format conversation history for API
   * @param {Array} messages - Previous messages
   * @returns {Array} - Formatted messages for OpenAI
   */
  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Generate AI response for healthcare query
   * @param {string} userMessage - Current user message
   * @param {Array} conversationHistory - Previous messages (optional)
   * @returns {Object} - AI response with metadata
   */
  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Check for emergency keywords first
      if (this.checkForEmergency(userMessage)) {
        return {
          success: true,
          response: EMERGENCY_RESPONSE,
          isEmergency: true
        };
      }

      // Build messages array
      const messages = [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        ...this.formatMessages(conversationHistory),
        { role: 'user', content: userMessage }
      ];

      // Call OpenAI API
      const completion = await getOpenAIClient().chat.completions.create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const aiResponse = completion.choices[0].message.content;

      // Ensure disclaimer is included if not already present
      let finalResponse = aiResponse;
      if (!aiResponse.includes('Disclaimer') && !aiResponse.includes('disclaimer')) {
        finalResponse += `\n\n${MEDICAL_DISCLAIMER.short}`;
      }

      return {
        success: true,
        response: finalResponse,
        isEmergency: false,
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        }
      };

    } catch (error) {
      console.error('AI Service Error:', error);

      // Handle specific OpenAI errors
      if (error.code === 'invalid_api_key') {
        throw new Error('AI service configuration error');
      }

      if (error.code === 'rate_limit_exceeded') {
        throw new Error('AI service is temporarily busy. Please try again in a moment.');
      }

      if (error.code === 'context_length_exceeded') {
        throw new Error('Conversation is too long. Please start a new chat.');
      }

      throw new Error('Unable to generate response. Please try again.');
    }
  }

  /**
   * Generate a summary title for a chat conversation
   * @param {string} firstMessage - First user message
   * @returns {string} - Generated title
   */
  async generateChatTitle(firstMessage) {
    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Generate a short 3-5 word title summarizing this health query. No quotes or punctuation.'
          },
          { role: 'user', content: firstMessage }
        ],
        max_tokens: 20,
        temperature: 0.5
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      // Fallback to truncated message
      return firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
    }
  }
}

// Export singleton instance
export default new AIService();

