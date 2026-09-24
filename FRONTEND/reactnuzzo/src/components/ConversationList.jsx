
import { List, ListItemButton, ListItemText, Typography, Divider, Box } from '@mui/material';
import { formatDate } from '../utils/postDisplay';

function ConversationList({ conversations, selectedKey, onSelect }) {
    if (conversations.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">
                    No conversations yet. Open a post and choose "Message the author" to start one.
                </Typography>
            </Box>
        );
    }

    return (
        <List disablePadding>
            {conversations.map((conversation, index) => {
                const key = `${conversation.post.id}-${conversation.participantId}`;
                const other = conversation.otherUser;
                const last = conversation.lastMessage;

                return (
                    <Box key={key}>
                        {index > 0 && <Divider />}
                        <ListItemButton selected={key === selectedKey} onClick={() => onSelect(conversation)}>
                            <ListItemText
                                primary={other ? `${other.fName} ${other.lName}` : 'Removed user'}
                                secondary={
                                    <>
                                        <Typography component="span" variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                            {conversation.post.title}
                                        </Typography>
                                        <Typography component="span" variant="body2" noWrap sx={{ display: 'block' }}>
                                            {last.isMine ? 'You: ' : ''}{last.content}
                                        </Typography>
                                        <Typography component="span" variant="caption" color="text.secondary">
                                            {formatDate(last.createdAt, true)}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItemButton>
                    </Box>
                );
            })}
        </List>
    );
}

export default ConversationList;
