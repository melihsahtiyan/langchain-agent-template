import {
  ChatMessage,
  HumanMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { IChatService } from "./IChatService";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
import { ChatSessions } from "../model/ChatSessions";
import { createAgent } from "../tool-calling/agent";
import { AgentExecutor } from "langchain/agents";
import FileService from "../file-system/file.service";

dotenv.config();

export class ChatService implements IChatService {
  private readonly ollama: ChatOllama;
  private readonly chatSessions: ChatSessions;
  private agent: AgentExecutor;

  constructor() {
    this.ollama = new ChatOllama({
      baseUrl: process.env.LM_MODEL_URL,
      model: process.env.LM_MODEL_NAME,
      temperature: parseInt(process.env.LM_MODEL_TEMPERATURE),
    });
    this.chatSessions = new ChatSessions();
    this.initializeAgent();
  }

  private async initializeAgent() {
    this.agent = await createAgent(this.ollama);
  }

  async chat(
    message: string,
    sessionId: string,
    pdf?: Express.Multer.File
  ): Promise<AIMessage> {
    // Step 1: Create a new chat message
    const userMessage = new HumanMessage(message);

    // Step 2: Get the chat history
    let chatHistory: BaseMessage[] = [];
    try {
      const storedMessages = await this.getChatBySessionId(sessionId);
      chatHistory = this.convertToLangChainMessages(storedMessages);
    } catch (error) {
      console.log("No chat history found, starting new conversation");
      await this.createNewSession(sessionId);
    }

    // Step 3: Process PDF if provided
    if (pdf) {
      const fileService = new FileService();
      const filePath = await fileService.handleUpload(pdf, "docs");
      const prompt = message + `\n\nAttached PDF file: ${filePath}`;
      message = prompt;
    }

    console.log(
      "--------------------------------PDF INPUT--------------------------------"
    );
    console.log(pdf);
    console.log(
      "--------------------------------PDF INPUT--------------------------------"
    );

    // Step 4: Send the message to the agent
    const result = await this.agent.invoke({
      input: message,
      chat_history: chatHistory,
      pdf: pdf ? pdf : null,
    });

    // Step 5: Save the chat messages
    await this.saveChatMessage(sessionId, userMessage);

    const assistantMessage = new AIMessage(result.output);
    await this.saveChatMessage(sessionId, assistantMessage);

    return assistantMessage;
  }

  /**
   * Creates a new chat session
   * @param sessionId Session ID
   */
  private async createNewSession(sessionId: string): Promise<void> {
    await this.chatSessions.createSession(sessionId);
    console.log(`New session created: ${sessionId}`);
  }

  /**
   * Saves a chat message
   * @param sessionId Session ID
   * @param message Message to be saved
   */
  private async saveChatMessage(
    sessionId: string,
    message: BaseMessage
  ): Promise<void> {
    await this.chatSessions.saveMessage(sessionId, message);
    console.log(`Message saved: ${sessionId}`);
  }

  /**
   * Converts stored message format to LangChain BaseMessage objects
   * @param messages Array of stored messages
   * @returns Array of LangChain BaseMessage objects
   **/
  private convertToLangChainMessages(messages: any[]): BaseMessage[] {
    return messages.map((msg) => {
      if (msg.type === "human") {
        return new HumanMessage(msg.content);
      } else if (msg.type === "ai") {
        return new AIMessage(msg.content);
      } else {
        // Handle other message types if needed
        return new HumanMessage(msg.content);
      }
    });
  }

  async getAllChatByUserId(userId: string): Promise<BaseMessage[]> {
    // This would need to aggregate all messages from all sessions for a user
    // For now, we'll throw an error as it's not implemented
    throw new Error("Method not implemented.");
  }

  async getChatBySessionId(sessionId: string): Promise<any[]> {
    return await this.chatSessions.getSessionMessages(sessionId);
  }

  async getChatByUserIdAndSessionId(
    userId: string,
    sessionId: string
  ): Promise<ChatMessage> {
    throw new Error("Method not implemented.");
  }
}
