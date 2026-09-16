// Formulário partilhado entre "New Pet" e "Edit Pet" (mesmo espírito do PostForm).

import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SPECIES_OPTIONS, MIN_WEIGHT_KG, MAX_WEIGHT_KG } from '../utils/petOptions';

import {
    Box, Typography, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Alert, Stack, FormHelperText, Switch, FormControlLabel,
} from '@mui/material';

const EMPTY_PET = {
    name: '',
    species: '',
    breed: '',
    weight: '',
    spayed: false,
    vaccinated: false,
    dateOfBirth: '',
};

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function PetProfileForm({ mode = 'create', defaultValues, submitting = false, serverError = '', onSubmit }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues: { ...EMPTY_PET, ...defaultValues } });

    function submit(data) {
        onSubmit({
            name: data.name.trim(),
            species: data.species,
            breed: data.breed.trim(),
            weight: Number(data.weight),
            spayed: !!data.spayed,
            vaccinated: !!data.vaccinated,
            dateOfBirth: data.dateOfBirth,
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} sx={{ maxWidth: 480, mx: 'auto' }} noValidate>
            <Typography variant="h4" gutterBottom>
                {mode === 'edit' ? 'Edit Pet' : 'New Pet'}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Name"
                    fullWidth
                    {...register('name', { required: 'Your pet needs a name.' })}
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
                    name="spayed"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                            label={`Spayed: ${field.value ? 'Yes' : 'No'}`}
                        />
                    )}
                />

                <Controller
                    name="vaccinated"
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
                        {submitting ? 'Saving…' : mode === 'edit' ? 'Update Pet' : 'Save Pet'}
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
