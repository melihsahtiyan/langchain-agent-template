import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
import {
  addDocumentsToVectorStore,
  deleteCollection,
  initializeVectorStore,
} from "./vectorStore";
import { prepareRagPrompt } from "./prepare.rag.prompt";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { Chroma } from "@langchain/community/vectorstores/chroma";

dotenv.config();

export async function runRagQuery(
  userPrompt: string,
  companyName: string
): Promise<string> {
  const vectorStore = await initializeVectorStore();

  console.log(
    "---------------------------------------------------------------"
  );
  console.log("Vector store initialized successfully");

  console.log(
    "---------------------------------------------------------------"
  );

  await addDocumentsToVectorStore(vectorStore, userPrompt);

  const retriever: VectorStoreRetriever<Chroma> = vectorStore.asRetriever();

  console.log("Retrieving context for user prompt...");

  const prompt = await prepareRagPrompt(retriever, userPrompt, companyName);

  const model = new ChatOllama({
    baseUrl: process.env.LM_MODEL_URL,
    model: process.env.LM_MODEL_NAME!,
    temperature: parseFloat(process.env.LM_MODEL_TEMPERATURE!),
  });

  console.log("Model initialized successfully");

  console.log(
    "---------------------------------------------------------------"
  );
  console.log(
    "---------------------------------------------------------------"
  );

  const response = await model.invoke(prompt);

  console.log("Response received successfully");

  const content = response.content;

  console.log("Content: ", content);
  console.log(
    "---------------------------------------------------------------"
  );

  console.log("Cleaning data from chromadb");

  await deleteCollection();

  console.log("Data cleaned from chromadb");

  return content.toString();
}
