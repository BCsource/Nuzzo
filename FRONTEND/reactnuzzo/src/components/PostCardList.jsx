import { Box } from '@mui/material';
import PostCard from './PostCard';

function PostCardList({ posts, onToggleFavourite, onDelete }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            }}
        >
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onToggleFavourite={onToggleFavourite}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
}

export default PostCardList;
