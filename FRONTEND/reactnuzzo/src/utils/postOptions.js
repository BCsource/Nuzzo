//valores iguais aos schemas, apenas para aparecer logo no ui

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
