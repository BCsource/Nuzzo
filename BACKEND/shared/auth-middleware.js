const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const UserModel = require('../nuzzo-api/users/user.model');

exports.authenticate = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided.' });
    }

    const token = header.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
        }

        UserModel.findById(decoded.id)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: 'This account no longer exists.' });
                }
                if (user.disabled) {
                    return res.status(401).json({ message: 'This account has been deactivated.' });
                }
                req.user = user;
                next();
            })
            .catch(() => {
                res.status(500).json({ message: 'Something went wrong. Please try again later.' });
            });
    });
};

exports.authorize = (...userTypes) => {
    return (req, res, next) => {
        if (!req.user || !userTypes.includes(req.user.userType)) {
            return res.status(403).json({ message: 'You are not allowed to do this.' });
        }
        next();
    };
};
