const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HealthHistorySchema = new Schema({
    content: {
        type: String,
        required: [true, 'The entry cannot be empty.'],
        trim: true,
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
        // para o fe saber o id user
        toJSON: { virtuals: true },
    });

const PetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
        minLength: [2, "Your pet's name must be at least 2 characters long."],
    },
    gender: {
        type: String,
        enum: {
            values: ['female', 'male', 'unknown'],
            message: 'Invalid gender.',
        },
        required: [true, "Choose your pet's gender."],
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [10000, 'The bio is too long.'],
    },
    favouritesCount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'image',
    },
    species: {
        type: String,
        enum: {
            values: ['Dog', 'Cat', 'Rabbit', 'Horse', 'Farm', 'Bird', 'Reptile', 'Rodent', 'Fish', 'Other']
        },
        required: [true, 'Select your pet species.'],
        trim: true
    },
    breed: {
        type: String,
        required: [true, 'Breed is required.'],
    },
    weight: {
        type: Number,
        required: [true, 'Weight of pet is required.'],
        min: [0.01, 'Your pet must weight at least 0,01Kg.'],
        max: [1500, 'Your pet weight must not exceed 1500Kg.'],
    },
    isSpayed: {
        type: Boolean,
        required: [true, 'Please confirm if pet has been spayed or neutered.'],
    },
    isVaccinated: {
        type: Boolean,
        required: [true, 'Please confirm if pet has been vaccinated.']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required.'],
    },
    healthHistory: [HealthHistorySchema],
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
        // para o fe saber o id user
        toJSON: { virtuals: true },
    });



module.exports = mongoose.model('pet', PetSchema);
