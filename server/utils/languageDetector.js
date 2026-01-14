/**
 * Language Detection Utility for Multilingual Search
 * Detects Hindi, Hinglish, and English text for semantic search matching
 */

// Hindi Unicode range: Devanagari script
const HINDI_REGEX = /[\u0900-\u097F]/;

// Common Hinglish patterns (Hindi words written in English)
const HINGLISH_PATTERNS = [
  // Body parts
  /\b(pet|pait|dard|sir|sar|dant|aankh|kan|gala|haath|pair|kamar|seena|peeth)\b/i,
  // Symptoms
  /\b(bukhar|bukhaar|khujli|jalan|sujan|dard|taklif|takleef|chakkar|ulti|dast|kabz|gas|acidity)\b/i,
  // Body functions
  /\b(latrine|toilet|potty|peshab|peshaab|hagna|susu)\b/i,
  // Medical terms
  /\b(bawasir|bawaseer|fistula|pilya|safed|daag|fungal|infection)\b/i,
  // Body areas
  /\b(guda|muh|mooh|pet|nabhi|upar|neeche)\b/i,
  // Descriptive
  /\b(bahut|jyada|kam|thoda|pura|baar|din|raat)\b/i,
  // Actions
  /\b(karna|hona|lena|dena|khana|peena|sona)\b/i,
  // Common phrases
  /\b(ke baad|se pehle|mein|ka|ki|ko)\b/i
];

// Common Hindi symptom keywords (for matching)
const HINDI_SYMPTOM_KEYWORDS = [
  // Digestive
  'पेट दर्द', 'गैस', 'एसिडिटी', 'कब्ज', 'दस्त', 'उल्टी', 'जी मिचलाना',
  // Skin
  'खुजली', 'दाने', 'फोड़े', 'फंगल', 'दाद', 'खाज',
  // Pain
  'सिर दर्द', 'कमर दर्द', 'जोड़ों का दर्द', 'गले में दर्द',
  // Anorectal
  'गुदा', 'जलन', 'खून', 'बवासीर', 'पाइल्स', 'लैट्रिन',
  // General
  'बुखार', 'कमजोरी', 'थकान', 'चक्कर'
];

/**
 * Detect the language of a search query
 * @param {string} query - The search query text
 * @returns {Object} - { language: 'hi'|'hinglish'|'en', confidence: number }
 */
export function detectLanguage(query) {
  if (!query || typeof query !== 'string') {
    return { language: 'en', confidence: 0 };
  }

  const trimmedQuery = query.trim();
  
  // Check for Hindi (Devanagari script)
  const hindiCharCount = (trimmedQuery.match(HINDI_REGEX) || []).length;
  const totalChars = trimmedQuery.replace(/\s/g, '').length;
  const hindiRatio = totalChars > 0 ? hindiCharCount / totalChars : 0;

  // If more than 30% Hindi characters, it's Hindi
  if (hindiRatio > 0.3) {
    return { 
      language: 'hi', 
      confidence: Math.min(hindiRatio + 0.3, 1),
      detectedScript: 'devanagari'
    };
  }

  // Check for Hinglish patterns
  let hinglishScore = 0;
  for (const pattern of HINGLISH_PATTERNS) {
    if (pattern.test(trimmedQuery)) {
      hinglishScore += 0.2;
    }
  }

  if (hinglishScore >= 0.2) {
    return { 
      language: 'hinglish', 
      confidence: Math.min(hinglishScore + 0.3, 1),
      detectedScript: 'latin'
    };
  }

  // Default to English
  return { 
    language: 'en', 
    confidence: 0.8,
    detectedScript: 'latin'
  };
}

/**
 * Normalize Hindi text for search matching
 * Handles common variations in Hindi typing
 * @param {string} text - Hindi text to normalize
 * @returns {string} - Normalized text
 */
export function normalizeHindiText(text) {
  if (!text) return '';
  
  return text
    // Remove nukta variations
    .replace(/[\u093C\u094D]/g, '')
    // Normalize chandrabindu
    .replace(/[\u0901\u0902]/g, 'ं')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Convert Hinglish to searchable patterns
 * @param {string} hinglishText - Hinglish text
 * @returns {string[]} - Array of possible search patterns
 */
export function hinglishToPatterns(hinglishText) {
  if (!hinglishText) return [];
  
  const patterns = [hinglishText.toLowerCase()];
  
  // Common Hinglish variations
  const variations = {
    'aa': 'a',
    'ee': 'i',
    'oo': 'u',
    'ph': 'f',
    'sh': 's',
    'th': 't',
    'dh': 'd'
  };
  
  let variant = hinglishText.toLowerCase();
  for (const [from, to] of Object.entries(variations)) {
    variant = variant.replace(new RegExp(from, 'g'), to);
  }
  
  if (variant !== hinglishText.toLowerCase()) {
    patterns.push(variant);
  }
  
  return patterns;
}

/**
 * Build MongoDB search query based on detected language
 * @param {string} searchQuery - User's search query
 * @param {string} language - Detected language
 * @returns {Object} - MongoDB query object
 */
export function buildMultilingualSearchQuery(searchQuery, language) {
  const normalizedQuery = searchQuery.trim();
  
  switch (language) {
    case 'hi':
      // Hindi search: prioritize intentKeywords.hi and symptoms
      return {
        $or: [
          { 'intentKeywords.hi': { $regex: normalizedQuery, $options: 'i' } },
          { symptoms: { $regex: normalizedQuery, $options: 'i' } },
          { 'seo.hindiMeta.keywords': { $regex: normalizedQuery, $options: 'i' } },
          { 'faq.question_hi': { $regex: normalizedQuery, $options: 'i' } },
          { $text: { $search: normalizedQuery } }
        ]
      };
      
    case 'hinglish':
      // Hinglish search: check both hinglish and hi keywords
      const hinglishPatterns = hinglishToPatterns(normalizedQuery);
      return {
        $or: [
          { 'intentKeywords.hinglish': { $in: hinglishPatterns.map(p => new RegExp(p, 'i')) } },
          { 'intentKeywords.hi': { $regex: normalizedQuery, $options: 'i' } },
          { symptoms: { $regex: normalizedQuery, $options: 'i' } },
          { $text: { $search: normalizedQuery } }
        ]
      };
      
    default:
      // English search: standard text search
      return {
        $or: [
          { $text: { $search: normalizedQuery } },
          { title: { $regex: normalizedQuery, $options: 'i' } },
          { 'intentKeywords.en': { $regex: normalizedQuery, $options: 'i' } },
          { symptoms: { $regex: normalizedQuery, $options: 'i' } }
        ]
      };
  }
}

export default {
  detectLanguage,
  normalizeHindiText,
  hinglishToPatterns,
  buildMultilingualSearchQuery
};
