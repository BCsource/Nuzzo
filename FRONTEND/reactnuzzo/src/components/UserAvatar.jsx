import { Avatar } from '@mui/material';
import { imageUrl } from '../services/apiClient';

// se nao houver foto mostra inicial nome

function UserAvatar({ user, size = 36 }) {
    const name = user ? `${user.fName || user.name || ''} ${user.lName || ''}`.trim() : '';
    const initial = name ? name[0].toUpperCase() : '?';

    return (
        <Avatar
            src={imageUrl(user && user.profilePicture)}
            alt={name}
            sx={{ width: size, height: size }}
        >
            {initial}
        </Avatar>
    );
}

export default UserAvatar;
