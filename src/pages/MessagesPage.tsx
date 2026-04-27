import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, TextField,
  Button, CircularProgress, Alert, Divider, Paper,
} from '@mui/material';
import { Send, Message } from '@mui/icons-material';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient.get('/messages/threads')
      .then((res) => setThreads(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    apiClient.get(`/messages/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch(() => {});
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPartner = (thread: any) =>
    thread.fromUserId?._id === user?._id ? thread.toUserId : thread.fromUserId;

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await apiClient.post('/messages', { toUserId: selectedUser._id, content: input });
      setMessages((prev) => [...prev, res.data]);
      setInput('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Message sx={{ color: '#1a73e8', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Messages</Typography>
          <Typography variant="body2" color="text.secondary">Chat with your connections</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
        {/* Thread list */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', overflow: 'auto' }}>
            {threads.length === 0 ? (
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Message sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">No conversations yet. Connect with someone to start messaging.</Typography>
              </CardContent>
            ) : (
              threads.map((thread) => {
                const partner = getPartner(thread);
                const isSelected = selectedUser?._id === partner?._id;
                return (
                  <Box
                    key={thread._id}
                    onClick={() => setSelectedUser(partner)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 2, cursor: 'pointer',
                      background: isSelected ? 'rgba(26,115,232,0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #1a73e8' : '3px solid transparent',
                      transition: 'all 0.15s',
                      '&:hover': { background: 'rgba(26,115,232,0.06)' },
                    }}
                  >
                    <Avatar src={partner?.avatarUrl} sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.9rem', fontWeight: 700 }}>
                      {partner?.name?.[0]}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{partner?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{thread.content}</Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Card>
        </Grid>

        {/* Chat window */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!selectedUser ? (
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1 }}>
                <Message sx={{ fontSize: 48, color: 'text.disabled' }} />
                <Typography color="text.secondary">Select a conversation to start chatting</Typography>
              </CardContent>
            ) : (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(26,115,232,0.12)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={selectedUser.avatarUrl} sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.85rem', fontWeight: 700 }}>
                    {selectedUser.name?.[0]}
                  </Avatar>
                  <Typography fontWeight={600}>{selectedUser.name}</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {messages.map((msg) => {
                    const isMe = msg.fromUserId === user?._id;
                    return (
                      <Box key={msg._id} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <Paper sx={{
                          p: 1.5, maxWidth: '70%', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                          background: isMe ? 'linear-gradient(135deg, rgba(26,115,232,0.3), rgba(0,212,255,0.2))' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isMe ? 'rgba(26,115,232,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.content}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', mt: 0.3, textAlign: isMe ? 'right' : 'left', fontSize: '0.65rem' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })}
                  <div ref={bottomRef} />
                </Box>

                <Divider />
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={sending}
                  />
                  <Button variant="contained" onClick={handleSend} disabled={sending || !input.trim()} sx={{ minWidth: 48, px: 1.5 }}>
                    <Send sx={{ fontSize: 18 }} />
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage;
