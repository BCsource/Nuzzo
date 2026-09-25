const CommentModel = require('./comment.model');
const PostModel = require('../posts/post.model');
const { isAdmin } = require('../../shared/permissions');


const addCommentFlags = (comment, user) => {
    const commentObject = comment.toJSON();
    const isCommentAuthor = comment.author._id.toString() === user.id;

    commentObject.canEdit = isCommentAuthor;
    commentObject.canDelete = isCommentAuthor || isAdmin(user);

    return commentObject;
};


exports.getComments = (req, res) => {
    CommentModel.find({ post: req.params.postId })
        .populate('author', 'fName lName profilePicture')
        .sort({ createdAt: 'asc' })
        .then((comments) => {
            const result = [];
            comments.forEach((comment) => {
                result.push(addCommentFlags(comment, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load comments.' });
        });
};


exports.addComment = (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    PostModel.findById(req.params.postId)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }

            const newComment = new CommentModel({ content });
            newComment.post = post._id;
            newComment.author = req.user._id;
            newComment.createdAt = new Date();

            // para o user ver nova actv
            post.lastActivityAt = new Date();

            return post.save()
                .then(() => newComment.save());
        })
        .then((comment) => {
            if (!comment) return;
            return comment.populate('author', 'fName lName profilePicture')
                .then((populated) => res.status(201).json(addCommentFlags(populated, req.user)));
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not add your comment.' });
        });
};

exports.updateComment = (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    CommentModel.findById(req.params.commentId)
        .then((comment) => {
            if (!comment) {
                res.status(404).json({ message: 'Comment not found.' });
                return null;
            }
            if (comment.author.toString() !== req.user.id) {
                res.status(403).json({ message: 'You can only edit your own comments.' });
                return null;
            }

            comment.content = content;
            comment.updatedAt = new Date();
            comment.updatedBy = req.user._id;
            return comment.save();
        })
        .then((comment) => {
            if (!comment) return;
            return comment.populate('author', 'fName lName profilePicture')
                .then((populated) => res.status(200).json(addCommentFlags(populated, req.user)));
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not update your comment.' });
        });
};

exports.deleteComment = (req, res) => {
    CommentModel.findById(req.params.commentId)
        .then((comment) => {
            if (!comment) {
                res.status(404).json({ message: 'Comment not found.' });
                return null;
            }
            if (comment.author.toString() !== req.user.id && !isAdmin(req.user)) {
                res.status(403).json({ message: 'You can only delete your own comments.' });
                return null;
            }
            return comment.deleteOne();
        })
        .then((deleted) => {
            if (!deleted) return;
            res.status(200).json({ message: 'Comment deleted.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not delete this comment.' });
        });
};
