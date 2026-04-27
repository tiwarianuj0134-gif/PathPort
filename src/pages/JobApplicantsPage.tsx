import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, Chip,
  CircularProgress, Alert, Select, MenuItem, FormControl,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tooltip, Grid, LinearProgress,
} from '@mui/material';
import {
  ArrowBack, Person, Description, Message, Notes,
  CheckCircle, Cancel, TrendingUp,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../services/jobServices';
import { toast } from 'react-toastify';

const STATUSES = ['applied', 'shortlisted', 'test', 'interview', 'offer', 'rejected'];

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  applied: { color: '#8aa3c8', bg: 'rgba(138,163,200,0.1)', border: 'rgba(138,163,200,0.25)' },
  shortlisted: { color: '#1a73e8', bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)' },
  test: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.3)' },
  interview: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' },
  offer: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)' },
  rejected: { color: '#ff4444', bg: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.25)' },
};

const PIPELINE_ORDER = ['applied', 'shortlisted', 'test', 'interview', 'offer'];

const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ open: boolean; appId: string; note: string }>({ open: false, appId: '', note: '' });
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    jobService.getApplicants(jobId)
      .then(setApplications)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdating(appId);
    try {
      const updated = await jobService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status: updated.status } : a));
      toast.success(`Moved to ${newStatus}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await jobService.updateRecruiterNote(noteModal.appId, noteModal.note);
      setApplications((prev) => prev.map((a) => a._id === noteModal.appId ? { ...a, recruiterNote: noteModal.note } : a));
      toast.success('Note saved.');
      setNoteModal({ open: false, appId: '', note: '' });
    } catch {
      toast.error('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  };

  const filtered = filterStatus ? applications.filter((a) => a.status === filterStatus) : applications;

  // Stats
  const stats = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const jobTitle = applications[0]?.jobId?.title || 'Job';

  return (
    <Box className="page-enter">
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}>
        Back to Dashboard
      </Button>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Applicants</Typography>
        <Typography color="text.secondary">{applications.length} total applications</Typography>
      </Box>

      {/* Pipeline funnel */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" mb={2} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Pipeline Overview
          </Typography>
          <Grid container spacing={1.5}>
            {PIPELINE_ORDER.map((stage) => {
              const cfg = STATUS_CONFIG[stage];
              const count = stats[stage] || 0;
              const pct = applications.length ? Math.round((count / applications.length) * 100) : 0;
              return (
                <Grid item xs key={stage}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: cfg.color }}>{count}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', display: 'block' }}>{stage}</Typography>
                    <LinearProgress variant="determinate" value={pct} sx={{ mt: 0.5, height: 3, borderRadius: 2, bgcolor: `${cfg.color}22`, '& .MuiLinearProgress-bar': { background: cfg.color } }} />
                  </Box>
                </Grid>
              );
            })}
            <Grid item xs>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#ff4444' }}>{stats.rejected || 0}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Rejected</Typography>
                <LinearProgress variant="determinate" value={applications.length ? Math.round(((stats.rejected || 0) / applications.length) * 100) : 0} sx={{ mt: 0.5, height: 3, borderRadius: 2, bgcolor: 'rgba(255,68,68,0.1)', '& .MuiLinearProgress-bar': { background: '#ff4444' } }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip label="All" size="small" onClick={() => setFilterStatus('')} sx={{ cursor: 'pointer', background: !filterStatus ? 'rgba(26,115,232,0.2)' : 'transparent', border: '1px solid rgba(26,115,232,0.3)', color: !filterStatus ? '#00d4ff' : '#8aa3c8' }} />
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <Chip
              key={s}
              label={`${s} (${stats[s] || 0})`}
              size="small"
              onClick={() => setFilterStatus(s)}
              sx={{ cursor: 'pointer', textTransform: 'capitalize', background: filterStatus === s ? cfg.bg : 'transparent', border: `1px solid ${filterStatus === s ? cfg.border : 'rgba(26,115,232,0.15)'}`, color: filterStatus === s ? cfg.color : '#8aa3c8' }}
            />
          );
        })}
      </Box>

      {filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Person sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No applicants {filterStatus ? `with status "${filterStatus}"` : 'yet'}.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Quick Actions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((app) => {
                const student = app.studentId;
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                return (
                  <TableRow key={app._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={student?.avatarUrl} sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.85rem', fontWeight: 700 }}>
                          {student?.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{student?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{student?.headline || student?.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap', maxWidth: 180 }}>
                        {student?.skills?.slice(0, 3).map((s: any) => (
                          <Chip key={s.name} label={s.name} size="small" sx={{ fontSize: '0.65rem', height: 18, background: 'rgba(26,115,232,0.08)', color: '#8aa3c8' }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" disabled={updating === app._id}>
                        <Select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          sx={{
                            fontSize: '0.78rem',
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-icon': { color: cfg.color },
                            minWidth: 110,
                          }}
                        >
                          {STATUSES.map((s) => (
                            <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Shortlist">
                          <Button size="small" onClick={() => handleStatusChange(app._id, 'shortlisted')} disabled={app.status === 'shortlisted' || updating === app._id} sx={{ minWidth: 0, p: 0.5, color: '#1a73e8' }}>
                            <CheckCircle sx={{ fontSize: 18 }} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <Button size="small" onClick={() => handleStatusChange(app._id, 'rejected')} disabled={app.status === 'rejected' || updating === app._id} sx={{ minWidth: 0, p: 0.5, color: '#ff4444' }}>
                            <Cancel sx={{ fontSize: 18 }} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Move to next stage">
                          <Button
                            size="small"
                            disabled={updating === app._id || !PIPELINE_ORDER[PIPELINE_ORDER.indexOf(app.status) + 1]}
                            onClick={() => {
                              const next = PIPELINE_ORDER[PIPELINE_ORDER.indexOf(app.status) + 1];
                              if (next) handleStatusChange(app._id, next);
                            }}
                            sx={{ minWidth: 0, p: 0.5, color: '#00d4ff' }}
                          >
                            <TrendingUp sx={{ fontSize: 18 }} />
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Button size="small" startIcon={<Person sx={{ fontSize: 13 }} />} onClick={() => navigate(`/profile/${student?._id}`)} sx={{ fontSize: '0.7rem', py: 0.4, color: '#8aa3c8' }}>
                          Profile
                        </Button>
                        {student?.resumeUrl && (
                          <Button size="small" startIcon={<Description sx={{ fontSize: 13 }} />} href={student.resumeUrl} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.7rem', py: 0.4, color: '#8aa3c8' }}>
                            Resume
                          </Button>
                        )}
                        <Button size="small" startIcon={<Message sx={{ fontSize: 13 }} />} onClick={() => navigate('/messages')} sx={{ fontSize: '0.7rem', py: 0.4, color: '#8aa3c8' }}>
                          Chat
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Notes sx={{ fontSize: 13 }} />}
                          onClick={() => setNoteModal({ open: true, appId: app._id, note: app.recruiterNote || '' })}
                          sx={{ fontSize: '0.7rem', py: 0.4, color: app.recruiterNote ? '#ffb300' : '#8aa3c8' }}
                        >
                          Notes
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Cover messages accordion — show on click */}
      {filtered.some((a) => a.coverMessage) && (
        <Box mt={3}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1.5} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Cover Messages
          </Typography>
          {filtered.filter((a) => a.coverMessage).map((app) => (
            <Card key={app._id} sx={{ mb: 1.5 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar src={app.studentId?.avatarUrl} sx={{ width: 24, height: 24, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.65rem' }}>
                    {app.studentId?.name?.[0]}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>{app.studentId?.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.coverMessage}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Notes modal */}
      <Dialog open={noteModal.open} onClose={() => setNoteModal({ open: false, appId: '', note: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Internal Notes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={1.5}>These notes are only visible to you.</Typography>
          <TextField
            fullWidth multiline rows={4}
            value={noteModal.note}
            onChange={(e) => setNoteModal((p) => ({ ...p, note: e.target.value }))}
            placeholder="Add your notes about this candidate..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setNoteModal({ open: false, appId: '', note: '' })} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNote} disabled={savingNote}>
            {savingNote ? <CircularProgress size={18} color="inherit" /> : 'Save Note'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobApplicantsPage;
