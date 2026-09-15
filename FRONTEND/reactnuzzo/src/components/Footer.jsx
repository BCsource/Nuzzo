import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box component="footer" className="nuzzo-footer" sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
                Nuzzo &copy; {new Date().getFullYear()}
            </Typography>
        </Box>
    );
}

export default Footer;
