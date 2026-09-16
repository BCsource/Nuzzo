import { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostFilters from '../components/PostFilters';
import PostTable from '../components/PostTable';
import { EMPTY_FILTERS, filterAndSortPosts } from '../utils/postFilters';
import { fetchPosts, fetchFavoritePosts, setFavoritePost } from '../services/postService';
import { useAuth } from '../context/useAuth';

function HomePage() {
    const { currentUser } = useAuth();
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [posts, setPosts] = useState([]);
    const [favoritePostIds, setFavoritePostIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const [postsData, favoritesData] = await Promise.all([
                fetchPosts(),
                fetchFavoritePosts(),
            ]);
            setPosts(postsData);
            setFavoritePostIds(favoritesData.map((p) => p.id));
            setError('');
        } catch (error) {
            setError("Couldn't load feed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);


    const visiblePosts = useMemo(() => filterAndSortPosts(posts, filters), [posts, filters]);

    async function handleToggleFavorite(postId) {
        const isFav = favoritePostIds.includes(postId);
        setFavoritePostIds((prev) => (isFav ? prev.filter((id) => id !== postId) : [...prev, postId]));
        try {
            await setFavoritePost(postId, !isFav);
        } catch (error) {

            setFavoritePostIds((prev) => (isFav ? [...prev, postId] : prev.filter((id) => id !== postId)));
            console.error(error);
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
            ) : visiblePosts.length === 0 ? (
                <Typography color="text.secondary">No posts to show.</Typography>
            ) : (
                <PostTable
                    posts={visiblePosts}
                    currentUserId={currentUser?.id}
                    favoritePostIds={favoritePostIds}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </Box>
    );
}

export default HomePage;
