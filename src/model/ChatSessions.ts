import { Types } from 'mongoose';
import { ChatSessionModel, IChatSession } from './schema/chat.session.schema';
import { BaseMessage } from "@langchain/core/messages";

export interface IMessage {
  type: string;
  content: string;
  timestamp: Date;
}

export class ChatSessions {
  sessionId: string;
  userId?: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;

  constructor(sessionId?: string, userId?: string) {
    this.sessionId = sessionId || '';
    this.userId = userId;
    this.messages = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Create a new chat session
   */
  async createSession(sessionId: string, userId?: string): Promise<void> {
    const session = new ChatSessions(sessionId, userId);
    await session.save();
  }

  /**
   * Save a message to a session
   */
  async saveMessage(sessionId: string, message: BaseMessage): Promise<void> {
    const session = await ChatSessions.findBySessionId(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    
    const messageType = message._getType();
    // Handle complex message content by converting to string
    const content = typeof message.content === 'string' 
      ? message.content 
      : JSON.stringify(message.content);
      
    session.addMessage(messageType, content);
    await session.save();
  }

  /**
   * Get all messages for a session
   */
  async getSessionMessages(sessionId: string): Promise<IMessage[]> {
    const session = await ChatSessions.findBySessionId(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    
    return session.messages;
  }

  /**
   * Add a message to the chat session
   */
  addMessage(type: string, content: string): void {
    const message: IMessage = {
      type,
      content,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.updatedAt = new Date();
  }

  /**
   * Get the last message in the chat session
   */
  getLastMessage(): IMessage | null {
    if (this.messages.length === 0) return null;
    return this.messages[this.messages.length - 1];
  }

  /**
   * Get all messages of a specific type
   */
  getMessagesByType(type: string): IMessage[] {
    return this.messages.filter(message => message.type === type);
  }

  /**
   * Clear all messages in the session
   */
  clearMessages(): void {
    this.messages = [];
    this.updatedAt = new Date();
  }

  /**
   * Save the chat session to the database
   */
  async save(): Promise<IChatSession> {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      messages: this.messages,
      createdAt: this.createdAt,
      updatedAt: new Date() // Update the timestamp
    };

    // Update if exists, otherwise create new
    const session = await ChatSessionModel.findOneAndUpdate(
      { sessionId: this.sessionId },
      sessionData,
      { new: true, upsert: true }
    );
    
    return session;
  }

  /**
   * Delete the chat session from the database
   */
  static async delete(sessionId: string): Promise<boolean> {
    const result = await ChatSessionModel.deleteOne({ sessionId });
    return result.deletedCount > 0;
  }

  /**
   * Find a chat session by sessionId
   */
  static async findBySessionId(sessionId: string): Promise<ChatSessions | null> {
    const session = await ChatSessionModel.findOne({ sessionId });
    
    if (!session) return null;
    
    const chatSession = new ChatSessions(session.sessionId, session.userId);
    chatSession.messages = session.messages;
    chatSession.createdAt = session.createdAt;
    chatSession.updatedAt = session.updatedAt;
    
    return chatSession;
  }

  /**
   * Find all chat sessions for a user
   */
  static async findByUserId(userId: string): Promise<ChatSessions[]> {
    const sessions = await ChatSessionModel.find({ userId });
    
    return sessions.map(session => {
      const chatSession = new ChatSessions(session.sessionId, session.userId);
      chatSession.messages = session.messages;
      chatSession.createdAt = session.createdAt;
      chatSession.updatedAt = session.updatedAt;
      return chatSession;
    });
  }

  /**
   * Get all chat sessions
   */
  static async getAll(limit = 100, skip = 0): Promise<ChatSessions[]> {
    const sessions = await ChatSessionModel.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return sessions.map(session => {
      const chatSession = new ChatSessions(session.sessionId, session.userId);
      chatSession.messages = session.messages;
      chatSession.createdAt = session.createdAt;
      chatSession.updatedAt = session.updatedAt;
      return chatSession;
    });
  }
}
