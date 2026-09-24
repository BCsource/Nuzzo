import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { deleteAccount } from '../services/userService';
import { BADGE_LABELS } from '../utils/badgeOptions';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';
import ConfirmDialog from '../components/ConfirmDialog';

import { Box, Typography, Card, CardContent, Stack, Chip, Button, Alert } from '@mui/material';

function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState('');

    if (!currentUser) return null;

    async function handleDeleteAccount() {
        setConfirmDelete(false);
        try {
            await deleteAccount(currentUser.id);
            logout();
            navigate('/login');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't delete your account. Please try again."));
        }
    }

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Profile</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">
                        {currentUser.fName} {currentUser.lName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Date of birth: {formatDate(currentUser.dateOfBirth)}
                    </Typography>

                    {currentUser.bio && (
                        <Typography variant="body1" sx={{ mb: 1.5 }}>{currentUser.bio}</Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {(currentUser.badges || []).map((badge) => (
                            <Chip key={badge} label={BADGE_LABELS[badge] || badge} size="small" />
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button component={RouterLink} to="/profile/edit" variant="contained">Edit Profile</Button>
                <Button component={RouterLink} to="/profile/badges" variant="outlined">Request Badges</Button>
            </Stack>

            <Button color="error" onClick={() => setConfirmDelete(true)}>Delete Account</Button>

            <ConfirmDialog
                open={confirmDelete}
                title="Delete your account?"
                message="Your pets, posts and messages will be deleted too. This can't be undone."
                confirmLabel="Delete Account"
                onConfirm={handleDeleteAccount}
                onCancel={() => setConfirmDelete(false)}
            />
        </Box>
    );
}

export default Profile;
