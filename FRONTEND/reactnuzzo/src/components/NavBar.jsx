import { useState, useEffect, useCallback } from 'react';
import {
    AppBar, Toolbar, Button, Box, IconButton,
    Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Badge, Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/useAuth';
import logo from '../assets/img/Final Logo.png';
import UserAvatar from './UserAvatar';
import { fetchNotifications } from '../services/notificationService';

export const SIDEBAR_WIDTH = 280;

function NavBar() {
    const { currentUser, permissions, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

    const [confirmLogout, setConfirmLogout] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState({});
    const loadNotifications = useCallback(async () => {
        if (!currentUser) return;
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Could not load notifications:', error);
        }
    }, [currentUser]);

    useEffect(() => {
        (async () => { await loadNotifications(); })();
        const timer = setInterval(() => { loadNotifications(); }, 30000);
        return () => clearInterval(timer);
    }, [loadNotifications, pathname]);

    function handleLogout() {
        setConfirmLogout(false);
        setDrawerOpen(false);
        logout();
        navigate('/login');
    }

    const loggedInLinks = [
        { to: '/', label: 'Feed' },
        { to: '/posts/new', label: 'New Post' },
        { to: '/my-posts', label: 'My Posts', count: notifications.comments },
        { to: '/my-pets', label: 'My Pets' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/messages', label: 'Messages', count: notifications.messages },
        { to: '/profile', label: 'Profile' },
        //admin link
        ...(permissions.canManageUsers
            ? [
                { to: '/users', label: 'Users', count: notifications.activationRequests },
                { to: '/admin/badge-requests', label: 'Badge Requests', count: notifications.badgeRequests },
            ]
            : []),
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
                        {link.count > 0 && (
                            <Badge badgeContent={link.count} color="error" sx={{ mr: 1.5 }} />
                        )}
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
            className="nuzzo-brand"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
            <img src={logo} alt="Nuzzo" className="nz-sidebar-logo" />
        </Box>
    );


    const welcome = currentUser ? (
        <Box className="nuzzo-welcome">
            <UserAvatar user={currentUser} size={40} />
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">Welcome</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {currentUser.fName} {currentUser.lName}
                </Typography>
            </Box>
        </Box>
    ) : null;

    return (
        <>
            {/*DESKTOP*/}
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
                {welcome}
                {navList}
            </Drawer>

            {/*TELEMOVEL*/}
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
                <Box sx={{ width: '80vw', maxWidth: SIDEBAR_WIDTH }} role="presentation">
                    {brand}
                    {welcome}
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