import Blog from '../models/Blog.js';

/**
 * Generate dynamic XML sitemap
 * Includes all public pages, blog posts, and category pages
 */
export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'https://healthai.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];

    // Fetch all published blogs
    const blogs = await Blog.find({ isPublished: true })
      .select('slug category updatedAt publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    // Get unique categories
    const categories = [...new Set(blogs.map(blog => blog.category))];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/ai-health-report-analyzer', priority: '0.95', changefreq: 'weekly' },
      { url: '/blood-test-analysis', priority: '0.9', changefreq: 'weekly' },
      { url: '/cholesterol-report-ai', priority: '0.9', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/report-analyzer', priority: '0.85', changefreq: 'weekly' },
      { url: '/blogs', priority: '0.8', changefreq: 'daily' },
      { url: '/diseases', priority: '0.85', changefreq: 'weekly' },
      { url: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
      { url: '/login', priority: '0.6', changefreq: 'monthly' },
      { url: '/register', priority: '0.6', changefreq: 'monthly' },
    ];

    // Disease pages (everyday health problems)
    const diseasePages = [
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

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += generateUrlEntry(baseUrl, page.url, currentDate, page.changefreq, page.priority);
    }

    // Add disease pages
    for (const disease of diseasePages) {
      xml += generateUrlEntry(baseUrl, `/diseases/${disease}`, currentDate, 'weekly', '0.8');
    }

    // Add category pages
    for (const category of categories) {
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      xml += generateUrlEntry(
        baseUrl, 
        `/blogs/category/${categorySlug}`, 
        currentDate, 
        'weekly', 
        '0.75'
      );
    }

    // Add blog posts
    for (const blog of blogs) {
      const lastmod = blog.updatedAt || blog.publishedAt;
      const lastmodDate = new Date(lastmod).toISOString().split('T')[0];
      
      xml += `  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blogs/${blog.slug}" />
    <xhtml:link rel="alternate" hreflang="hi" href="${baseUrl}/blogs/${blog.slug}?lang=hi" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/blogs/${blog.slug}?lang=es" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blogs/${blog.slug}" />
  </url>
`;
    }

    xml += '</urlset>';

    // Set response headers
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
};

/**
 * Generate URL entry with language alternates
 */
function generateUrlEntry(baseUrl, path, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${path}" />
    <xhtml:link rel="alternate" hreflang="hi" href="${baseUrl}${path}?lang=hi" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${path}?lang=es" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${path}" />
  </url>
`;
}

/**
 * Generate robots.txt dynamically
 */
export const generateRobotsTxt = (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'https://healthai.vercel.app';
  
  const robotsTxt = `# HealthAI Robots.txt
# https://healthai.vercel.app

User-agent: *
Allow: /

# Allow all search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/api/sitemap.xml

# Allow SEO landing pages
Allow: /ai-health-report-analyzer
Allow: /blood-test-analysis
Allow: /cholesterol-report-ai
Allow: /about
Allow: /blogs
Allow: /blogs/*
Allow: /report-analyzer
Allow: /disclaimer

# Disallow private/admin areas
Disallow: /admin
Disallow: /admin/*
Disallow: /chat/history
Disallow: /reports/history
Disallow: /profile
Disallow: /bookmarks

# Crawl-delay for politeness
Crawl-delay: 1
`;

  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robotsTxt);
};

/**
 * Get blog sitemap data for client-side rendering
 */
export const getSitemapData = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .select('slug title category publishedAt updatedAt')
      .sort({ publishedAt: -1 })
      .lean();

    const categories = [...new Set(blogs.map(b => b.category))];

    res.json({
      success: true,
      data: {
        blogs: blogs.map(b => ({
          slug: b.slug,
          title: b.title,
          category: b.category,
          lastmod: b.updatedAt || b.publishedAt
        })),
        categories,
        totalBlogs: blogs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sitemap data'
    });
  }
};

