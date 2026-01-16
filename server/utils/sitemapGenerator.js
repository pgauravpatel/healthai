import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production domain (NO www)
const SITE_URL = 'https://healthreportscan.info';

/**
 * Static pages configuration
 */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/report-analyzer-info', priority: '0.95', changefreq: 'weekly' },
  { path: '/blood-test-analysis', priority: '0.9', changefreq: 'weekly' },
  { path: '/cholesterol-report-ai', priority: '0.9', changefreq: 'weekly' },
  { path: '/report-analyzer', priority: '0.85', changefreq: 'weekly' },
  { path: '/diseases', priority: '0.85', changefreq: 'weekly' },
  { path: '/blogs', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'monthly' },
  { path: '/register', priority: '0.5', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.4', changefreq: 'monthly' },
];

/**
 * Disease pages
 */
const DISEASE_PAGES = [
  'fungal-infection',
  'mouth-ulcer',
  'piles',
  'acidity',
  'gas-bloating',
  'skin-rash',
  'fever',
  'cold-cough',
  'dandruff',
  'itching'
];

/**
 * Blog categories
 */
const BLOG_CATEGORIES = [
  'diseases',
  'fitness',
  'mental-health',
  'diet',
  'wellness',
  'prevention',
  'lifestyle'
];

/**
 * Generate URL entry for sitemap
 */
function generateUrlEntry(path, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML
 */
export async function generateSitemapXML() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let urls = [];

  // 1. Add static pages
  for (const page of STATIC_PAGES) {
    urls.push(generateUrlEntry(page.path, currentDate, page.changefreq, page.priority));
  }

  // 2. Add disease pages
  for (const disease of DISEASE_PAGES) {
    urls.push(generateUrlEntry(`/diseases/${disease}`, currentDate, 'weekly', '0.8'));
  }

  // 3. Add blog category pages
  for (const category of BLOG_CATEGORIES) {
    urls.push(generateUrlEntry(`/blogs/category/${category}`, currentDate, 'weekly', '0.75'));
  }

  // 4. Add blog posts from database
  try {
    const blogs = await Blog.find({ isPublished: true })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    for (const blog of blogs) {
      const lastmod = blog.updatedAt || blog.publishedAt;
      const lastmodDate = new Date(lastmod).toISOString().split('T')[0];
      urls.push(generateUrlEntry(`/blogs/${blog.slug}`, lastmodDate, 'weekly', '0.7'));
    }

    console.log(`📝 Added ${blogs.length} blog posts to sitemap`);
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error.message);
  }

  // Build final XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return xml;
}

/**
 * Write sitemap to static file
 * Writes to both server/public and client/public for deployment flexibility
 */
export async function writeSitemapToFile() {
  try {
    const xml = await generateSitemapXML();
    
    // Paths to write sitemap
    const serverPublicPath = path.join(__dirname, '../public');
    const clientPublicPath = path.join(__dirname, '../../client/public');
    
    // Create directories if they don't exist
    if (!fs.existsSync(serverPublicPath)) {
      fs.mkdirSync(serverPublicPath, { recursive: true });
    }
    
    // Write to server/public
    const serverSitemapPath = path.join(serverPublicPath, 'sitemap.xml');
    fs.writeFileSync(serverSitemapPath, xml, 'utf8');
    console.log(`✅ Sitemap written to: ${serverSitemapPath}`);
    
    // Write to client/public (for Vercel/static hosting)
    if (fs.existsSync(path.dirname(clientPublicPath))) {
      const clientSitemapPath = path.join(clientPublicPath, 'sitemap.xml');
      fs.writeFileSync(clientSitemapPath, xml, 'utf8');
      console.log(`✅ Sitemap written to: ${clientSitemapPath}`);
    }
    
    return { success: true, urlCount: xml.split('<url>').length - 1 };
  } catch (error) {
    console.error('❌ Error writing sitemap:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Write robots.txt to static file
 */
export function writeRobotsTxtToFile() {
  try {
    const robotsTxt = generateRobotsTxt();
    
    const serverPublicPath = path.join(__dirname, '../public');
    const clientPublicPath = path.join(__dirname, '../../client/public');
    
    // Create directory if needed
    if (!fs.existsSync(serverPublicPath)) {
      fs.mkdirSync(serverPublicPath, { recursive: true });
    }
    
    // Write to server/public
    fs.writeFileSync(path.join(serverPublicPath, 'robots.txt'), robotsTxt, 'utf8');
    
    // Write to client/public
    if (fs.existsSync(path.dirname(clientPublicPath))) {
      fs.writeFileSync(path.join(clientPublicPath, 'robots.txt'), robotsTxt, 'utf8');
    }
    
    console.log('✅ robots.txt generated');
    return { success: true };
  } catch (error) {
    console.error('❌ Error writing robots.txt:', error);
    return { success: false, error: error.message };
  }
}

export default {
  generateSitemapXML,
  writeSitemapToFile,
  generateRobotsTxt,
  writeRobotsTxtToFile
};
