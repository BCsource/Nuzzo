import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchPetById } from '../services/petProfileService';
import HealthHistoryList from '../components/HealthHistoryList';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';

import {
    Box, Typography, Chip, Stack, Card, CardContent, Button,
    CircularProgress, Alert, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

function ViewPetProfile() {
    const { petId } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchPetById(petId);
            setPet(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't load this pet."));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'Pet not found.'}</Alert>
            </Box>
        );
    }

    const { canEdit, canViewHealthHistory, canWriteHealthHistory } = pet.permissions;

    return (
        <Box sx={{ maxWidth: 560, mx: 'auto', mt: 2, px: 2, mb: 6 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="go back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h4" gutterBottom>{pet.name}</Typography>
                        {canEdit && (
                            <Button component={RouterLink} to={`/pets/${pet.id}/edit`} startIcon={<EditIcon />} size="small">
                                Edit
                            </Button>
                        )}
                    </Stack>

                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={pet.species} color="primary" />
                        <Chip label={pet.breed} variant="outlined" />
                        <Chip label={pet.isSpayed ? 'Spayed' : 'Not spayed'} variant="outlined" />
                        <Chip label={pet.isVaccinated ? 'Vaccinated' : 'Not vaccinated'} variant="outlined" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary">Weight: {pet.weight} kg</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Date of birth: {formatDate(pet.dateOfBirth)}
                    </Typography>
                    {pet.owner?.fName && (
                        <Typography variant="body2" color="text.secondary">
                            Owner: {pet.owner.fName} {pet.owner.lName}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {canViewHealthHistory && (
                <HealthHistoryList petId={pet.id} canWrite={canWriteHealthHistory} />
            )}
        </Box>
    );
}

export default ViewPetProfile;
