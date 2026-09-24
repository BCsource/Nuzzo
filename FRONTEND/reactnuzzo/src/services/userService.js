import apiClient from './apiClient';

// Perfil user 

export async function fetchUserById(userId) {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
}

export async function updateProfile(userId, payload) {
    const { data } = await apiClient.put(`/users/${userId}`, payload);
    return data;
}

// Soft delete-> a conta fica desativada, não é apagada
export async function disableAccount(userId) {
    const { data } = await apiClient.put(`/users/${userId}/disable`);
    return data;
}

// Só admin
export async function reactivateAccount(userId) {
    const { data } = await apiClient.put(`/users/${userId}/reactivate`);
    return data;
}

// Pedido Badges

export async function submitBadgeRequest(payload) {
    const { data } = await apiClient.post('/users/badge-requests', payload);
    return data;
}

// area Admin-> all users 

export async function fetchAllUsers(params) {
    const { data } = await apiClient.get('/users', { params });
    return data;
}

export async function fetchPendingBadgeRequests() {
    const { data } = await apiClient.get('/users/badge-requests/pending');
    return data;
}

export async function reviewBadgeRequest(requestId, approved, rejectReason) {
    const { data } = await apiClient.put(`/users/badge-requests/${requestId}`, { approved, rejectReason });
    return data;
}

export async function promoteToAdmin(userId) {
    const { data } = await apiClient.put(`/users/${userId}/promote-admin`);
    return data;
}