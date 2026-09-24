import { Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Stack, Tooltip, Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { postTypeLabel, formatPrice, formatDate, authorLabel } from '../utils/postDisplay';


function PostTable({ posts, onToggleFavourite, onDelete }) {
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
                        <TableCell>Published</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id} hover>
                            <TableCell>
                                <Link component={RouterLink} to={`/posts/${post.id}`} underline="hover">
                                    {post.title}
                                </Link>
                            </TableCell>
                            <TableCell>{postTypeLabel(post.postType)}</TableCell>
                            <TableCell>{post.category || '—'}</TableCell>
                            <TableCell>
                                {authorLabel(post.author)}
                            </TableCell>
                            <TableCell align="right">{formatPrice(post.price)}</TableCell>
                            <TableCell align="right">{post.views ?? 0}</TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                    <Tooltip title="View post">
                                        <IconButton size="small" component={RouterLink} to={`/posts/${post.id}`} aria-label="view post">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

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

                                    {!onDelete && post.isOwner && (
                                        <Chip label="Yours" size="small" variant="outlined" />
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;
