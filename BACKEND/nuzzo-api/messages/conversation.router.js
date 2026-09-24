const express = require('express');
const messageController = require('./message.controller');
const { authenticate } = require('../../shared/auth-middleware');

const conversationRouter = express.Router();

conversationRouter.get('/', authenticate, messageController.getMyConversations);

module.exports = conversationRouter;
