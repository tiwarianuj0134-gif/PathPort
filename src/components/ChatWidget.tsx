import React, { useState } from 'react';
import {
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, CircularProgress, Avatar,
} from '@mui/material';
import { Chat as ChatIcon, Close, SmartToy, Person } from '@mui/icons-material';
import { aiService } from '../services/aiServices';

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);
    try {
      const response = await aiService.support(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        size="medium"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { m: 2, maxHeight: '80vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy sx={{ color: '#00d4ff', fontSize: 20 }} />
            <Typography fontWeight={600} fontSize="0.95rem">PathPort Support</Typography>
          </Box>
          <Button size="small" onClick={() => setOpen(false)} sx={{ minWidth: 0, p: 0.5 }}>
            <Close sx={{ fontSize: 18 }} />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ minHeight: 260, maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.5 }}>
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SmartToy sx={{ fontSize: 36, color: '#1a73e8', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Ask me about PathPort features or career terms!
                </Typography>
              </Box>
            )}
            {messages.map((msg, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ width: 26, height: 26, background: msg.role === 'user' ? 'linear-gradient(135deg, #1a73e8, #00d4ff)' : 'rgba(255,179,0,0.3)', flexShrink: 0 }}>
                  {msg.role === 'user' ? <Person sx={{ fontSize: 14 }} /> : <SmartToy sx={{ fontSize: 14 }} />}
                </Avatar>
                <Box sx={{
                  maxWidth: '80%', p: 1.2, borderRadius: 2,
                  background: msg.role === 'user' ? 'rgba(26,115,232,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(26,115,232,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <Typography variant="caption" sx={{ lineHeight: 1.5, color: 'text.primary' }}>{msg.content}</Typography>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={18} sx={{ color: '#00d4ff' }} />
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Type your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} size="small" sx={{ color: 'text.secondary' }}>Close</Button>
          <Button onClick={handleSend} variant="contained" size="small" disabled={loading || !message.trim()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatWidget;
