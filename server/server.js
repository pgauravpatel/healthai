import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { writeSitemapToFile, writeRobotsTxtToFile } from './utils/sitemapGenerator.js';

// Load environment variables
dotenv.config();

// Connect to database and generate sitemap
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Generate static sitemap and robots.txt after DB connection
    console.log('\n📍 Generating SEO files...');
    
    const sitemapResult = await writeSitemapToFile();
    if (sitemapResult.success) {
      console.log(`✅ Sitemap generated with ${sitemapResult.urlCount} URLs`);
    }
    
    writeRobotsTxtToFile();
    
    // Get port from environment
    const PORT = process.env.PORT || 5000;
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🏥 Health Scan Server Running                          ║
║                                                          ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(14)}                    ║
║   Port: ${String(PORT).padEnd(5)}                                         ║
║   API: http://localhost:${PORT}/api                         ║
║   Domain: https://healthreportscan.info                  ║
║                                                          ║
║   📍 SEO Files:                                          ║
║   - /sitemap.xml (static)                                ║
║   - /robots.txt (static)                                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💤 Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
