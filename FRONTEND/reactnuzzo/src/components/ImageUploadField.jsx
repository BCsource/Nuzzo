
import { useState } from 'react';
import { Box, Button, Typography, Avatar, Stack } from '@mui/material';
import { uploadImage } from '../services/imageService';
import { imageUrl } from '../services/apiClient';
import { getErrorMessage } from '../utils/apiErrors';


function ImageUploadField({ label = 'Photo', value, onChange, round = true }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    async function handleChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('The image must be a JPG, PNG or WEBP file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('The image must be smaller than 2 MB.');
            return;
        }

        setError('');
        setUploading(true);
        try {
            const imageId = await uploadImage(file);
            onChange(imageId);
        } catch (uploadError) {
            setError(getErrorMessage(uploadError, 'Could not upload this image.'));
        } finally {
            setUploading(false);
        }
    }

    return (
        <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                    src={imageUrl(value)}
                    variant={round ? 'circular' : 'rounded'}
                    sx={{ width: 64, height: 64 }}
                />
                <Stack spacing={1}>
                    <Button variant="outlined" component="label" size="small" disabled={uploading}>
                        {uploading ? 'Uploading…' : value ? 'Change image' : 'Upload image'}
                        <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
                    </Button>
                    {value && (
                        <Button size="small" color="inherit" onClick={() => onChange(null)}>Remove</Button>
                    )}
                </Stack>
            </Stack>
            {error
                ? <Typography variant="caption" color="error">{error}</Typography>
                : <Typography variant="caption" color="text.secondary">JPG, PNG or WEBP, up to 2 MB.</Typography>}
        </Box>
    );
}

export default ImageUploadField;
