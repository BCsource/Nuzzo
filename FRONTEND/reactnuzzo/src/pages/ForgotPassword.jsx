
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Stack, Link } from '@mui/material';
import logo from '../assets/img/Final Logo.png';
import { forgotPassword } from '../services/authService';
import { getErrorMessage } from '../utils/apiErrors';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setSubmitting(true);
        try {
            const data = await forgotPassword(email.trim());
            setSuccess(data.message);
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't send the email. Please try again later."));
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
                <Typography variant="h4" gutterBottom>Forgot your password?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Type your email and we&apos;ll send you a link to choose a new password.
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Send link'}
                    </Button>

                    <Typography variant="body2" align="center">
                        <Link component={RouterLink} to="/login">Back to log in</Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}

export default ForgotPassword;
