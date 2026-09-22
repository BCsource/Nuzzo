const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

exports.authenticate = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided.' });
    }

    const token = header.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid Token.' });
        }
        req.user = decoded;
        next();
    });
}

exports.authorize = (...userType) => {
    return (req, res, next) => {
        if (!req.user || !userType.includes(req.user.userType)) {
            return res.status(403).json({ message: 'Not authorized.' });
        }
        next();
    }
}
