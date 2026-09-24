const express = require('express');
const notificationController = require('./notification.controller');
const { authenticate } = require('../../shared/auth-middleware');

const notificationRouter = express.Router();

notificationRouter.get('/', authenticate, notificationController.getNotifications);
notificationRouter.put('/messages/seen', authenticate, notificationController.markMessagesSeen);
notificationRouter.put('/comments/seen', authenticate, notificationController.markCommentsSeen);

module.exports = notificationRouter;
