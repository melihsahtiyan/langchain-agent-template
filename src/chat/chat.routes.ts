import { Router } from 'express';
import { ChatController } from './chat.controller';
import { upload } from '../config/multer.config';

const router = Router();
const chatController = new ChatController();

// Send a message to the chat
router.post('/message', upload.single('pdf'), (req, res) => {chatController.sendMessage(req, res)});

// Send a message to a specific chat session
router.post('/message/:sessionId', upload.single('pdf'), (req, res) => chatController.sendMessage(req, res));

// Get chat history for a session
router.get('/history/:sessionId', (req, res) => chatController.getChatHistory(req, res));

export default router; 