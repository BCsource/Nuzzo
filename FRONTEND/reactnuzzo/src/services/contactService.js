import apiClient from './apiClient';


export async function sendContactMessage(payload) {
    const { data } = await apiClient.post('/contact', payload);
    return data;
}

// admin
export async function fetchPendingContactMessages() {
    const { data } = await apiClient.get('/contact/pending');
    return data;
}

export async function markContactHandled(messageId) {
    const { data } = await apiClient.put(`/contact/${messageId}/handled`);
    return data;
}
