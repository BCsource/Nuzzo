// Formulário partilhado entre "New Pet" e "Edit Pet"

import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SPECIES_OPTIONS, GENDER_OPTIONS, MIN_WEIGHT_KG, MAX_WEIGHT_KG } from '../utils/petOptions';
import ImageUploadField from './ImageUploadField';
import { useState } from 'react';

import {
    Box, Typography, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Alert, Stack, FormHelperText, Switch, FormControlLabel,
} from '@mui/material';

const EMPTY_PET = {
    name: '',
    bio: '',
    species: '',
    gender: '',
    breed: '',
    weight: '',
    isSpayed: false,
    isVaccinated: false,
    dateOfBirth: '',
};

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function PetProfileForm({ mode = 'create', defaultValues, submitting = false, serverError = '', onSubmit }) {
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState(defaultValues?.profilePicture || null);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ...EMPTY_PET,
            ...defaultValues,
            dateOfBirth: defaultValues?.dateOfBirth ? defaultValues.dateOfBirth.slice(0, 10) : ''
        }
    });

    function submit(data) {
        onSubmit({
            name: data.name.trim(),
            species: data.species,
            gender: data.gender,
            profilePicture: profilePicture,
            bio: data.bio.trim(),
            breed: data.breed.trim(),
            weight: Number(data.weight),
            isSpayed: !!data.isSpayed,
            isVaccinated: !!data.isVaccinated,
            dateOfBirth: data.dateOfBirth,
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} sx={{ maxWidth: 480, mx: 'auto' }} noValidate>
            <Typography variant="h4" gutterBottom>
                {mode === 'edit' ? 'Edit Pet' : 'New Pet'}
            </Typography>

            <Stack spacing={2}>
                <ImageUploadField
                    label="Pet photo"
                    value={profilePicture}
                    onChange={setProfilePicture}
                />

                <TextField
                    label="Name"
                    fullWidth
                    {...register('name', {
                        required: 'Your pet needs a name.',
                        minLength: { value: 2, message: "Your pet's name must be at least 2 characters long." },
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <Controller
                    name="species"
                    control={control}
                    rules={{ required: 'What species is it?' }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.species}>
                            <InputLabel id="species-label">Species</InputLabel>
                            <Select labelId="species-label" label="Species" {...field}>
                                {SPECIES_OPTIONS.map((species) => (
                                    <MenuItem key={species} value={species}>{species}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.species?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Choose your pet's gender." }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.gender}>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select labelId="gender-label" label="Gender" {...field}>
                                {GENDER_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.gender?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                <TextField
                    label="About your pet (optional)"
                    placeholder="Manias, historial, o que quiseres contar"
                    fullWidth
                    multiline
                    minRows={3}
                    {...register('bio', {
                        maxLength: { value: 2000, message: 'The bio is too long.' },
                    })}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                />

                <TextField
                    label="Breed"
                    fullWidth
                    {...register('breed', { required: "What's its breed?" })}
                    error={!!errors.breed}
                    helperText={errors.breed?.message}
                />

                <TextField
                    label="Weight (kg)"
                    type="number"
                    fullWidth
                    slotProps={{ htmlInput: { step: '0.01', min: MIN_WEIGHT_KG, max: MAX_WEIGHT_KG } }}
                    {...register('weight', {
                        required: "Set your pet's weight.",
                        min: { value: MIN_WEIGHT_KG, message: 'Weight must be greater than 0.' },
                        max: { value: MAX_WEIGHT_KG, message: 'Please check the value entered.' },
                    })}
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                />

                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayISO() } }}
                    {...register('dateOfBirth', {
                        required: 'Set the birth date.',
                        validate: (value) => new Date(value) <= new Date() || "Date can't be in the future.",
                    })}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                />

                <Controller
                    name="isSpayed"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                            label={`Spayed: ${field.value ? 'Yes' : 'No'}`}
                        />
                    )}
                />

                <Controller
                    name="isVaccinated"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                            label={`Vaccinated: ${field.value ? 'Yes' : 'No'}`}
                        />
                    )}
                />

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving…' : mode === 'edit' ? 'Update Pet info' : 'Save Pet info'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default PetProfileForm;

