
import apiClient from './apiClient';

export async function requestActivation(email, message) {
    const { data } = await apiClient.post('/activation-requests', { email, message });
    return data;
}

// admin
export async function fetchPendingActivationRequests() {
    const { data } = await apiClient.get('/activation-requests/pending');
    return data;
}

export async function markActivationHandled(requestId) {
    const { data } = await apiClient.put(`/activation-requests/${requestId}/handled`);
    return data;
}
