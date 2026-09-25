const express = require('express');
const contactController = require('./contact.controller');
const { authenticate, authorize } = require('../../shared/auth-middleware');

const contactRouter = express.Router();

contactRouter.post('/', authenticate, contactController.sendContactMessage);
contactRouter.get('/pending', authenticate, authorize('admin', 'masterAdmin'), contactController.getPendingContactMessages);
contactRouter.put('/:id/handled', authenticate, authorize('admin', 'masterAdmin'), contactController.markContactHandled);

module.exports = contactRouter;
