const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: [true, 'Email already in use.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minLength: [6, 'Your password must be at least 6 characters long.'],
    },
    fName: {
        type: String,
        required: [true, 'First name is required.'],
        trim: true,
        minLength: [2, 'Your first name must be at least 2 characters long.'],
    },
    lName: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true,
        minLength: [2, 'Your first name must be at least 2 characters long.'],
    },
    bio: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'You must be between 18 and 120 years old to register.'],
    },
    postsPublished: {
        type: Number,
    },
    userType: {
        type: String,
        enum: {
            values: ['user', 'admin', 'master admin'],
            default: ['user'],
        }
    },
    Badges: {
        type: [{
            type: String,
            enum: {
                values: ['aficionado', 'health professional', 'care professional', 'supplier'],
                message: ['Badges need permission from an Admin.'],
            }
        }],
        default: ['aficionado']
    },

    createdAt: Date,
    updatedAt: Date
});

UserSchema.pre('save', function () {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(12);
        this.password = bcrypt.hashSync(this.password, salt);
    }
});

UserSchema.pre('save', function () {
    if (this.isNew) {
        this.createdAt = new Date();
    }
});

UserSchema.pre(/^find/, function () {
    this.select('-__v');
});

UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = mongoose.model('user', UserSchema);
