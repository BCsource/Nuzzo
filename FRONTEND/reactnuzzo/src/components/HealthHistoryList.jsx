/* Pet health history -> appendix to pet Profile
Pet owner can read their pet history
health and care professional can read and edit on pet history -- canWrite--
admin access */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Stack, Alert, CircularProgress, Paper } from '@mui/material';
import { fetchHealthHistory, addHealthHistoryEntry } from '../services/healthHistoryService';
import { formatDate, authorLabel } from '../utils/postDisplay';
import { getErrorMessage } from '../utils/apiErrors';

function HealthHistoryList({ petId, canWrite }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchHealthHistory(petId);
            setEntries(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't download health history."));
        } finally {
            setLoading(false);
        }
    }, [petId]);


    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function handleAdd() {
        const text = content.trim();
        if (!text) {
            setError("Entry cannot be empty.");
            return;
        }
        setError('');
        setSending(true);
        try {
            await addHealthHistoryEntry(petId, text);
            setContent('');
            await load();
        } catch (error) {
            setError(getErrorMessage("Couldn't save entry."));
            console.error(error);
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Health History:</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {canWrite && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <TextField
                        label="New entry"
                        fullWidth
                        multiline
                        minRows={2}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1.5 }}>
                        <Button variant="contained" disabled={sending} onClick={handleAdd}>
                            {sending ? 'Saving…' : 'Add entry'}
                        </Button>
                    </Stack>
                </Paper>
            )}

            {entries.length === 0 ? (
                <Typography color="text.secondary">No entries yet.</Typography>
            ) : (
                <Stack spacing={1.5}>
                    {entries.map((entry) => (
                        <Paper key={entry.id} variant="outlined" sx={{ p: 1.5 }}>
                            <Typography variant="body2">{entry.content}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {authorLabel(entry.author)} • {formatDate(entry.createdAt, true)}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default HealthHistoryList;
