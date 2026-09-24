
const isAdmin = (user) => {
    return user.userType === 'admin' || user.userType === 'masterAdmin';
};

const isProfessional = (user) => {
    return user.badges.includes('healthProfessional') || user.badges.includes('careProfessional');
};

const getAllowedPostTypes = (user) => {
    if (isAdmin(user)) {
        return ['regular', 'poll', 'health', 'care', 'product', 'adoption'];
    }
    const types = ['regular', 'poll'];

    if (user.badges.includes('healthProfessional')) {
        types.push('health');
    }
    if (isProfessional(user)) {
        types.push('care');
        types.push('adoption');
    }
    if (user.badges.includes('supplier')) {
        types.push('product');
    }

    return types;
};

const getUserPermissions = (user) => {
    return {
        canManageUsers: isAdmin(user),
        canPromoteAdmins: user.userType === 'masterAdmin',
        allowedPostTypes: getAllowedPostTypes(user),
    };
};

module.exports = { isAdmin, isProfessional, getAllowedPostTypes, getUserPermissions };
