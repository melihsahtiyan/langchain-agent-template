import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from "dotenv";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { splitDocsIntoChunks, splitTextIntoChunks } from "./embedder";
import { ChromaClient } from "chromadb";
import { Document } from "langchain/document";

dotenv.config();

export async function initializeVectorStore(): Promise<Chroma> {
  const embeddings = new OllamaEmbeddings({
    model: process.env.EMBEDDING_MODEL!,
    baseUrl: process.env.LM_MODEL_URL!,
  });

  console.log(
    "---------------------------------------------------------------"
  );

  console.log("Initializing vector store with embeddings...");
  console.log("Embedding model:", embeddings.model);

  const vectorstore = new Chroma(embeddings, {
    collectionName: "invoices",
    url: process.env.CHROMA_DB_URL,
    collectionMetadata: {
      "hnsw:space": "cosine",
    },
  });

  console.log("Vector store initialized successfully");

  console.log(
    "---------------------------------------------------------------"
  );

  return vectorstore;
}

export async function addDocumentsToVectorStore(
  vectorStore: Chroma,
  documents: Document
): Promise<void> {
  console.log("Adding documents to vector store...");
  const docs = await splitDocsIntoChunks(documents);
  await vectorStore.addDocuments(docs);
  console.log("Documents added successfully");
}

export async function addTextToVectorStore(
  vectorStore: Chroma,
  text: string
): Promise<void> {
  console.log("Adding documents to vector store...");
  const docs = await splitTextIntoChunks(text);
  await vectorStore.addDocuments(docs);
  console.log("Documents added successfully");
}

// Delete the collection after changing the embedding model
export async function deleteCollection(): Promise<void> {
  const client = new ChromaClient({
    path: process.env.CHROMA_DB_URL
  });
  
  await client.deleteCollection({
    name: "invoices"
  });
  console.log("Collection deleted successfully");
}
