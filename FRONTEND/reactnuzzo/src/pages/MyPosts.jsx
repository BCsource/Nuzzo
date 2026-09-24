import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Stack } from '@mui/material';
import PostTable from '../components/PostTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchMyPosts, deletePost } from '../services/postService';
import { getErrorMessage } from '../utils/apiErrors';

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const load = useCallback(async () => {
        try {
            const data = await fetchMyPosts();
            setPosts(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load your posts.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function confirmDelete() {
        const postId = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not delete this post.'));
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">My Posts</Typography>
                <Button component={RouterLink} to="/posts/new" variant="contained">New Post</Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Typography color="text.secondary">You haven't published any posts yet.</Typography>
            ) : (
                <PostTable posts={posts} onDelete={(postId) => setPendingDeleteId(postId)} />
            )}

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete this post?"
                message="Its messages will be deleted too. This can't be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </Box>
    );
}

export default MyPosts;
