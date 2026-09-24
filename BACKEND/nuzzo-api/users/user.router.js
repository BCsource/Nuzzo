const express = require('express');
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../shared/auth-middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const userRouter = express.Router();


userRouter.get('/', authenticate, authorize('admin', 'masterAdmin'), userController.getAllUsers);

userRouter.post('/badge-requests', authenticate, upload.single('certificate'), userController.submitBadgeRequest);
userRouter.get('/badge-requests/pending', authenticate, authorize('admin', 'masterAdmin'), userController.getPendingBadgeRequests);
userRouter.get('/badge-requests/:requestId/certificate', authenticate, authorize('admin', 'masterAdmin'), userController.getCertificate);
userRouter.put('/badge-requests/:requestId', authenticate, authorize('admin', 'masterAdmin'), userController.reviewBadgeRequest);

userRouter.get('/:id', authenticate, userController.getUserById);
userRouter.put('/:id', authenticate, userController.updateUser);
userRouter.put('/:id/disable', authenticate, userController.disableUser);
userRouter.put('/:id/reactivate', authenticate, authorize('admin', 'masterAdmin'), userController.reactivateUser);
userRouter.put('/:id/promote-admin', authenticate, authorize('masterAdmin'), userController.promoteToAdmin);

module.exports = userRouter;
