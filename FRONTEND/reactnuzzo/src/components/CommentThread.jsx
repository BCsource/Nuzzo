
import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, TextField, Button, Stack, Alert, CircularProgress, Paper, Avatar,
} from '@mui/material';
import { fetchComments, addComment, updateComment, deleteComment } from '../services/commentService';
import ConfirmDialog from './ConfirmDialog';
import { getErrorMessage } from '../utils/apiErrors';
import { authorLabel, formatDate } from '../utils/postDisplay';

function CommentThread({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const load = useCallback(async () => {
        try {
            const data = await fetchComments(postId);
            setComments(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load comments.'));
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function handleSend() {
        if (!content.trim()) {
            setError('Write something before commenting.');
            return;
        }
        setError('');
        setSending(true);
        try {
            const created = await addComment(postId, content.trim());
            setComments((prev) => [...prev, created]);
            setContent('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not add your comment.'));
        } finally {
            setSending(false);
        }
    }

    async function handleSaveEdit(commentId) {
        if (!editContent.trim()) {
            setError('Comment cannot be empty.');
            return;
        }
        try {
            const updated = await updateComment(postId, commentId, editContent.trim());
            setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
            setEditingId(null);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not update your comment.'));
        }
    }

    async function confirmDelete() {
        const commentId = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deleteComment(postId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not delete this comment.'));
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
                    placeholder="Write a comment…"
                    fullWidth
                    multiline
                    minRows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1.5 }}>
                    <Button variant="contained" disabled={sending} onClick={handleSend}>
                        {sending ? 'Posting…' : 'Comment'}
                    </Button>
                </Stack>
            </Paper>

            {comments.length === 0 ? (
                <Typography color="text.secondary">No comments yet.</Typography>
            ) : (
                <Stack spacing={1.5}>
                    {comments.map((comment) => (
                        <Paper key={comment.id} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36 }}>
                                {authorLabel(comment.author)[0]?.toUpperCase() ?? '?'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700 }}>
                                    {authorLabel(comment.author)}
                                </Typography>

                                {editingId === comment.id ? (
                                    <Box sx={{ mt: 1 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button size="small" variant="contained" onClick={() => handleSaveEdit(comment.id)}>Save</Button>
                                            <Button size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
                                )}

                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(comment.createdAt, true)}
                                        {comment.updatedAt && ' · edited'}
                                    </Typography>
                                    {comment.canEdit && editingId !== comment.id && (
                                        <Button
                                            size="small"
                                            onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {comment.canDelete && (
                                        <Button size="small" color="error" onClick={() => setPendingDeleteId(comment.id)}>
                                            Delete
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete this comment?"
                message="This can't be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </Box>
    );
}

export default CommentThread;
