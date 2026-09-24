const express = require('express');
const postController = require('./post.controller');
const { authenticate } = require('../../shared/auth-middleware');

const postRouter = express.Router();

postRouter.get('/', authenticate, postController.getAllPosts);
postRouter.get('/mine', authenticate, postController.getMyPosts);
postRouter.get('/favourites', authenticate, postController.getFavouritePosts);
postRouter.get('/:id', authenticate, postController.getPostById);

postRouter.post('/', authenticate, postController.createPost);
postRouter.put('/:id', authenticate, postController.updatePost);
postRouter.delete('/:id', authenticate, postController.deletePost);

postRouter.post('/:id/favourite', authenticate, postController.addFavourite);
postRouter.delete('/:id/favourite', authenticate, postController.removeFavourite);

module.exports = postRouter;
