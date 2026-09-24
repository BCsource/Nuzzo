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

export const REQUESTABLE_BADGES = [
    BADGES.HEALTH_PROFESSIONAL,
    BADGES.CARE_PROFESSIONAL,
    BADGES.SUPPLIER,
];
