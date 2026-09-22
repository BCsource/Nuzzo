const UserModel = require('./user.model');

/* // criar um pedido de badge request
user.badgeRequests.push({ requestedBadges, message, fileUrl });
await user.save();

// encontrar um pedido pelo id
const request = user.badgeRequests.id(req.params.requestId);
request.status = 'approved';
await user.save();

//count postsPublished

PostModel.countDocuments({ author: user.id }) */


exports.submitBadgeRequest = (req, res, next) => {
    const { requestedBadges, message, fileUrl } = req.body;

    UserModel.findById(req.user.id)
        .then((user) => {
            user.badgeRequests.push({ requestedBadges, message, fileUrl });
            return user.save();
        })
        .then((user) => res.status(201).json(user))
        .catch(next);
};