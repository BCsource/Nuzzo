import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/useAuth';


//protege páginas restritas para badge/admin only.


function RoleRoute({ children, roles = [], badges = [] }) {
    const { currentUser, loading, isAdmin, hasBadge } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    let allowed = isAdmin;

    if (!allowed && roles.length > 0) {
        allowed = roles.includes(currentUser.userType);
    }
    if (!allowed && badges.length > 0) {
        allowed = badges.some((badge) => hasBadge(badge));
    }

    if (!allowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;
