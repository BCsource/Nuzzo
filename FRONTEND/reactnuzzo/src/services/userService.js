
import apiClient from './apiClient';

// perfil user 

export async function fetchUserById(userId) {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
}

export async function updateProfile(userId, payload) {
    const { data } = await apiClient.put(`/users/${userId}`, payload);
    return data;
}

// softdelete-> a conta fica desativada, não é apagada
export async function disableAccount(userId) {
    const { data } = await apiClient.put(`/users/${userId}/disable`);
    return data;
}

// admin
export async function reactivateAccount(userId) {
    const { data } = await apiClient.put(`/users/${userId}/reactivate`);
    return data;
}

// pedido Badges

export async function submitBadgeRequest(formData) {
    const { data } = await apiClient.post('/users/badge-requests', formData);
    return data;
}

// admin
export async function fetchCertificate(requestId) {
    const response = await apiClient.get(`/users/badge-requests/${requestId}/certificate`, {
        responseType: 'blob',
    });
    return response.data;
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

// perfil publico
export async function fetchUserPosts(userId) {
    const { data } = await apiClient.get(`/users/${userId}/posts`);
    return data;
}

export async function fetchUserPets(userId) {
    const { data } = await apiClient.get(`/users/${userId}/pets`);
    return data;
}

export async function updatePreferences(preferences) {
    const { data } = await apiClient.put('/users/preferences', preferences);
    return data;
}

export async function fetchMyBadgeRequests() {
    const { data } = await apiClient.get('/users/badge-requests/mine');
    return data;
}

export async function markBadgeRequestSeen(requestId) {
    const { data } = await apiClient.put(`/users/badge-requests/${requestId}/seen`);
    return data;
}
