
import apiClient from './apiClient';

// inbox
export async function fetchMyConversations() {
    const { data } = await apiClient.get('/conversations');
    return data;
}
export async function fetchConversation(postId, participantId) {
    const { data } = await apiClient.get(`/posts/${postId}/messages/${participantId}`);
    return data;
}

export async function sendMessage(postId, content, participantId) {
    const { data } = await apiClient.post(`/posts/${postId}/messages`, { content, participantId });
    return data;
}
