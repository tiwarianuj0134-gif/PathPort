import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material';
import { Add, Folder } from '@mui/icons-material';
import EvidenceCard from '../components/EvidenceCard';
import evidenceService from '../services/evidenceService';
import { toast } from 'react-toastify';

const TYPES = ['project', 'course', 'hackathon', 'internship_task', 'simulation'];
const emptyForm = { title: '', type: 'project', description: '', skills: '', links: '' };

const PortfolioPage: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState('');

  const load = async () => {
    try {
      const data = await evidenceService.getMyEvidence();
      setCards(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (card: any) => {
    setEditing(card);
    setForm({
      title: card.title, type: card.type, description: card.description,
      skills: card.skills.join(', '),
      links: card.links.map((l: any) => `${l.label}:${l.url}`).join('\n'),
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { toast.error('Title and description are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title, type: form.type, description: form.description,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        links: form.links.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
          const colonIdx = l.indexOf(':');
          return { label: l.slice(0, colonIdx).trim(), url: l.slice(colonIdx + 1).trim() };
        }),
      };
      if (editing) {
        await evidenceService.update(editing._id, payload);
        toast.success('Evidence card updated!');
      } else {
        await evidenceService.create(payload);
        toast.success('Evidence card created!');
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
    if (!confirm('Delete this evidence card?')) return;
    try {
      await evidenceService.delete(id);
      toast.success('Deleted.');
      setCards((prev) => prev.filter((c) => c._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filterType ? cards.filter((c) => c.type === filterType) : cards;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,179,0,0.12)', border: '1px solid rgba(255,179,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder sx={{ color: '#ffb300', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Proof Portfolio</Typography>
            <Typography variant="body2" color="text.secondary">Your evidence ledger — real work, real proof</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setFilterType('')}
              sx={{ cursor: 'pointer', background: !filterType ? 'rgba(26,115,232,0.2)' : 'transparent', border: '1px solid rgba(26,115,232,0.3)', color: !filterType ? '#00d4ff' : '#8aa3c8' }}
            />
            {TYPES.map((t) => (
              <Chip
                key={t}
                label={t.replace('_', ' ')}
                size="small"
                onClick={() => setFilterType(t)}
                sx={{ cursor: 'pointer', textTransform: 'capitalize', background: filterType === t ? 'rgba(26,115,232,0.2)' : 'transparent', border: '1px solid rgba(26,115,232,0.2)', color: filterType === t ? '#00d4ff' : '#8aa3c8' }}
              />
            ))}
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate} size="small">Add Evidence</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Folder sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary" mb={2}>
            {filterType ? `No ${filterType.replace('_', ' ')} cards yet.` : 'No evidence cards yet. Add your first project, course, or hackathon.'}
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Evidence</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <EvidenceCard card={card} onEdit={openEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editing ? 'Edit Evidence Card' : 'Add Evidence Card'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {TYPES.map((t) => <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t.replace('_', ' ')}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Description (problem → solution)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={4} required />
          <TextField label="Skills (comma-separated)" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))} fullWidth placeholder="React, Node.js, MongoDB" />
          <TextField label="Links (one per line: Label:URL)" value={form.links} onChange={(e) => setForm((p) => ({ ...p, links: e.target.value }))} fullWidth multiline rows={2} placeholder="GitHub:https://github.com/..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} color="inherit" /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioPage;
