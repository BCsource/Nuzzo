const moongose = require('mongoose');

const Schema = mongoose.schema;

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
    },
    description: {
        type: String,
        required: true,
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
    },
    author: {},
    petId: {},
    views: Number,
    createdAt: Date,
    updatedAt: Date,
});

PostSchema.pre('save', function () {
    if (this.isNew) {
        this.createdAt = new Date();
    }
});

PostSchema.pre(/^find/, function () {
    this.select('-__v');
});


module.exports = mongoose.model('post', PostSchema);
