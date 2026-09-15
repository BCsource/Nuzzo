
export const POST_TYPES = {
    REGULAR: 'regular',
    HEALTH: 'health',
    CARE: 'care',
    PRODUCT: 'product',
    ADOPTION: 'adoption',
    POLL: 'poll',
};

export const POST_TYPE_LABELS = {
    [POST_TYPES.REGULAR]: 'Regular',
    [POST_TYPES.HEALTH]: 'Health',
    [POST_TYPES.CARE]: 'Care',
    [POST_TYPES.PRODUCT]: 'Product',
    [POST_TYPES.ADOPTION]: 'Adoption',
    [POST_TYPES.POLL]: 'Poll',
};


export const POST_TYPES_BY_BADGE = {
    aficionado: [POST_TYPES.REGULAR, POST_TYPES.POLL],
    healthProfessional: [POST_TYPES.REGULAR, POST_TYPES.POLL, POST_TYPES.HEALTH, POST_TYPES.CARE, POST_TYPES.ADOPTION],
    careProfessional: [POST_TYPES.REGULAR, POST_TYPES.POLL, POST_TYPES.CARE, POST_TYPES.ADOPTION],
    supplier: [POST_TYPES.REGULAR, POST_TYPES.POLL, POST_TYPES.PRODUCT],
};

export const MIN_TITLE_LENGTH = 3;
export const MAX_TITLE_LENGTH = 100;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 5000;


export const POST_CATEGORIES = [
    'Veterinarian',
    'Grooming',
    'Pet Coach',
    'Pet Sitting',
    'Nutrition',
    'Accessories',
    'Play time',
    'Other',
];
