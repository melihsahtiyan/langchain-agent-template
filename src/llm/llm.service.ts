import ILlmService from "./ILlmService";
import dotenv from "dotenv";
import { runRagQuery } from "../rag/retrieval.chain";
import { Ollama } from "@langchain/ollama";

dotenv.config();

export default class LLMService implements ILlmService {
  private readonly ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      baseUrl: process.env.LM_MODEL_URL,
      model: process.env.LM_MODEL_NAME,
      temperature: parseInt(process.env.LM_MODEL_TEMPERATURE),
    });
  }

  public async invokeLlm(prompt: string): Promise<string> {
    try {
      console.log("Invoice started to processing");
      const llmResponse: string = await this.ollama.invoke(prompt);
      console.log("Invoice processing finished");

      return llmResponse;
    } catch (error) {
      console.error("Error invoking LLM:", error);
      throw new Error("Failed to invoke LLM");
    }
  }

  public async invokeWithRetrieval(
    userPrompt: string,
    companyName: string
  ): Promise<string> {
    try {
      const result = await runRagQuery(userPrompt, companyName);
      return result;
    } catch (error) {
      console.error("Error invoking RAG chain:", error);
      throw new Error("Failed to invoke RAG chain");
    }
  }
}
