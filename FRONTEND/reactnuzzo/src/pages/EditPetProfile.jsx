import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import PetProfileForm from '../components/PetProfileForm';
import { fetchPetById, updatePet } from '../services/petProfileService';
import { getErrorMessage } from '../utils/apiErrors';

function EditPetProfile() {
    const { petId } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        fetchPetById(petId)
            .then((data) => setPet(data))
            .catch((error) => setServerError(getErrorMessage(error, "Couldn't load this pet.")))
            .finally(() => setLoading(false));
    }, [petId]);

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            await updatePet(petId, payload);
            navigate(`/pets/${petId}`);
        } catch (error) {
            setServerError(getErrorMessage(error, "Couldn't update this pet. Please try again."));
        } finally {
            setSubmitting(false);
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
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
                <Alert severity="error">{serverError || 'Pet not found.'}</Alert>
            </Box>
        );
    }

    if (!pet.permissions.canEdit) {
        return (
            <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
                <Alert severity="warning">You can only edit your own pets.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            <PetProfileForm mode="edit" defaultValues={pet} submitting={submitting} serverError={serverError} onSubmit={handleSubmit} />
        </Box>
    );
}

export default EditPetProfile;
