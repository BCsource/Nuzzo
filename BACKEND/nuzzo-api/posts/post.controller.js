const PostModel = require('./post.model');
const MessageModel = require('../messages/message.model');
const CommentModel = require('../comments/comment.model');
const { isAdmin, getAllowedPostTypes } = require('../../shared/permissions');
const { preparePagination, prepareSort, prepareFilter } = require('../../shared/pagination-utils');

const addPostFlags = (post, user) => {
    const postObject = post.toJSON();
    const favouriteIds = user.favourites.map((id) => id.toString());

    postObject.isOwner = post.author._id.toString() === user.id;
    postObject.canEdit = postObject.isOwner || isAdmin(user);
    postObject.isFavourite = favouriteIds.includes(post._id.toString());

    return postObject;
};


exports.getAllPosts = (req, res) => {
    const { limit, page } = preparePagination(req.query);
    const filter = prepareFilter(req.query, PostModel);
    let sort = prepareSort(req.query);

    if (Object.keys(sort).length === 0) {
        sort = { createdAt: 'desc' };
    }

    PostModel.find(filter)
        .populate('author', 'fName lName profilePicture')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .then((posts) => {
            const result = [];
            posts.forEach((post) => {
                result.push(addPostFlags(post, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load posts.' });
        });
};

exports.getMyPosts = (req, res) => {
    PostModel.find({ author: req.user._id })
        .populate('author', 'fName lName profilePicture')
        .sort({ createdAt: 'desc' })
        .then((posts) => {
            const result = [];
            posts.forEach((post) => {
                result.push(addPostFlags(post, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your posts.' });
        });
};

exports.getFavouritePosts = (req, res) => {
    const favouriteIds = req.user.favourites.map((id) => id.toString());

    PostModel.find()
        .populate('author', 'fName lName profilePicture')
        .sort({ createdAt: 'desc' })
        .then((posts) => {
            const result = [];
            posts.forEach((post) => {
                if (favouriteIds.includes(post._id.toString())) {
                    result.push(addPostFlags(post, req.user));
                }
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your favourites.' });
        });
};

exports.getPostById = (req, res) => {
    PostModel.findById(req.params.id)
        .populate('author', 'fName lName profilePicture')
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            post.views = post.views + 1;
            return post.save();
        })
        .then((post) => {
            if (!post) return;
            res.status(200).json(addPostFlags(post, req.user));
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load this post.' });
        });
};


exports.createPost = (req, res) => {
    const { postType, title, description, category, price, taggedPets, image, videoUrl } = req.body;

    if (!postType) {
        return res.status(400).json({ message: 'Choose a post type.' });
    }
    if (!getAllowedPostTypes(req.user).includes(postType)) {
        return res.status(403).json({ message: 'Your badges do not allow this type of post.' });
    }
    if (price < 0) {
        return res.status(400).json({ message: "Price can't be negative." });
    }

    const newPost = new PostModel({ postType, title, description, category, price, taggedPets, image, videoUrl });
    newPost.author = req.user._id;
    newPost.createdAt = new Date();
    newPost.createdBy = req.user._id;

    newPost.save()
        .then((post) => {
            res.status(201).json(post);
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not create this post.' });
        });
};

exports.updatePost = (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    PostModel.findById(req.params.id)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            if (post.author.toString() !== req.user.id && !isAdmin(req.user)) {
                res.status(403).json({ message: 'You can only edit your own posts.' });
                return null;
            }

            post.title = title;
            post.description = description;
            post.updatedAt = new Date();
            post.updatedBy = req.user._id;
            return post.save();
        })
        .then((post) => {
            if (!post) return;
            res.status(200).json(post);
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not update this post.' });
        });
};

exports.deletePost = (req, res) => {
    PostModel.findById(req.params.id)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            if (post.author.toString() !== req.user.id && !isAdmin(req.user)) {
                res.status(403).json({ message: 'You can only delete your own posts.' });
                return null;
            }
            return post.deleteOne();
        })
        .then((deleted) => {
            if (!deleted) return;
            return CommentModel.deleteMany({ post: req.params.id })
                .then(() => MessageModel.deleteMany({ post: req.params.id }))
                .then(() => res.status(200).json({ message: 'Post deleted.' }));
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not delete this post.' });
        });
};

exports.addFavourite = (req, res) => {
    const user = req.user;
    const favouriteIds = user.favourites.map((id) => id.toString());

    PostModel.findById(req.params.id)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return null;
            }
            if (!favouriteIds.includes(post._id.toString())) {
                user.favourites.push(post._id);
            }
            return user.save();
        })
        .then((savedUser) => {
            if (!savedUser) return;
            res.status(200).json({ message: 'Added to favourites.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not add to favourites.' });
        });
};

exports.removeFavourite = (req, res) => {
    const user = req.user;

    user.favourites = user.favourites.filter((id) => id.toString() !== req.params.id);

    user.save()
        .then(() => {
            res.status(200).json({ message: 'Removed from favourites.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not remove from favourites.' });
        });
};
