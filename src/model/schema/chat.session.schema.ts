import mongoose, { Schema, Document } from 'mongoose';

// Interface for the message structure
interface IMessage {
  type: string;       // 'human', 'ai', or other message types
  content: string;    // The message content
  timestamp: Date;    // When the message was sent
}

// Interface for the chat session document
export interface IChatSession extends Document {
  sessionId: string;  // Unique identifier for the session
  userId?: string;    // Optional user ID if authentication is used
  messages: IMessage[]; // Array of messages in the session
  createdAt: Date;    // When the session was created
  updatedAt: Date;    // When the session was last updated
}

// Schema for messages within a chat session
const MessageSchema = new Schema<IMessage>({
  type: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Schema for chat sessions
const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, index: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
export const ChatSessionModel = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema); 