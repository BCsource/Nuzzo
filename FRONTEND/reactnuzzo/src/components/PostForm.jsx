// Formulário partilhado entre New Post e Edit Post

import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    POST_TYPES, POST_TYPE_LABELS, POST_TYPES_BY_BADGE, POST_CATEGORIES,
    MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH,
} from '../utils/postOptions';
import { REQUESTABLE_BADGES, BADGES } from '../utils/badgeOptions';

import {
    Box, Typography, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Alert, Stack, FormHelperText,
} from '@mui/material';

const EMPTY_POST = {
    type: POST_TYPES.REGULAR,
    title: '',
    description: '',
    category: '',
    price: '',
};


//Post types consoante os badges do User. Admin tem acesso total


function allowedTypesFor({ isAdmin, hasBadge }) {
    if (isAdmin) return Object.values(POST_TYPES);

    const allowed = new Set(POST_TYPES_BY_BADGE[BADGES.AFICIONADO]);
    REQUESTABLE_BADGES.forEach((badge) => {
        if (hasBadge(badge)) {
            POST_TYPES_BY_BADGE[badge].forEach((type) => allowed.add(type));
        }
    });
    return Array.from(allowed);
}

function PostForm({
    mode = 'create',
    defaultValues,
    submitting = false,
    serverError = '',
    onSubmit,
}) {
    const navigate = useNavigate();
    const { isAdmin, hasBadge } = useAuth();
    const typeOptions = allowedTypesFor({ isAdmin, hasBadge });

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: { ...EMPTY_POST, ...defaultValues } });

    const type = watch('type');
    const isProduct = type === POST_TYPES.PRODUCT;

    function submit(data) {
        onSubmit({
            type: data.type,
            title: data.title.trim(),
            description: data.description.trim(),
            category: data.category,
            // preço só é aplicado em produtos, no resto é null
            price: !isProduct || data.price === '' ? null : Number(data.price),
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} sx={{ maxWidth: 520, mx: 'auto' }} noValidate>
            <Typography variant="h4" gutterBottom>
                {mode === 'edit' ? 'Edit Post' : 'New Post'}
            </Typography>

            <Stack spacing={2}>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Choose a post type.' }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.type}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select labelId="type-label" label="Type" {...field}>
                                {typeOptions.map((t) => (
                                    <MenuItem key={t} value={t}>{POST_TYPE_LABELS[t]}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.type?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

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

                <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Choose a category.' }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select labelId="category-label" label="Category" {...field}>
                                {POST_CATEGORIES.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.category?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                {isProduct && (
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
                        {submitting ? 'Saving…' : mode === 'edit' ? 'Update Post' : 'Publish Post'}
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
