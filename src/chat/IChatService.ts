import { AIMessage, BaseMessage, ChatMessage } from "@langchain/core/messages";

export interface IChatService {
  chat(message: string, sessionId: string): Promise<AIMessage>;

  getAllChatByUserId(userId: string): Promise<BaseMessage[]>;

  getChatBySessionId(sessionId: string): Promise<BaseMessage[]>;

  getChatByUserIdAndSessionId(userId: string, sessionId: string): Promise<ChatMessage>;
}
