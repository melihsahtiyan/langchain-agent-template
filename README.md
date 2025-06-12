# LangChain Agent Template

A powerful, extensible TypeScript framework for building LLM-powered agents using LangChain, Express, and various vector stores.

## 🚀 Features

- **LLM Integration**: Ready-to-use integration with Ollama and extensible to other LLM providers
- **RAG (Retrieval Augmented Generation)**: Built-in vector store integration with ChromaDB
- **Chat History**: Persistent chat sessions with MongoDB support
- **Metrics & Monitoring**: Prometheus integration for observability
- **Docker Ready**: Complete containerization with Docker Compose
- **Database Support**: MongoDB for chat history and PostgreSQL for structured data
- **TypeScript**: Fully typed codebase for better developer experience

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) and Docker Compose
- [Ollama](https://ollama.ai/) (for local LLM support)

## 🛠️ Quick Start

### Clone the Repository

```bash
git clone https://github.com/melihsahtiyan/langchain-agent-template.git
cd langchain-agent-template
```

### Environment Setup

1. Create environment files:

```bash
# For local development
cp .env.example .env

# For Docker deployment
cp .env.example .env.docker
```

2. Configure your environment variables:

> **Note:** Docker uses `.env.docker`, while local development uses `.env`

```
# Server configuration
PORT=7070                                         # Port for the Express server

# LLM configuration
LM_MODEL_URL=http://agent-template-ollama:11434   # URL for the Ollama server
LM_MODEL_NAME=llama3                              # Model name (see options below)
LM_MODEL_TEMPERATURE=0.7                          # Temperature for generation (0.0-1.0)

# Database configuration
MONGODB_URI=mongodb://admin:admin@agent-template-mongo:27017/agent-db?authSource=admin
```

#### Available LLM Models

You can use any model supported by Ollama. Some popular options include:

- `llama3` - Meta's Llama 3 model (recommended)
- `mistral` - Mistral AI's model
- `gemma` - Google's Gemma model
- `phi` - Microsoft's Phi model

For a complete list of available models, visit [ollama.com/library](https://ollama.com/library)



### Running with Docker

```bash
docker-compose up
```

This will start:
- Express server on port 7070
- Ollama LLM server
- MongoDB for chat history
- PostgreSQL for structured data
- ChromaDB for vector storage

## 🧩 Project Structure

```
langchain-agent-template/
├── src/
│   ├── app.ts                # Main application entry point
│   ├── chat/                 # Chat functionality
│   ├── config/               # Configuration files
│   ├── file-system/          # File system operations
│   ├── llm/                  # LLM service implementations
│   ├── middleware/           # Express middleware
│   ├── model/                # Data models
│   ├── pdf/                  # PDF processing
│   ├── rag/                  # Retrieval Augmented Generation
│   └── types/                # TypeScript type definitions
├── docker-compose.yml        # Docker compose configuration
├── Dockerfile                # Docker build configuration
└── package.json              # Node.js dependencies
```

## 💬 API Documentation

For detailed information about API endpoints, request/response formats, and examples, see the [API Documentation](./docs/api.md).

## 🔧 Customization

The template is designed to be easily customizable. Here are the key files you can modify:

### LLM Integration

- **`src/llm/ILlmService.ts`**: Interface for LLM service implementation
- **`src/llm/llm.service.ts`**: Main LLM service implementation
- **`src/llm/prompt.builder.ts`**: Customize prompts for different use cases


### RAG (Retrieval Augmented Generation)

- **`src/rag/vectorStore.ts`**: Vector store implementation for document storage
- **`src/rag/embedder.ts`**: Document embedding configuration
- **`src/rag/retrieval.chain.ts`**: RAG chain implementation
- **`src/rag/prepare.rag.prompt.ts`**: RAG prompt templates

### Chat Functionality

- **`src/chat/chat.service.ts`**: Chat service implementation
- **`src/chat/chat.controller.ts`**: API endpoints for chat
- **`src/model/ChatSessions.ts`**: Chat session persistence

### Customization Guides

For detailed instructions on customizing and extending the template, see:

- [LLM Integration Guide](./docs/llm-integration.md) - How to integrate different LLM providers
- [RAG Integration Guide](./docs/rag-integration.md) - How to customize RAG capabilities

## 📊 Monitoring

The template includes Prometheus metrics for monitoring:
- Request counts and latencies
- Memory usage
- Error rates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
