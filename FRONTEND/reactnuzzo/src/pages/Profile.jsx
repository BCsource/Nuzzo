
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { disableAccount } from '../services/userService';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';
import { isHighContrast, applyHighContrast } from '../utils/contrastMode';
import ConfirmDialog from '../components/ConfirmDialog';
import ProfileHeader from '../components/ProfileHeader';
import BadgeChip from '../components/BadgeChip';
import AdminChip from '../components/AdminChip';

import {
    Box, Typography, Button, Alert, Paper, Stack,
    FormControlLabel, Switch, Divider,
} from '@mui/material';
import ContrastIcon from '@mui/icons-material/Contrast';

function Profile() {
    const { currentUser, permissions, logout } = useAuth();
    const navigate = useNavigate();
    const [confirmDisable, setConfirmDisable] = useState(false);
    const [error, setError] = useState('');
    const [highContrast, setHighContrast] = useState(() => isHighContrast());

    if (!currentUser) return null;

    async function handleDisableAccount() {
        setConfirmDisable(false);
        try {
            await disableAccount(currentUser.id);
            logout();
            navigate('/login');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't deactivate your account. Please try again."));
        }
    }

    function handleContrastChange(enabled) {
        setHighContrast(enabled);
        applyHighContrast(enabled);
    }

    const chips = [
        ...(permissions.canManageUsers
            ? [<AdminChip key="admin" isMasterAdmin={permissions.canPromoteAdmins} />]
            : []),
        ...(currentUser.badges || []).map((badge) => <BadgeChip key={badge} badge={badge} />),
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <ProfileHeader
                subject={currentUser}
                title={`${currentUser.fName} ${currentUser.lName}`}
                subtitle={currentUser.email}
                chips={chips}
                facts={[
                    { label: 'Date of birth', value: formatDate(currentUser.dateOfBirth) },
                    { label: 'Member since', value: formatDate(currentUser.createdAt) },
                ]}
                actions={[
                    <Button key="edit" variant="contained" component={RouterLink} to="/profile/edit">
                        Edit Profile
                    </Button>,
                    <Button key="badges" variant="outlined" component={RouterLink} to="/profile/badges">
                        Request Badges
                    </Button>,
                ]}
            />

            {currentUser.bio && (
                <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>About me</Typography>
                    <Typography variant="body1" className="nz-user-text">{currentUser.bio}</Typography>
                </Paper>
            )}

            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Accessibility</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={highContrast}
                            onChange={(e) => handleContrastChange(e.target.checked)}
                        />
                    }
                    label={
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <ContrastIcon fontSize="small" />
                            <span>High contrast mode</span>
                        </Stack>
                    }
                />
                <Typography variant="body2" color="text.secondary">
                    Stronger colours and clearer outlines. Your choice is remembered on this device.
                </Typography>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Button color="error" onClick={() => setConfirmDisable(true)}>Deactivate Account</Button>

            <ConfirmDialog
                open={confirmDisable}
                title="Deactivate your account?"
                message="You won't be able to log in anymore. Your posts and pets stay saved, and an admin can reactivate your account."
                confirmLabel="Deactivate"
                onConfirm={handleDisableAccount}
                onCancel={() => setConfirmDisable(false)}
            />
        </Box>
    );
}

export default Profile;
