import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Button, CircularProgress, Alert, Stack,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { fetchAllUsers, promoteToAdmin, deleteAccount } from '../services/userService';
import { useAuth } from '../context/useAuth';
import ConfirmDialog from '../components/ConfirmDialog';
import { BADGE_LABELS } from '../utils/badgeOptions';
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
    const [pendingRemoveId, setPendingRemoveId] = useState(null);

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

    async function confirmRemove() {
        const userId = pendingRemoveId;
        setPendingRemoveId(null);
        try {
            await deleteAccount(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not remove this user.'));
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
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date of birth</TableCell>
                                <TableCell>Badges</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.fName} {user.lName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                            {user.badges.map((badge) => (
                                                <Chip key={badge} label={BADGE_LABELS[badge] || badge} size="small" variant="outlined" />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{user.isAdmin ? <Chip label="Admin" size="small" color="primary" /> : '—'}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            {permissions.canPromoteAdmins && !user.isAdmin && (
                                                <Button size="small" onClick={() => handlePromote(user.id)}>Make admin</Button>
                                            )}
                                            {user.id !== currentUser.id && (
                                                <Button size="small" color="error" onClick={() => setPendingRemoveId(user.id)}>Remove</Button>
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
                open={!!pendingRemoveId}
                title="Remove this user?"
                message="Their pets, posts and messages will be deleted too. This can't be undone."
                confirmLabel="Remove"
                onConfirm={confirmRemove}
                onCancel={() => setPendingRemoveId(null)}
            />
        </Box>
    );
}

export default AllUsersAdminOnly;
