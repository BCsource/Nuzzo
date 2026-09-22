const PetSchema = require('./pet.model');

exports.createPet = (req, res) => {
    const newPet = new PetSchema({
        ...req.body,
        owner: req.user.id
    });
    newPet.save()
        .then((pet) => {
            res.status(201).json(pet);
        })
        .catch(err => {
            res.status(500).json(err.errors || err);
        });
}

exports.updatePet = (req, res) => {
    PetSchema.findByIdAndUpdate(req.params.id,
        req.body, { returnDocument: 'after', runValidators: true })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

exports.deletePet = (req, res) => {
    PetSchema.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(error => {
            res.status(500).json(error.errors || error);
        });
}
