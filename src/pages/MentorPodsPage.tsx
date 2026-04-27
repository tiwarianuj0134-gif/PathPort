import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, LinearProgress, Avatar,
} from '@mui/material';
import { Add, Group, AccessTime, Person } from '@mui/icons-material';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const MentorPodsPage: React.FC = () => {
  const { user } = useAuth();
  const [pods, setPods] = useState<any[]>([]);
  const [myPods, setMyPods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', goal: '', description: '', maxStudents: 5, durationWeeks: 4 });
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  const load = async () => {
    try {
      const [openRes, myRes] = await Promise.all([
        apiClient.get('/pods'),
        apiClient.get('/pods/mine'),
      ]);
      setPods(openRes.data);
      setMyPods(myRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load pods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.goal) { toast.error('Name and goal are required.'); return; }
    setSaving(true);
    try {
      await apiClient.post('/pods', form);
      toast.success('Mentor Pod created!');
      setCreateOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create pod');
    } finally {
      setSaving(false);
    }
  };

  const handleJoin = async (podId: string) => {
    setJoining(podId);
    try {
      await apiClient.post(`/pods/${podId}/join`);
      toast.success('Joined pod!');
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to join pod');
    } finally {
      setJoining(null);
    }
  };

  const isInPod = (podId: string) => myPods.some((p) => p._id === podId);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Group sx={{ color: '#7c3aed', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Mentor Pods</Typography>
            <Typography variant="body2" color="text.secondary">Small groups for focused skill development</Typography>
          </Box>
        </Box>
        {(user?.role === 'mentor' || user?.role === 'admin') && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>Create Pod</Button>
        )}
      </Box>

      {/* My Pods */}
      {myPods.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" fontWeight={600} mb={2}>My Pods</Typography>
          <Grid container spacing={2}>
            {myPods.map((pod) => (
              <Grid item xs={12} sm={6} md={4} key={pod._id}>
                <Card sx={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>{pod.name}</Typography>
                      <Chip label={pod.status} size="small" sx={{ textTransform: 'capitalize', background: pod.status === 'open' ? 'rgba(0,255,136,0.1)' : 'rgba(26,115,232,0.1)', color: pod.status === 'open' ? '#00ff88' : '#8aa3c8', fontSize: '0.68rem' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1.5}>{pod.goal}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{pod.students?.length || 0}/{pod.maxStudents} students</Typography>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary', ml: 1 }} />
                      <Typography variant="caption" color="text.secondary">{pod.durationWeeks} weeks</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={((pod.students?.length || 0) / pod.maxStudents) * 100} sx={{ height: 4, borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Open Pods */}
      <Typography variant="h6" fontWeight={600} mb={2}>Open Pods</Typography>
      {pods.filter((p) => !isInPod(p._id)).length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Group sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No open pods available right now.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pods.filter((p) => !isInPod(p._id)).map((pod) => (
            <Grid item xs={12} sm={6} md={4} key={pod._id}>
              <Card className="hover-lift">
                <CardContent sx={{ p: 2.5 }}>
                  <Typography fontWeight={600} mb={0.5} sx={{ fontSize: '0.95rem' }}>{pod.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    🎯 {pod.goal}
                  </Typography>
                  {pod.description && (
                    <Typography variant="caption" color="text.disabled" display="block" mb={1.5}>{pod.description}</Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar src={pod.mentorId?.avatarUrl} sx={{ width: 24, height: 24, background: 'linear-gradient(135deg, #7c3aed, #1a73e8)', fontSize: '0.65rem' }}>
                      {pod.mentorId?.name?.[0]}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">{pod.mentorId?.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip icon={<Person sx={{ fontSize: 12 }} />} label={`${pod.students?.length || 0}/${pod.maxStudents}`} size="small" sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.7rem' }} />
                    <Chip icon={<AccessTime sx={{ fontSize: 12 }} />} label={`${pod.durationWeeks}w`} size="small" sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.7rem' }} />
                  </Box>
                  {user?.role === 'student' && (
                    <Button
                      variant="outlined" fullWidth size="small"
                      onClick={() => handleJoin(pod._id)}
                      disabled={joining === pod._id || (pod.students?.length || 0) >= pod.maxStudents}
                    >
                      {joining === pod._id ? <CircularProgress size={14} /> : (pod.students?.length || 0) >= pod.maxStudents ? 'Full' : 'Join Pod'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Pod Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Create Mentor Pod</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Pod Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth required />
          <TextField label="Goal" value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))} fullWidth required placeholder="e.g. Get React internship ready" />
          <TextField label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={2} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Max Students" type="number" value={form.maxStudents} onChange={(e) => setForm((p) => ({ ...p, maxStudents: Number(e.target.value) }))} fullWidth inputProps={{ min: 1, max: 20 }} />
            <TextField label="Duration (weeks)" type="number" value={form.durationWeeks} onChange={(e) => setForm((p) => ({ ...p, durationWeeks: Number(e.target.value) }))} fullWidth inputProps={{ min: 1, max: 52 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Create Pod'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorPodsPage;
