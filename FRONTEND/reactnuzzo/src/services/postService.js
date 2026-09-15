import apiClient from './apiClient';

export async function fetchPosts(params) {
    const { data } = await apiClient.get('/posts', { params });
    return data;
}

export async function fetchPostById(postId) {
    const { data } = await apiClient.get(`/posts/${postId}`);
    return data;
}

export async function fetchMyPosts() {
    const { data } = await apiClient.get('/posts/mine');
    return data;
}

export async function createPost(payload) {
    const { data } = await apiClient.post('/posts', payload);
    return data;
}

export async function updatePost(postId, payload) {
    const { data } = await apiClient.put(`/posts/${postId}`, payload);
    return data;
}

export async function deletePost(postId) {
    await apiClient.delete(`/posts/${postId}`);
}

export async function fetchFavoritePosts() {
    const { data } = await apiClient.get('/posts/favorites');
    return data;
}

export async function setFavoritePost(postId, shouldAdd) {
    if (shouldAdd) {
        await apiClient.post(`/posts/${postId}/favorite`);
    } else {
        await apiClient.delete(`/posts/${postId}/favorite`);
    }
}
