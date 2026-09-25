import apiClient from './apiClient';

export async function fetchNotifications() {
    const { data } = await apiClient.get('/notifications');
    return data;
}

export async function markMessagesSeen() {
    await apiClient.put('/notifications/messages/seen');
}

export async function markCommentsSeen() {
    await apiClient.put('/notifications/comments/seen');
}
