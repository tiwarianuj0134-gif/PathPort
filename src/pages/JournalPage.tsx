import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { Add, Book, Lock, Public, Delete, Edit } from '@mui/icons-material';
import journalService from '../services/journalServices';
import { toast } from 'react-toastify';

const MOODS = ['great', 'good', 'neutral', 'bad', 'struggling'];
const MOOD_EMOJI: Record<string, string> = { great: '🚀', good: '😊', neutral: '😐', bad: '😔', struggling: '😤' };
const MOOD_COLOR: Record<string, string> = { great: '#00ff88', good: '#1a73e8', neutral: '#8aa3c8', bad: '#ffb300', struggling: '#ff4444' };

const emptyForm = { title: '', content: '', tags: '', mood: 'neutral', visibility: 'private' };

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await journalService.getAll();
      setEntries(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load journal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (entry: any) => {
    setEditing(entry);
    setForm({ title: entry.title, content: entry.content, tags: entry.tags.join(', '), mood: entry.mood, visibility: entry.visibility });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
      if (editing) {
        await journalService.update(editing._id, payload);
        toast.success('Entry updated!');
      } else {
        await journalService.create(payload);
        toast.success('Entry created!');
      }
      setOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await journalService.delete(id);
      toast.success('Deleted.');
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Book sx={{ color: '#7c3aed', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Reflection Journal</Typography>
            <Typography variant="body2" color="text.secondary">Track your growth, thoughts, and lessons learned</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>New Entry</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : entries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Book sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary" mb={2}>No journal entries yet. Start reflecting on your journey.</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Write First Entry</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry) => {
            const moodColor = MOOD_COLOR[entry.mood] || '#8aa3c8';
            return (
              <Grid item xs={12} md={6} key={entry._id}>
                <Card className="hover-lift">
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ fontSize: '1.3rem', lineHeight: 1 }}>{MOOD_EMOJI[entry.mood]}</Box>
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem' }}>{entry.title}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.3 }}>
                        <Button size="small" onClick={() => openEdit(entry)} sx={{ minWidth: 0, p: 0.5, color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}>
                          <Edit sx={{ fontSize: 15 }} />
                        </Button>
                        <Button size="small" onClick={() => handleDelete(entry._id)} sx={{ minWidth: 0, p: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                          <Delete sx={{ fontSize: 15 }} />
                        </Button>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                      {entry.content}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                      {entry.tags.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" sx={{ background: 'rgba(26,115,232,0.08)', border: '1px solid rgba(26,115,232,0.2)', color: '#8aa3c8', fontSize: '0.7rem' }} />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: moodColor, boxShadow: `0 0 4px ${moodColor}` }} />
                        <Typography variant="caption" sx={{ color: moodColor, textTransform: 'capitalize' }}>{entry.mood}</Typography>
                        {entry.visibility === 'private' ? (
                          <Lock sx={{ fontSize: 12, color: 'text.disabled' }} />
                        ) : (
                          <Public sx={{ fontSize: 12, color: '#00d4ff' }} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editing ? 'Edit Entry' : 'New Journal Entry'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} fullWidth required />
          <TextField
            label="Reflection"
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            fullWidth multiline rows={5} required
            placeholder="What happened? What did you learn? What would you improve?"
          />
          <TextField label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} fullWidth placeholder="React, interview, learning" />
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">Mood</Typography>
            <ToggleButtonGroup value={form.mood} exclusive onChange={(_, v) => v && setForm((p) => ({ ...p, mood: v }))} size="small">
              {MOODS.map((m) => (
                <ToggleButton key={m} value={m} sx={{ fontSize: '1.1rem', px: 1.5, py: 0.75 }}>
                  {MOOD_EMOJI[m]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Visibility</InputLabel>
            <Select value={form.visibility} label="Visibility" onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}>
              <MenuItem value="private">🔒 Private</MenuItem>
              <MenuItem value="public">🌐 Public</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} color="inherit" /> : editing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalPage;
