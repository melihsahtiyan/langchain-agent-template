import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ChatService } from "./chat.service";

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  /**
   * Send a message to the chat
   * @param req Request
   * @param res Response
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      const pdf = req.file || null; // PDF file uploaded via multer
      const sessionId = req.params.sessionId || req.body.sessionId || uuidv4();

      if (!message) {
        res.status(400).json({
          success: false,
          message: "Message is required",
        });
        return;
      }

      const response = await this.chatService.chat(message, sessionId, pdf);

      res.json({
        success: true,
        data: {
          sessionId,
          message: response.content,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Chat error: ${error.message}`,
      });
    }
  }

  /**
   * Get chat history for a session
   * @param req Request
   * @param res Response
   */
  async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: "Session ID is required",
        });
        return;
      }

      const history = await this.chatService.getChatBySessionId(sessionId);

      res.json({
        success: true,
        data: {
          sessionId,
          messages: history,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error retrieving chat history: ${error.message}`,
      });
    }
  }
}
