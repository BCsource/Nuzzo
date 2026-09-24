const express = require('express');
const commentController = require('./comment.controller');
const { authenticate } = require('../../shared/auth-middleware');

const commentRouter = express.Router({ mergeParams: true });

commentRouter.get('/', authenticate, commentController.getComments);
commentRouter.post('/', authenticate, commentController.addComment);
commentRouter.put('/:commentId', authenticate, commentController.updateComment);
commentRouter.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = commentRouter;
