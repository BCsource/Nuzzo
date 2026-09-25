// Formulário partilhado entre New Post e Edit Post

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    POST_TYPES, POST_TYPE_LABELS, POST_CATEGORIES,
    MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH,
} from '../utils/postOptions';
import { formatPrice, postTypeLabel } from '../utils/postDisplay';
import ImageUploadField from './ImageUploadField';
import { getVideoEmbedUrl } from '../utils/videoEmbed';

import {
    Box, Typography, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Alert, Stack, FormHelperText, Chip,
} from '@mui/material';

const EMPTY_POST = {
    postType: POST_TYPES.REGULAR,
    title: '',
    description: '',
    category: '',
    price: '',
    videoUrl: '',
};


//Post types consoante os badges do User. Admin tem acesso total

function PostForm({
    mode = 'create',
    defaultValues,
    submitting = false,
    serverError = '',
    onSubmit,
}) {
    const navigate = useNavigate();
    const [image, setImage] = useState(defaultValues?.image || null);
    const { permissions } = useAuth();
    const typeOptions = permissions.allowedPostTypes || [];
    const isEdit = mode === 'edit';

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: { ...EMPTY_POST, ...defaultValues } });

    const postType = watch('postType');
    const isProduct = postType === POST_TYPES.PRODUCT;

    function submit(data) {
        if (isEdit) {
            onSubmit({
                title: data.title.trim(),
                description: data.description.trim(),
            });
            return;
        }
        onSubmit({
            postType: data.postType,
            title: data.title.trim(),
            description: data.description.trim(),
            category: data.category,
            price: !isProduct || data.price === '' ? null : Number(data.price),
            image: image,
            videoUrl: data.videoUrl.trim(),
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} sx={{ maxWidth: 520, mx: 'auto' }} noValidate>
            <Typography variant="h4" gutterBottom>
                {mode === 'edit' ? 'Edit Post' : 'New Post'}
            </Typography>

            <Stack spacing={2}>
                {isEdit ? (
                    // no edit o type, a categoria e o preço são imutaveis
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip label={postTypeLabel(defaultValues?.postType)} color="primary" />
                        {defaultValues?.category && <Chip label={defaultValues.category} variant="outlined" />}
                        {defaultValues?.price !== null && defaultValues?.price !== undefined && (
                            <Chip label={formatPrice(defaultValues.price)} variant="outlined" />
                        )}
                    </Stack>
                ) : (
                    <Controller
                        name="postType"
                        control={control}
                        rules={{ required: 'Choose a post type.' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.postType}>
                                <InputLabel id="post-type-label">Type</InputLabel>
                                <Select labelId="post-type-label" label="Type" {...field}>
                                    {typeOptions.map((type) => (
                                        <MenuItem key={type} value={type}>{POST_TYPE_LABELS[type]}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.postType?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                )}

                <TextField
                    label="Title"
                    fullWidth
                    {...register('title', {
                        required: 'Give your post a title.',
                        minLength: { value: MIN_TITLE_LENGTH, message: `Must contain at least ${MIN_TITLE_LENGTH} characters.` },
                        maxLength: { value: MAX_TITLE_LENGTH, message: `Title must be shorter than ${MAX_TITLE_LENGTH} characters.` },
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    minRows={3}
                    {...register('description', {
                        required: 'Write a description.',
                        minLength: { value: MIN_DESCRIPTION_LENGTH, message: `Must contain at least ${MIN_DESCRIPTION_LENGTH} characters.` },
                        maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Description must be shorter than ${MAX_DESCRIPTION_LENGTH} characters.` },
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />

                {!isEdit && (
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: 'Choose a category.' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.category}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select labelId="category-label" label="Category" {...field}>
                                    {POST_CATEGORIES.map((category) => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.category?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                )}

                {!isEdit && (
                    <ImageUploadField
                        label="Post image (optional)"
                        value={image}
                        onChange={setImage}
                        round={false}
                    />
                )}

                {!isEdit && (
                    <TextField
                        label="Video link (optional)"
                        placeholder="https://www.youtube.com/watch?v=…"
                        fullWidth
                        {...register('videoUrl', {
                            validate: (value) => !value || getVideoEmbedUrl(value) !== null
                                || 'Paste a YouTube or Vimeo link.',
                        })}
                        error={!!errors.videoUrl}
                        helperText={errors.videoUrl?.message || 'The video stays on YouTube or Vimeo; we only save the link.'}
                    />
                )}

                {!isEdit && isProduct && (
                    <TextField
                        label="Price (€)"
                        type="number"
                        fullWidth
                        slotProps={{ htmlInput: { step: '0.01', min: 0 } }}
                        {...register('price', {
                            min: { value: 0, message: "Price can't be negative." },
                        })}
                        error={!!errors.price}
                        helperText={errors.price?.message || 'Optional.'}
                    />
                )}

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving…' : isEdit ? 'Update Post' : 'Publish Post'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default PostForm;
