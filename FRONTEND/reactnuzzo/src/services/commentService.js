
import apiClient from './apiClient';

export async function fetchComments(postId) {
    const { data } = await apiClient.get(`/posts/${postId}/comments`);
    return data;
}

export async function addComment(postId, content) {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, { content });
    return data;
}

export async function updateComment(postId, commentId, content) {
    const { data } = await apiClient.put(`/posts/${postId}/comments/${commentId}`, { content });
    return data;
}

export async function deleteComment(postId, commentId) {
    await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
}
