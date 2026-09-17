import { useState } from 'react';
import {
    AppBar, Toolbar, Button, Box, IconButton,
    Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/useAuth';
import wordmark from '../assets/img/nuzzo-wordmark.png';

export const SIDEBAR_WIDTH = 240;

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

    const navList = (
        <List className="nuzzo-nav-list">
            {links.map((link) => (
                <ListItem key={link.to} disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to={link.to}
                        selected={isActive(link.to)}
                        className={`nuzzo-nav-item ${isActive(link.to) ? 'nuzzo-nav-active' : ''}`}
                        onClick={() => setDrawerOpen(false)}
                    >
                        <ListItemText primary={link.label} />
                    </ListItemButton>
                </ListItem>
            ))}

            {currentUser && (
                <>
                    <Divider sx={{ my: 1 }} />
                    <ListItem disablePadding>
                        <ListItemButton
                            className="nuzzo-nav-item"
                            onClick={() => { setDrawerOpen(false); setConfirmLogout(true); }}
                        >
                            <ListItemText primary="Log Off" />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
        </List>
    );

    const brand = (
        <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', px: 2, py: 3 }}
        >
            <Typography sx={{ fontWeight: 900, fontSize: 22, color: 'var(--nz-text)' }}>
                Nuzzo
            </Typography>
        </Box>
    );

    return (
        <>
            {/* DESKTOP — barra lateral fixa à esquerda */}
            <Drawer
                variant="permanent"
                className="nuzzo-sidebar"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {brand}
                {navList}
            </Drawer>

            {/* TELEMÓVEL — barra no topo só com o menu */}
            <AppBar position="sticky" className="nuzzo-navbar" sx={{ display: { xs: 'block', md: 'none' } }}>
                <Toolbar sx={{ minHeight: 64 }}>
                    <Box sx={{ flexGrow: 1 }}>{brand}</Box>
                    <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="open menu">
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box sx={{ width: SIDEBAR_WIDTH }} role="presentation">
                    {brand}
                    {navList}
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
        </>
    );
}

export default NavBar;
