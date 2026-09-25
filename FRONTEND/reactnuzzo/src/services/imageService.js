import apiClient from './apiClient';

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post('/images', formData);
    return data.id;
}
