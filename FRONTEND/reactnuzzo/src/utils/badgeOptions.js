
export const BADGES = {
    AFICIONADO: 'aficionado',
    HEALTH_PROFESSIONAL: 'healthProfessional',
    CARE_PROFESSIONAL: 'careProfessional',
    SUPPLIER: 'supplier',
};

export const BADGE_LABELS = {
    [BADGES.AFICIONADO]: 'Aficionado',
    [BADGES.HEALTH_PROFESSIONAL]: 'Health Profissional',
    [BADGES.CARE_PROFESSIONAL]: 'Care Profissional',
    [BADGES.SUPPLIER]: 'Supplier',
};

// Badges que precisam de ser pedidos
export const REQUESTABLE_BADGES = [
    BADGES.HEALTH_PROFESSIONAL,
    BADGES.CARE_PROFESSIONAL,
    BADGES.SUPPLIER,
];

// Badges que podem editar pet health history
export const HEALTH_HISTORY_WRITER_BADGES = [
    BADGES.HEALTH_PROFESSIONAL,
    BADGES.CARE_PROFESSIONAL,
];

// user types
export const USER_TYPES = {
    USER: 'user',
    ADMIN: 'admin',
    MASTER_ADMIN: 'masterAdmin',
};
