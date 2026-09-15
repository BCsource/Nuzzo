import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Button, CircularProgress, Alert, Stack, TextField,
} from '@mui/material';
import { fetchAllUsers, promoteToAdmin, removeUser } from '../services/userService';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/postDisplay';



function AllUsersAdminOnly() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingRemoveId, setPendingRemoveId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (error) {
            setError("Couldn't load users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const visibleUsers = users.filter((u) => {
        if (!search.trim()) return true;
        const term = search.trim().toLowerCase();
        return `${u.fName} ${u.lName} ${u.email}`.toLowerCase().includes(term);
    });

    async function handlePromote(userId) {
        try {
            await promoteToAdmin(userId);
            await load();
        } catch (error) {
            setError("Couldn't promote user.");
            console.error(error);
        }
    }

    async function confirmRemove() {
        const userId = pendingRemoveId;
        setPendingRemoveId(null);
        try {
            await removeUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            setError("Couldn't remove user.");
            console.error(error);
        }
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>All Users</Typography>

            <TextField
                placeholder="Search by name or email..."
                size="small"
                fullWidth
                sx={{ mb: 2, maxWidth: 360 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Posts</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleUsers.map((u) => (
                                <TableRow key={u.id} hover>
                                    <TableCell>{u.fName} {u.lName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{formatDate(u.dateOfBirth)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.userType}
                                            size="small"
                                            color={u.userType === 'user' ? 'default' : 'primary'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{u.Postnum ?? 0}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            {u.userType === 'user' && (
                                                <Button size="small" onClick={() => handlePromote(u.id)}>
                                                    Promote to Admin
                                                </Button>
                                            )}
                                            <Button size="small" color="error" onClick={() => setPendingRemoveId(u.id)}>
                                                Remove
                                            </Button>
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
                title="Remove user?"
                message="This action cannot be undone. Are you sure you want to proceed?"
                confirmLabel="Remove"
                onConfirm={confirmRemove}
                onCancel={() => setPendingRemoveId(null)}
            />
        </Box>
    );
}

export default AllUsersAdminOnly;
