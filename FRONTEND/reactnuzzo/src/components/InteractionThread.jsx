import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Stack, Alert, CircularProgress, Paper, Avatar } from '@mui/material';
import { fetchInteractions, addInteraction } from '../services/interactionService';
import { authorLabel, formatDate } from '../utils/postDisplay';

function InteractionThread({ postId }) {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchInteractions(postId);
            setInteractions(data);
        } catch (error) {
            setError("Couldn't load comments.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { load(); }, [load]);

    async function handleSend() {
        const text = message.trim();
        if (!text) {
            setError("Text required.");
            return;
        }
        setError('');
        setSending(true);
        try {
            await addInteraction(postId, text);
            setMessage('');
            await load();
        } catch (error) {
            setError("Comment not sent.");
            console.error(error);
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Comments</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <TextField
                    label="Your comment"
                    placeholder="Write something..."
                    fullWidth
                    multiline
                    minRows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1.5 }}>
                    <Button variant="contained" disabled={sending} onClick={handleSend}>
                        {sending ? 'Sending' : 'Comment'}
                    </Button>
                </Stack>
            </Paper>

            {interactions.length === 0 ? (
                <Typography color="text.secondary">No comments yet.</Typography>
            ) : (
                <Stack spacing={1.5}>
                    {interactions.map((interaction) => (
                        <Paper key={interaction.id} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36 }}>
                                {authorLabel(interaction.author)[0]?.toUpperCase() ?? '?'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700 }}>{authorLabel(interaction.author)}</Typography>
                                <Typography variant="body2">{interaction.content}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(interaction.Hourdate, true)}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default InteractionThread;
