//apenas para ser visivel no ui, regras e permissoes do lado do be

export const BADGES = {
    AFICIONADO: 'aficionado',
    HEALTH_PROFESSIONAL: 'healthProfessional',
    CARE_PROFESSIONAL: 'careProfessional',
    SUPPLIER: 'supplier',
};

export const BADGE_LABELS = {
    [BADGES.AFICIONADO]: 'Aficionado',
    [BADGES.HEALTH_PROFESSIONAL]: 'Health Professional',
    [BADGES.CARE_PROFESSIONAL]: 'Care Professional',
    [BADGES.SUPPLIER]: 'Supplier',
};

export const BADGE_IMAGES = {
    [BADGES.AFICIONADO]: '/badges/aficionado.png',
    [BADGES.HEALTH_PROFESSIONAL]: '/badges/health-professional.png',
    [BADGES.CARE_PROFESSIONAL]: '/badges/care-professional.png',
    [BADGES.SUPPLIER]: '/badges/supplier.png',
};

export const BADGE_COLORS = {
    [BADGES.AFICIONADO]: 'aficionado',
    [BADGES.HEALTH_PROFESSIONAL]: 'health',
    [BADGES.CARE_PROFESSIONAL]: 'care',
    [BADGES.SUPPLIER]: 'supplier',
};

export const REQUESTABLE_BADGES = [
    BADGES.HEALTH_PROFESSIONAL,
    BADGES.CARE_PROFESSIONAL,
    BADGES.SUPPLIER,
];
