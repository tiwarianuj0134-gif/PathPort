import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { SmartToy, Mic, VolumeUp } from '@mui/icons-material';
import AiJarvisPanel from '../components/AiJarvisPanel';

const AiJarvisPage: React.FC = () => {
  return (
    <Box className="page-enter">
      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        mb: 3, flexWrap: 'wrap', gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #ffb300, #ff6b00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255,179,0,0.3)',
          }}>
            <SmartToy sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #ffb300, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Career Jarvis
            </Typography>
            <Typography variant="body2" color="text.secondary">Your voice-enabled AI career co-pilot</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip icon={<Mic sx={{ fontSize: 14 }} />} label="Voice Input" size="small" sx={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }} />
          <Chip icon={<VolumeUp sx={{ fontSize: 14 }} />} label="Voice Output" size="small" sx={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }} />
        </Box>
      </Box>

      <Card sx={{ height: 'calc(100vh - 180px)', minHeight: 500 }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <AiJarvisPanel />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AiJarvisPage;
