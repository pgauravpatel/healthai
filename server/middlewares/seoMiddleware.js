/**
 * SEO Middleware
 * - Redirects www to non-www (301)
 * - Ensures canonical domain consistency
 */

/**
 * Redirect www to non-www
 * Google prefers consistent canonical URLs
 */
export const wwwRedirect = (req, res, next) => {
  const host = req.hostname || req.headers.host;
  
  // Check if request is coming from www subdomain
  if (host && host.startsWith('www.')) {
    const nonWwwHost = host.replace('www.', '');
    const redirectUrl = `https://${nonWwwHost}${req.originalUrl}`;
    
    console.log(`🔄 Redirecting www to non-www: ${redirectUrl}`);
    return res.redirect(301, redirectUrl);
  }
  
  next();
};

/**
 * Add canonical headers for SEO
 */
export const canonicalHeaders = (req, res, next) => {
  // Add canonical link header
  const canonicalUrl = `https://healthreportscan.info${req.originalUrl.split('?')[0]}`;
  res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
  
  next();
};

export default { wwwRedirect, canonicalHeaders };
