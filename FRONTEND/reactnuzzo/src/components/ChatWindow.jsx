
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Stack, Alert, CircularProgress, Paper, Link,
} from '@mui/material';
import { fetchConversation, sendMessage } from '../services/messageService';
import { useAuth } from '../context/useAuth';
import UserAvatar from './UserAvatar';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';

const REFRESH_EVERY_MS = 5000;

function ChatWindow({ postId, participantId, onMessageSent }) {
    const { currentUser } = useAuth();
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const bottomRef = useRef(null);

    const iAmParticipant = participantId === currentUser.id;

    const load = useCallback(async () => {
        try {
            const data = await fetchConversation(postId, participantId);
            setConversation(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load this conversation.'));
        } finally {
            setLoading(false);
        }
    }, [postId, participantId]);

    useEffect(() => {
        (async () => { await load(); })();
        const timer = setInterval(() => { load(); }, REFRESH_EVERY_MS);
        return () => clearInterval(timer);
    }, [load]);

    const messageCount = conversation?.messages.length || 0;
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageCount]);

    async function handleSend() {
        if (!content.trim()) {
            setError('Write something before sending.');
            return;
        }
        setError('');
        setSending(true);
        try {
            await sendMessage(postId, content.trim(), iAmParticipant ? undefined : participantId);
            setContent('');
            await load();
            if (onMessageSent) onMessageSent();
        } catch (error) {
            setError(getErrorMessage(error, 'Could not send your message.'));
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!conversation) {
        return <Alert severity="error">{error || 'Conversation not found.'}</Alert>;
    }

    const other = conversation.otherUser;

    return (
        <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: { xs: '70vh', md: '65vh' } }}>
            <Box sx={{ p: 2, borderBottom: '1px solid var(--nz-border)' }}>
                <Typography sx={{ fontWeight: 700 }}>
                    {other ? `${other.fName} ${other.lName}` : 'Removed user'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    About{' '}
                    <Link component={RouterLink} to={`/posts/${conversation.post.id}`}>{conversation.post.title}</Link>
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {conversation.messages.length === 0 ? (
                    <Typography color="text.secondary">
                        Say hello!
                    </Typography>
                ) : (
                    <Stack spacing={1.5}>
                        {conversation.messages.map((message) => (
                            <Stack
                                key={message.id}
                                direction={message.isMine ? 'row-reverse' : 'row'}
                                spacing={1}
                                sx={{ alignItems: 'flex-end' }}
                            >
                                {!message.isMine && <UserAvatar user={message.sender} size={28} />}
                                <Box className={`nz-bubble ${message.isMine ? 'nz-bubble--mine' : 'nz-bubble--theirs'}`}>
                                    <Typography variant="body2" className="nz-user-text">{message.content}</Typography>
                                    <Typography variant="caption" className="nz-bubble__time">
                                        {formatDate(message.createdAt, true)}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                )}
                <div ref={bottomRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid var(--nz-border)' }}>
                {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                {conversation.canReply ? (
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
                        <TextField
                            placeholder="Write a message…"
                            fullWidth
                            multiline
                            maxRows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button variant="contained" disabled={sending} onClick={handleSend}>
                            {sending ? '…' : 'Send'}
                        </Button>
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        You can reply once someone messages you about this post.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}

export default ChatWindow;
