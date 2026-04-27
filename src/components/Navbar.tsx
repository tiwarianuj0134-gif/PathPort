import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Avatar,
  Menu, MenuItem, InputBase, useMediaQuery, useTheme, Button, Badge,
} from '@mui/material';
import {
  Menu as MenuIcon, Search, SmartToy, Work, Home,
  Message, Person, Logout, Notifications,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { UiContext } from '../context/UiContext';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useContext(UiContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCount = () => {
      apiClient.get('/notifications/unread-count')
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/');
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 1, minHeight: '64px !important' }}>
        {user && (
          <IconButton edge="start" onClick={toggleSidebar} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box
          component={Link}
          to={user ? '/dashboard' : '/'}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', mr: 2, flexShrink: 0 }}
        >
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(26, 115, 232, 0.4)',
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '-0.5px' }}>PP</Typography>
          </Box>
          {!isMobile && (
            <Typography variant="h6" sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              PathPort
            </Typography>
          )}
        </Box>

        {/* Search */}
        {user && (
          <Box sx={{
            flexGrow: 1, maxWidth: 380,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(26,115,232,0.2)',
            borderRadius: '10px',
            px: 2, py: 0.6,
            display: 'flex', alignItems: 'center', gap: 1,
            transition: 'border-color 0.2s',
            '&:focus-within': { borderColor: 'rgba(26,115,232,0.6)' },
          }}>
            <Search sx={{ color: 'text.secondary', fontSize: 16 }} />
            <InputBase
              placeholder="Search jobs, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ fontSize: '0.85rem', width: '100%', color: 'text.primary' }}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[
                  { icon: <Home sx={{ fontSize: 20 }} />, path: '/dashboard', title: 'Dashboard' },
                  { icon: <Work sx={{ fontSize: 20 }} />, path: '/jobs', title: 'Jobs' },
                  { icon: <Message sx={{ fontSize: 20 }} />, path: '/messages', title: 'Messages' },
                  { icon: <SmartToy sx={{ fontSize: 20 }} />, path: '/jarvis', title: 'AI Jarvis' },
                ].map(({ icon, path, title }) => (
                  <IconButton
                    key={path}
                    onClick={() => navigate(path)}
                    title={title}
                    sx={{
                      color: 'text.secondary',
                      borderRadius: '10px',
                      '&:hover': { color: '#00d4ff', background: 'rgba(26,115,232,0.1)' },
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
                <IconButton
                  onClick={() => navigate('/notifications')}
                  title="Notifications"
                  sx={{ color: 'text.secondary', borderRadius: '10px', '&:hover': { color: '#00d4ff', background: 'rgba(26,115,232,0.1)' } }}
                >
                  <Badge badgeContent={unreadCount} color="error" max={9}>
                    <Notifications sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
              </Box>
            )}

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
              <Avatar
                src={user.avatarUrl}
                sx={{
                  width: 34, height: 34,
                  background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
                  fontSize: '0.85rem', fontWeight: 700,
                  border: '2px solid rgba(26,115,232,0.4)',
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(26,115,232,0.1)' }}>
                <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
              </Box>
              <MenuItem onClick={() => { navigate(`/profile/${user._id}`); setAnchorEl(null); }}>
                <Person sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/notifications'); setAnchorEl(null); }}>
                <Badge badgeContent={unreadCount} color="error" max={9} sx={{ mr: 1.5 }}>
                  <Notifications sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Badge>
                Notifications
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); setAnchorEl(null); }}>
                <Logout sx={{ mr: 1.5, fontSize: 18, color: 'error.main' }} />
                <Typography color="error.main">Logout</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="contained" size="small" onClick={() => navigate('/register')}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
