
import { useState } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Stack, Link } from '@mui/material';
import logo from '../assets/img/Final Logo.png';
import { resetPassword } from '../services/authService';
import { getErrorMessage } from '../utils/apiErrors';
import { validatePasswordStrength } from '../utils/validators';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        const passwordError = validatePasswordStrength(password);
        if (passwordError !== true) {
            setError(passwordError);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setSubmitting(true);
        try {
            const data = await resetPassword(token, password);
            setSuccess(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (submitError) {
            setError(getErrorMessage(submitError, "Couldn't update your password. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box className="nz-auth-screen">
            <Box className="nz-auth-brand">
                <img src={logo} alt="Nuzzo — Animal Hub" className="nz-auth-logo" />
            </Box>

            <Box component="form" onSubmit={handleSubmit} className="nuzzo-auth nz-auth-card" noValidate>
                <Typography variant="h4" gutterBottom>Choose a new password</Typography>

                {!token ? (
                    <Alert severity="error">
                        This link is missing its code. Please ask for a new one on the{' '}
                        <Link component={RouterLink} to="/forgot-password">forgot password</Link> page.
                    </Alert>
                ) : (
                    <Stack spacing={2}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? 'Saving…' : 'Update password'}
                        </Button>

                        <Typography variant="body2" align="center">
                            <Link component={RouterLink} to="/login">Back to log in</Link>
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Box>
    );
}

export default ResetPassword;
