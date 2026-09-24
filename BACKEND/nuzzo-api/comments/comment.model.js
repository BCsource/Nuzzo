const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment cannot be empty.'],
        trim: true,
        maxLength: [1000, 'Comment is too long.'],
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
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
        //para o fe saber o id user
        toJSON: { virtuals: true },
    });

module.exports = mongoose.model('comment', CommentSchema);
