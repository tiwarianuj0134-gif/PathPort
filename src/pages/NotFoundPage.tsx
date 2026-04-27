import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3,
      background: 'linear-gradient(135deg, #050b18 0%, #0a1628 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <Box className="grid-bg" sx={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontSize: '8rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, rgba(26,115,232,0.3), rgba(0,212,255,0.2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1,
        }}>
          404
        </Typography>
        <Typography variant="h5" fontWeight={600} mb={1} color="text.primary">Page not found</Typography>
        <Typography color="text.secondary" mb={4}>The page you're looking for doesn't exist or has been moved.</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ px: 4 }}>Go Home</Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
