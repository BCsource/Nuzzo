import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { fetchPostById, setFavoritePost } from '../services/postService';
import InteractionThread from '../components/InteractionThread';
import { postTypeLabel, formatPrice, formatDate, authorLabel } from '../utils/postDisplay';

import {
    Box, Typography, Chip, Stack, Card, CardContent, Button,
    CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function ViewPost() {
    const { postId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFav, setIsFav] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await fetchPostById(postId);
            setPost(data);
            setIsFav(!!data.favorite);
            setError('');
        } catch (error) {
            setError("Couldn't load post.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function toggleFav() {
        const next = !isFav;
        setIsFav(next);
        try {
            await setFavoritePost(postId, next);
        } catch (error) {
            setIsFav(!next);
            console.error(error);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'Post not found.'}</Alert>
            </Box>
        );
    }

    const isAuthor = !!(currentUser && post.author?.id === currentUser.id);

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto', mt: 2, px: 2, mb: 6 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Typography variant="h4" gutterBottom>{post.title}</Typography>

                        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            {!isAuthor && (
                                <Tooltip title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                                    <IconButton size="small" onClick={toggleFav} color={isFav ? 'error' : 'default'} aria-label="switch favorite">
                                        {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                            {isAuthor && (
                                <Button component={RouterLink} to={`/posts/${post.id}/edit`} startIcon={<EditIcon />} size="small">
                                    Edit
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Posted by {authorLabel(post.author)} • {formatDate(post.publishDate)}
                    </Typography>

                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={postTypeLabel(post.type)} color="primary" />
                        {post.category && <Chip label={post.category} variant="outlined" />}
                        <Chip
                            label={post.available ? 'Available' : 'Not available'}
                            color={post.available ? 'success' : 'default'}
                            variant={post.available ? 'filled' : 'outlined'}
                        />
                        {post.price !== null && post.price !== undefined && (
                            <Chip label={formatPrice(post.price)} variant="outlined" />
                        )}
                    </Stack>

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                        {post.description}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        {post.views ?? 0} views
                    </Typography>
                </CardContent>
            </Card>

            <InteractionThread postId={postId} />
        </Box>
    );
}

export default ViewPost;
