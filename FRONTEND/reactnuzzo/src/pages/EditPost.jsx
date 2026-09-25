
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import PostForm from '../components/PostForm';
import { fetchPostById, updatePost } from '../services/postService';
import { getErrorMessage } from '../utils/apiErrors';

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        fetchPostById(postId)
            .then((data) => setPost(data))
            .catch((error) => setServerError(getErrorMessage(error, "Couldn't load this post.")))
            .finally(() => setLoading(false));
    }, [postId]);

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            await updatePost(postId, payload);
            navigate(`/posts/${postId}`);
        } catch (error) {
            setServerError(getErrorMessage(error, "Couldn't update this post. Please try again."));
        } finally {
            setSubmitting(false);
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
            <Box sx={{ maxWidth: 520, mx: 'auto', mt: 4 }}>
                <Alert severity="error">{serverError || 'Post not found.'}</Alert>
            </Box>
        );
    }

    if (!post.canEdit) {
        return (
            <Box sx={{ maxWidth: 520, mx: 'auto', mt: 4 }}>
                <Alert severity="warning">You can only edit your own posts.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            <PostForm mode="edit" defaultValues={post} submitting={submitting} serverError={serverError} onSubmit={handleSubmit} />
        </Box>
    );
}

export default EditPost;
