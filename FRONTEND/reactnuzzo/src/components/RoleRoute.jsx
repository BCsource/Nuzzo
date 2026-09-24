import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/useAuth';


//protege páginas restritas para badge/admin only.

function RoleRoute({ children, permission }) {
    const { currentUser, permissions, loading } = useAuth();

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

    if (!permissions[permission]) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;
