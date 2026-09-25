const express = require('express');
const messageController = require('./message.controller');
const { authenticate } = require('../../shared/auth-middleware');

const messageRouter = express.Router({ mergeParams: true });

messageRouter.get('/', authenticate, messageController.getAllMessages);
messageRouter.get('/:senderId', authenticate, messageController.getSenderMessages);
messageRouter.post('/', authenticate, messageController.addMessage);
messageRouter.put('/:senderId/seen', authenticate, messageController.markConversationSeen);

module.exports = messageRouter;
