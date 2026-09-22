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

    const { email, password, fName, lName, dateOfBirth } = req.body;

    const error = validateRegistration({ email, password, dateOfBirth });
    if (error) {
        return res.status(400).json({ message: error });
    }

    UserModel.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                res.status(409).json({ message: 'Email already in use.' });
                return null;
            }

            const newUser = new UserModel({ email, password, fName, lName, dateOfBirth }); //Se meter req.body, qualquer pessoa se consegue registar como admin no postman
            newUser.createdAt = new Date();
            newUser.createdBy = newUser._id; // Para quando o user é criado por ele próprio e não no Mongodb por admin

            return newUser.save();
        })
        .then((user) => {
            if (!user) return; //para nao duplicar mensagem de email existe
            res.status(201).json({
                token: generateToken(user),
                user: { id: user._id, email: user.email },
            });
        })
        .catch(() => {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
        });
};

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
                token: generateToken(user),
                user: { id: user._id, email: user.email },
            });
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

exports.me = (req, res) => {
    UserModel.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json(error);
        });
}