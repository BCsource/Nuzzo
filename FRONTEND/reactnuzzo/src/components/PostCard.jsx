import { Link as RouterLink } from 'react-router-dom';
import {
    Card, CardContent, CardActions, CardMedia, Typography, Stack,
    IconButton, Tooltip, Button, Box, Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UserAvatar from './UserAvatar';
import PostTypeChip from './PostTypeChip';
import CategoryChip from './CategoryChip';
import { imageUrl } from '../services/apiClient';
import { getVideoEmbedUrl } from '../utils/videoEmbed';
import { formatPrice, formatDate, authorLabel } from '../utils/postDisplay';

function PostCard({ post, onToggleFavourite, onDelete }) {
    const videoEmbedUrl = getVideoEmbedUrl(post.videoUrl);
    const isProduct = post.postType === 'product';

    return (
        <Card className="nz-post-card" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {videoEmbedUrl && (
                <Box className="nz-post-card__video">
                    <iframe
                        src={videoEmbedUrl}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen
                    />
                </Box>
            )}
            {!videoEmbedUrl && post.image && (
                <CardMedia component="img" height="180" image={imageUrl(post.image)} alt={post.title} />
            )}

            <CardContent sx={{ flexGrow: 1 }}>
                {/* Autor */}
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
                    <UserAvatar user={post.author} size={32} />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {authorLabel(post.author)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt)}
                        </Typography>
                    </Box>
                </Stack>

                <Typography variant="h6" component={RouterLink} to={`/posts/${post.id}`} className="nz-post-card__title">
                    {post.title}
                </Typography>

                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, my: 1 }}>
                    <PostTypeChip postType={post.postType} />
                    {post.category && <CategoryChip category={post.category} />}
                    {post.isOwner && <Chip label="Yours" size="small" variant="outlined" className="nz-chip nz-chip--yours" />}
                </Stack>

                <Typography variant="body2" color="text.secondary" className="nz-post-card__text">
                    {post.description}
                </Typography>

                {isProduct && post.price !== null && post.price !== undefined && (
                    <Typography className="nz-price" sx={{ mt: 1.5 }}>
                        {formatPrice(post.price)}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Button size="small" component={RouterLink} to={`/posts/${post.id}`} startIcon={<VisibilityIcon />}>
                        View
                    </Button>
                    {isProduct && (
                        <Button
                            size="small"
                            variant="contained"
                            component={RouterLink}
                            to="/coming-soon"
                            startIcon={<ShoppingCartIcon />}
                        >
                            Buy
                        </Button>
                    )}
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{post.views ?? 0} views</Typography>

                    {onDelete && post.canEdit && (
                        <>
                            <Tooltip title="Edit post">
                                <IconButton size="small" component={RouterLink} to={`/posts/${post.id}/edit`} aria-label="edit post">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete post">
                                <IconButton size="small" onClick={() => onDelete(post.id)} aria-label="delete post">
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    {!onDelete && !post.isOwner && onToggleFavourite && (
                        <Tooltip title={post.isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
                            <IconButton
                                size="small"
                                onClick={() => onToggleFavourite(post)}
                                color={post.isFavourite ? 'error' : 'default'}
                                aria-label="toggle favourite"
                            >
                                {post.isFavourite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </CardActions>
        </Card>
    );
}

export default PostCard;
