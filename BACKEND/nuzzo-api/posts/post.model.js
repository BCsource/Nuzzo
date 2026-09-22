const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postType: {
        type: String,
        enum: {
            values: ['regular', 'health', 'care', 'product', 'adoption', 'poll']
        },
        required: true,
    },
    title: {
        type: String,
        required: true,
        minLength: [3, 'Title must be at least 3 characters long.'],
        maxLength: [100, 'Title must not exceed 100 characters.'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description must be at least 10 characters long.'],
        maxLength: [5000, 'Description too long! Please summarize.'],
    },
    category: {
        type: String,
        enum: {
            values: ['Veterinarian', 'Grooming', 'Pet Coach', 'Pet Sitting', 'Nutrition', 'Accessories', 'Play time', 'Other']
        },
        required: true,
    },
    price: {
        type: Number,
        min: 0,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    taggedPets: [{
        type: Schema.Types.ObjectId,
        ref: 'pet',
    }],
    views: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
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
});

module.exports = mongoose.model('post', PostSchema);
