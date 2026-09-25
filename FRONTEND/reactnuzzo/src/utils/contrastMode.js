export function applyHighContrast(enabled) {
    if (enabled) {
        document.documentElement.setAttribute('data-contrast', 'high');
    } else {
        document.documentElement.removeAttribute('data-contrast');
    }
}
