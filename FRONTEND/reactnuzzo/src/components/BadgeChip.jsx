import { Chip, Avatar } from '@mui/material';
import { BADGE_LABELS, BADGE_IMAGES, BADGE_COLORS } from '../utils/badgeOptions';

function BadgeChip({ badge, size = 'small' }) {
    return (
        <Chip
            avatar={<Avatar src={BADGE_IMAGES[badge]} alt="">{BADGE_LABELS[badge][0]}</Avatar>}
            label={BADGE_LABELS[badge] || badge}
            size={size}
            className={`nz-chip nz-chip--${BADGE_COLORS[badge] || 'default'}`}
        />
    );
}

export default BadgeChip;
