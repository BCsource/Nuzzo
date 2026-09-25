
import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Stack } from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import PetCardList from '../components/PetCardList';
import { fetchMyPets, deletePet } from '../services/petProfileService';
import { getErrorMessage } from '../utils/apiErrors';

function MyPets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const load = useCallback(async () => {
        try {
            const data = await fetchMyPets();
            setPets(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load your pets.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function confirmDelete() {
        const petId = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deletePet(petId);
            setPets((prev) => prev.filter((pet) => pet.id !== petId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not delete this pet.'));
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">My Pets</Typography>
                <Button component={RouterLink} to="/pets/new" variant="contained">Add Pet</Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : pets.length === 0 ? (
                <Typography color="text.secondary">You haven&apos;t added any pets yet.</Typography>
            ) : (
                <PetCardList pets={pets} onDelete={(petId) => setPendingDeleteId(petId)} />
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete this pet?"
                message="Its health history will be deleted too. This can't be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </Box>
    );
}

export default MyPets;
