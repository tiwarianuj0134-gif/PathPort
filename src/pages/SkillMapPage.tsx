import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Select,
  MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert,
} from '@mui/material';
import { Add, AccountTree } from '@mui/icons-material';
import SkillMap from '../components/SkillMap';
import useSkillMap from '../hooks/useSkillMap';
import { toast } from 'react-toastify';

const CAREER_GOALS = [
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'Data Analyst', 'Data Scientist', 'DevOps Engineer',
  'UI/UX Designer', 'Product Manager', 'Mobile Developer', 'Cybersecurity',
];

const RECOMMENDATIONS: Record<string, string[]> = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git'],
  'Full-Stack Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Pandas'],
  'Data Scientist': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow', 'Pandas'],
  'DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
  'UI/UX Designer': ['Figma', 'User Research', 'Prototyping', 'CSS', 'Design Systems'],
  'Mobile Developer': ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Git'],
};

const STATUS_CONFIG = [
  { value: 'to_learn', label: 'To Learn', color: '#4a6080', bg: 'rgba(74,96,128,0.15)', border: 'rgba(74,96,128,0.3)' },
  { value: 'in_progress', label: 'In Progress', color: '#ffb300', bg: 'rgba(255,179,0,0.12)', border: 'rgba(255,179,0,0.35)' },
  { value: 'verified', label: 'Verified', color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.35)' },
];

const SkillMapPage: React.FC = () => {
  const { skills, loading, error, addSkill, updateSkill, removeSkill } = useSkillMap();
  const [selectedGoal, setSelectedGoal] = useState('Full-Stack Developer');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technical', status: 'to_learn' });
  const [saving, setSaving] = useState(false);

  const recommendations = RECOMMENDATIONS[selectedGoal] || [];
  const existingNames = skills.map((s) => s.name.toLowerCase());
  const missingSkills = recommendations.filter((r) => !existingNames.includes(r.toLowerCase()));

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    setSaving(true);
    try {
      await addSkill({ ...newSkill, goalTag: selectedGoal });
      toast.success('Skill added!');
      setAddOpen(false);
      setNewSkill({ name: '', category: 'technical', status: 'to_learn' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateSkill(id, { status });
      toast.success('Status updated!');
      setSelectedSkill((prev: any) => prev ? { ...prev, status } : null);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeSkill(id);
      toast.success('Skill removed');
      setSelectedSkill(null);
    } catch {
      toast.error('Failed to remove skill');
    }
  };

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(26,115,232,0.15)', border: '1px solid rgba(26,115,232,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AccountTree sx={{ color: '#1a73e8', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Skill Pathway Map</Typography>
            <Typography variant="body2" color="text.secondary">Visualize and track your skill journey</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Add Skill</Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left panel */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                Career Goal
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)}>
                  {CAREER_GOALS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {missingSkills.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#ffb300', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                  ⚡ Recommended to Add
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {missingSkills.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      onClick={() => { setNewSkill((p) => ({ ...p, name: s })); setAddOpen(true); }}
                      sx={{ cursor: 'pointer', background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.25)', color: '#ffb300', fontSize: '0.72rem', '&:hover': { background: 'rgba(255,179,0,0.15)' } }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                Legend
              </Typography>
              {STATUS_CONFIG.map((s) => (
                <Box key={s.value} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Center: graph */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : skills.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <AccountTree sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary" mb={2}>No skills yet. Add your first skill to start mapping your journey.</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Add First Skill</Button>
              </CardContent>
            </Card>
          ) : (
            <SkillMap skills={skills} onNodeClick={setSelectedSkill} />
          )}
        </Grid>

        {/* Right: detail panel */}
        <Grid item xs={12} md={3}>
          {selectedSkill ? (
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={600} mb={0.5}>{selectedSkill.name}</Typography>
                <Chip label={selectedSkill.category} size="small" sx={{ mb: 2, background: 'rgba(26,115,232,0.1)', color: '#8aa3c8', textTransform: 'capitalize' }} />

                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
                  Update Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2.5 }}>
                  {STATUS_CONFIG.map((s) => (
                    <Button
                      key={s.value}
                      size="small"
                      onClick={() => handleStatusChange(selectedSkill._id, s.value)}
                      sx={{
                        justifyContent: 'flex-start',
                        background: selectedSkill.status === s.value ? s.bg : 'transparent',
                        border: `1px solid ${selectedSkill.status === s.value ? s.border : 'rgba(26,115,232,0.15)'}`,
                        color: selectedSkill.status === s.value ? s.color : 'text.secondary',
                        '&:hover': { background: s.bg, borderColor: s.border, color: s.color },
                      }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: s.color, mr: 1, flexShrink: 0 }} />
                      {s.label}
                    </Button>
                  ))}
                </Box>

                <Button
                  color="error"
                  size="small"
                  fullWidth
                  variant="outlined"
                  onClick={() => handleDelete(selectedSkill._id)}
                  sx={{ borderColor: 'rgba(255,68,68,0.3)', '&:hover': { background: 'rgba(255,68,68,0.08)' } }}
                >
                  Remove Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ p: 2.5, textAlign: 'center', py: 4 }}>
                <AccountTree sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">Click a skill node to see details and update its status.</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Add Skill Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add Skill</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
            fullWidth autoFocus
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={newSkill.category} label="Category" onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}>
              {['technical', 'soft', 'tool', 'domain'].map((c) => <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={newSkill.status} label="Status" onChange={(e) => setNewSkill((p) => ({ ...p, status: e.target.value }))}>
              {STATUS_CONFIG.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSkill} disabled={saving || !newSkill.name.trim()}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillMapPage;
