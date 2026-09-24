import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PetProfileForm from '../components/PetProfileForm';
import { createPet } from '../services/petProfileService';
import { getErrorMessage } from '../utils/apiErrors';

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
            setServerError(getErrorMessage(error, "Couldn't save your pet. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            <PetProfileForm mode="create" submitting={submitting} serverError={serverError} onSubmit={handleSubmit} />
        </Box>
    );
}

export default NewPetProfile;
