const ActivationRequestModel = require('./activation.model');

// caso o user queira reactivar a sua acc
exports.createActivationRequest = (req, res) => {
    const { email, message } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    ActivationRequestModel.findOne({ email: email, status: 'pending' })
        .then((existingRequest) => {
            if (existingRequest) {
                res.status(200).json({ message: 'We already have your request. An admin will contact you soon.' });
                return null;
            }

            const newRequest = new ActivationRequestModel({ email, message });
            newRequest.createdAt = new Date();
            return newRequest.save();
        })
        .then((request) => {
            if (!request) return;
            res.status(201).json({ message: 'Request sent. An admin will contact you soon.' });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not send your request. Please try again later.' });
        });
};

// pedidos de ativacao -> admin only

exports.getPendingActivationRequests = (req, res) => {
    ActivationRequestModel.find({ status: 'pending' })
        .sort({ createdAt: 'desc' })
        .then((requests) => {
            res.status(200).json(requests);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load activation requests.' });
        });
};

exports.markActivationRequestHandled = (req, res) => {
    ActivationRequestModel.findById(req.params.id)
        .then((request) => {
            if (!request) {
                res.status(404).json({ message: 'Activation request not found.' });
                return null;
            }
            if (request.status === 'handled') {
                res.status(400).json({ message: 'This request was already handled.' });
                return null;
            }

            request.status = 'handled';
            request.handledAt = new Date();
            request.handledBy = req.user._id;
            return request.save();
        })
        .then((request) => {
            if (!request) return;
            res.status(200).json({ message: 'Request marked as handled.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not update this request.' });
        });
};
