const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const BadgeRequestSchema = new Schema({
    requestedBadges: {
        type: [{
            type: String,
            enum: {
                values: ['healthProfessional', 'careProfessional', 'supplier'],
                message: 'Invalid badge requested.',
            },
        }],
        required: [true, 'Choose at least one badge.'],
    },
    message: {
        type: String,
        required: [true, 'Tell us about your experience.'],
        trim: true,
    },
    certificate: {
        type: Schema.Types.ObjectId,
        ref: 'certificate',
        required: [true, 'Upload your certificate.'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: 'Invalid status.',
        },
        default: 'pending',
    },
    rejectReason: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    reviewedAt: {
        type: Date,
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
},
    {
        // para o fe saber o id user
        toJSON: { virtuals: true },
    });

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minLength: [6, 'Your password must be at least 6 characters long.'],
        select: false,
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
        minLength: [2, 'Your last name must be at least 2 characters long.'],
    },
    bio: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of Birth is required.'],
    },
    userType: {
        type: String,
        enum: {
            values: ['user', 'admin', 'masterAdmin'],
        },
        default: 'user',
    },
    badges: {
        type: [{
            type: String,
            enum: {
                values: ['aficionado', 'healthProfessional', 'careProfessional', 'supplier'],
                message: 'Badges need permission from an Admin.',
            }
        }],
        default: ['aficionado']
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    badgeRequests: [BadgeRequestSchema],
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'image',
    },

    lastSeenMessagesAt: {
        type: Date,
    },
    lastSeenCommentsAt: {
        type: Date,
    },

    // Soft delete: a conta não é apagada, fica desativada. só admin pode reativar
    disabled: {
        type: Boolean,
        default: false,
    },
    disabledAt: {
        type: Date,
    },
    disabledBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },

    createdAt: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    updatedAt: {
        type: Date,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
},
    {
        // para o fe saber o id usesr
        toJSON: { virtuals: true },
    });

UserSchema.pre('save', function () {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(12);
        this.password = bcrypt.hashSync(this.password, salt);
    }
});

UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = mongoose.model('user', UserSchema);
