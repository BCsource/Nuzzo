
import { Box, Typography, Stack, IconButton, Link, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import GitHubIcon from '@mui/icons-material/GitHub';
import wordmark from '../assets/img/nuzzo-wordmark.png';

const SOCIAL_LINKS = [
    { label: 'Facebook', href: 'https://www.facebook.com/', icon: <FacebookIcon /> },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: <InstagramIcon /> },
    { label: 'TikTok', href: 'https://www.tiktok.com/', icon: <MusicNoteIcon /> },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: <YouTubeIcon /> },
];

//responsividade desktop
function Separator() {
    return (
        <Typography
            component="span"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'inline' }, px: 1.5 }}
        >
            ·
        </Typography>
    );
}

function Footer() {
    return (
        <Box component="footer" className="nuzzo-footer" sx={{ py: { xs: 3, md: 2 }, px: 2 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 1.5, md: 0 }}
                sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <img src={wordmark} alt="Nuzzo" className="nz-wordmark" />

                <Separator />

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Created by Bruna Caetano
                    </Typography>
                    <Tooltip title="GitHub repository">
                        <IconButton
                            component="a"
                            href="https://github.com/BCsource/Nuzzo"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub repository"
                            size="small"
                        >
                            <GitHubIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Separator />

                <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {SOCIAL_LINKS.map((social) => (
                        <Tooltip key={social.label} title={social.label}>
                            <IconButton
                                component="a"
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={social.label}
                                size="small"
                            >
                                {social.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Stack>

                <Separator />

                <Typography variant="body2" color="text.secondary">
                    &copy; {new Date().getFullYear()}
                </Typography>
            </Stack>
            <Stack
                direction="row"
                spacing={0.5}
                sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 1.5 }}
            >
                {SOCIAL_LINKS.map((social) => (
                    <Tooltip key={social.label} title={social.label}>
                        <IconButton
                            component="a"
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            size="small"
                        >
                            {social.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Stack>
            <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: 'center', alignItems: 'center', mt: { xs: 1.5, md: 1 } }}
            >
                <Link component={RouterLink} to="/terms" variant="caption" underline="hover" color="text.secondary">
                    Terms of Service
                </Link>
                <Typography component="span" variant="caption" color="text.secondary">·</Typography>
                <Link component={RouterLink} to="/privacy" variant="caption" underline="hover" color="text.secondary">
                    Privacy Policy
                </Link>
                <Typography component="span" variant="caption" color="text.secondary">·</Typography>
                <Link component={RouterLink} to="/contact" variant="caption" underline="hover" color="text.secondary">
                    Contact us
                </Link>
            </Stack>
        </Box>
    );
}

export default Footer;
