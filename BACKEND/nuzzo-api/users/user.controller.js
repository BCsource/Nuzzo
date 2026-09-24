const UserModel = require('./user.model');
const PetModel = require('../pets/pet.model');
const PostModel = require('../posts/post.model');
const MessageModel = require('../messages/message.model');
const CommentModel = require('../comments/comment.model');
const { isAdmin } = require('../../shared/permissions');
const { preparePagination, prepareSort, prepareFilter } = require('../../shared/pagination-utils');

// admin

exports.getAllUsers = (req, res) => {
    const { limit, page } = preparePagination(req.query);
    const sort = prepareSort(req.query);
    const filter = prepareFilter(req.query, UserModel);

    UserModel.find(filter)
        .select('fName lName email dateOfBirth badges userType createdAt')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .then((users) => {
            const result = [];
            users.forEach((user) => {
                const userObject = user.toJSON();
                userObject.isAdmin = isAdmin(user);
                delete userObject.userType;
                result.push(userObject);
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load users.' });
        });
};

exports.promoteToAdmin = (req, res) => {
    UserModel.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return null;
            }
            if (isAdmin(user)) {
                res.status(400).json({ message: 'This user is already an admin.' });
                return null;
            }

            user.userType = 'admin';
            user.updatedAt = new Date();
            user.updatedBy = req.user._id;
            return user.save();
        })
        .then((user) => {
            if (!user) return;
            res.status(200).json({ message: 'User promoted to admin.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not promote this user.' });
        });
};

//profile
exports.getUserById = (req, res) => {
    UserModel.findById(req.params.id)
        .select('fName lName bio dateOfBirth badges createdAt')
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.status(200).json(user);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load this user.' });
        });
};

exports.updateUser = (req, res) => {
    if (req.user.id !== req.params.id && !isAdmin(req.user)) {
        return res.status(403).json({ message: 'You can only edit your own profile.' });
    }

    const { fName, lName, bio, dateOfBirth, password } = req.body;

    if (!fName || !lName || !dateOfBirth) {
        return res.status(400).json({ message: 'First name, last name and date of birth are required.' });
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (isNaN(age) || age < 18 || age > 120) {
        return res.status(400).json({ message: 'You must be between 18 and 120 years old.' });
    }

    if (password) {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        if (password.length < 6 || !hasLetter || !hasNumber || !hasSpecial) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long and contain letters, numbers and a special character.' });
        }
    }

    UserModel.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return null;
            }

            user.fName = fName;
            user.lName = lName;
            user.bio = bio;
            user.dateOfBirth = dateOfBirth;
            if (password) {
                user.password = password;
            }
            user.updatedAt = new Date();
            user.updatedBy = req.user._id;
            return user.save();
        })
        .then((user) => {
            if (!user) return;
            res.status(200).json({ message: 'Profile updated.' });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not update this profile.' });
        });
};



exports.submitBadgeRequest = (req, res) => {
    const { requestedBadges, message, fileUrl } = req.body;

    if (!requestedBadges || requestedBadges.length === 0) {
        return res.status(400).json({ message: 'Choose at least one badge.' });
    }
    if (!message || message.trim() === '') {
        return res.status(400).json({ message: 'Tell us about your experience.' });
    }

    const user = req.user;
    user.badgeRequests.push({
        requestedBadges: requestedBadges,
        message: message,
        fileUrl: fileUrl,
        createdAt: new Date(),
        createdBy: user._id,
    });

    user.save()
        .then(() => {
            res.status(201).json({ message: 'Badge request submitted. An admin will review it soon.' });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not submit your request.' });
        });
};

exports.getPendingBadgeRequests = (req, res) => {
    UserModel.find({ 'badgeRequests.status': 'pending' })
        .then((users) => {
            const pending = [];

            users.forEach((user) => {
                user.badgeRequests.forEach((request) => {
                    if (request.status === 'pending') {
                        pending.push({
                            id: request._id,
                            user: { id: user._id, fName: user.fName, lName: user.lName, email: user.email },
                            requestedBadges: request.requestedBadges,
                            message: request.message,
                            fileUrl: request.fileUrl,
                            createdAt: request.createdAt,
                        });
                    }
                });
            });

            res.status(200).json(pending);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load badge requests.' });
        });
};

exports.reviewBadgeRequest = (req, res) => {
    const { approved, rejectReason } = req.body;

    if (approved !== true && approved !== false) {
        return res.status(400).json({ message: 'Choose whether to approve or reject this request.' });
    }

    UserModel.findOne({ 'badgeRequests._id': req.params.requestId })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Badge request not found.' });
                return null;
            }

            const request = user.badgeRequests.id(req.params.requestId);

            if (request.status !== 'pending') {
                res.status(400).json({ message: 'This request was already reviewed.' });
                return null;
            }

            if (approved) {
                request.status = 'approved';
                request.requestedBadges.forEach((badge) => {
                    if (!user.badges.includes(badge)) {
                        user.badges.push(badge);
                    }
                });
            } else {
                request.status = 'rejected';
                request.rejectReason = rejectReason;
            }

            request.reviewedAt = new Date();
            request.reviewedBy = req.user._id;
            return user.save();
        })
        .then((user) => {
            if (!user) return;
            res.status(200).json({ message: 'Request reviewed.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not review this request.' });
        });
};
