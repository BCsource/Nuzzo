
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostCardList from '../components/PostCardList';
import { fetchFavouritePosts, removeFavourite } from '../services/postService';
import { getErrorMessage } from '../utils/apiErrors';

function Favorites() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchFavouritePosts();
            setPosts(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load your favourites.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);


    async function handleRemove(post) {
        try {
            await removeFavourite(post.id);
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not remove this favourite.'));
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Favourites</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Typography color="text.secondary">You have no favourite posts yet.</Typography>
            ) : (
                <PostCardList posts={posts} onToggleFavourite={handleRemove} />
            )}
        </Box>
    );
}

export default Favorites;
