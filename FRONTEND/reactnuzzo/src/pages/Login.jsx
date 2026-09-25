import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import {
    Box, Typography, TextField, Button, Alert, Stack,
    InputAdornment, IconButton, Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../assets/img/Final Logo.png';
import { getErrorMessage } from '../utils/apiErrors';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: { email: '', password: '' } });

    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(data) {
        setServerError('');
        setLoading(true);
        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (error) {
            setServerError(getErrorMessage(error, "Couldn't log in. Please try again later."));
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
                <Typography variant="h4" gutterBottom>Log in</Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register('email', { required: 'Insert email address' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        {...register('password', { required: 'Write your password' })}
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

                    {serverError && <Alert severity="error">{serverError}</Alert>}

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Logging in…' : 'Log in'}
                    </Button>

                    <Typography variant="body2" align="center">
                        Not registered?{' '}
                        <Link component={RouterLink} to="/register">Register</Link>
                    </Typography>

                    <Typography variant="body2" align="center">
                        Can&apos;t log in?{' '}
                        <Link component={RouterLink} to="/request-activation">Request account activation</Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}

export default Login;