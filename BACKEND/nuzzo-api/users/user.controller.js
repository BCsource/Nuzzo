const UserModel = require('./user.model');




exports.submitBadgeRequest = (req, res) => {
    const { requestedBadges, message, fileUrl } = req.body;

    UserModel.findById(req.user.id)
        .then((user) => {
            user.badgeRequests.push({ requestedBadges, message, fileUrl });
            return user.save();
        })
        .then((user) => res.status(201).json(user))
        .catch(error => {
            res.status(500).json(error);
        });
};