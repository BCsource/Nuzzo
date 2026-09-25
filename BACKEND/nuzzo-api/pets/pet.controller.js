const PetModel = require('./pet.model');
const { isAdmin, isProfessional } = require('../../shared/permissions');

const addPetPermissions = (pet, user) => {
    const petObject = pet.toJSON();
    const isOwner = pet.owner.toString() === user.id;
    const favouriteIds = user.favouritePets.map((id) => id.toString());

    petObject.isOwner = isOwner;
    petObject.isFavourite = favouriteIds.includes(pet._id.toString());

    petObject.permissions = {
        canEdit: isOwner || isAdmin(user),
        canViewHealthHistory: isOwner || isProfessional(user) || isAdmin(user),
        canWriteHealthHistory: isAdmin(user) || (isProfessional(user) && !isOwner),
    };

    return petObject;
};

// pets
exports.createPet = (req, res) => {
    const { name, species, breed, gender, weight, isSpayed, isVaccinated, dateOfBirth, profilePicture, bio } = req.body;


    if (!name || !species || !breed || !gender || !weight || !dateOfBirth) {
        return res.status(400).json({ message: 'Name, species, breed, gender, weight and date of birth are required.' });
    }
    if (name.trim().length < 2) {
        return res.status(400).json({ message: "Your pet's name must be at least 2 characters long." });
    }
    if (weight <= 0) {
        return res.status(400).json({ message: 'Weight must be greater than 0.' });
    }
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ message: 'Please enter a valid date of birth.' });
    }
    if (birthDate > new Date()) {
        return res.status(400).json({ message: 'Your pet cannot be born in the future.' });
    }

    const newPet = new PetModel({ name, species, breed, gender, weight, isSpayed, isVaccinated, dateOfBirth, profilePicture, bio });
    newPet.owner = req.user._id;
    newPet.createdAt = new Date();
    newPet.createdBy = req.user._id;

    newPet.save()
        .then((pet) => {
            res.status(201).json(pet);
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not create this pet.' });
        });
};

exports.getMyPets = (req, res) => {
    PetModel.find({ owner: req.user._id })
        .select('-healthHistory')
        .sort({ createdAt: 'desc' })
        .then((pets) => {
            const result = [];
            pets.forEach((pet) => {
                result.push(addPetPermissions(pet, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your pets.' });
        });
};

// user autenticado consegue ver
exports.getPetById = (req, res) => {
    PetModel.findById(req.params.id)
        .select('-healthHistory')
        .then((pet) => {
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }
            res.status(200).json(addPetPermissions(pet, req.user));
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load this pet.' });
        });
};

exports.updatePet = (req, res) => {
    const { name, species, breed, gender, weight, isSpayed, isVaccinated, dateOfBirth, profilePicture, bio } = req.body;


    if (!name || !species || !breed || !gender || !weight || !dateOfBirth) {
        return res.status(400).json({ message: 'Name, species, breed, gender, weight and date of birth are required.' });
    }
    if (name.trim().length < 2) {
        return res.status(400).json({ message: "Your pet's name must be at least 2 characters long." });
    }
    if (weight <= 0) {
        return res.status(400).json({ message: 'Weight must be greater than 0.' });
    }
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ message: 'Please enter a valid date of birth.' });
    }
    if (birthDate > new Date()) {
        return res.status(400).json({ message: 'Your pet cannot be born in the future.' });
    }


    PetModel.findById(req.params.id)
        .then((pet) => {
            if (!pet) {
                res.status(404).json({ message: 'Pet not found.' });
                return null;
            }
            if (pet.owner.toString() !== req.user.id && !isAdmin(req.user)) {
                res.status(403).json({ message: 'You can only edit your own pets.' });
                return null;
            }

            pet.name = name;
            pet.species = species;
            pet.breed = breed;
            pet.gender = gender;
            pet.weight = weight;
            pet.isSpayed = isSpayed;
            pet.isVaccinated = isVaccinated;
            pet.dateOfBirth = dateOfBirth;
            pet.profilePicture = profilePicture;
            pet.bio = bio;
            pet.updatedAt = new Date();
            pet.updatedBy = req.user._id;
            return pet.save();
        })
        .then((pet) => {
            if (!pet) return;
            res.status(200).json(pet);
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not update this pet.' });
        });
};

exports.deletePet = (req, res) => {
    PetModel.findById(req.params.id)
        .then((pet) => {
            if (!pet) {
                res.status(404).json({ message: 'Pet not found.' });
                return null;
            }
            if (pet.owner.toString() !== req.user.id && !isAdmin(req.user)) {
                res.status(403).json({ message: 'You can only delete your own pets.' });
                return null;
            }
            return pet.deleteOne();
        })
        .then((deleted) => {
            if (!deleted) return;
            res.status(200).json({ message: 'Pet deleted.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not delete this pet.' });
        });
};

//owner, professional e admin

exports.getHealthHistory = (req, res) => {
    PetModel.findById(req.params.id)
        .populate('healthHistory.author', 'fName lName')
        .then((pet) => {
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }

            const isOwner = pet.owner.toString() === req.user.id;
            if (!isOwner && !isProfessional(req.user) && !isAdmin(req.user)) {
                return res.status(403).json({ message: 'You cannot see this health history.' });
            }

            res.status(200).json(pet.healthHistory);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load the health history.' });
        });
};

exports.addHealthHistoryEntry = (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'The entry cannot be empty.' });
    }

    PetModel.findById(req.params.id)
        .then((pet) => {
            if (!pet) {
                res.status(404).json({ message: 'Pet not found.' });
                return null;
            }

            const isOwner = pet.owner.toString() === req.user.id;
            const canWrite = isAdmin(req.user) || (isProfessional(req.user) && !isOwner);
            if (!canWrite) {
                res.status(403).json({ message: 'Only verified professionals can write in this health history.' });
                return null;
            }

            pet.healthHistory.push({
                content: content,
                author: req.user._id,
                createdAt: new Date(),
            });
            return pet.save();
        })
        .then((pet) => {
            if (!pet) return;
            res.status(201).json({ message: 'Entry added.' });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not add this entry.' });
        });
};

// other users pets

exports.getPetsByOwner = (req, res) => {
    PetModel.find({ owner: req.params.id })
        .select('-healthHistory')
        .sort({ createdAt: 'desc' })
        .then((pets) => {
            const result = [];
            pets.forEach((pet) => {
                result.push(addPetPermissions(pet, req.user));
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load these pets.' });
        });
};

exports.addPetFavourite = (req, res) => {
    const user = req.user;
    const favouriteIds = user.favouritePets.map((id) => id.toString());

    PetModel.findById(req.params.id)
        .then((pet) => {
            if (!pet) {
                res.status(404).json({ message: 'Pet not found.' });
                return null;
            }
            if (!favouriteIds.includes(pet._id.toString())) {
                user.favouritePets.push(pet._id);
                pet.favouritesCount = pet.favouritesCount + 1;
            }
            return pet.save()
                .then(() => user.save());
        })
        .then((savedUser) => {
            if (!savedUser) return;
            res.status(200).json({ message: 'Added to favourites.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not add to favourites.' });
        });
};

exports.removePetFavourite = (req, res) => {
    const user = req.user;
    const wasFavourite = user.favouritePets.some((id) => id.toString() === req.params.id);

    user.favouritePets = user.favouritePets.filter((id) => id.toString() !== req.params.id);

    user.save()
        .then(() => {
            if (!wasFavourite) {
                return null;
            }
            return PetModel.findById(req.params.id)
                .then((pet) => {
                    if (!pet || pet.favouritesCount === 0) {
                        return null;
                    }
                    pet.favouritesCount = pet.favouritesCount - 1;
                    return pet.save();
                });
        })
        .then(() => {
            res.status(200).json({ message: 'Removed from favourites.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not remove from favourites.' });
        });
};

exports.getFavouritePets = (req, res) => {
    const favouriteIds = req.user.favouritePets.map((id) => id.toString());

    PetModel.find()
        .select('-healthHistory')
        .sort({ createdAt: 'desc' })
        .then((pets) => {
            const result = [];
            pets.forEach((pet) => {
                if (favouriteIds.includes(pet._id.toString())) {
                    result.push(addPetPermissions(pet, req.user));
                }
            });
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load your favourite pets.' });
        });
};
