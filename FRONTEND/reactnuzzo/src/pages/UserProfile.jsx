
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Button, Alert, CircularProgress, Paper, Stack,
    Card, CardContent, CardActions, Chip, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchUserById, fetchUserPosts, fetchUserPets } from '../services/userService';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';
import { GENDER_LABELS } from '../utils/petOptions';
import ProfileHeader from '../components/ProfileHeader';
import BadgeChip from '../components/BadgeChip';
import PostCardList from '../components/PostCardList';
import UserAvatar from '../components/UserAvatar';

function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        try {
            const [userData, postsData, petsData] = await Promise.all([
                fetchUserById(userId),
                fetchUserPosts(userId),
                fetchUserPets(userId),
            ]);
            setUser(userData);
            setPosts(postsData);
            setPets(petsData);
            setError('');
        } catch (error) {
            setError(getErrorMessage(error, "Couldn't load this profile."));
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { (async () => { await load(); })(); }, [load]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
                <Alert severity="error">{error || 'User not found.'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: 3 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="go back" sx={{ mb: 1 }}>
                <ArrowBackIcon />
            </IconButton>

            <ProfileHeader
                subject={user}
                title={`${user.fName} ${user.lName}`}
                chips={(user.badges || []).map((badge) => <BadgeChip key={badge} badge={badge} />)}
                facts={[
                    { label: 'Member since', value: formatDate(user.createdAt) },
                    { label: 'Posts', value: posts.length },
                    { label: 'Pets', value: pets.length },
                ]}
            />

            {user.bio && (
                <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>About</Typography>
                    <Typography variant="body1" className="nz-user-text">{user.bio}</Typography>
                </Paper>
            )}

            {pets.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Pets</Typography>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
                        {pets.map((pet) => (
                            <Card key={pet.id} sx={{ width: 240 }}>
                                <CardContent>
                                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                        <UserAvatar user={pet} size={56} />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="h6" noWrap>{pet.name}</Typography>
                                            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                <Chip label={pet.species} size="small" className="nz-chip nz-chip--species" />
                                                <Chip
                                                    label={GENDER_LABELS[pet.gender] || pet.gender}
                                                    size="small"
                                                    className={`nz-chip nz-chip--${pet.gender}`}
                                                />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={RouterLink} to={`/pets/${pet.id}`}>View</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>Posts</Typography>
                {posts.length === 0
                    ? <Typography color="text.secondary">No posts yet.</Typography>
                    : <PostCardList posts={posts} />}
            </Box>
        </Box>
    );
}

export default UserProfile;
