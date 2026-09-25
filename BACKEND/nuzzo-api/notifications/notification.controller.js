const MessageModel = require('../messages/message.model');
const PostModel = require('../posts/post.model');
const UserModel = require('../users/user.model');
const ActivationRequestModel = require('../activation/activation.model');
const { isAdmin } = require('../../shared/permissions');


const seenSince = (date) => {
    if (!date) {
        return new Date(0);
    }
    return date;
};


exports.getNotifications = (req, res) => {
    const user = req.user;
    const notifications = { messages: 0, comments: 0, badgeRequests: 0, activationRequests: 0 };


    MessageModel.find({ createdAt: { $gt: seenSince(user.lastSeenMessagesAt) } })
        .then((messages) => {
            messages.forEach((message) => {
                const isMine = message.sender.toString() === user.id;
                const inMyConversation = message.participant.toString() === user.id
                    || message.postAuthor.toString() === user.id;
                if (!isMine && inMyConversation) {
                    notifications.messages = notifications.messages + 1;
                }
            });
            return PostModel.find({ author: user._id });
        })
        .then((posts) => {
            const lastSeen = seenSince(user.lastSeenCommentsAt);
            posts.forEach((post) => {
                if (post.lastActivityAt && post.lastActivityAt > lastSeen) {
                    notifications.comments = notifications.comments + 1;
                }
            });
        })
        .then(() => {
            if (!isAdmin(user)) {
                return null;
            }

            return UserModel.find({ 'badgeRequests.status': 'pending' })
                .then((users) => {
                    users.forEach((otherUser) => {
                        otherUser.badgeRequests.forEach((request) => {
                            if (request.status === 'pending') {
                                notifications.badgeRequests = notifications.badgeRequests + 1;
                            }
                        });
                    });
                    return ActivationRequestModel.countDocuments({ status: 'pending' });
                })
                .then((count) => {
                    notifications.activationRequests = count;
                });
        })
        .then(() => {
            res.status(200).json(notifications);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your notifications.' });
        });
};

exports.markMessagesSeen = (req, res) => {
    const user = req.user;
    user.lastSeenMessagesAt = new Date();

    user.save()
        .then(() => {
            res.status(200).json({ message: 'Messages marked as seen.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not update your notifications.' });
        });
};

exports.markCommentsSeen = (req, res) => {
    const user = req.user;
    user.lastSeenCommentsAt = new Date();

    user.save()
        .then(() => {
            res.status(200).json({ message: 'Comments marked as seen.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not update your notifications.' });
        });
};
