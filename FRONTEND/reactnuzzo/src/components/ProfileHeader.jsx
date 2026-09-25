
import { Box, Typography, Stack, Paper } from '@mui/material';
import UserAvatar from './UserAvatar';


function ProfileHeader({ subject, title, subtitle, chips, facts = [], actions }) {
    return (
        <Paper className="nz-profile-header" variant="outlined">
            <Box className="nz-profile-header__banner" />

            <Box className="nz-profile-header__body">
                <Box className="nz-profile-header__avatar">
                    <UserAvatar user={subject} size={120} />
                </Box>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h4" sx={{ lineHeight: 1.2 }}>{title}</Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
                        )}
                        {chips && (
                            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                                {chips}
                            </Stack>
                        )}
                    </Box>

                    {actions && (
                        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, flexWrap: 'wrap', gap: 1 }}>
                            {actions}
                        </Stack>
                    )}
                </Stack>
                {facts.length > 0 && (
                    <Stack direction="row" className="nz-profile-facts" sx={{ flexWrap: 'wrap', mt: 2 }}>
                        {facts.map((fact) => (
                            <Box key={fact.label} className="nz-profile-facts__item">
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {fact.label}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {fact.value}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Paper>
    );
}

export default ProfileHeader;
