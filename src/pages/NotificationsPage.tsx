import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  CircularProgress, Alert, Chip,
} from '@mui/material';
import {
  PersonAdd, Work, Star, ThumbUp, Comment,
  SmartToy, CheckCircle, Notifications as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  connection_request: { icon: <PersonAdd sx={{ fontSize: 16 }} />, color: '#1a73e8' },
  connection_accepted: { icon: <CheckCircle sx={{ fontSize: 16 }} />, color: '#00ff88' },
  application_update: { icon: <Work sx={{ fontSize: 16 }} />, color: '#ffb300' },
  new_recommendation: { icon: <Star sx={{ fontSize: 16 }} />, color: '#00d4ff' },
  post_like: { icon: <ThumbUp sx={{ fontSize: 16 }} />, color: '#1a73e8' },
  post_comment: { icon: <Comment sx={{ fontSize: 16 }} />, color: '#7c3aed' },
  pod_invite: { icon: <SmartToy sx={{ fontSize: 16 }} />, color: '#ffb300' },
  endorsement: { icon: <Star sx={{ fontSize: 16 }} />, color: '#00ff88' },
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/notifications')
      .then((res) => setNotifications(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await apiClient.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All marked as read.');
    } catch { /* silent */ }
  };

  const handleClick = async (notif: any) => {
    if (!notif.read) {
      await apiClient.put(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifications((prev) => prev.map((n) => n._id === notif._id ? { ...n, read: true } : n));
    }
    if (notif.link) navigate(notif.link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NotifIcon sx={{ color: '#1a73e8', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </Typography>
          </Box>
        </Box>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllRead} sx={{ color: '#00d4ff' }}>Mark all read</Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <NotifIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No notifications yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] || { icon: <NotifIcon sx={{ fontSize: 16 }} />, color: '#8aa3c8' };
            return (
              <Card
                key={notif._id}
                onClick={() => handleClick(notif)}
                sx={{
                  cursor: notif.link ? 'pointer' : 'default',
                  opacity: notif.read ? 0.7 : 1,
                  borderLeft: notif.read ? '3px solid transparent' : `3px solid ${cfg.color}`,
                  transition: 'all 0.15s',
                }}
              >
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: `${cfg.color}18`, border: `1px solid ${cfg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cfg.color }}>
                    {cfg.icon}
                  </Box>
                  {notif.fromUserId && (
                    <Avatar src={notif.fromUserId?.avatarUrl} sx={{ width: 30, height: 30, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.75rem', flexShrink: 0 }}>
                      {notif.fromUserId?.name?.[0]}
                    </Avatar>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>{notif.message}</Typography>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  {!notif.read && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, flexShrink: 0 }} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPage;
