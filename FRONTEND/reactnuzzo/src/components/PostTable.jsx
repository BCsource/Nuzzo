import { Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Stack, Tooltip, Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { postTypeLabel, formatPrice, formatDate, authorLabel } from '../utils/postDisplay';


function PostTable({ posts, currentUserId, favoritePostIds = [], onToggleFavorite, onDelete }) {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Views</TableCell>
                        <TableCell>Publish</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post) => {
                        const isMine = post.author?.id === currentUserId || post.authorId === currentUserId;
                        const isFav = favoritePostIds.includes(post.id);

                        return (
                            <TableRow key={post.id} hover>
                                <TableCell>
                                    <Link component={RouterLink} to={`/posts/${post.id}`} underline="hover">
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{postTypeLabel(post.type)}</TableCell>
                                <TableCell>{post.category || '—'}</TableCell>
                                <TableCell>{authorLabel(post.author)}</TableCell>
                                <TableCell align="right">{formatPrice(post.price)}</TableCell>
                                <TableCell align="right">{post.views ?? 0}</TableCell>
                                <TableCell>{formatDate(post.dataPublish)}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Check post">
                                            <IconButton size="small" component={RouterLink} to={`/posts/${post.id}`} aria-label="check post">
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {onDelete && isMine && (
                                            <Tooltip title="Delete post">
                                                <IconButton size="small" onClick={() => onDelete(post.id)} aria-label="delete post">
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {!onDelete && (isMine ? (
                                            <Chip label="Yours" size="small" variant="outlined" />
                                        ) : (
                                            <Tooltip title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onToggleFavorite(post.id)}
                                                    color={isFav ? 'error' : 'default'}
                                                    aria-label="switch favorite"
                                                >
                                                    {isFav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;
