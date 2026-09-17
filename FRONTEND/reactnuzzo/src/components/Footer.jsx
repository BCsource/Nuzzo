import { Box, Typography } from '@mui/material';
import wordmark from '../assets/img/nuzzo-wordmark.png';

function Footer() {
    return (
        <Box
            component="footer"
            className="nuzzo-footer"
            sx={{
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <img src={wordmark} alt="Nuzzo" className="nz-wordmark" />
            <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()}
            </Typography>
        </Box>
    );
}

export default Footer;