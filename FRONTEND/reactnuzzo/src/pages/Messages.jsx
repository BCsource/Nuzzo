
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import { fetchMyConversations } from '../services/messageService';
import { markMessagesSeen } from '../services/notificationService';
import { getErrorMessage } from '../utils/apiErrors';

const REFRESH_EVERY_MS = 5000;

function Messages() {
    const { postId, participantId } = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadConversations = useCallback(async () => {
        try {
            const data = await fetchMyConversations();
            setConversations(data);
            await markMessagesSeen();
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load your conversations.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        (async () => { await loadConversations(); })();
        const timer = setInterval(() => { loadConversations(); }, REFRESH_EVERY_MS);
        return () => clearInterval(timer);
    }, [loadConversations]);

    const isOpen = Boolean(postId && participantId);
    const selectedKey = isOpen ? `${postId}-${participantId}` : null;

    function openConversation(conversation) {
        navigate(`/messages/${conversation.post.id}/${conversation.participantId}`);
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Messages</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Paper
                    variant="outlined"
                    sx={{
                        width: { xs: '100%', md: 340 },
                        flexShrink: 0,
                        display: { xs: isOpen ? 'none' : 'block', md: 'block' },
                        maxHeight: '65vh',
                        overflowY: 'auto',
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress size={28} />
                        </Box>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedKey={selectedKey}
                            onSelect={openConversation}
                        />
                    )}
                </Paper>

                <Box sx={{ flex: 1, minWidth: 0, display: { xs: isOpen ? 'block' : 'none', md: 'block' } }}>
                    {isOpen ? (
                        <>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/messages')}
                                sx={{ display: { xs: 'inline-flex', md: 'none' }, mb: 1 }}
                            >
                                All conversations
                            </Button>
                            <ChatWindow
                                key={selectedKey}
                                postId={postId}
                                participantId={participantId}
                                onMessageSent={loadConversations}
                            />
                        </>
                    ) : (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">Choose a conversation to read it.</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Messages;
