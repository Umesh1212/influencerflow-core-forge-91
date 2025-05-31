# InfluencerFlow AI Platform

> **AI-powered influencer campaign management with automated multilingual voice outreach**

Transform influencer marketing with the power of AI. InfluencerFlow makes influencer campaigns as easy as running paid ads, featuring automated multilingual voice outreach that speaks to creators in their native language.

## 🚀 Key Features

- **🎙️ AI Voice Outreach**: Automated multilingual voice messages using GPT-4o + ElevenLabs
- **🔍 Smart Creator Discovery**: AI-powered creator matching with Pinecone vector search
- **📊 Real-time Analytics**: Live campaign performance tracking and ROI monitoring
- **💰 Automated Payments**: Milestone-based payouts with Stripe/Razorpay integration
- **📝 Smart Contracts**: Auto-generated contracts with DocuSign e-signatures
- **🌍 Global Localization**: Support for 8+ languages and emerging markets

## 🏗️ Architecture

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** + **ShadCN UI** for beautiful components
- **React Query** for state management
- **Supabase** for authentication and real-time features

### Backend
- **FastAPI** (Python 3.11+) with async support
- **Supabase Postgres** with Row Level Security
- **Pinecone** for vector search
- **Redis** for caching and job queues

### AI Services
- **OpenAI GPT-4o** for script generation and language detection
- **ElevenLabs** for voice synthesis
- **Whisper** for speech-to-text transcription
- **Perplexity** for research-backed operations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and **npm**
- **Python 3.11+** and **pip**
- **Docker** and **Docker Compose** (optional, for containerized development)
- **Git** for version control

## 🛠️ Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd influencerflow-ai-platform

# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install
```

### 2. Environment Setup

```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit backend/.env with your API keys:
# - SUPABASE_URL and SUPABASE_KEY
# - OPENAI_API_KEY
# - ELEVENLABS_API_KEY
# - SECRET_KEY (generate a strong one)
```

### 3. Development Options

#### Option A: Full-Stack Development
```bash
# Run both frontend and backend simultaneously
npm run full-stack
```

#### Option B: Separate Terminals
```bash
# Terminal 1: Frontend (http://localhost:5173)
npm run dev

# Terminal 2: Backend (http://localhost:8000)
npm run backend:dev
```

#### Option C: Docker Development
```bash
# Run everything with Docker
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 🧪 Testing

```bash
# Run backend tests
npm run backend:test

# Run linting
npm run lint

# Format code
npm run format
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run backend:dev` | Start FastAPI backend |
| `npm run full-stack` | Run both frontend and backend |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
| `npm run backend:test` | Run Python tests |
| `npm run docker:up` | Start Docker development environment |

## 🏗️ Project Structure

```
influencerflow-ai-platform/
├── 📁 src/                    # Frontend React application
│   ├── 📁 components/         # Reusable UI components
│   ├── 📁 pages/             # Application pages
│   ├── 📁 hooks/             # Custom React hooks
│   └── 📁 lib/               # Utilities and configurations
├── 📁 backend/               # FastAPI backend
│   ├── 📁 app/               # Application code
│   │   ├── 📁 routers/       # API route handlers
│   │   ├── 📁 models/        # Data models and schemas
│   │   ├── 📁 services/      # Business logic
│   │   └── 📁 core/          # Core configurations
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Backend container configuration
├── 📁 .github/workflows/     # CI/CD pipelines
├── 📁 tasks/                 # TaskMaster project management
├── 📁 scripts/               # Development scripts and PRD
├── docker-compose.yml        # Development environment
└── package.json             # Frontend dependencies and scripts
```

## 🎯 Next Steps

With **Task 1 (Project Setup & CI/CD Configuration)** now complete, you can proceed to:

1. **Task 2**: Review database schema and RLS policies
2. **Task 3**: Complete authentication implementation
3. **Task 8**: Build the AI voice outreach system
4. **Task 9**: Create the outreach frontend UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@influencerflow.com
- 💬 Discord: [Join our community](https://discord.gg/influencerflow)
- 📖 Documentation: [docs.influencerflow.com](https://docs.influencerflow.com)

---

**Built with ❤️ for the future of influencer marketing**
