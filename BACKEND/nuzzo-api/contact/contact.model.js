const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactMessageSchema = new Schema({
    subject: {
        type: String,
        required: [true, 'Write a subject.'],
        trim: true,
        maxLength: [120, 'The subject is too long.'],
    },
    reason: {
        type: String,
        enum: {
            values: ['question', 'problem', 'report', 'suggestion', 'other'],
            message: 'Invalid reason.',
        },
        required: [true, 'Choose a reason.'],
    },
    content: {
        type: String,
        required: [true, 'Write your message.'],
        trim: true,
        maxLength: [2000, 'The message is too long.'],
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
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

module.exports = mongoose.model('contactMessage', ContactMessageSchema);
