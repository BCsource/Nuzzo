const ImageModel = require('./image.model');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Choose an image.' });
    }
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'The image must be a JPG, PNG or WEBP file.' });
    }
    if (req.file.size > MAX_SIZE) {
        return res.status(400).json({ message: 'The image must be smaller than 2 MB.' });
    }

    const newImage = new ImageModel({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
    });
    newImage.owner = req.user._id;
    newImage.createdAt = new Date();

    newImage.save()
        .then((image) => {
            res.status(201).json({ id: image._id });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not save this image.' });
        });
};

//iamgens publicas

exports.getImage = (req, res) => {
    ImageModel.findById(req.params.id)
        .then((image) => {
            if (!image) {
                return res.status(404).json({ message: 'Image not found.' });
            }
            res.set('Content-Type', image.contentType);
            res.status(200).send(image.data);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load this image.' });
        });
};
