import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchPostById, addFavourite, removeFavourite } from '../services/postService';
import CommentThread from '../components/CommentThread';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../utils/apiErrors';
import { postTypeLabel, formatPrice, formatDate, authorLabel } from '../utils/postDisplay';

import {
    Box, Typography, Chip, Stack, Card, CardContent, Button,
    CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function ViewPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const data = await fetchPostById(postId);
            setPost(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't load this post."));
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function toggleFavourite() {
        try {
            if (post.isFavourite) {
                await removeFavourite(post.id);
            } else {
                await addFavourite(post.id);
            }
            setPost((prev) => ({ ...prev, isFavourite: !prev.isFavourite }));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not update your favourites.'));
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'Post not found.'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto', mt: 2, px: 2, mb: 6 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="go back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Typography variant="h4" gutterBottom>{post.title}</Typography>

                        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            {!post.isOwner && (
                                <Tooltip title={post.isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
                                    <IconButton size="small" onClick={toggleFavourite} color={post.isFavourite ? 'error' : 'default'} aria-label="toggle favourite">
                                        {post.isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                            {post.canEdit && (
                                <Button component={RouterLink} to={`/posts/${post.id}/edit`} startIcon={<EditIcon />} size="small">
                                    Edit
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Published by {authorLabel(post.author)} • {formatDate(post.createdAt)}
                        {post.updatedAt && ` • edited ${formatDate(post.updatedAt)}`}
                    </Typography>

                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={postTypeLabel(post.postType)} color="primary" />
                        {post.category && <Chip label={post.category} variant="outlined" />}
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

            {post.author && !post.isOwner && (
                <Button
                    variant="outlined"
                    startIcon={<ChatBubbleOutlineIcon />}
                    component={RouterLink}
                    to={`/messages/${post.id}/${currentUser.id}`}
                >
                    Message {post.author.fName} privately
                </Button>
            )}
            {post.isOwner && (
                <Button variant="outlined" startIcon={<ChatBubbleOutlineIcon />} component={RouterLink} to="/messages">
                    See private messages
                </Button>
            )}

            <CommentThread postId={post.id} />
        </Box>
    );
}

export default ViewPost;
