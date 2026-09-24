//DMs sobre posts. o autor do post vê as dms enviadas a ele, outro user vê as dms que teve com o autor e pode escrever-lhe.


import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, TextField, Button, Stack, Alert, CircularProgress,
    Paper, List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import { fetchConversations, fetchMyConversation, sendMessage } from '../services/messageService';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';


function MessageBubble({ message }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: message.isMine ? 'flex-end' : 'flex-start' }}>
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    bgcolor: message.isMine ? 'var(--nz-brand-tint)' : 'transparent',
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    {message.isMine ? 'You' : `${message.sender.fName} ${message.sender.lName}`}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatDate(message.createdAt, true)}
                </Typography>
            </Paper>
        </Box>
    );
}


function MessageForm({ onSend, placeholder }) {
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    async function handleSend() {
        if (!content.trim()) {
            setError('Write something before sending.');
            return;
        }
        setError('');
        setSending(true);
        try {
            await onSend(content.trim());
            setContent('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not send your message.'));
        } finally {
            setSending(false);
        }
    }

    return (
        <Box sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
            <TextField
                placeholder={placeholder}
                fullWidth
                multiline
                minRows={2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" disabled={sending} onClick={handleSend}>
                    {sending ? 'Sending…' : 'Send'}
                </Button>
            </Stack>
        </Box>
    );
}

function MessageThread({ postId, isOwner }) {
    const { currentUser } = useAuth();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            if (isOwner) {
                const data = await fetchConversations(postId);
                setConversations(data);
            } else {
                const data = await fetchMyConversation(postId, currentUser.id);
                setMessages(data);
            }
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load messages.'));
        } finally {
            setLoading(false);
        }
    }, [postId, isOwner, currentUser.id]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // autor post
    if (isOwner) {
        const selected = conversations.find((c) => c.participant.id === selectedId);

        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Messages</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {conversations.length === 0 ? (
                    <Typography color="text.secondary">No messages.</Typography>
                ) : (
                    <Paper variant="outlined">
                        <List disablePadding>
                            {conversations.map((conversation, index) => (
                                <Box key={conversation.participant.id}>
                                    {index > 0 && <Divider />}
                                    <ListItemButton
                                        selected={conversation.participant.id === selectedId}
                                        onClick={() => setSelectedId(conversation.participant.id)}
                                    >
                                        <ListItemText
                                            primary={`${conversation.participant.fName} ${conversation.participant.lName}`}
                                            secondary={`${conversation.participant.email} · ${conversation.messages.length} message(s)`}
                                        />
                                    </ListItemButton>
                                </Box>
                            ))}
                        </List>
                    </Paper>
                )}

                {selected && (
                    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                        <Stack spacing={1.5}>
                            {selected.messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                        </Stack>
                        <MessageForm
                            placeholder={`Reply to ${selected.participant.fName}…`}
                            onSend={async (content) => {
                                await sendMessage(postId, content, selected.participant.id);
                                await load();
                            }}
                        />
                    </Paper>
                )}
            </Box>
        );
    }

    // quem conversa
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Message the author</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper variant="outlined" sx={{ p: 2 }}>
                {messages.length === 0 ? (
                    <Typography color="text.secondary">
                        Have a question? Feel free to DM the author.
                    </Typography>
                ) : (
                    <Stack spacing={1.5}>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                    </Stack>
                )}
                <MessageForm
                    placeholder="Write your message…"
                    onSend={async (content) => {
                        await sendMessage(postId, content);
                        await load();
                    }}
                />
            </Paper>
        </Box>
    );
}

export default MessageThread;
