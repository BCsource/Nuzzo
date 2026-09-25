import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Card, CardContent, CardActions, Typography, Stack, Box, Chip,
    IconButton, Tooltip, Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserAvatar from './UserAvatar';
import { GENDER_LABELS } from '../utils/petOptions';

function PetCard({ pet, onToggleFavourite, onDelete }) {
    const navigate = useNavigate();

    function openPet() {
        navigate(`/pets/${pet.id}`);
    }

    function stop(event) {
        event.stopPropagation();
    }

    return (
        <Card
            className="nz-post-card"
            onClick={openPet}
            sx={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <UserAvatar user={pet} size={64} />
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

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {pet.breed}
                </Typography>

                {pet.bio && (
                    <Typography variant="body2" color="text.secondary" className="nz-post-card__text" sx={{ mt: 1 }}>
                        {pet.bio}
                    </Typography>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }} onClick={stop}>
                <Button size="small" component={RouterLink} to={`/pets/${pet.id}`} startIcon={<VisibilityIcon />}>
                    View
                </Button>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', mr: 0.5 }}>
                        <FavoriteIcon fontSize="inherit" color="error" />
                        <Typography variant="caption" color="text.secondary">{pet.favouritesCount ?? 0}</Typography>
                    </Stack>

                    {onDelete && pet.permissions.canEdit && (
                        <>
                            <Tooltip title="Edit pet">
                                <IconButton size="small" component={RouterLink} to={`/pets/${pet.id}/edit`} aria-label="edit pet">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete pet">
                                <IconButton size="small" onClick={() => onDelete(pet.id)} aria-label="delete pet">
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    {!onDelete && !pet.isOwner && onToggleFavourite && (
                        <Tooltip title={pet.isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
                            <IconButton
                                size="small"
                                onClick={() => onToggleFavourite(pet)}
                                color={pet.isFavourite ? 'error' : 'default'}
                                aria-label="toggle pet favourite"
                            >
                                {pet.isFavourite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </CardActions>
        </Card>
    );
}

export default PetCard;
