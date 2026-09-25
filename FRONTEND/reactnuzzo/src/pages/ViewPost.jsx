
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { fetchPostById, addFavourite, removeFavourite } from '../services/postService';
import CommentThread from '../components/CommentThread';
import { useAuth } from '../context/useAuth';
import { getErrorMessage } from '../utils/apiErrors';
import { formatPrice, formatDate, authorLabel } from '../utils/postDisplay';
import UserAvatar from '../components/UserAvatar';
import PostTypeChip from '../components/PostTypeChip';
import CategoryChip from '../components/CategoryChip';
import { imageUrl } from '../services/apiClient';
import { getVideoEmbedUrl } from '../utils/videoEmbed';

import {
    Box, Typography, Stack, Card, CardContent, Button, Link,
    CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                        <UserAvatar user={post.author} size={40} />
                        <Typography variant="body2" color="text.secondary">
                            Published by{' '}
                            {post.author
                                ? <Link component={RouterLink} to={`/users/${post.author.id}`}>{authorLabel(post.author)}</Link>
                                : authorLabel(post.author)} • {formatDate(post.createdAt)}
                            {post.updatedAt && ` • edited ${formatDate(post.updatedAt)}`}
                        </Typography>
                    </Stack>

                    {getVideoEmbedUrl(post.videoUrl) && (
                        <Box className="nz-post-video" sx={{ mb: 2 }}>
                            <iframe
                                src={getVideoEmbedUrl(post.videoUrl)}
                                title={post.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowFullScreen
                            />
                        </Box>
                    )}
                    {post.image && (
                        <Box
                            component="img"
                            src={imageUrl(post.image)}
                            alt={post.title}
                            sx={{ width: '100%', borderRadius: 2, mb: 2, display: 'block' }}
                        />
                    )}

                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <PostTypeChip postType={post.postType} />
                        {post.category && <CategoryChip category={post.category} />}
                    </Stack>

                    <Typography variant="body1" className="nz-user-text" sx={{ mb: 1 }}>
                        {post.description}
                    </Typography>

                    {post.postType === 'product' && post.price !== null && post.price !== undefined && (
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', my: 2 }}>
                            <Typography className="nz-price nz-price--lg">{formatPrice(post.price)}</Typography>
                            <Button variant="contained" startIcon={<ShoppingCartIcon />} component={RouterLink} to="/coming-soon">
                                Buy
                            </Button>
                        </Stack>
                    )}

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
