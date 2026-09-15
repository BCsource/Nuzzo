
const TOKEN_KEY = 'nuzzo_token';
const EXPIRES_AT_KEY = 'nuzzo_token_expires_at';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutos

export function saveToken(token) {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + SESSION_DURATION_MS));
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getTokenExpiresAt() {
    const value = localStorage.getItem(EXPIRES_AT_KEY);
    return value ? Number(value) : null;
}

export function isTokenExpired() {
    const expiresAt = getTokenExpiresAt();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
}

export { SESSION_DURATION_MS };
