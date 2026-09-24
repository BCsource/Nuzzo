import apiClient from './apiClient';

// Autor do post-> todas as conversas
export async function fetchConversations(postId) {
    const { data } = await apiClient.get(`/posts/${postId}/messages`);
    return data;
}

// outro user -> conversa com autor
export async function fetchMyConversation(postId, userId) {
    const { data } = await apiClient.get(`/posts/${postId}/messages/${userId}`);
    return data;
}

// para distingir o autor do user que conversou
export async function sendMessage(postId, content, participantId) {
    const { data } = await apiClient.post(`/posts/${postId}/messages`, { content, participantId });
    return data;
}
