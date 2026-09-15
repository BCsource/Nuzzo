import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteOwnAccount } from '../services/userService';
import { BADGE_LABELS } from '../utils/badgeOptions';
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
            await deleteOwnAccount(currentUser.id);
            logout();
            navigate('/login');
        } catch (error) {
            setError("Couldn't delete account. Please try again.");
            console.error(error);
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
                        Birthday: {formatDate(currentUser.dateOfBirth)}
                    </Typography>

                    {currentUser.bio && (
                        <Typography variant="body1" sx={{ mb: 1.5 }}>{currentUser.bio}</Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
                title="Delete account?"
                message="This action is permanent and cannot be undone."
                confirmLabel="Delete account"
                onConfirm={handleDeleteAccount}
                onCancel={() => setConfirmDelete(false)}
            />
        </Box>
    );
}

export default Profile;
