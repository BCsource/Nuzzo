const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../../shared/config');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, userType: user.userType },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
}

exports.register = (req, res) => {
    const newUser = new UserModel(req.body);
    newUser.save()
        .then((user) => {
            res.status(201).json({
                token: generateToken(user)
            });
        })
        .catch(err => {
            res.status(500).json(err.errors || err);
        });
}

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    UserModel.findOne({ email })
        .select('+password')
        .then((user) => {
            if (!user || !user.comparePassword(password)) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
            res.status(200).json({
                token: generateToken(user)
            });
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

exports.me = (req, res) => {
    UserModel.findById(req.user.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

// criar um pedido de badge request
user.badgeRequests.push({ requestedBadges, message, fileUrl });
await user.save();

// encontrar um pedido pelo id
const request = user.badgeRequests.id(req.params.requestId);
request.status = 'approved';
await user.save();

//count postsPublished

PostModel.countDocuments({ author: user.id })