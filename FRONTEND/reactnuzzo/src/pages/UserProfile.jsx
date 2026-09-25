
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Alert, CircularProgress, Paper, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchUserById, fetchUserPosts, fetchUserPets } from '../services/userService';
import { addPetFavourite, removePetFavourite } from '../services/petProfileService';
import { getErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/postDisplay';
import ProfileHeader from '../components/ProfileHeader';
import BadgeChip from '../components/BadgeChip';
import PostCardList from '../components/PostCardList';
import PetCardList from '../components/PetCardList';

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

    async function handleTogglePetFavourite(pet) {
        try {
            if (pet.isFavourite) {
                await removePetFavourite(pet.id);
            } else {
                await addPetFavourite(pet.id);
            }
            setPets((prev) => prev.map((current) => {
                if (current.id !== pet.id) {
                    return current;
                }
                const favouritesCount = current.isFavourite
                    ? current.favouritesCount - 1
                    : current.favouritesCount + 1;
                return { ...current, isFavourite: !current.isFavourite, favouritesCount };
            }));
        } catch (favouriteError) {
            setError(getErrorMessage(favouriteError, 'Could not update your favourites.'));
        }
    }

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
                    <PetCardList pets={pets} onToggleFavourite={handleTogglePetFavourite} />
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
