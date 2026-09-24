import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { updateProfile } from '../services/userService';
import { getErrorMessage } from '../utils/apiErrors';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, validateAge, validatePasswordStrength,
} from '../utils/validators';

import { Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';

function EditProfile() {
    const { currentUser, refreshUserData } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fName: currentUser?.fName || '',
            lName: currentUser?.lName || '',
            bio: currentUser?.bio || '',
            dateOfBirth: currentUser?.dateOfBirth?.slice(0, 10) || '',
            password: '',
            confirmPassword: '',
        },
    });

    const newPassword = watch('password', '');
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(data) {
        setServerError('');
        setSubmitting(true);
        try {
            const payload = {
                fName: data.fName.trim(),
                lName: data.lName.trim(),
                bio: data.bio.trim(),
                dateOfBirth: data.dateOfBirth,
            };
            // no caso do user quiser alterar pw
            if (data.password) {
                payload.password = data.password;
            }
            await updateProfile(currentUser.id, payload);
            await refreshUserData();
            navigate('/profile');
        } catch (error) {
            setServerError(getErrorMessage(error, "Couldn't save your changes. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 420, mx: 'auto', px: 2, py: 3 }} noValidate>
            <Typography variant="h4" gutterBottom>Edit Profile</Typography>

            <Stack spacing={2}>
                <TextField
                    label="First Name"
                    fullWidth
                    {...register('fName', { required: 'Required.', minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })}
                    error={!!errors.fName}
                    helperText={errors.fName?.message}
                />
                <TextField
                    label="Last Name"
                    fullWidth
                    {...register('lName', { required: 'Required.', minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH })}
                    error={!!errors.lName}
                    helperText={errors.lName?.message}
                />
                <TextField label="Bio" fullWidth multiline minRows={3} {...register('bio')} />
                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('dateOfBirth', { required: 'Required.', validate: validateAge })}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                />

                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    {...register('password', {
                        validate: (value) => !value || validatePasswordStrength(value),
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    {...register('confirmPassword', {
                        validate: (value) => value === newPassword || "Passwords don't match.",
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving…' : 'Update'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default EditProfile;
