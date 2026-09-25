const UserModel = require('./user.model');
const CertificateModel = require('./certificate.model');
const { isAdmin } = require('../../shared/permissions');
const { preparePagination, prepareSort, prepareFilter } = require('../../shared/pagination-utils');

// admin

exports.getAllUsers = (req, res) => {
    const { limit, page } = preparePagination(req.query);
    const sort = prepareSort(req.query);
    const filter = prepareFilter(req.query, UserModel);

    UserModel.find(filter)
        .select('fName lName email dateOfBirth badges userType disabled profilePicture createdAt')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .then((users) => {
            const result = [];
            users.forEach((user) => {
                const userObject = user.toJSON();
                userObject.isAdmin = isAdmin(user);
                userObject.isMasterAdmin = user.userType === 'masterAdmin';
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
        .select('fName lName bio dateOfBirth badges profilePicture createdAt')
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

    const { fName, lName, bio, dateOfBirth, password, profilePicture } = req.body;

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
            user.profilePicture = profilePicture;
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

//soft delete
exports.disableUser = (req, res) => {
    if (req.user.id !== req.params.id && !isAdmin(req.user)) {
        return res.status(403).json({ message: 'You can only deactivate your own account.' });
    }

    UserModel.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return null;
            }
            if (user.disabled) {
                res.status(400).json({ message: 'This account is already deactivated.' });
                return null;
            }
            if (user.userType === 'masterAdmin') {
                res.status(403).json({ message: 'The master admin account cannot be deactivated.' });
                return null;
            }

            user.disabled = true;
            user.disabledAt = new Date();
            user.disabledBy = req.user._id;
            user.updatedAt = new Date();
            user.updatedBy = req.user._id;
            return user.save();
        })
        .then((user) => {
            if (!user) return;
            res.status(200).json({ message: 'Account deactivated.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not deactivate this account.' });
        });
};
exports.reactivateUser = (req, res) => {
    UserModel.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return null;
            }
            if (!user.disabled) {
                res.status(400).json({ message: 'This account is already active.' });
                return null;
            }

            user.disabled = false;
            user.disabledAt = null;
            user.disabledBy = null;
            user.updatedAt = new Date();
            user.updatedBy = req.user._id;
            return user.save();
        })
        .then((user) => {
            if (!user) return;
            res.status(200).json({ message: 'Account reactivated.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not reactivate this account.' });
        });
};

exports.submitBadgeRequest = (req, res) => {
    const { message } = req.body;
    let requestedBadges = req.body.requestedBadges;
    if (typeof requestedBadges === 'string') {
        requestedBadges = [requestedBadges];
    }

    if (!requestedBadges || requestedBadges.length === 0) {
        return res.status(400).json({ message: 'Choose at least one badge.' });
    }
    if (!message || message.trim() === '') {
        return res.status(400).json({ message: 'Tell us about your experience.' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'Upload your certificate (PDF or image).' });
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'The certificate must be a PDF, JPG or PNG file.' });
    }
    if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'The certificate must be smaller than 2 MB.' });
    }

    const newCertificate = new CertificateModel({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
    });
    newCertificate.owner = req.user._id;
    newCertificate.createdAt = new Date();

    newCertificate.save()
        .then((certificate) => {
            const user = req.user;
            user.badgeRequests.push({
                requestedBadges: requestedBadges,
                message: message,
                certificate: certificate._id,
                createdAt: new Date(),
                createdBy: user._id,
            });
            return user.save();
        })
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

exports.getCertificate = (req, res) => {
    UserModel.findOne({ 'badgeRequests._id': req.params.requestId })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'Badge request not found.' });
            }

            const request = user.badgeRequests.id(req.params.requestId);

            return CertificateModel.findById(request.certificate)
                .then((certificate) => {
                    if (!certificate) {
                        return res.status(404).json({ message: 'Certificate not found.' });
                    }
                    res.set('Content-Type', certificate.contentType);
                    res.set('Content-Disposition', 'inline; filename="' + certificate.fileName + '"');
                    res.status(200).send(certificate.data);
                });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load the certificate.' });
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
                            user: { id: user._id, fName: user.fName, lName: user.lName, email: user.email, profilePicture: user.profilePicture },
                            requestedBadges: request.requestedBadges,
                            message: request.message,
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

exports.updatePreferences = (req, res) => {
    const { highContrast } = req.body;

    if (highContrast !== true && highContrast !== false) {
        return res.status(400).json({ message: 'Choose whether to turn high contrast on or off.' });
    }

    const user = req.user;
    user.highContrast = highContrast;

    user.save()
        .then(() => {
            res.status(200).json({ message: 'Preferences updated.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not save your preferences.' });
        });
};

exports.getMyBadgeRequests = (req, res) => {
    const result = [];

    req.user.badgeRequests.forEach((request) => {
        result.push({
            id: request._id,
            requestedBadges: request.requestedBadges,
            message: request.message,
            status: request.status,
            rejectReason: request.rejectReason,
            seenByUser: request.seenByUser,
            createdAt: request.createdAt,
            reviewedAt: request.reviewedAt,
        });
    });

    res.status(200).json(result);
};

exports.markBadgeRequestSeen = (req, res) => {
    const user = req.user;
    const request = user.badgeRequests.id(req.params.requestId);

    if (!request) {
        return res.status(404).json({ message: 'Badge request not found.' });
    }

    request.seenByUser = true;

    user.save()
        .then(() => {
            res.status(200).json({ message: 'Marked as seen.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not update this request.' });
        });
};
