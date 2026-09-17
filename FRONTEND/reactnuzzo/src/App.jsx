import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import BadgeRequest from './pages/BadgeRequest';
import AllUsersAdminOnly from './pages/AllUsersAdminOnly';
import BadgeRequestsQueue from './pages/BadgeRequestsQueue';
import NewPost from './pages/NewPost';
import ViewPost from './pages/ViewPost';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';
import Favorites from './pages/Favorites';
import NewPetProfile from './pages/NewPetProfile';
import ViewPetProfile from './pages/ViewPetProfile';
import EditPetProfile from './pages/EditPetProfile';
import MyPets from './pages/MyPets';

import { ADMIN_ROLES } from './utils/badgeOptions';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import SessionTimeout from './components/SessionTimeout';

function App() {
    const { pathname } = useLocation();
    const hideNav = pathname === '/login' || pathname === '/register';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            {!hideNav && <NavBar />}
            <SessionTimeout />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}></Box>
            <Box component="main" sx={{ flex: 1 }}>
                <Routes>

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />


                    <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

                    <Route path="/posts/new" element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
                    <Route path="/posts/:postId" element={<ProtectedRoute><ViewPost /></ProtectedRoute>} />
                    <Route path="/posts/:postId/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
                    <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

                    <Route path="/pets/new" element={<ProtectedRoute><NewPetProfile /></ProtectedRoute>} />
                    <Route path="/pets/:petId" element={<ProtectedRoute><ViewPetProfile /></ProtectedRoute>} />
                    <Route path="/pets/:petId/edit" element={<ProtectedRoute><EditPetProfile /></ProtectedRoute>} />
                    <Route path="/my-pets" element={<ProtectedRoute><MyPets /></ProtectedRoute>} />

                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route path="/profile/badges" element={<ProtectedRoute><BadgeRequest /></ProtectedRoute>} />


                    <Route
                        path="/users"
                        element={<RoleRoute roles={ADMIN_ROLES}><AllUsersAdminOnly /></RoleRoute>}
                    />
                    <Route
                        path="/admin/badge-requests"
                        element={<RoleRoute roles={ADMIN_ROLES}><BadgeRequestsQueue /></RoleRoute>}
                    />

                    {/* rota desconhecida -> feed/login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Box>

            <Footer />
        </Box>
        </Box >
   
    );
}

export default App;
