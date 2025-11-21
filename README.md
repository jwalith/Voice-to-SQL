# 🎤 Voice-to-SQL: Real-Time Voice AI Data Analyst

A voice-activated data analyst that converts natural language speech into SQL queries using AI. Ask questions about your data using your voice, and get instant answers spoken back to you.

![Node](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🚀 Features

- **🎙️ Voice Input**: Speak naturally to query your database
- **🤖 AI-Powered**: Uses Gemini 2.5 Flash Lite for natural language understanding
- **📊 Speech-to-SQL**: Automatically converts questions into SQL queries
- **🔊 Voice Output**: Hear the results spoken back to you
- **💬 Conversational**: Maintains context across multiple questions
- **⚡ Real-time**: Instant responses via WebSocket streaming

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  (Voice Input/Output, UI)
│   Port: 5174    │
└────────┬────────┘
         │ WebSocket
         ↓
┌─────────────────┐
│  API Gateway    │  (WebSocket ↔ gRPC Bridge)
│  Ports: 4000-1  │
└────────┬────────┘
         │ gRPC
         ↓
┌─────────────────┐
│ Voice AI Service│  (Gemini AI + SQLite)
│   Port: 50051   │
└─────────────────┘
```

### Technology Stack

**Frontend:**
- React + TypeScript + Vite
- Web Speech API (native browser TTS/STT)
- WebSocket for real-time communication

**Backend:**
- Node.js + TypeScript
- gRPC (Protocol Buffers) for microservice communication
- GraphQL (Apollo Server) for data queries
- Gemini 2.5 Flash Lite for AI/NLU
- SQLite for data storage

**Architecture Patterns:**
- Microservices (Gateway + Voice Service)
- Monorepo (npm workspaces)
- Function Calling (Gemini tools)
- Bidirectional streaming (gRPC)

## 📦 Project Structure

```
fullstack/
├── apps/
│   └── web/                 # React frontend
├── services/
│   ├── gateway/             # API Gateway (WebSocket + GraphQL)
│   └── voice-agent/         # Voice AI Service (Gemini + SQLite)
└── packages/
    └── protos/              # Shared gRPC definitions
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jwalith/Voice-to-SQL.git
   cd Voice-to-SQL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cd services/voice-agent
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

4. **Start the application:**
   ```bash
   cd ../..  # Back to root
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:5174
   ```

## 🎯 Usage

1. Click **"🎤 Speak to Jarvis"**
2. Ask a question like:
   - "How many laptops did we sell?"
   - "What's the total revenue from electronics?"
   - "Show me all sales from yesterday"
3. Hear the AI respond with the answer!

## 🧪 Example Queries

The demo includes a mock sales database with:
- Laptops, Mice, Keyboards (electronics)
- Coffee (food)

**Try asking:**
- "How many laptops did we sell?"
- "What's the total amount from laptop sales?"
- "Show me all electronics"

## 🔧 Development

### Run services individually:

```bash
# Voice AI Service only
npm run dev:voice

# API Gateway only
npm run dev:gateway

# Frontend only
npm run dev:web
```

### Stop all services:

Press `Ctrl + C` in the terminal running `npm run dev`

## 📚 Key Concepts

### Speech-to-SQL Flow

1. **User speaks** → Browser's Web Speech API transcribes
2. **Text sent** → WebSocket to API Gateway
3. **Gateway forwards** → gRPC to Voice AI Service
4. **Gemini processes** → Generates SQL via function calling
5. **SQL executes** → Against SQLite database
6. **Results summarized** → Gemini creates natural language response
7. **Response spoken** → Browser's TTS reads it aloud

### Function Calling

The AI uses Gemini's function calling feature to execute SQL:

```typescript
// Tool definition tells Gemini how to query the database
{
  name: "query_database",
  description: "Execute SQL against sales database...",
  parameters: { sql: "string" }
}

// Gemini automatically generates:
query_database({ sql: "SELECT COUNT(*) FROM sales WHERE item LIKE '%Laptop%'" })
```

## 🎓 What I Learned Building This

- Implementing microservices with gRPC and Protocol Buffers
- Real-time bidirectional streaming with WebSockets
- AI function calling and tool use patterns
- Monorepo management with npm workspaces
- TypeScript across full-stack applications
- Speech-to-text and text-to-speech integration

## 🚀 Future Enhancements

- [ ] Persistent conversation history
- [ ] User authentication
- [ ] File-based SQLite database
- [ ] Visual data dashboards
- [ ] Export query results
- [ ] Multi-user support
- [ ] Custom database connections

## 📝 License

MIT

## 👤 Author

**Jwalith**
- GitHub: [@jwalith](https://github.com/jwalith)
- Project: [Voice-to-SQL](https://github.com/jwalith/Voice-to-SQL)

## 🙏 Acknowledgments

- Google Gemini AI for the LLM
- Web Speech API for browser-native voice capabilities
- gRPC and Protocol Buffers for efficient microservice communication
