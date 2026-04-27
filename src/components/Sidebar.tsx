import React, { useContext } from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, useMediaQuery, useTheme, Avatar, Chip,
} from '@mui/material';
import {
  Dashboard, AccountTree, Folder, Book,
  Work, Message, SmartToy, Person, Assignment,
  Group, Code, Translate, Add, School, People,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { UiContext } from '../context/UiContext';
import useAuth from '../hooks/useAuth';

const DRAWER_WIDTH = 230;

const studentLinks = [
  { label: 'Dashboard', icon: <Dashboard sx={{ fontSize: 18 }} />, path: '/dashboard' },
  { label: 'Feed', icon: <Dashboard sx={{ fontSize: 18 }} />, path: '/feed' },
  { label: 'Skill Map', icon: <AccountTree sx={{ fontSize: 18 }} />, path: '/skill-map' },
  { label: 'Portfolio', icon: <Folder sx={{ fontSize: 18 }} />, path: '/portfolio' },
  { label: 'Journal', icon: <Book sx={{ fontSize: 18 }} />, path: '/journal' },
  { label: 'Jobs', icon: <Work sx={{ fontSize: 18 }} />, path: '/jobs' },
  { label: 'Applications', icon: <Assignment sx={{ fontSize: 18 }} />, path: '/applications' },
  { label: 'Find Mentors', icon: <People sx={{ fontSize: 18 }} />, path: '/mentors' },
  { label: 'My Mentorships', icon: <School sx={{ fontSize: 18 }} />, path: '/my-mentorships' },
  { label: 'Mentor Pods', icon: <Group sx={{ fontSize: 18 }} />, path: '/pods' },
  { label: 'Simulations', icon: <Code sx={{ fontSize: 18 }} />, path: '/simulations' },
  { label: 'Translator', icon: <Translate sx={{ fontSize: 18 }} />, path: '/translator' },
  { label: 'Messages', icon: <Message sx={{ fontSize: 18 }} />, path: '/messages' },
  { label: 'AI Jarvis', icon: <SmartToy sx={{ fontSize: 18 }} />, path: '/jarvis' },
];

const recruiterLinks = [
  { label: 'Dashboard', icon: <Dashboard sx={{ fontSize: 18 }} />, path: '/dashboard' },
  { label: 'My Postings', icon: <Work sx={{ fontSize: 18 }} />, path: '/jobs' },
  { label: 'Post a Job', icon: <Add sx={{ fontSize: 18 }} />, path: '/jobs/create' },
  { label: 'Messages', icon: <Message sx={{ fontSize: 18 }} />, path: '/messages' },
];

const mentorLinks = [
  { label: 'Mentor Dashboard', icon: <SmartToy sx={{ fontSize: 18 }} />, path: '/mentor-dashboard' },
  { label: 'Skill Map', icon: <AccountTree sx={{ fontSize: 18 }} />, path: '/skill-map' },
  { label: 'Portfolio', icon: <Folder sx={{ fontSize: 18 }} />, path: '/portfolio' },
  { label: 'Journal', icon: <Book sx={{ fontSize: 18 }} />, path: '/journal' },
  { label: 'Messages', icon: <Message sx={{ fontSize: 18 }} />, path: '/messages' },
  { label: 'AI Jarvis', icon: <SmartToy sx={{ fontSize: 18 }} />, path: '/jarvis' },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(UiContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const links = user?.role === 'recruiter' ? recruiterLinks : user?.role === 'mentor' ? mentorLinks : studentLinks;

  const handleNav = (path: string) => {
    navigate(path);
    if (!isDesktop) setSidebarOpen(false);
  };

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column', pt: 1 }}>
      {/* User mini-profile */}
      {user && (
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user.avatarUrl}
            sx={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
              fontSize: '0.9rem', fontWeight: 700,
              border: '2px solid rgba(26,115,232,0.3)',
            }}
          >
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} noWrap>{user.name}</Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{
                height: 18, fontSize: '0.65rem', fontWeight: 600,
                background: 'rgba(26,115,232,0.15)',
                color: '#00d4ff',
                border: '1px solid rgba(26,115,232,0.3)',
                textTransform: 'capitalize',
              }}
            />
          </Box>
        </Box>
      )}

      <Divider sx={{ mx: 2 }} />

      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', px: 1 }}>
          Navigation
        </Typography>
      </Box>

      <List dense sx={{ flexGrow: 1, px: 0.5 }}>
        {links.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItemButton
              key={path}
              selected={active}
              onClick={() => handleNav(path)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                pl: active ? 1.5 : 2,
                borderLeft: active ? '3px solid #1a73e8' : '3px solid transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: active ? '#00d4ff' : 'text.secondary' }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#e8f0fe' : '#8aa3c8',
                }}
              />
              {label === 'AI Jarvis' && (
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#00ff88',
                  boxShadow: '0 0 6px #00ff88',
                }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />
      <List dense sx={{ px: 0.5, pb: 1 }}>
        <ListItemButton onClick={() => handleNav(`/profile/${user?._id}`)} sx={{ borderRadius: '10px' }}>
          <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}><Person sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.875rem', color: '#8aa3c8' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, top: 56 } }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
