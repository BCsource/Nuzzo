import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, CircularProgress } from '@mui/material';
import PostForm from '../components/PostForm';
import { fetchPostById, updatePost } from '../services/postService';

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchPostById(postId);
                setPost(data);
            } catch (error) {
                setServerError("Couldn't load post.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [postId]);

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            await updatePost(postId, payload);
            navigate(`/posts/${postId}`);
        } catch (error) {
            setServerError("Couldn't update post. Please try again.");
            console.error(error);
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

    return (
        <Box sx={{ px: 2, py: 3 }}>
            {serverError && <Alert severity="error" sx={{ maxWidth: 520, mx: 'auto', mb: 2 }}>{serverError}</Alert>}
            <PostForm mode="edit" defaultValues={post} submitting={submitting} onSubmit={handleSubmit} />
        </Box>
    );
}

export default EditPost;
