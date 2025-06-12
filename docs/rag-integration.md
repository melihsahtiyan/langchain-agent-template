# RAG (Retrieval Augmented Generation) Guide

This document provides detailed instructions for customizing and extending the RAG capabilities in the LangChain Agent Template.

## What is RAG?

Retrieval Augmented Generation (RAG) is a technique that enhances LLM responses by retrieving relevant information from a knowledge base before generating a response. This allows the LLM to access specific information that may not be in its training data.

## Architecture Overview

The template implements RAG using LangChain's vector stores and retrieval mechanisms. The main components include:

1. **Document Processing**: Converting documents into chunks
2. **Embedding**: Creating vector representations of documents
3. **Vector Store**: Storing and retrieving document vectors
4. **Retrieval Chain**: Combining retrieved documents with user queries

## Key Components

### Vector Store

Located at `src/rag/vectorStore.ts`, this module handles the storage and retrieval of document embeddings:

```typescript
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { getEmbeddings } from "./embedder";

export async function initializeVectorStore() {
  const embeddings = await getEmbeddings();
  
  return await Chroma.fromExistingCollection(
    embeddings,
    { collectionName: "documents" }
  );
}

export async function addDocumentsToVectorStore(
  vectorStore: Chroma,
  text: string
) {
  const docs = [new Document({ pageContent: text })];
  await vectorStore.addDocuments(docs);
}

export async function deleteCollection() {
  // Clean up code
}
```

### Embedder

Located at `src/rag/embedder.ts`, this module creates vector embeddings for documents:

```typescript
import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from "dotenv";

dotenv.config();

export async function getEmbeddings() {
  return new OllamaEmbeddings({
    model: process.env.EMBEDDING_MODEL_NAME || "llama3",
    baseUrl: process.env.LM_MODEL_URL,
  });
}
```

### Retrieval Chain

Located at `src/rag/retrieval.chain.ts`, this module combines the retrieval and generation:

```typescript
import { ChatOllama } from "@langchain/ollama";
import { initializeVectorStore, addDocumentsToVectorStore } from "./vectorStore";
import { prepareRagPrompt } from "./prepare.rag.prompt";

export async function runRagQuery(
  userPrompt: string,
  context: string
): Promise<string> {
  const vectorStore = await initializeVectorStore();
  await addDocumentsToVectorStore(vectorStore, userPrompt);
  
  const retriever = vectorStore.asRetriever();
  const prompt = await prepareRagPrompt(retriever, userPrompt, context);
  
  const model = new ChatOllama({
    baseUrl: process.env.LM_MODEL_URL,
    model: process.env.LM_MODEL_NAME!,
    temperature: parseFloat(process.env.LM_MODEL_TEMPERATURE!),
  });
  
  const response = await model.invoke(prompt);
  return response.content.toString();
}
```

### RAG Prompt Template

Located at `src/rag/prepare.rag.prompt.ts`, this module defines the prompt structure:

```typescript
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";

export async function prepareRagPrompt(
  retriever: VectorStoreRetriever,
  question: string,
  context: string
) {
  // Create a template for the RAG prompt
  const template = `
    You are an AI assistant for ${context}.
    
    Answer the question based on the following context:
    {context}
    
    Question: {question}
    
    Answer:
  `;
  
  const promptTemplate = PromptTemplate.fromTemplate(template);
  
  // Create a retrieval chain
  const ragChain = RunnableSequence.from([
    {
      context: retriever.pipe(new StringOutputParser()),
      question: (input) => input.question,
    },
    promptTemplate,
  ]);
  
  // Run the chain
  return await ragChain.invoke({ question });
}
```

## Customizing RAG

### Using Different Vector Stores

You can replace ChromaDB with other vector stores like Pinecone, Weaviate, or Milvus:

```typescript
import { Pinecone } from "@langchain/pinecone";
import { getEmbeddings } from "./embedder";

export async function initializeVectorStore() {
  const embeddings = await getEmbeddings();
  
  return await Pinecone.fromExistingIndex(
    embeddings,
    { pineconeIndex: "your-index-name" }
  );
}
```

### Custom Document Processing

To support different document types:

```typescript
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function processDocuments(text: string): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  return await splitter.createDocuments([text]);
}
```

### Advanced Retrieval Strategies

For more sophisticated retrieval:

```typescript
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";

export async function createAdvancedRetriever(vectorStore) {
  return await MultiQueryRetriever.fromLLM({
    vectorStore,
    llm: new ChatOllama({ /* config */ }),
  });
}
```

## Best Practices

1. **Chunk Size**: Experiment with different chunk sizes for your specific use case
2. **Embedding Models**: Choose embedding models appropriate for your content
3. **Metadata**: Add metadata to documents for filtering and context
4. **Hybrid Search**: Consider combining semantic and keyword search
5. **Evaluation**: Regularly evaluate retrieval quality with test queries 