const ContactMessageModel = require('./contact.model');
const { sendContactEmail } = require('../../shared/mailer');

exports.sendContactMessage = (req, res) => {
    const { subject, reason, content } = req.body;

    if (!subject || subject.trim() === '') {
        return res.status(400).json({ message: 'Write a subject.' });
    }
    if (!reason) {
        return res.status(400).json({ message: 'Choose a reason.' });
    }
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Write your message.' });
    }

    const newMessage = new ContactMessageModel({ subject, reason, content });
    newMessage.sender = req.user._id;
    newMessage.createdAt = new Date();

    newMessage.save()
        .then(() => {
            return sendContactEmail(req.user, subject, reason, content)
                .catch(() => null);
        })
        .then(() => {
            res.status(201).json({ message: 'Message sent. We will get back to you soon.' });
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Could not send your message. Please try again later.' });
        });
};

exports.getPendingContactMessages = (req, res) => {
    ContactMessageModel.find({ status: 'pending' })
        .populate('sender', 'fName lName email profilePicture')
        .sort({ createdAt: 'desc' })
        .then((messages) => {
            res.status(200).json(messages);
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not load contact messages.' });
        });
};

exports.markContactHandled = (req, res) => {
    ContactMessageModel.findById(req.params.id)
        .then((message) => {
            if (!message) {
                res.status(404).json({ message: 'Message not found.' });
                return null;
            }
            if (message.status === 'handled') {
                res.status(400).json({ message: 'This message was already handled.' });
                return null;
            }

            message.status = 'handled';
            message.handledAt = new Date();
            message.handledBy = req.user._id;
            return message.save();
        })
        .then((message) => {
            if (!message) return;
            res.status(200).json({ message: 'Message marked as handled.' });
        })
        .catch(() => {
            res.status(500).json({ message: 'Could not update this message.' });
        });
};
