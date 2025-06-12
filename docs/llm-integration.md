# LLM Integration Guide

This document provides detailed instructions for customizing and extending the LLM capabilities in the LangChain Agent Template.

## Architecture Overview

The template uses a service-based architecture for LLM integration, allowing you to easily swap between different LLM providers while maintaining a consistent interface throughout the application.

## Key Components

### ILlmService Interface

Located at `src/llm/ILlmService.ts`, this interface defines the contract that all LLM service implementations must follow:

```typescript
export interface ILlmService {
  generateResponse(prompt: string, options?: any): Promise<string>;
  // Additional methods as needed
}
```

### Default Implementation

The default implementation (`src/llm/llm.service.ts`) uses Ollama, but you can replace it with any LLM provider:

```typescript
import { ILlmService } from './ILlmService';
import { Ollama } from '@langchain/ollama';
import dotenv from 'dotenv';

dotenv.config();

export class LlmService implements ILlmService {
  private readonly ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      baseUrl: process.env.LM_MODEL_URL,
      model: process.env.LM_MODEL_NAME,
      temperature: parseFloat(process.env.LM_MODEL_TEMPERATURE || '0.7'),
    });
  }

  async generateResponse(prompt: string, options?: any): Promise<string> {
    const response = await this.ollama.invoke(prompt);
    return response;
  }
}
```

## Adding a New LLM Provider

To integrate a new LLM provider:

1. Create a new service class that implements the `ILlmService` interface:

```typescript
import { ILlmService } from './ILlmService';

export class CustomLlmService implements ILlmService {
  // Initialize your LLM client
  constructor() {
    // Setup your LLM client
  }

  async generateResponse(prompt: string, options?: any): Promise<string> {
    // Implement the method using your LLM provider
    // Return the generated response
  }
}
```

2. Update the service registration in your application:

```typescript
// In your dependency injection setup
import { CustomLlmService } from './path/to/CustomLlmService';

// Replace the default LLM service with your custom implementation
const llmService = new CustomLlmService();
```

## Example: OpenAI Integration

Here's an example of integrating OpenAI:

```typescript
import { ILlmService } from './ILlmService';
import { OpenAI } from 'langchain/llms/openai';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIService implements ILlmService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    });
  }

  async generateResponse(prompt: string, options?: any): Promise<string> {
    const response = await this.openai.invoke(prompt);
    return response;
  }
}
```

## Prompt Customization

The template includes a prompt builder (`src/llm/prompt.builder.ts`) that you can customize for different use cases:

```typescript
import { PromptTemplate } from '@langchain/core/prompts';

export const createChatPrompt = (context: string) => {
  const template = `
    You are a helpful AI assistant.
    
    Context information:
    {context}
    
    User question: {question}
    
    Please provide a helpful response:
  `;
  
  return PromptTemplate.fromTemplate(template);
};
```

## Advanced Configuration

### Streaming Responses

To implement streaming responses:

```typescript
async generateStreamingResponse(prompt: string, callback: (chunk: string) => void): Promise<void> {
  const stream = await this.llm.stream(prompt);
  
  for await (const chunk of stream) {
    callback(chunk);
  }
}
```

### Handling Context Windows

For large context windows:

```typescript
async generateResponseWithContext(prompt: string, context: string[]): Promise<string> {
  // Implement context window handling logic
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for API keys and configuration
2. **Error Handling**: Implement proper error handling for API failures
3. **Rate Limiting**: Consider implementing rate limiting for API-based LLMs
4. **Caching**: Add response caching for frequently used prompts
5. **Fallbacks**: Implement fallback mechanisms for when primary LLM is unavailable 