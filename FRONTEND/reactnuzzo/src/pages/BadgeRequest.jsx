
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitBadgeRequest } from '../services/userService';
import { REQUESTABLE_BADGES, BADGE_LABELS } from '../utils/badgeOptions';
import { getErrorMessage } from '../utils/apiErrors';

import {
    Box, Typography, TextField, Button, Alert, Stack, FormGroup,
    FormControlLabel, Checkbox,
} from '@mui/material';

function BadgeRequest() {
    const navigate = useNavigate();
    const [requestedBadges, setRequestedBadges] = useState([]);
    const [message, setMessage] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function toggleBadge(badge) {
        setRequestedBadges((prev) =>
            prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (requestedBadges.length === 0) {
            setError('Choose at least one badge.');
            return;
        }
        if (!message.trim()) {
            setError('Tell us about your experience.');
            return;
        }
        // As mesmas regras do backend, para o alerta aparecer logo
        if (!certificate) {
            setError('Upload your certificate (PDF or image).');
            return;
        }
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(certificate.type)) {
            setError('The certificate must be a PDF, JPG or PNG file.');
            return;
        }
        if (certificate.size > 2 * 1024 * 1024) {
            setError('The certificate must be smaller than 2 MB.');
            return;
        }

        setSubmitting(true);
        try {
            // Com um ficheiro o pedido vai como form-data em vez de JSON
            const formData = new FormData();
            requestedBadges.forEach((badge) => formData.append('requestedBadges', badge));
            formData.append('message', message.trim());
            formData.append('certificate', certificate);

            const data = await submitBadgeRequest(formData);
            setSuccess(data.message);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (submitError) {
            setError(getErrorMessage(submitError, "Couldn't submit your request. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 460, mx: 'auto', px: 2, py: 3 }} noValidate>
            <Typography variant="h4" gutterBottom>Request Badges</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your request stays pending until an admin reviews it.
            </Typography>

            <Stack spacing={2}>
                <FormGroup>
                    {REQUESTABLE_BADGES.map((badge) => (
                        <FormControlLabel
                            key={badge}
                            control={<Checkbox checked={requestedBadges.includes(badge)} onChange={() => toggleBadge(badge)} />}
                            label={BADGE_LABELS[badge]}
                        />
                    ))}
                </FormGroup>

                <TextField
                    label="Message"
                    placeholder="Tell us about your experience or speciality"
                    fullWidth
                    multiline
                    minRows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Box>
                    <Button variant="outlined" component="label">
                        {certificate ? 'Choose another file' : 'Upload certificate'}
                        <input
                            type="file"
                            hidden
                            accept="application/pdf,image/jpeg,image/png"
                            onChange={(e) => setCertificate(e.target.files[0] || null)}
                        />
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {certificate ? certificate.name : 'PDF, JPG or PNG, up to 2 MB.'}
                    </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Submit Request'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default BadgeRequest;
