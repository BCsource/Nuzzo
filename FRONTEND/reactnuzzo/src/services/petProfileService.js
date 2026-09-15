import apiClient from './apiClient';

export async function fetchMyPets() {
    const { data } = await apiClient.get('/pets/mine');
    return data;
}

export async function fetchPetById(petId) {
    const { data } = await apiClient.get(`/pets/${petId}`);
    return data;
}

export async function createPet(payload) {
    const { data } = await apiClient.post('/pets', payload);
    return data;
}

export async function updatePet(petId, payload) {
    const { data } = await apiClient.put(`/pets/${petId}`, payload);
    return data;
}

export async function deletePet(petId) {
    await apiClient.delete(`/pets/${petId}`);
}

export async function requestOwnershipTransfer(petId, emailReceiver) {
    const { data } = await apiClient.post(`/pets/${petId}/transfer-requests`, { emailReceiver });
    return data;
}
