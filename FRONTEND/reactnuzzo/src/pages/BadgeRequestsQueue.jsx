import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Stack, Chip, Button, CircularProgress,
    Alert, TextField, Divider,
} from '@mui/material';
import { fetchPendingBadgeRequests, reviewBadgeRequest } from '../services/userService';
import { BADGE_LABELS } from '../utils/badgeOptions';
import { formatDate } from '../utils/postDisplay';



function BadgeRequestsQueue() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rejectReasons, setRejectReasons] = useState({});

    const load = useCallback(async () => {
        try {
            const data = await fetchPendingBadgeRequests();
            setRequests(data);
            setError('');
        } catch (error) {
            setError("Couldn't load requests.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function handleApprove(requestId) {
        try {
            await reviewBadgeRequest(requestId, { approved: true });
            setRequests((prev) => prev.filter((r) => r.id !== requestId));
        } catch (error) {
            setError("Couldn't approve request.");
            console.error(error);
        }
    }

    async function handleReject(requestId) {
        try {
            await reviewBadgeRequest(requestId, {
                approved: false,
                rejectReason: rejectReasons[requestId] || '',
            });
            setRequests((prev) => prev.filter((r) => r.id !== requestId));
        } catch (error) {
            setError("Couldn't reject request.");
            console.error(error);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>Pending Badge Requests</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {requests.length === 0 ? (
                <Typography color="text.secondary">No pending requests.</Typography>
            ) : (
                <Stack spacing={2}>
                    {requests.map((req) => (
                        <Paper key={req.id} variant="outlined" sx={{ p: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                                {req.user?.fName} {req.user?.lName} ({req.user?.email})
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap' }}>
                                {(req.requestedBadges || []).map((b) => (
                                    <Chip key={b} label={BADGE_LABELS[b] || b} size="small" />
                                ))}
                            </Stack>
                            <Typography variant="body2" sx={{ mb: 1 }}>{req.message}</Typography>
                            {req.fileUrl && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <a href={req.fileUrl} target="_blank" rel="noreferrer">See Certificate</a>
                                </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                Requested at {formatDate(req.createdAt, true)}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <TextField
                                label="Reason (if rejected)"
                                size="small"
                                fullWidth
                                sx={{ mb: 1.5 }}
                                value={rejectReasons[req.id] || ''}
                                onChange={(e) => setRejectReasons((prev) => ({ ...prev, [req.id]: e.target.value }))}
                            />

                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" onClick={() => handleApprove(req.id)}>
                                    Approve
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={() => handleReject(req.id)}>
                                    Reject
                                </Button>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default BadgeRequestsQueue;
