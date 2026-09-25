import { Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StaticPage from './StaticPage';

// landing page do purchase
function ComingSoon() {
    return (
        <StaticPage title="Coming soon">
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Typography variant="body1" color="text.secondary">
                    Buying products is still under development. Meanwhile, you can message the
                    supplier directly from the post to ask about it.
                </Typography>
                <Button variant="contained" component={RouterLink} to="/">Back to the feed</Button>
            </Stack>
        </StaticPage>
    );
}

export default ComingSoon;
