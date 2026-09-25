
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchPetById, addPetFavourite, removePetFavourite } from '../services/petProfileService';
import HealthHistoryList from '../components/HealthHistoryList';
import ProfileHeader from '../components/ProfileHeader';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';
import { GENDER_LABELS } from '../utils/petOptions';

import {
    Box, Typography, Chip, Button, CircularProgress, Alert, IconButton, Paper, Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


//se idd inferior a 1y, mostra meses

function petAge(dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        years--;
    }
    if (years >= 1) {
        return years === 1 ? '1 year' : `${years} years`;
    }
    const months = Math.max(0, years * 12 + monthDiff);
    return months === 1 ? '1 month' : `${months} months`;
}

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

    async function toggleFavourite() {
        try {
            if (pet.isFavourite) {
                await removePetFavourite(pet.id);
            } else {
                await addPetFavourite(pet.id);
            }
            setPet((previous) => ({
                ...previous,
                isFavourite: !previous.isFavourite,
                favouritesCount: previous.isFavourite
                    ? previous.favouritesCount - 1
                    : previous.favouritesCount + 1,
            }));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not update your favourites.'));
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'Pet not found.'}</Alert>
            </Box>
        );
    }

    const { canEdit, canViewHealthHistory, canWriteHealthHistory } = pet.permissions;

    const chips = [
        <Chip key="species" label={pet.species} className="nz-chip nz-chip--species" />,
        <Chip key="breed" label={pet.breed} variant="outlined" className="nz-chip nz-chip--category" />,
        <Chip key="gender" label={GENDER_LABELS[pet.gender] || pet.gender} className={`nz-chip nz-chip--${pet.gender}`} />,
        <Chip key="spayed" label={pet.isSpayed ? 'Spayed' : 'Not spayed'} variant="outlined" className="nz-chip nz-chip--category" />,
        <Chip key="vaccinated" label={pet.isVaccinated ? 'Vaccinated' : 'Not vaccinated'} className={`nz-chip ${pet.isVaccinated ? 'nz-chip--approved' : 'nz-chip--pending'}`} />,
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 3 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="go back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            <ProfileHeader
                subject={pet}
                title={pet.name}
                subtitle={
                    pet.owner && pet.owner.fName
                        ? <>Owned by <Link component={RouterLink} to={`/users/${pet.owner.id}`}>{pet.owner.fName} {pet.owner.lName}</Link></>
                        : null
                }
                chips={chips}
                facts={[
                    { label: 'Age', value: petAge(pet.dateOfBirth) },
                    { label: 'Weight', value: `${pet.weight} kg` },
                    { label: 'Date of birth', value: formatDate(pet.dateOfBirth) },
                ]}
                actions={[
                    ...(pet.isOwner ? [] : [
                        <Button
                            key="favourite"
                            variant="outlined"
                            startIcon={pet.isFavourite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            onClick={toggleFavourite}
                        >
                            {pet.isFavourite ? 'Saved' : 'Save'} ({pet.favouritesCount ?? 0})
                        </Button>,
                    ]),
                    ...(canEdit ? [
                        <Button key="edit" variant="contained" startIcon={<EditIcon />} component={RouterLink} to={`/pets/${pet.id}/edit`}>
                            Edit
                        </Button>,
                    ] : []),
                ]}
            />

            {pet.bio && (
                <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>About {pet.name}</Typography>
                    <Typography variant="body1" className="nz-user-text">{pet.bio}</Typography>
                </Paper>
            )}

            {canViewHealthHistory && (
                <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                    <HealthHistoryList petId={pet.id} canWrite={canWriteHealthHistory} />
                </Paper>
            )}
        </Box>
    );
}

export default ViewPetProfile;
