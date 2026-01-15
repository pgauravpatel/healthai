# 🏥 Health Scan – Healthcare Analyzer & Blog Platform

A modern, production-ready MERN stack application that provides healthcare assistance and a comprehensive health blog platform.

![Health Scan](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop)

## ✨ Features

### 🩺 Health Assistant
- ChatGPT-style conversational interface
- General health information and lifestyle guidance
- Smart follow-up questions for vague symptoms
- Emergency detection and warnings
- Chat history with session management
- Rate-limited for fair usage

### 📝 Health Blog Platform
- Expert articles on Fitness, Mental Health, Diet, Diseases, Wellness, and more
- Full-text search and category filtering
- Reading time indicators
- Like and bookmark functionality
- Comment system for discussions
- SEO-optimized content

### 📊 Report Analyzer
- Upload health reports (PDF/Images)
- Get easy-to-understand explanations
- Support for blood tests, CBC, lipid panels
- Multi-language support (English, Hindi, Spanish)

### 🔐 User Authentication
- Secure JWT-based authentication with HttpOnly cookies
- User registration and login
- Profile management
- Password change functionality
- Role-based access (User/Admin)

### 👨‍💼 Admin Dashboard
- Create, edit, and delete blog posts
- Publish/unpublish controls
- Rich content editor with HTML support
- SEO settings management
- Analytics overview

### 🎨 Modern UI/UX
- Beautiful healthcare-themed design
- Dark mode support
- Responsive mobile-first layout
- Smooth Framer Motion animations
- Floating chatbot widget
- Accessibility focused

## 🛡️ Safety & Compliance

**Important Disclaimers:**
- ❌ NO medical diagnosis
- ❌ NO medication prescriptions
- ✅ General health information only
- ✅ Lifestyle guidance and wellness tips
- ✅ Always recommends consulting healthcare professionals

The platform includes:
- Global medical disclaimer banner
- Emergency keyword detection
- Consistent safety messaging in responses

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **ShadCN UI** components (Radix UI based)
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Zod** for validation
- **OpenAI API** for chat
- **Express Rate Limit** for API protection
- **Helmet** for security headers

## 📁 Project Structure

```
healthCare/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── blog/        # Blog-related components
│   │   │   ├── chat/        # Chat-related components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # Base UI components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Page components
│   │   │   └── admin/       # Admin pages
│   │   ├── services/        # API services
│   │   └── styles/          # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Express backend
│   ├── config/              # Configuration
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Express middlewares
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   ├── app.js               # Express app
│   ├── server.js            # Server entry
│   └── package.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd healthCare
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create environment file
# Copy env.example.txt to .env and fill in your values:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A strong secret key for JWT
# - OPENAI_API_KEY: Your OpenAI API key

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Seed the Database (Optional)
```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@healthscan.com` / `admin123`
- Regular user: `john@example.com` / `user123`
- Sample blog posts

## 🔑 Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/healthscan

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_MAX_REQUESTS=20
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |
| POST | `/api/auth/bookmark/:blogId` | Toggle bookmark |
| GET | `/api/auth/bookmarks` | Get bookmarks |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to assistant |
| GET | `/api/chat` | Get all user chats |
| GET | `/api/chat/:id` | Get specific chat |
| DELETE | `/api/chat/:id` | Delete chat |
| DELETE | `/api/chat/clear` | Clear all chats |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get published blogs |
| GET | `/api/blogs/:slug` | Get blog by slug |
| GET | `/api/blogs/categories` | Get categories |
| GET | `/api/blogs/tags` | Get popular tags |
| POST | `/api/blogs/:id/like` | Toggle like |
| GET | `/api/blogs/:id/related` | Get related blogs |

### Admin Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs/admin/all` | Get all blogs |
| GET | `/api/blogs/admin/:id` | Get blog for editing |
| POST | `/api/blogs/admin` | Create blog |
| PUT | `/api/blogs/admin/:id` | Update blog |
| DELETE | `/api/blogs/admin/:id` | Delete blog |
| PATCH | `/api/blogs/admin/:id/publish` | Toggle publish |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:blogId` | Get blog comments |
| POST | `/api/comments/:blogId` | Add comment |
| PUT | `/api/comments/:id` | Update comment |
| DELETE | `/api/comments/:id` | Delete comment |
| POST | `/api/comments/:id/like` | Toggle like |

## 🧪 Testing

### Test Accounts (after seeding)
- **Admin:** admin@healthscan.com / admin123
- **User:** john@example.com / user123

### API Health Check
```bash
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### Backend (Node.js)
1. Set `NODE_ENV=production`
2. Configure production MongoDB (Atlas recommended)
3. Set strong JWT_SECRET
4. Deploy to: Render, Railway, DigitalOcean, AWS, etc.

### Frontend (React)
1. Build: `npm run build`
2. Deploy `dist/` folder to: Vercel, Netlify, Cloudflare Pages, etc.
3. Configure API URL in environment

## 🔒 Security Features

- **JWT in HttpOnly cookies** - Prevents XSS token theft
- **Helmet** - Security headers
- **CORS** - Configured for frontend origin
- **Rate Limiting** - Prevents abuse
- **Zod Validation** - Input sanitization
- **Password Hashing** - bcrypt with 12 rounds
- **Role-Based Access** - Admin/User separation

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible navigation
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## 🎨 Theming

Supports light and dark modes with:
- CSS custom properties
- Persistent theme preference
- System theme detection
- Smooth transitions

## ⚠️ Medical Disclaimer

**Health Scan is for informational purposes only.**

This platform:
- Does NOT diagnose medical conditions
- Does NOT prescribe medications
- Does NOT replace professional medical advice
- Provides general health information only

Always consult qualified healthcare professionals for medical concerns.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for better health awareness
