const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PetSchema = new Schema({
    owner: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
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
        required: [true, 'Please confirm if pet has been vacinated.']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Your pet cannot be born in the future.'],
    },

    createdAt: Date,
    updatedAt: Date
});

PetSchema.pre('save', function () {
    if (this.isNew) {
        this.createdAt = new Date();
    }
});

PetSchema.pre(/^find/, function () {
    this.select('-__v');
});


module.exports = mongoose.model('pet', PetSchema);
