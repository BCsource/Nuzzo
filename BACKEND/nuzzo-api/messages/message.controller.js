const MessageModel = require('./message.model');
const PostModel = require('../posts/post.model');

const addIsMine = (message, user) => {
    const messageObject = message.toJSON();
    messageObject.isMine = message.sender.toString() === user.id;
    return messageObject;
};


exports.getAllMessages = (req, res) => {
    PostModel.findById(req.params.postId)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            if (post.author.toString() !== req.user.id) {
                res.status(403).json({ message: 'Only the author of this post can see all its messages.' });
                return null;
            }
            return MessageModel.find({ post: post._id }).sort({ createdAt: 'asc' });
        })
        .then((messages) => {
            if (!messages) return;
            const result = [];
            messages.forEach((message) => {
                result.push(addIsMine(message, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load messages.' });
        });
};


exports.getSenderMessages = (req, res) => {
    let post = null;

    PostModel.findById(req.params.postId)
        .populate('author', 'fName lName profilePicture')
        .then((foundPost) => {
            if (!foundPost) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            post = foundPost;

            const isSender = req.params.senderId === req.user.id;
            const isPostAuthor = post.author._id.toString() === req.user.id;
            if (!isSender && !isPostAuthor) {
                res.status(403).json({ message: 'You can only see your own messages.' });
                return null;
            }

            return MessageModel.find({ post: post._id, participant: req.params.senderId })
                .populate('participant', 'fName lName profilePicture')
                .sort({ createdAt: 'asc' });
        })
        .then((messages) => {
            if (!messages) return;

            const isPostAuthor = post.author._id.toString() === req.user.id;

            let otherUser = null;
            if (isPostAuthor) {
                if (messages.length > 0) {
                    otherUser = messages[0].participant;
                }
            } else {
                otherUser = post.author;
            }

            let canReply = true;
            if (isPostAuthor && messages.length === 0) {
                canReply = false;
            }

            const result = [];
            messages.forEach((message) => {
                result.push(addIsMine(message, req.user));
            });

            res.status(200).json({
                post: { id: post._id, title: post.title },
                otherUser: otherUser,
                canReply: canReply,
                messages: result,
            });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load this conversation.' });
        });
};

exports.addMessage = (req, res) => {
    const { content, participantId } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    PostModel.findById(req.params.postId)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }

            const isPostAuthor = post.author.toString() === req.user.id;

            if (!isPostAuthor) {
                const newMessage = new MessageModel({ content });
                newMessage.post = post._id;
                newMessage.sender = req.user._id;
                newMessage.participant = req.user._id;
                newMessage.postAuthor = post.author;
                newMessage.createdAt = new Date();
                return newMessage.save();
            }

            if (!participantId) {
                res.status(400).json({ message: 'Choose which conversation you are replying to.' });
                return null;
            }

            return MessageModel.findOne({ post: post._id, participant: participantId })
                .then((existingMessage) => {
                    if (!existingMessage) {
                        res.status(400).json({ message: 'You can only reply to people who messaged you about this post.' });
                        return null;
                    }

                    const newMessage = new MessageModel({ content });
                    newMessage.post = post._id;
                    newMessage.sender = req.user._id;
                    newMessage.participant = participantId;
                    newMessage.postAuthor = post.author;
                    newMessage.createdAt = new Date();
                    return newMessage.save();
                });
        })
        .then((message) => {
            if (!message) return;
            res.status(201).json(addIsMine(message, req.user));
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not send this message.' });
        });
};

// DMS
exports.getMyConversations = (req, res) => {
    MessageModel.find()
        .populate('post', 'title')
        .populate('participant', 'fName lName profilePicture')
        .populate('postAuthor', 'fName lName profilePicture')
        .sort({ createdAt: 'desc' })
        .then((messages) => {
            const conversations = [];

            messages.forEach((message) => {
                const iAmParticipant = message.participant._id.toString() === req.user.id;
                const iAmPostAuthor = message.postAuthor._id.toString() === req.user.id;

                if (!iAmParticipant && !iAmPostAuthor) {
                    return;
                }

                const key = message.post._id.toString() + '-' + message.participant._id.toString();
                const existing = conversations.find((conversation) => conversation.key === key);


                if (!existing) {
                    let otherUser = message.participant;
                    if (iAmParticipant) {
                        otherUser = message.postAuthor;
                    }

                    conversations.push({
                        key: key,
                        post: { id: message.post._id, title: message.post.title },
                        participantId: message.participant._id,
                        otherUser: otherUser,
                        lastMessage: {
                            content: message.content,
                            createdAt: message.createdAt,
                            isMine: message.sender.toString() === req.user.id,
                        },
                    });
                }
            });

            res.status(200).json(conversations);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your conversations.' });
        });
};
