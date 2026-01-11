import express from 'express';
import { 
  generateSitemap, 
  generateRobotsTxt, 
  getSitemapData 
} from '../controllers/sitemapController.js';

const router = express.Router();

/**
 * SEO Routes
 * Public endpoints for sitemap and robots.txt
 */

// XML Sitemap - /api/sitemap.xml
router.get('/sitemap.xml', generateSitemap);

// Robots.txt - /api/robots.txt
router.get('/robots.txt', generateRobotsTxt);

// Sitemap data API (for client-side use)
router.get('/sitemap-data', getSitemapData);

export default router;

