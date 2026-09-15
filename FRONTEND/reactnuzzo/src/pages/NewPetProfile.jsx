import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import PetProfileForm from '../components/PetProfileForm';
import { createPet } from '../services/petProfileService';

function NewPetProfile() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            const created = await createPet(payload);
            navigate(`/pets/${created.id}`);
        } catch (error) {
            setServerError("Couldn't save pet. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            {serverError && <Alert severity="error" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>{serverError}</Alert>}
            <PetProfileForm mode="create" submitting={submitting} onSubmit={handleSubmit} />
        </Box>
    );
}

export default NewPetProfile;
