import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Stack, Link } from '@mui/material';
import logo from '../assets/img/Final Logo.png';
import { requestActivation } from '../services/activationService';
import { getErrorMessage } from '../utils/apiErrors';

function RequestActivation() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
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
            const data = await requestActivation(email.trim(), message.trim());
            setSuccess(data.message);
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't send your request. Please try again later."));
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
                <Typography variant="h4" gutterBottom>Activate my account</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Can&apos;t log in? Leave your email and an admin will get back to you.
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Message (optional)"
                        placeholder="Tell us what happened"
                        fullWidth
                        multiline
                        minRows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Send request'}
                    </Button>

                    <Typography variant="body2" align="center">
                        <Link component={RouterLink} to="/login">Back to log in</Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}

export default RequestActivation;
