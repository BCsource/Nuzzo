const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActivationRequestSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'handled'],
            message: 'Invalid status.',
        },
        default: 'pending',
    },
    createdAt: {
        type: Date,
        required: true,
    },
    handledAt: {
        type: Date,
    },
    handledBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
},
    {
        toJSON: { virtuals: true },
    });

module.exports = mongoose.model('activationRequest', ActivationRequestSchema);
