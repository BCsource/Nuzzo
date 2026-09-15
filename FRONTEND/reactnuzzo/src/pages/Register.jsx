import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    EMAIL_PATTERN, NAME_MIN_LENGTH, NAME_MAX_LENGTH, validateAge, validatePasswordStrength,
} from '../utils/validators';

import {
    Box, Typography, TextField, Button, Alert, Stack,
    InputAdornment, IconButton, Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
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
            // Badge afficionado é default para novo user

            await registerUser({
                fName: data.fName.trim(),
                lName: data.lName.trim(),
                email: data.email,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
            });
            navigate('/');
        } catch (error) {
            if (error.response?.status === 400) {
                setServerError('Email already registered.');
            } else {
                setServerError("Couldn't create account. Please try again later.");
            }
            console.error('Register failed:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="nuzzo-auth"
            sx={{ maxWidth: 420, mx: 'auto', mt: 4, mb: 6 }}
            noValidate
        >
            <Typography variant="h4" gutterBottom>Create Account</Typography>

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
                    label="lName"
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
    );
}

export default Register;
