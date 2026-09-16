import { useState } from 'react';
import {
    AppBar, Toolbar, Button, Typography, Box, IconButton,
    Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/useAuth';

function NavBar() {
    const { currentUser, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

    const [confirmLogout, setConfirmLogout] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    function handleLogout() {
        setConfirmLogout(false);
        setDrawerOpen(false);
        logout();
        navigate('/login');
    }

    const loggedInLinks = [
        { to: '/', label: 'Feed' },
        { to: '/posts/new', label: 'New Post' },
        { to: '/my-posts', label: 'My Posts' },
        { to: '/my-pets', label: 'My Pets' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/profile', label: 'Profile' },
        ...(isAdmin ? [{ to: '/users', label: 'Users' }] : []),
    ];

    const loggedOutLinks = [
        { to: '/login', label: 'Log in' },
        { to: '/register', label: 'Register' },
    ];

    const links = currentUser ? loggedInLinks : loggedOutLinks;

    return (
        <AppBar position="static" className="nuzzo-navbar">
            <Toolbar sx={{ minHeight: 72 }}>
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1, flexGrow: 1 }}
                >
                    <Typography sx={{ fontWeight: 900, fontSize: 22, color: 'var(--nz-text)' }}>
                        Nuzzo
                    </Typography>
                </Box>

                <Box className="nuzzo-nav-desktop" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                    {links.map((l) => (
                        <Button
                            key={l.to}
                            color="inherit"
                            component={RouterLink}
                            to={l.to}
                            className={isActive(l.to) ? 'nuzzo-nav-active' : ''}
                        >
                            {l.label}
                        </Button>
                    ))}
                    {currentUser && (
                        <Button color="inherit" onClick={() => setConfirmLogout(true)}>
                            Log Off
                        </Button>
                    )}
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="abrir menu">
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {links.map((l) => (
                            <ListItem key={l.to} disablePadding>
                                <ListItemButton
                                    component={RouterLink}
                                    to={l.to}
                                    selected={isActive(l.to)}
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <ListItemText primary={l.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {currentUser && (
                            <>
                                <Divider />
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setDrawerOpen(false); setConfirmLogout(true); }}>
                                        <ListItemText primary="Log Off" />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
                <DialogTitle>Log off?</DialogTitle>
                <DialogContent>
                    <DialogContentText>You need to log in again.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmLogout(false)}>Cancel</Button>
                    <Button color="error" onClick={handleLogout}>Log Off</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
}

export default NavBar;
