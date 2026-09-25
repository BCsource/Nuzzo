
import apiClient from './apiClient';

export async function registerUser(payload) {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
}

export async function loginUser(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
}

export async function getCurrentUser() {
    const { data } = await apiClient.get('/auth/me');
    return data;
}

export async function forgotPassword(email) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
}

export async function resetPassword(token, password) {
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data;
}
