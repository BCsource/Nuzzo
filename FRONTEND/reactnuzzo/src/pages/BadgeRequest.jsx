import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitBadgeRequest } from '../services/userService';
import { REQUESTABLE_BADGES, BADGE_LABELS } from '../utils/badgeOptions';

import {
    Box, Typography, TextField, Button, Alert, Stack, FormGroup,
    FormControlLabel, Checkbox, FormHelperText, Input,
} from '@mui/material';

function BadgeRequest() {
    const navigate = useNavigate();
    const [selectedBadges, setSelectedBadges] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    function toggleBadge(badge) {
        setSelectedBadges((prev) =>
            prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (selectedBadges.length === 0) {
            setError('Choose at least one Badge,');
            return;
        }
        if (!message.trim()) {
            setError('Please explain briefly your request.');
            return;
        }
        if (!file) {
            setError('Add a certificate or credential.');
            return;
        }

        const formData = new FormData();
        selectedBadges.forEach((b) => formData.append('requestedBadges[]', b));
        formData.append('message', message.trim());
        formData.append('file', file);

        setSubmitting(true);
        try {
            await submitBadgeRequest(formData);
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            setError("Couldn't submit request. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 460, mx: 'auto', px: 2, py: 3 }} noValidate>
            <Typography variant="h4" gutterBottom>Badge Request</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your request will remain pending until an Admin reviews it.
            </Typography>

            <Stack spacing={2}>
                <FormGroup>
                    {REQUESTABLE_BADGES.map((badge) => (
                        <FormControlLabel
                            key={badge}
                            control={
                                <Checkbox
                                    checked={selectedBadges.includes(badge)}
                                    onChange={() => toggleBadge(badge)}
                                />
                            }
                            label={BADGE_LABELS[badge]}
                        />
                    ))}
                </FormGroup>

                <TextField
                    label="Message"
                    placeholder="Give us some context about your request (ex. experience)."
                    fullWidth
                    multiline
                    minRows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>Certificate/Credential</Typography>
                    <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} fullWidth />
                    <FormHelperText>PDF or image file that verifies your Badge request.</FormHelperText>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">Request sent! We will notify you when reviewed.</Alert>}

                <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Submit Request'}
                </Button>
            </Stack>
        </Box>
    );
}

export default BadgeRequest;
