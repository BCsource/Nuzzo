import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostFilters from '../components/PostFilters';
import PostCardList from '../components/PostCardList';
import { EMPTY_FILTERS, buildPostQuery } from '../utils/postFilters';
import { fetchPosts, addFavourite, removeFavourite } from '../services/postService';
import { getErrorMessage } from '../utils/apiErrors';

function HomePage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchPosts(buildPostQuery(filters));
            setPosts(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't load feed. Please try again."));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function handleToggleFavourite(post) {
        try {
            if (post.isFavourite) {
                await removeFavourite(post.id);
            } else {
                await addFavourite(post.id);
            }
            setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, isFavourite: !p.isFavourite } : p)));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not update your favourites.'));
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Feed</Typography>

            <PostFilters value={filters} onChange={setFilters} />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : posts.length === 0 ? (
                <Typography color="text.secondary">No posts to show.</Typography>
            ) : (
                <PostCardList posts={posts} onToggleFavourite={handleToggleFavourite} />
            )}
        </Box>
    );
}

export default HomePage;
