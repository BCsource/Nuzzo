import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import PetProfileForm from '../components/PetProfileForm';
import { fetchPetById, updatePet } from '../services/petProfileService';

function EditPetProfile() {
    const { petId } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchPetById(petId);
                setPet(data);
            } catch (error) {
                setServerError("Couldn't load pet.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [petId]);

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            await updatePet(petId, payload);
            navigate(`/pets/${petId}`);
        } catch (error) {
            setServerError("Couldnt't update pet. Please try again.");
            console.error(error);
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

    return (
        <Box sx={{ px: 2, py: 3 }}>
            {serverError && <Alert severity="error" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>{serverError}</Alert>}
            <PetProfileForm mode="edit" defaultValues={pet} submitting={submitting} onSubmit={handleSubmit} />
        </Box>
    );
}

export default EditPetProfile;
