import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPetById } from '../services/petProfileService';
import { HEALTH_HISTORY_WRITER_BADGES } from '../utils/badgeOptions';
import HealthHistoryList from '../components/HealthHistoryList';
import { formatDate } from '../utils/postDisplay';

import {
    Box, Typography, Chip, Stack, Card, CardContent, Button,
    CircularProgress, Alert, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

function ViewPetProfile() {
    const { petId } = useParams();
    const { currentUser, isAdmin, hasBadge } = useAuth();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchPetById(petId);
            setPet(data);
        } catch (error) {
            setError("Couldn't load pet.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => { load(); }, [load]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !pet) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'Pet not found.'}</Alert>
            </Box>
        );
    }

    const isOwner = !!(currentUser && pet.owner?.id === currentUser.id);
    const canWriteHealthHistory = isAdmin
        || HEALTH_HISTORY_WRITER_BADGES.some((badge) => hasBadge(badge));

    return (
        <Box sx={{ maxWidth: 560, mx: 'auto', mt: 2, px: 2, mb: 6 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h4" gutterBottom>{pet.name}</Typography>
                        {isOwner && (
                            <Button component={RouterLink} to={`/pets/${pet.id}/edit`} startIcon={<EditIcon />} size="small">
                                Edit
                            </Button>
                        )}
                    </Stack>

                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={pet.species} color="primary" />
                        <Chip label={pet.breed} variant="outlined" />
                        <Chip label={pet.spayed ? 'Spayed' : 'Not Spayed'} variant="outlined" />
                        <Chip label={pet.vacinated ? 'Vacinated' : 'Not vacinated'} variant="outlined" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary">Weight: {pet.weight} kg</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Date of Birth: {formatDate(pet.dateOfBirth)}
                    </Typography>
                </CardContent>
            </Card>

            {/* Histórico de Saúde: dono só visualiza; profissionais verificados e admin podem escrever. */}
            <HealthHistoryList petId={petId} canWrite={!isOwner && canWriteHealthHistory} />
        </Box>
    );
}

export default ViewPetProfile;
