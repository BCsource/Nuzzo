
import apiClient from './apiClient';

// params-> os filtros já traduzidos pelo buildPostQuery
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

export async function updatePost(postId, { title, description }) {
    const { data } = await apiClient.put(`/posts/${postId}`, { title, description });
    return data;
}

export async function deletePost(postId) {
    await apiClient.delete(`/posts/${postId}`);
}

// favs

export async function fetchFavouritePosts() {
    const { data } = await apiClient.get('/posts/favourites');
    return data;
}

export async function addFavourite(postId) {
    await apiClient.post(`/posts/${postId}/favourite`);
}

export async function removeFavourite(postId) {
    await apiClient.delete(`/posts/${postId}/favourite`);
}
