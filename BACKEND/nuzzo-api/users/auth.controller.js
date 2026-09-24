const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../../shared/config');
const { getUserPermissions } = require('../../shared/permissions');

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

exports.register = (req, res) => {

    const { email, password, fName, lName, dateOfBirth } = req.body;


    if (!email || !password || !fName || !lName || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    if (password.length < 6 || !hasLetter || !hasNumber || !hasSpecial) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long and contain letters, numbers and a special character.' });
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (isNaN(age) || age < 18 || age > 120) {
        return res.status(400).json({ message: 'You must be between 18 and 120 years old to register.' });
    }


    UserModel.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                res.status(409).json({ message: 'Email already in use.' });
                return null;
            }

            const newUser = new UserModel({ email, password, fName, lName, dateOfBirth }); //Se meter req.body, qualquer pessoa se consegue registar como admin no postman
            newUser.createdAt = new Date();
            newUser.createdBy = newUser._id; // quando user é criado por si e nao por admin na db

            return newUser.save();
        })
        .then((user) => {
            if (!user) return; //para nao duplicar error de email existe
            res.status(201).json({
                token: generateToken(user),
                user: {
                    id: user._id,
                    email: user.email,
                    fName: user.fName,
                    lName: user.lName,
                    bio: user.bio,
                    dateOfBirth: user.dateOfBirth,
                    badges: user.badges,
                    permissions: getUserPermissions(user),
                },
            });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
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
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
            res.status(200).json({
                token: generateToken(user),
                user: {
                    id: user._id,
                    email: user.email,
                    fName: user.fName,
                    lName: user.lName,
                    bio: user.bio,
                    dateOfBirth: user.dateOfBirth,
                    badges: user.badges,
                    permissions: getUserPermissions(user),
                },
            });
        })
        .catch(() => {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
        });
};

exports.me = (req, res) => {
    const user = req.user;
    res.status(200).json({
        id: user._id,
        email: user.email,
        fName: user.fName,
        lName: user.lName,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        badges: user.badges,
        permissions: getUserPermissions(user),
    });
};
