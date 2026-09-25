
const STORAGE_KEY = 'nuzzo_high_contrast';

export function isHighContrast() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
}
export function applyHighContrast(enabled) {
    if (enabled) {
        document.documentElement.setAttribute('data-contrast', 'high');
    } else {
        document.documentElement.removeAttribute('data-contrast');
    }
    localStorage.setItem(STORAGE_KEY, String(enabled));
}
