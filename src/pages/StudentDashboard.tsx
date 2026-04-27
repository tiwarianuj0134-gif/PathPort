import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  CircularProgress, Chip, LinearProgress, Avatar,
} from '@mui/material';
import { Add, AccountTree, Folder, Work, Book, SmartToy, TrendingUp, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import profileService from '../services/profileService';
import jobService from '../services/jobServices';
import evidenceService from '../services/evidenceService';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string; onClick?: () => void }> = ({ icon, label, value, sub, color, onClick }) => (
  <Card className="hover-lift" sx={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h3" fontWeight={700} sx={{ color: 'text.primary', lineHeight: 1 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{sub}</Typography>}
    </CardContent>
  </Card>
);

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileService.getMySkills(),
      jobService.getJobs({ limit: 4 }),
      evidenceService.getMyEvidence(),
    ])
      .then(([skillData, jobData, evidenceData]) => {
        setSkills(skillData);
        setRecentJobs(jobData.jobs || []);
        setEvidenceCount(evidenceData.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const verifiedCount = skills.filter((s) => s.status === 'verified').length;
  const inProgressCount = skills.filter((s) => s.status === 'in_progress').length;
  const skillProgress = skills.length ? Math.round((verifiedCount / skills.length) * 100) : 0;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;

  return (
    <Box className="page-enter">
      {/* Welcome */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Welcome back, <Box component="span" sx={{ background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</Box> 👋
        </Typography>
        <Typography color="text.secondary">{user?.headline || 'Complete your profile to get started'}</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AccountTree sx={{ fontSize: 18, color: '#1a73e8' }} />}
            label="Skill Map"
            value={skills.length}
            sub={`${verifiedCount} verified · ${inProgressCount} in progress`}
            color="#1a73e8"
            onClick={() => navigate('/skill-map')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Folder sx={{ fontSize: 18, color: '#ffb300' }} />}
            label="Evidence Cards"
            value={evidenceCount}
            sub="Proof of your work"
            color="#ffb300"
            onClick={() => navigate('/portfolio')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp sx={{ fontSize: 18, color: '#00ff88' }} />}
            label="Skill Progress"
            value={`${skillProgress}%`}
            sub="Verified skills"
            color="#00ff88"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Work sx={{ fontSize: 18, color: '#00d4ff' }} />}
            label="Career Goal"
            value={user?.careerGoal ? '✓ Set' : 'Not set'}
            sub={user?.careerGoal || 'Set in Skill Map'}
            color="#00d4ff"
            onClick={() => navigate('/skill-map')}
          />
        </Grid>
      </Grid>

      {/* Skill progress bar */}
      {skills.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>Skill Verification Progress</Typography>
              <Typography variant="body2" color="text.secondary">{verifiedCount}/{skills.length} verified</Typography>
            </Box>
            <LinearProgress variant="determinate" value={skillProgress} sx={{ height: 8, borderRadius: 4 }} />
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(26,115,232,0.15), rgba(0,212,255,0.08))', border: '1px solid rgba(26,115,232,0.25)' }}>
            <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,179,0,0.15)', border: '1px solid rgba(255,179,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SmartToy sx={{ color: '#ffb300', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={600} mb={0.3}>Talk to Jarvis</Typography>
                <Typography variant="body2" color="text.secondary">Get AI-powered career guidance</Typography>
              </Box>
              <Button variant="outlined" size="small" endIcon={<ArrowForward />} onClick={() => navigate('/jarvis')}>Open</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Add sx={{ color: '#00ff88', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={600} mb={0.3}>Add Evidence Card</Typography>
                <Typography variant="body2" color="text.secondary">Document your latest project or course</Typography>
              </Box>
              <Button variant="outlined" size="small" endIcon={<ArrowForward />} onClick={() => navigate('/portfolio')}>Add</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Jobs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Recent Opportunities</Typography>
        <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/jobs')} sx={{ color: '#00d4ff' }}>View all</Button>
      </Box>
      <Grid container spacing={2}>
        {recentJobs.map((job) => (
          <Grid item xs={12} sm={6} md={3} key={job._id}>
            <Card className="hover-lift" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job._id}`)}>
              <CardContent sx={{ p: 2 }}>
                <Typography fontWeight={600} mb={0.3} sx={{ fontSize: '0.9rem' }}>{job.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>{job.companyName}</Typography>
                <Chip label={job.type.replace('_', ' ')} size="small" sx={{ background: 'rgba(26,115,232,0.1)', color: '#8aa3c8', textTransform: 'capitalize', fontSize: '0.7rem' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
        {recentJobs.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" mb={2}>No jobs available yet.</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/jobs')}>Browse Jobs</Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
