import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';

function NewPost() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    async function handleSubmit(payload) {
        setServerError('');
        setSubmitting(true);
        try {
            const created = await createPost(payload);
            navigate(`/posts/${created.id}`);
        } catch (error) {
            setServerError("Couldn't publish post. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            {serverError && <Alert severity="error" sx={{ maxWidth: 520, mx: 'auto', mb: 2 }}>{serverError}</Alert>}
            <PostForm mode="create" submitting={submitting} onSubmit={handleSubmit} />
        </Box>
    );
}

export default NewPost;
