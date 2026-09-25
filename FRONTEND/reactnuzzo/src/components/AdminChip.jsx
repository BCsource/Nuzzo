
import { Chip } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

function AdminChip({ isMasterAdmin = false, size = 'small' }) {
    return (
        <Chip
            icon={<ShieldIcon />}
            label={isMasterAdmin ? 'Master Admin' : 'Admin'}
            size={size}
            className={`nz-chip ${isMasterAdmin ? 'nz-chip--master-admin' : 'nz-chip--admin'}`}
        />
    );
}

export default AdminChip;
