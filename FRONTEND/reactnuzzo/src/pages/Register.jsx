
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    EMAIL_PATTERN, NAME_MIN_LENGTH, NAME_MAX_LENGTH, validateAge, validatePasswordStrength,
} from '../utils/validators';

import {
    Box, Typography, TextField, Button, Alert, Stack,
    InputAdornment, IconButton, Link, Checkbox, FormControlLabel, FormHelperText,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../assets/img/Final Logo.png';
import { getErrorMessage } from '../utils/apiErrors';

function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            acceptTerms: false,
            acceptPrivacy: false,
            fName: '',
            lName: '',
            email: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: '',
        },
    });

    const password = watch('password', '');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(data) {
        setServerError('');
        setLoading(true);
        try {
            // badge aficionado default na criação de user
            await registerUser({
                fName: data.fName.trim(),
                lName: data.lName.trim(),
                email: data.email,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
            });
            navigate('/');
        } catch (error) {
            setServerError(getErrorMessage(error, "Couldn't create account. Please try again later."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box className="nz-auth-screen">
            <Box className="nz-auth-brand">
                <img src={logo} alt="Nuzzo — Animal Hub" className="nz-auth-logo" />
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                className="nuzzo-auth nz-auth-card"
                noValidate
            >
                <Typography variant="h4" gutterBottom>Create an Account</Typography>

                <Stack spacing={2}>
                    <TextField
                        label="First Name"
                        fullWidth
                        {...register('fName', {
                            required: 'Given Name required',
                            minLength: NAME_MIN_LENGTH,
                            maxLength: NAME_MAX_LENGTH,
                        })}
                        error={!!errors.fName}
                        helperText={errors.fName?.message}
                    />

                    <TextField
                        label="Last Name"
                        fullWidth
                        {...register('lName', {
                            required: 'Family Name required',
                            minLength: NAME_MIN_LENGTH,
                            maxLength: NAME_MAX_LENGTH,
                        })}
                        error={!!errors.lName}
                        helperText={errors.lName?.message}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register('email', { required: 'Write a valid email address', pattern: EMAIL_PATTERN })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        {...register('password', {
                            required: 'Set a password.',
                            validate: validatePasswordStrength,
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="show/hide password">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        {...register('confirmPassword', {
                            required: 'Confirm your password.',
                            validate: (value) => value === password || "Passwords don't match.",
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />

                    <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        {...register('dateOfBirth', {
                            required: 'Set your Birth Date',
                            validate: validateAge,
                        })}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                    />

                    <Controller
                        name="acceptTerms"
                        control={control}
                        rules={{ required: 'You must accept the Terms of Service.' }}
                        render={({ field }) => (
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                                    label={
                                        <Typography variant="body2">
                                            I accept the{' '}
                                            <Link component={RouterLink} to="/terms" target="_blank" rel="noreferrer">
                                                Terms of Service.
                                            </Link>
                                        </Typography>
                                    }
                                />
                                {errors.acceptTerms && <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>}
                            </Box>
                        )}
                    />

                    <Controller
                        name="acceptPrivacy"
                        control={control}
                        rules={{ required: 'You must accept the Privacy Policy.' }}
                        render={({ field }) => (
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                                    label={
                                        <Typography variant="body2">
                                            I accept the{' '}
                                            <Link component={RouterLink} to="/privacy" target="_blank" rel="noreferrer">
                                                Privacy Policy.
                                            </Link>
                                        </Typography>
                                    }
                                />
                                {errors.acceptPrivacy && <FormHelperText error>{errors.acceptPrivacy.message}</FormHelperText>}
                            </Box>
                        )}
                    />

                    {serverError && <Alert severity="error">{serverError}</Alert>}

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </Button>

                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login">Sign in</Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}

export default Register;