import { Box, Typography, Paper } from '@mui/material';


function StaticPage({ title, children }) {
    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>{title}</Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
                {children}
            </Paper>
        </Box>
    );
}

export default StaticPage;
