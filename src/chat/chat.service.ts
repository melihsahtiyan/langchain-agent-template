import { ChatMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { IChatService } from "./IChatService";
import dotenv from "dotenv";
import { Ollama } from "@langchain/ollama";
import { ChatSessions } from "../model/ChatSessions";

dotenv.config();

export class ChatService implements IChatService {
  private readonly ollama: Ollama;
  private readonly chatSessions: ChatSessions;

  constructor() {
    this.ollama = new Ollama({
      baseUrl: process.env.LM_MODEL_URL,
      model: process.env.LM_MODEL_NAME,
      temperature: parseInt(process.env.LM_MODEL_TEMPERATURE),
    });
    this.chatSessions = new ChatSessions();
  }

  async chat(
    message: string,
    sessionId: string
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
      // Creating a new session since this is the first conversation
      await this.createNewSession(sessionId);
    }

    // Step 3: Send the message to the LLM
    const messages = [...chatHistory, userMessage];
    const response = await this.ollama.invoke(messages);

    // Step 4: Save the chat message
    await this.saveChatMessage(sessionId, userMessage);
    const assistantMessage = new AIMessage(response);
    await this.saveChatMessage(sessionId, assistantMessage);

    // Step 5: Return the response
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
  private async saveChatMessage(sessionId: string, message: BaseMessage): Promise<void> {
    await this.chatSessions.saveMessage(sessionId, message);
    console.log(`Message saved: ${sessionId}`);
  }

  /**
   * Converts stored message format to LangChain BaseMessage objects
   * @param messages Array of stored messages
   * @returns Array of LangChain BaseMessage objects
  **/
  private convertToLangChainMessages(messages: any[]): BaseMessage[] {
    return messages.map(msg => {
      if (msg.type === 'human') {
        return new HumanMessage(msg.content);
      } else if (msg.type === 'ai') {
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
