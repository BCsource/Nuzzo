require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./nuzzo-api/users/auth.router');
const userRouter = require('./nuzzo-api/users/user.router');
const postRouter = require('./nuzzo-api/posts/post.router');
const messageRouter = require('./nuzzo-api/messages/message.router');
const conversationRouter = require('./nuzzo-api/messages/conversation.router');
const commentRouter = require('./nuzzo-api/comments/comment.router');
const petRouter = require('./nuzzo-api/pets/pet.router');
const imageRouter = require('./nuzzo-api/images/image.router');
const activationRouter = require('./nuzzo-api/activation/activation.router');
const notificationRouter = require('./nuzzo-api/notifications/notification.router');
const contactRouter = require('./nuzzo-api/contact/contact.router');

const app = express();
app.use(cors());
app.use(express.json());
app.set('query parser', 'extended');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts/:postId/comments', commentRouter);
app.use('/api/posts/:postId/messages', messageRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/posts', postRouter);
app.use('/api/pets', petRouter);
app.use('/api/images', imageRouter);
app.use('/api/activation-requests', activationRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/contact', contactRouter);

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error.message));
if (!process.env.VERCEL) {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port', process.env.PORT);
    });
}

module.exports = app;
