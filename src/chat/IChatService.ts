import { AIMessage, BaseMessage, ChatMessage } from "@langchain/core/messages";

export interface IChatService {
  chat(message: string, sessionId: string): Promise<AIMessage>;

  getChatBySessionId(sessionId: string): Promise<BaseMessage[]>;
}
