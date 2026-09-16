import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Button, CircularProgress, Alert, Stack,
    Card, CardContent, CardActions, Chip,
} from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchMyPets, deletePet } from '../services/petProfileService';

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
            setError("Couldn't load pets. Please try again.");
            console.error(error);
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
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch (error) {
            setError("Couldn't delete pet.");
            console.error(error);
        }
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 3 }}>
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
                <Typography color="text.secondary">No pets added.</Typography>
            ) : (
                <Stack spacing={2}>
                    {pets.map((pet) => (
                        <Card key={pet.id}>
                            <CardContent>
                                <Typography variant="h6">{pet.name}</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Chip label={pet.species} size="small" />
                                    <Chip label={pet.breed} size="small" variant="outlined" />
                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={RouterLink} to={`/pets/${pet.id}`}>Check</Button>
                                <Button size="small" component={RouterLink} to={`/pets/${pet.id}/edit`}>Edit</Button>
                                <Button size="small" color="error" onClick={() => setPendingDeleteId(pet.id)}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete pet?"
                message="This action cannot be undone. Do you want to proceed?"
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </Box>
    );
}

export default MyPets;
