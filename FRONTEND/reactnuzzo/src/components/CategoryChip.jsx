
import { Chip } from '@mui/material';

function CategoryChip({ category, size = 'small' }) {
    return <Chip label={category} size={size} variant="outlined" className="nz-chip nz-chip--category" />;
}

export default CategoryChip;
