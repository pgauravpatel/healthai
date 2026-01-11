import Tesseract from 'tesseract.js';
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

/**
 * OCR Service
 * Handles text extraction from images and PDFs
 */
class OCRService {
  /**
   * Extract text from an image file using Tesseract.js
   * @param {Buffer} imageBuffer - Image file buffer
   * @returns {Promise<string>} - Extracted text
   */
  async extractFromImage(imageBuffer) {
    try {
      console.log('Starting OCR for image...');
      
      const result = await Tesseract.recognize(
        imageBuffer,
        'eng', // English language
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );
      
      const extractedText = result.data.text;
      
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract meaningful text from the image. Please ensure the image is clear and contains readable text.');
      }
      
      console.log(`OCR completed. Extracted ${extractedText.length} characters.`);
      return this.cleanText(extractedText);
      
    } catch (error) {
      console.error('OCR Image Error:', error);
      throw new Error(`Image text extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from a PDF file
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @returns {Promise<string>} - Extracted text
   */
  async extractFromPDF(pdfBuffer) {
    try {
      console.log('Starting PDF text extraction...');
      
      const data = await pdf(pdfBuffer);
      const extractedText = data.text;
      
      if (!extractedText || extractedText.trim().length < 10) {
        // If PDF has no selectable text, it might be a scanned document
        // In production, you might want to convert PDF pages to images and use OCR
        throw new Error('Could not extract text from PDF. The PDF might be scanned or image-based. Please try uploading images of each page instead.');
      }
      
      console.log(`PDF extraction completed. Extracted ${extractedText.length} characters from ${data.numpages} pages.`);
      return this.cleanText(extractedText);
      
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      throw new Error(`PDF text extraction failed: ${error.message}`);
    }
  }

  /**
   * Main extraction method - determines file type and extracts accordingly
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} mimeType - File MIME type
   * @returns {Promise<{text: string, fileType: string}>}
   */
  async extractText(fileBuffer, mimeType) {
    let text;
    let fileType;

    if (mimeType === 'application/pdf') {
      text = await this.extractFromPDF(fileBuffer);
      fileType = 'pdf';
    } else if (mimeType.startsWith('image/')) {
      text = await this.extractFromImage(fileBuffer);
      fileType = 'image';
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or image file (PNG, JPG, JPEG).');
    }

    return { text, fileType };
  }

  /**
   * Clean and normalize extracted text
   * @param {string} text - Raw extracted text
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might interfere
      .replace(/[^\w\s.,;:()/<>=-]/g, '')
      // Trim
      .trim();
  }

  /**
   * Detect report type from extracted text
   * @param {string} text - Extracted text
   * @returns {string} - Detected report type
   */
  detectReportType(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('hemoglobin') || textLower.includes('rbc') || textLower.includes('wbc') || textLower.includes('platelet')) {
      return 'blood_test';
    }
    if (textLower.includes('urine') || textLower.includes('urinalysis')) {
      return 'urine_test';
    }
    if (textLower.includes('cholesterol') || textLower.includes('triglyceride') || textLower.includes('ldl') || textLower.includes('hdl')) {
      return 'lipid_panel';
    }
    if (textLower.includes('sgpt') || textLower.includes('sgot') || textLower.includes('bilirubin') || textLower.includes('alt') || textLower.includes('ast')) {
      return 'liver_function';
    }
    if (textLower.includes('creatinine') || textLower.includes('bun') || textLower.includes('urea') || textLower.includes('gfr')) {
      return 'kidney_function';
    }
    if (textLower.includes('tsh') || textLower.includes('t3') || textLower.includes('t4') || textLower.includes('thyroid')) {
      return 'thyroid';
    }
    
    return 'general';
  }
}

// Export singleton instance
export default new OCRService();

