
import { Chip } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SpaIcon from '@mui/icons-material/Spa';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PollIcon from '@mui/icons-material/Poll';
import { postTypeLabel } from '../utils/postDisplay';

const TYPE_ICONS = {
    regular: <PetsIcon />,
    health: <LocalHospitalIcon />,
    care: <SpaIcon />,
    product: <ShoppingBagIcon />,
    adoption: <FavoriteIcon />,
    poll: <PollIcon />,
};

function PostTypeChip({ postType, size = 'small' }) {
    return (
        <Chip
            icon={TYPE_ICONS[postType]}
            label={postTypeLabel(postType)}
            size={size}
            className={`nz-chip nz-chip--${postType}`}
        />
    );
}

export default PostTypeChip;
