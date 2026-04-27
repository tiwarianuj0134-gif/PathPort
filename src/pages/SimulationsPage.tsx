import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { PlayArrow, AccessTime, Code, CheckCircle } from '@mui/icons-material';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string }> = {
  beginner: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)' },
  intermediate: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)' },
  advanced: { color: '#ff4444', bg: 'rgba(255,68,68,0.1)' },
};

const TYPE_ICONS: Record<string, string> = {
  frontend: '🎨', backend: '⚙️', data: '📊', design: '✏️', general: '🚀',
};

const SimulationsPage: React.FC = () => {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSim, setSelectedSim] = useState<any>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterDiff, setFilterDiff] = useState('');

  const load = async () => {
    try {
      const params: Record<string, string> = {};
      if (filterType) params.type = filterType;
      if (filterDiff) params.difficulty = filterDiff;
      const res = await apiClient.get('/simulations', { params });
      setSimulations(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load simulations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterType, filterDiff]);

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) { toast.error('Submission URL is required.'); return; }
    setSubmitting(true);
    try {
      const res = await apiClient.post(`/simulations/${selectedSim._id}/submit`, { submissionUrl, notes });
      toast.success('Submitted! Evidence card created automatically.');
      setSubmitOpen(false);
      setSubmissionUrl(''); setNotes('');
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const hasSubmitted = (sim: any) =>
    sim.submissions?.some((s: any) => s.studentId === user?._id);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Code sx={{ color: '#00d4ff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Simulation Rooms</Typography>
          <Typography variant="body2" color="text.secondary">Shadow internships — complete tasks, earn Evidence Cards</Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            {['frontend', 'backend', 'data', 'design', 'general'].map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{TYPE_ICONS[t]} {t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select value={filterDiff} label="Difficulty" onChange={(e) => setFilterDiff(e.target.value)}>
            <MenuItem value="">All Levels</MenuItem>
            {['beginner', 'intermediate', 'advanced'].map((d) => (
              <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {simulations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Code sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No simulations available yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {simulations.map((sim) => {
            const diffCfg = DIFFICULTY_CONFIG[sim.difficulty] || DIFFICULTY_CONFIG.beginner;
            const submitted = hasSubmitted(sim);
            return (
              <Grid item xs={12} sm={6} md={4} key={sim._id}>
                <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>{TYPE_ICONS[sim.type] || '🚀'}</Typography>
                      <Chip
                        label={sim.difficulty}
                        size="small"
                        sx={{ textTransform: 'capitalize', background: diffCfg.bg, color: diffCfg.color, border: `1px solid ${diffCfg.color}33`, fontSize: '0.68rem' }}
                      />
                    </Box>
                    <Typography fontWeight={600} mb={0.75} sx={{ fontSize: '0.95rem' }}>{sim.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {sim.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <AccessTime sx={{ fontSize: 13, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">~{sim.estimatedHours}h</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {sim.skills?.slice(0, 3).map((skill: string) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.68rem' }} />
                      ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ px: 2.5, pb: 2.5 }}>
                    {submitted ? (
                      <Button fullWidth size="small" disabled startIcon={<CheckCircle sx={{ fontSize: 15 }} />} sx={{ color: '#00ff88 !important', borderColor: 'rgba(0,255,136,0.3) !important' }} variant="outlined">
                        Submitted
                      </Button>
                    ) : user?.role === 'student' ? (
                      <Button
                        variant="contained" fullWidth size="small"
                        startIcon={<PlayArrow sx={{ fontSize: 15 }} />}
                        onClick={() => { setSelectedSim(sim); setSubmitOpen(true); }}
                      >
                        Start & Submit
                      </Button>
                    ) : (
                      <Button variant="outlined" fullWidth size="small" onClick={() => { setSelectedSim(sim); setSubmitOpen(true); }}>
                        View Details
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Submit Dialog */}
      <Dialog open={submitOpen} onClose={() => setSubmitOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {selectedSim?.title}
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          {selectedSim && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {selectedSim.description}
              </Typography>
              {selectedSim.resources?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.75}>Resources:</Typography>
                  {selectedSim.resources.map((r: any) => (
                    <Box key={r.url} component="a" href={r.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', color: '#1a73e8', fontSize: '0.8rem', mb: 0.3, '&:hover': { color: '#00d4ff' } }}>
                      → {r.label}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          {user?.role === 'student' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Submission URL *"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                fullWidth
                placeholder="https://github.com/your-repo or deployed link"
              />
              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth multiline rows={2}
                placeholder="What did you build? What did you learn?"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSubmitOpen(false)} sx={{ color: 'text.secondary' }}>Close</Button>
          {user?.role === 'student' && (
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <CircularProgress size={18} color="inherit" /> : 'Submit & Earn Evidence Card'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimulationsPage;
