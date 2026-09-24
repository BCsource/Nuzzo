import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';
import { getErrorMessage } from '../utils/apiErrors';

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
            setServerError(getErrorMessage(error, "Couldn't publish your post. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ px: 2, py: 3 }}>
            <PostForm mode="create" submitting={submitting} serverError={serverError} onSubmit={handleSubmit} />
        </Box>
    );
}

export default NewPost;
