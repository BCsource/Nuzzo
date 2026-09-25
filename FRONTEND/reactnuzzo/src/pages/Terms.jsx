
import { Box, Stack, Typography } from '@mui/material';
import StaticPage from './StaticPage';

function Terms() {
    return (
        <StaticPage title="Terms of Service">
            <Stack spacing={4}>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Last updated: 25 September 2026
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Welcome to <strong>Nuzzo</strong>. Nuzzo is a community platform
                        designed for people who care about animals, allowing users to
                        create pet profiles, share posts and information, interact with
                        other members, communicate privately, and connect around
                        animal care and adoption-related topics.
                    </Typography>

                    <Typography variant="body1">
                        By creating an account or using Nuzzo, you agree to these
                        Terms of Service. If you do not agree with these Terms,
                        please do not use the platform.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        1. Eligibility
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is intended for users who are <strong>18 years of age
                            or older</strong>.
                    </Typography>

                    <Typography variant="body1">
                        By registering for an account, you confirm that you meet this
                        age requirement and that the information you provide is
                        accurate and complete.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        2. Your Account
                    </Typography>

                    <Typography variant="body1">
                        To use most Nuzzo features, you must create an account using
                        a valid email address, password, first name, last name,
                        and date of birth.
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                        You are responsible for:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                providing accurate and up-to-date information;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                keeping your login credentials secure;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                maintaining the confidentiality of your account;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                all activity carried out through your account.
                            </Typography>
                        </li>
                    </Box>

                    <Typography variant="body1">
                        You must not impersonate another person, create an account
                        using false information, or attempt to access another user's
                        account.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        3. Nuzzo Features
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may provide features including:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                personal profiles and user authentication;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                pet profiles and pet-related information;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                posts and community discussions;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                comments and favourites;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                private messaging and conversations;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                animal health-history information;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                adoption-related content;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                product and service-related posts;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                professional badges and verification requests.
                            </Typography>
                        </li>
                    </Box>

                    <Typography variant="body1">
                        Features may be changed, suspended, or discontinued as the
                        Nuzzo project develops.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        4. User-Generated Content
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo allows users to create and share content, including
                        text, photographs, pet information, comments, messages,
                        and other materials ("User Content").
                    </Typography>

                    <Typography variant="body1">
                        You retain ownership of the User Content you submit to Nuzzo.
                    </Typography>

                    <Typography variant="body1">
                        By submitting User Content, you grant Nuzzo a non-exclusive,
                        worldwide, royalty-free licence to store, reproduce, display,
                        and make that content available through the platform to the
                        extent necessary to operate, maintain, and improve Nuzzo.
                    </Typography>

                    <Typography variant="body1">
                        You are responsible for the content you submit and must ensure
                        that you have the necessary rights and permissions to share it.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        5. Community Standards
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is intended to be a respectful and animal-focused
                        community.
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                        You agree not to use the platform to:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                publish unlawful, fraudulent, threatening, abusive,
                                hateful, or deliberately misleading content;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                harass, intimidate, or impersonate other users;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                upload content that infringes another person's
                                intellectual property, privacy, or other rights;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                distribute malware, spam, or other harmful material;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                attempt to gain unauthorised access to the platform
                                or another user's account;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                misuse personal information obtained through Nuzzo;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                create misleading professional credentials or
                                verification information;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                use Nuzzo for activities that violate applicable laws
                                or regulations.
                            </Typography>
                        </li>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        6. Pet and Animal Information
                    </Typography>

                    <Typography variant="body1">
                        Information provided about animals, including health,
                        vaccination, weight, treatment, care, or behavioural
                        information, is supplied by users and may not be independently
                        verified by Nuzzo.
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is a platform for communication and information sharing.
                        Information available through the platform should not be
                        treated as veterinary, medical, legal, or other professional
                        advice.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        7. Adoption, Products, Services and User Transactions
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may allow users to publish adoption-related posts,
                        product-related content, service information, prices,
                        or other offers.
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo does not automatically verify the accuracy, quality,
                        legality, availability, ownership, or suitability of these
                        offers or claims.
                    </Typography>

                    <Typography variant="body1">
                        Unless expressly stated otherwise, Nuzzo is not a party to
                        transactions, adoptions, exchanges, agreements, or
                        arrangements made between users.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        8. Professional Badges
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may provide badges such as health professional,
                        care professional, or supplier badges.
                    </Typography>

                    <Typography variant="body1">
                        Badges are intended to indicate that a user's submitted
                        information or documentation has been reviewed according
                        to Nuzzo's internal process. A badge does not constitute
                        a guarantee, endorsement, certification, licence, or
                        professional recommendation by Nuzzo.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        9. Moderation and Account Actions
                    </Typography>

                    <Typography variant="body1">
                        To protect the community and maintain the integrity of the
                        platform, Nuzzo may review content and account activity where
                        reasonably necessary.
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may remove content, restrict functionality, suspend
                        an account, or deactivate an account when there are reasonable
                        grounds to believe that these Terms, applicable law, or the
                        safety of the community may have been violated.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        10. Intellectual Property
                    </Typography>

                    <Typography variant="body1">
                        The Nuzzo application, including its design, branding,
                        interface, original text, software, and other materials
                        created by or for Nuzzo, is protected by applicable
                        intellectual property laws.
                    </Typography>

                    <Typography variant="body1">
                        Except where expressly permitted, you may not copy, modify,
                        distribute, sell, reverse engineer, or commercially exploit
                        Nuzzo or its proprietary materials without appropriate
                        permission.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        11. Availability of the Service
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is provided on an evolving project basis. We aim to
                        keep the platform available and functional, but we do not
                        guarantee that the service will always be uninterrupted,
                        error-free, secure, or available.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        12. Privacy
                    </Typography>

                    <Typography variant="body1">
                        Your use of Nuzzo is also governed by our Privacy Policy,
                        which explains how personal data is collected, used,
                        stored, and protected.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        13. Changes to These Terms
                    </Typography>

                    <Typography variant="body1">
                        We may update these Terms from time to time to reflect
                        changes to the platform, applicable law, or our practices.
                    </Typography>

                    <Typography variant="body1">
                        The latest version will be identified by its "Last updated"
                        date.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        14. Governing Law
                    </Typography>

                    <Typography variant="body1">
                        These Terms are governed by the laws of <strong>PORTUGAL</strong>, without prejudice to any mandatory
                        consumer or other rights that apply to you under applicable law.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        15. Contact
                    </Typography>

                    <Typography variant="body1">
                        For questions regarding these Terms or the Nuzzo platform,
                        please contact:
                    </Typography>

                    <Typography variant="body1">
                        <strong>Nuzzo / BRUNA CAETANO</strong>
                        <br />
                        Github: <strong>BCsource</strong>
                    </Typography>
                </Box>

            </Stack>
        </StaticPage>
    );
}

export default Terms;