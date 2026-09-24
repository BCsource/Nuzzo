import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Stack, Chip, Button, CircularProgress,
    Alert, TextField, Divider, Link,
} from '@mui/material';
import { fetchPendingBadgeRequests, reviewBadgeRequest } from '../services/userService';
import { BADGE_LABELS } from '../utils/badgeOptions';
import { getErrorMessage } from '../utils/apiErrors';
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
            setError(getErrorMessage(error, 'Could not load badge requests.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    async function handleReview(requestId, approved) {
        try {
            await reviewBadgeRequest(requestId, approved, rejectReasons[requestId] || '');
            setRequests((prev) => prev.filter((r) => r.id !== requestId));
        } catch (error) {
            setError(getErrorMessage(error, 'Could not review this request.'));
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
            <Typography variant="h4" gutterBottom>Badge Requests</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {requests.length === 0 ? (
                <Typography color="text.secondary">No pending requests.</Typography>
            ) : (
                <Stack spacing={2}>
                    {requests.map((request) => (
                        <Paper key={request.id} variant="outlined" sx={{ p: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                                {request.user.fName} {request.user.lName} ({request.user.email})
                            </Typography>
                            <Stack direction="row" sx={{ my: 1, flexWrap: 'wrap', gap: 1 }}>
                                {request.requestedBadges.map((badge) => (
                                    <Chip key={badge} label={BADGE_LABELS[badge] || badge} size="small" />
                                ))}
                            </Stack>
                            <Typography variant="body2" sx={{ mb: 1 }}>{request.message}</Typography>
                            {request.fileUrl && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <Link href={request.fileUrl} target="_blank" rel="noreferrer">View credential</Link>
                                </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                Requested on {formatDate(request.createdAt, true)}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <TextField
                                label="Reason (if rejecting)"
                                size="small"
                                fullWidth
                                sx={{ mb: 1.5 }}
                                value={rejectReasons[request.id] || ''}
                                onChange={(e) => setRejectReasons((prev) => ({ ...prev, [request.id]: e.target.value }))}
                            />

                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" onClick={() => handleReview(request.id, true)}>
                                    Approve
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={() => handleReview(request.id, false)}>
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
