import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateOwnProfile } from '../services/userService';
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, validateAge } from '../utils/validators';

import { Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';

function EditProfile() {
    const { currentUser, refreshUserData } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fName: currentUser?.fName || '',
            lName: currentUser?.lname || '',
            bio: currentUser?.bio || '',
            dateOfBirth: currentUser?.dateOfBirth?.slice(0, 10) || '',
        },
    });

    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(data) {
        setServerError('');
        setSubmitting(true);
        try {
            await updateOwnProfile(currentUser.id, {
                fName: data.fName.trim(),
                lName: data.lName.trim(),
                bio: data.bio.trim(),
                dateOfBirth: data.dateOfBirth,
            });
            await refreshUserData();
            navigate('/profile');
        } catch (error) {
            setServerError("Couldn't save changes. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 420, mx: 'auto', px: 2, py: 3 }} noValidate>
            <Typography variant="h4" gutterBottom>Update Profile</Typography>

            <Stack spacing={2}>
                <TextField
                    label="First name"
                    fullWidth
                    {...register('fName', { required: 'Required.', minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })}
                    error={!!errors.fName}
                    helperText={errors.fName?.message}
                />
                <TextField
                    label="Last name"
                    fullWidth
                    {...register('lName', { required: 'Required.', minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })}
                    error={!!errors.lName}
                    helperText={errors.lName?.message}
                />
                <TextField
                    label="Bio"
                    fullWidth
                    multiline
                    minRows={3}
                    {...register('bio')}
                />
                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('dateOfBirth', { required: 'Required.', validate: validateAge })}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                />

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving …' : 'Update'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default EditProfile;
