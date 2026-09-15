import apiClient from './apiClient';

export async function fetchHealthHistory(petId) {
    const { data } = await apiClient.get(`/pets/${petId}/health-history`);
    return data;
}

export async function addHealthHistoryEntry(petId, content) {
    const { data } = await apiClient.post(`/pets/${petId}/health-history`, { content });
    return data;
}
