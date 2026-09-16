import apiClient from './apiClient';

// ---------- Perfil user ----------

export async function updateOwnProfile(userId, payload) {
    const { data } = await apiClient.put(`/users/${userId}`, payload);
    return data;
}

export async function deleteOwnAccount(userId) {
    await apiClient.delete(`/users/${userId}`);
}

// ---------- Pedido Badges ----------

export async function submitBadgeRequest(formData) {
    const { data } = await apiClient.post('/users/badge-requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

// ---------- Área Admin: Todos os Users ----------

export async function fetchAllUsers(params) {
    const { data } = await apiClient.get('/users', { params });
    return data;
}

export async function fetchPendingBadgeRequests() {
    const { data } = await apiClient.get('/users/badge-requests/pending');
    return data;
}

export async function reviewBadgeRequest(requestId, { approved, rejectReason }) {
    const { data } = await apiClient.patch(`/users/badge-requests/${requestId}`, {
        approved,
        rejectReason,
    });
    return data;
}

export async function promoteToAdmin(userId) {
    const { data } = await apiClient.patch(`/users/${userId}/promote-admin`);
    return data;
}

export async function removeUser(userId) {
    await apiClient.delete(`/users/${userId}`);
}
