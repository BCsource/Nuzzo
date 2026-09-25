import { Box, Typography, Stack, IconButton, Link, Divider, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import GitHubIcon from '@mui/icons-material/GitHub';
import wordmark from '../assets/img/nuzzo-wordmark.png';

// Redes sociais do Nuzzo. Troca os endereços quando tiveres as contas criadas.
// O TikTok não tem ícone próprio no MUI, por isso usa-se o da nota musical.
const SOCIAL_LINKS = [
    { label: 'Facebook', href: 'https://www.facebook.com/', icon: <FacebookIcon /> },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: <InstagramIcon /> },
    { label: 'TikTok', href: 'https://www.tiktok.com/', icon: <MusicNoteIcon /> },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: <YouTubeIcon /> },
];

function Footer() {
    return (
        <Box component="footer" className="nuzzo-footer" sx={{ py: 4, px: 2 }}>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <img src={wordmark} alt="Nuzzo" className="nz-wordmark" />

                <Stack
                    direction="row"
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    <Link component={RouterLink} to="/terms" variant="body2" underline="hover">
                        Terms of Service
                    </Link>
                    <Link component={RouterLink} to="/privacy" variant="body2" underline="hover">
                        Privacy Policy
                    </Link>
                </Stack>

                <Stack direction="row" spacing={0.5}>
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

                <Typography variant="caption" color="text.secondary">
                    &copy; {new Date().getFullYear()} Nuzzo
                </Typography>
            </Stack>
        </Box>
    );
}

export default Footer;
