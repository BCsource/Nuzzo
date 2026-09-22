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

    const newUser = new UserModel({ email, password, fName, lName, dateOfBirth }); //Se meter req.body, qualquer pessoa se consegue registar como admin no postman
    newUser.save()
        .then((user) => {
            res.status(201).json({
                token: generateToken(user),
                user, // VER A INFO QUE ESTA A PASSAR PARA O FE
            });
        })
        .catch(err => {
            if (err.code === 11000) {
                res.status(400).json({ message: 'Email already in use.' }); // caso o email já esteja registrado
            }
            res.status(500).json({ message: 'Something went wrong. Please try again later.' }); // caso de erro, não dando muita informação.
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
                token: generateToken(user),
                user,
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