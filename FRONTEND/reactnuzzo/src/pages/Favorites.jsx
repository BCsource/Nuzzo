import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostTable from '../components/PostTable';
import { fetchFavoritePosts, setFavoritePost } from '../services/postService';
import { useAuth } from '../context/useAuth';

function Favorites() {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchFavoritePosts();
            setPosts(data);
            setError('');
        } catch (error) {
            setError("Couldn't load favorites. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    // Fav = true. false remove da lista

    async function handleRemove(postId) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        try {
            await setFavoritePost(postId, false);
        } catch (error) {
            console.error(error);
            load();
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Favorites</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Typography color="text.secondary">No favorite posts.</Typography>
            ) : (
                <PostTable
                    posts={posts}
                    currentUserId={currentUser?.id}
                    favoritePostIds={posts.map((p) => p.id)}
                    onToggleFavorite={handleRemove}
                />
            )}
        </Box>
    );
}

export default Favorites;
