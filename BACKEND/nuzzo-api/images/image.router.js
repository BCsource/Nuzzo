const express = require('express');
const multer = require('multer');
const imageController = require('./image.controller');
const { authenticate } = require('../../shared/auth-middleware');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const imageRouter = express.Router();

imageRouter.post('/', authenticate, upload.single('image'), imageController.uploadImage);
imageRouter.get('/:id', imageController.getImage);

module.exports = imageRouter;
