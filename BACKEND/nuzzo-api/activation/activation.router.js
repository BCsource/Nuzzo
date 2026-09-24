const express = require('express');
const activationController = require('./activation.controller');
const { authenticate, authorize } = require('../../shared/auth-middleware');

const activationRouter = express.Router();

activationRouter.post('/', activationController.createActivationRequest);

activationRouter.get('/pending', authenticate, authorize('admin', 'masterAdmin'), activationController.getPendingActivationRequests);
activationRouter.put('/:id/handled', authenticate, authorize('admin', 'masterAdmin'), activationController.markActivationRequestHandled);

module.exports = activationRouter;
