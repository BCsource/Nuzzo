
import { Box, Stack, Typography } from '@mui/material';
import StaticPage from './StaticPage';

function Privacy() {
    return (
        <StaticPage title="Privacy Policy">
            <Stack spacing={4}>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Last updated: 25 September 2026
                    </Typography>

                    <Typography variant="body1">
                        At <strong>Nuzzo</strong>, we care about your privacy and aim
                        to be transparent about how personal data is handled when
                        you use our platform.
                    </Typography>

                    <Typography variant="body1">
                        This Privacy Policy explains what information we collect,
                        why we use it, how it is stored and shared, and the choices
                        and rights available to you.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        1. Who We Are
                    </Typography>

                    <Typography variant="body1">
                        For the purposes of applicable data protection law, the
                        entity or person responsible for processing your personal
                        data is:
                    </Typography>

                    <Typography variant="body1">
                        <strong>Nuzzo / BRUNA CAETANO</strong>
                        <br />
                        Github: <strong>BCsource</strong>
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        2. What Information We Collect
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Account and Profile Information
                    </Typography>

                    <Typography variant="body1">
                        When you create an account, we may collect:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">email address;</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                first and last name;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                date of birth;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                profile biography and profile picture;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                account role and badge information.
                            </Typography>
                        </li>
                    </Box>

                    <Typography variant="body1">
                        Your password is processed for authentication purposes and
                        is stored in protected, hashed form rather than as plain text.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Pet Information
                    </Typography>

                    <Typography variant="body1">
                        When you create a pet profile, you may provide information
                        such as:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                pet name, species, and breed;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                gender and date of birth;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                weight;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                vaccination status;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                spaying or neutering status;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                profile picture;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                health-history information.
                            </Typography>
                        </li>
                    </Box>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Community Content
                    </Typography>

                    <Typography variant="body1">
                        When using community features, we may process posts,
                        descriptions, photographs, comments, favourites,
                        tagged pet profiles, and publication information.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Messages
                    </Typography>

                    <Typography variant="body1">
                        If you use private messaging, we process the messages you
                        send and receive, together with the accounts and posts
                        associated with those conversations.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Professional Badge Requests
                    </Typography>

                    <Typography variant="body1">
                        If you request a professional badge, we may collect
                        information about your professional experience, badge type,
                        certificates or supporting documents, and the status of
                        the review.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        3. How We Use Your Information
                    </Typography>

                    <Typography variant="body1">
                        We use personal data for purposes including:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                creating and managing user accounts;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                authenticating users and protecting accounts;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                providing profiles, pet profiles, posts, comments,
                                favourites, and messaging;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                storing and displaying content submitted by users;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                managing professional badge requests;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                maintaining and improving the functionality
                                of the platform;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                preventing misuse, fraud, or unauthorised access;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                enforcing our Terms of Service;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                complying with legal obligations where applicable.
                            </Typography>
                        </li>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        4. Legal Bases for Processing
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Performance of a Contract
                    </Typography>

                    <Typography variant="body1">
                        We may process information where it is necessary to provide
                        the Nuzzo services you request, including account creation,
                        authentication, profiles, messaging, and other platform
                        functionality.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Legitimate Interests
                    </Typography>

                    <Typography variant="body1">
                        We may process information where it is necessary for
                        legitimate interests such as maintaining platform security,
                        preventing abuse, administering the service, and protecting
                        users.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Legal Obligations
                    </Typography>

                    <Typography variant="body1">
                        We may process or retain information where necessary to
                        comply with a legal obligation.
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Consent
                    </Typography>

                    <Typography variant="body1">
                        Where applicable, we may ask for your consent before
                        processing information for a specific purpose. Where
                        processing is based on consent, you may withdraw that
                        consent at any time.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        5. How Your Content Is Shared
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is a community platform, so some information is
                        intentionally made available to other users.
                    </Typography>

                    <Typography variant="body1">
                        Content that you publish through posts, comments, pet
                        profiles, or your public-facing profile may be visible
                        to other authenticated users depending on the feature
                        and its permissions.
                    </Typography>

                    <Typography variant="body1">
                        Private messages are intended for the relevant participants
                        and authorised users associated with the conversation.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        6. Who May Receive Your Information
                    </Typography>

                    <Typography variant="body1">
                        Personal data may be accessed by:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                you, through your own account;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                other users where information is intentionally
                                shared through community features;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                authorised Nuzzo administrators;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                authorised professional users where platform
                                permissions allow access;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                technical service providers, where applicable;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                public authorities or other recipients where
                                disclosure is required by law.
                            </Typography>
                        </li>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        7. Data Retention
                    </Typography>

                    <Typography variant="body1">
                        We retain personal data only for as long as reasonably
                        necessary for the purposes described in this Privacy Policy,
                        unless a longer retention period is required or permitted
                        by law.
                    </Typography>

                    <Typography variant="body1">
                        Please note that Nuzzo currently uses account deactivation
                        rather than immediate permanent deletion. Deactivating an
                        account may therefore not result in the immediate removal
                        of all associated information.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        8. Security
                    </Typography>

                    <Typography variant="body1">
                        We use reasonable technical and organisational measures to
                        protect personal data against unauthorised access,
                        alteration, disclosure, loss, or destruction.
                    </Typography>

                    <Typography variant="body1">
                        However, no online system can be guaranteed to be completely
                        secure. Users should also protect their account credentials
                        and avoid sharing passwords or authentication information
                        with others.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        9. International Data Transfers
                    </Typography>

                    <Typography variant="body1">
                        Depending on the infrastructure and service providers used
                        by Nuzzo, personal data may be processed in countries outside
                        the European Economic Area (EEA). Where required, appropriate
                        safeguards will be used for such transfers.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        10. Cookies and Similar Technologies
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may use browser storage required for essential
                        functionality, including authentication and session management.
                    </Typography>

                    <Typography variant="body1">
                        The current application uses local browser storage for
                        authentication tokens and session-expiration information.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        11. Your Data Protection Rights
                    </Typography>

                    <Typography variant="body1">
                        Depending on applicable law, you may have rights including:
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                        <li>
                            <Typography variant="body1">
                                access to your personal data;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                correction of inaccurate information;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                deletion of personal data in certain circumstances;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                restriction of processing in certain circumstances;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                objection to certain processing;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                data portability where applicable;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                withdrawal of consent where processing is based
                                on consent.
                            </Typography>
                        </li>
                    </Box>

                    <Typography variant="body1">
                        To exercise your rights, contact us at{' '}
                        <strong>legal@nuzzo.com</strong>.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        12. Children's Privacy
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo is intended for users aged 18 and over. We do not
                        knowingly allow individuals under the age of 18 to create
                        accounts.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        13. Automated Decision-Making
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo does not currently rely on automated decision-making
                        or profiling to make decisions that produce legal or
                        similarly significant effects on users.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        14. Third-Party Websites and Services
                    </Typography>

                    <Typography variant="body1">
                        Nuzzo may contain links or user-provided links to third-party
                        websites or services. We are not responsible for the privacy
                        practices, security, or content of third-party websites.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        15. Changes to This Privacy Policy
                    </Typography>

                    <Typography variant="body1">
                        We may update this Privacy Policy when our platform,
                        data-processing practices, or legal obligations change.
                        The latest version will always be identified by its
                        "Last updated" date.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        16. Contact Us
                    </Typography>

                    <Typography variant="body1">
                        If you have questions, concerns, or requests relating
                        to privacy or personal data, please contact:
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

export default Privacy;