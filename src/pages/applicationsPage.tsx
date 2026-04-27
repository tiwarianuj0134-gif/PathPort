import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress,
  Alert, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Collapse, IconButton,
} from '@mui/material';
import { Assignment, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobServices';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  applied: { color: '#8aa3c8', bg: 'rgba(138,163,200,0.1)', border: 'rgba(138,163,200,0.25)' },
  shortlisted: { color: '#1a73e8', bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)' },
  test: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.3)' },
  interview: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' },
  offer: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)' },
  rejected: { color: '#ff4444', bg: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.25)' },
};

const PIPELINE_STAGES = ['applied', 'shortlisted', 'test', 'interview', 'offer'];

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    jobService.getMyApplications()
      .then(setApplications)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Assignment sx={{ color: '#00d4ff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Applications</Typography>
          <Typography variant="body2" color="text.secondary">Track your application pipeline</Typography>
        </Box>
      </Box>

      {applications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">You haven't applied to any jobs yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Pipeline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>History</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                const stageIdx = PIPELINE_STAGES.indexOf(app.status);
                const isExpanded = expandedHistory === app._id;
                return (
                  <React.Fragment key={app._id}>
                    <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                      <TableCell>
                        <Typography fontWeight={600} sx={{ fontSize: '0.9rem' }}>{app.jobId?.title || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{app.jobId?.companyName || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={app.jobId?.type?.replace('_', ' ') || '—'} size="small" sx={{ textTransform: 'capitalize', background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                          {PIPELINE_STAGES.map((stage, i) => (
                            <Box
                              key={stage}
                              sx={{
                                width: 22, height: 4, borderRadius: 2,
                                background: i <= stageIdx && app.status !== 'rejected'
                                  ? 'linear-gradient(90deg, #1a73e8, #00d4ff)'
                                  : app.status === 'rejected' && i === 0
                                  ? '#ff4444'
                                  : 'rgba(26,115,232,0.15)',
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Chip
                          label={app.status}
                          size="small"
                          sx={{ textTransform: 'capitalize', fontSize: '0.72rem', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={() => setExpandedHistory(isExpanded ? null : app._id)} sx={{ color: 'text.secondary' }}>
                          {isExpanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, background: 'rgba(26,115,232,0.03)', borderTop: '1px solid rgba(26,115,232,0.08)' }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
                              Stage History
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                              {app.stageHistory?.map((h: any, i: number) => {
                                const hcfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.applied;
                                return (
                                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: hcfg.color, flexShrink: 0 }} />
                                    <Chip label={h.status} size="small" sx={{ textTransform: 'capitalize', fontSize: '0.68rem', background: hcfg.bg, color: hcfg.color, border: `1px solid ${hcfg.border}`, height: 20 }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(h.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                    {h.note && <Typography variant="caption" color="text.disabled">— {h.note}</Typography>}
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ApplicationsPage;
