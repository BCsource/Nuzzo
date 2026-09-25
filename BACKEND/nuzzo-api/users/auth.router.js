const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../shared/auth-middleware');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.get('/me', authenticate, authController.me);

module.exports = authRouter;