import apiClient from './apiClient';

export async function fetchInteractions(postId) {
    const { data } = await apiClient.get(`/posts/${postId}/interactions`);
    return data;
}

export async function addInteraction(postId, content) {
    const { data } = await apiClient.post(`/posts/${postId}/interactions`, { content });
    return data;
}
