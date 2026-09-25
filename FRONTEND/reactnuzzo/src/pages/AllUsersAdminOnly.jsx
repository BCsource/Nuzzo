
import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Button, CircularProgress, Alert, Stack,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { fetchAllUsers, promoteToAdmin, disableAccount, reactivateAccount } from '../services/userService';
import { useAuth } from '../context/useAuth';
import ConfirmDialog from '../components/ConfirmDialog';
import UserAvatar from '../components/UserAvatar';
import BadgeChip from '../components/BadgeChip';
import AdminChip from '../components/AdminChip';
import { fetchPendingActivationRequests, markActivationHandled } from '../services/activationService';

import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';



const USER_SORT_OPTIONS = [
    { value: 'fName:asc', label: 'First name (A → Z)' },
    { value: 'lName:asc', label: 'Last name (A → Z)' },
    { value: 'createdAt:desc', label: 'Newest first' },
];

function AllUsersAdminOnly() {
    const { currentUser, permissions } = useAuth();
    const [users, setUsers] = useState([]);
    const [sort, setSort] = useState('fName:asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pendingDisableId, setPendingDisableId] = useState(null);
    const [activationRequests, setActivationRequests] = useState([]);

    const load = useCallback(async () => {
        try {
            const data = await fetchAllUsers({ sort, limit: 100 });
            setUsers(data);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't load users"));
        } finally {
            setLoading(false);
        }
    }, [sort]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    const loadActivationRequests = useCallback(async () => {
        try {
            const data = await fetchPendingActivationRequests();
            setActivationRequests(data);
        } catch (error) {
            setError(getErrorMessage(error, 'Could not load activation requests.'));
        }
    }, []);

    useEffect(() => { (async () => { await loadActivationRequests(); })(); }, [loadActivationRequests]);

    async function handleActivationHandled(requestId) {
        try {
            await markActivationHandled(requestId);
            setActivationRequests((prev) => prev.filter((request) => request.id !== requestId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not update this request.'));
        }
    }

    async function handlePromote(userId) {
        setSuccess('');
        try {
            const data = await promoteToAdmin(userId);
            setSuccess(data.message);
            await load();
        } catch (error) {
            setError(getErrorMessage(error, 'Could not promote this user.'));
        }
    }

    // Soft delete -> a conta fica desativada e continua na lista.
    async function confirmDisable() {
        const userId = pendingDisableId;
        setPendingDisableId(null);
        setSuccess('');
        try {
            const data = await disableAccount(userId);
            setSuccess(data.message);
            await load();
        } catch (error) {
            setError(getErrorMessage(error, 'Could not deactivate this user.'));
        }
    }

    async function handleReactivate(userId) {
        setSuccess('');
        try {
            const data = await reactivateAccount(userId);
            setSuccess(data.message);
            await load();
        } catch (error) {
            setError(getErrorMessage(error, 'Could not reactivate this user.'));
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>All Users</Typography>

            <FormControl size="small" sx={{ minWidth: 220, mb: 2 }}>
                <InputLabel id="user-sort-label">Sort by</InputLabel>
                <Select labelId="user-sort-label" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
                    {USER_SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {activationRequests.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Account activation requests</Typography>
                    <Stack spacing={1}>
                        {activationRequests.map((request) => (
                            <Stack
                                key={request.id}
                                direction="row"
                                spacing={2}
                                sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{request.email}</Typography>
                                    {request.message && (
                                        <Typography variant="body2" color="text.secondary">{request.message}</Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(request.createdAt, true)}
                                    </Typography>
                                </Box>
                                <Button size="small" onClick={() => handleActivationHandled(request.id)}>
                                    Mark as handled
                                </Button>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
            )}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 760 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date of birth</TableCell>
                                <TableCell>Badges</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                            <UserAvatar user={user} size={32} />
                                            <span>{user.fName} {user.lName}</span>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                            {user.badges.map((badge) => (
                                                <BadgeChip key={badge} badge={badge} />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{user.isAdmin ? <AdminChip /> : '—'}</TableCell>
                                    <TableCell>
                                        {user.disabled
                                            ? <Chip label="Deactivated" size="small" className="nz-chip nz-chip--rejected" />
                                            : <Chip label="Active" size="small" className="nz-chip nz-chip--approved" />}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            {permissions.canPromoteAdmins && !user.isAdmin && (
                                                <Button size="small" onClick={() => handlePromote(user.id)}>Make admin</Button>
                                            )}
                                            {user.id !== currentUser.id && !user.disabled && (
                                                <Button size="small" color="error" onClick={() => setPendingDisableId(user.id)}>Deactivate</Button>
                                            )}
                                            {user.disabled && (
                                                <Button size="small" onClick={() => handleReactivate(user.id)}>Reactivate</Button>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmDialog
                open={!!pendingDisableId}
                title="Deactivate this user?"
                message="They won't be able to log in. Their content stays saved and you can reactivate the account later."
                confirmLabel="Deactivate"
                onConfirm={confirmDisable}
                onCancel={() => setPendingDisableId(null)}
            />
        </Box>
    );
}

export default AllUsersAdminOnly;
