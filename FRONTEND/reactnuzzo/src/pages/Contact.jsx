import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Alert, Stack, Paper,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { sendContactMessage } from '../services/contactService';
import { getErrorMessage } from '../utils/apiErrors';

const REASONS = [
    { value: 'question', label: 'A question' },
    { value: 'problem', label: 'A problem with the app' },
    { value: 'report', label: 'Report a user or a post' },
    { value: 'suggestion', label: 'A suggestion' },
    { value: 'other', label: 'Something else' },
];

function Contact() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [reason, setReason] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        // mesmas regras do backend, para o alerta aparecer logo.
        if (!subject.trim()) {
            setError('Write a subject.');
            return;
        }
        if (!reason) {
            setError('Choose a reason.');
            return;
        }
        if (!content.trim()) {
            setError('Write your message.');
            return;
        }

        setSubmitting(true);
        try {
            const data = await sendContactMessage({
                subject: subject.trim(),
                reason,
                content: content.trim(),
            });
            setSuccess(data.message);
            setSubject(''); setReason(''); setContent('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't send your message. Please try again later."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Contact us</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send a message to the Nuzzo admins. We answer to the email address on your account.
            </Typography>

            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Subject"
                            fullWidth
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="reason-label">Reason</InputLabel>
                            <Select
                                labelId="reason-label"
                                label="Reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                {REASONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            minRows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Stack direction="row" spacing={2}>
                            <Button type="submit" variant="contained" disabled={submitting}>
                                {submitting ? 'Sending…' : 'Send message'}
                            </Button>
                            <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default Contact;
