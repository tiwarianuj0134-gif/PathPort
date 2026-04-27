import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  CircularProgress, Chip, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Avatar, Tooltip, Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Work, People, TrendingUp, ArrowForward, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import jobService from '../services/jobServices';
import { toast } from 'react-toastify';

const STATUS_COLORS: Record<string, string> = {
  applied: '#8aa3c8',
  shortlisted: '#1a73e8',
  test: '#ffb300',
  interview: '#00d4ff',
  offer: '#00ff88',
  rejected: '#ff4444',
};

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    jobService.getMyJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (jobId: string) => {
    setToggling(jobId);
    try {
      const res = await jobService.toggleJobStatus(jobId);
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, status: res.status } : j));
      toast.success(`Job ${res.status === 'open' ? 'opened' : 'closed'}.`);
    } catch {
      toast.error('Failed to update job status.');
    } finally {
      setToggling(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const totalApplicants = jobs.reduce((s, j) => s + (j.totalApplicants || 0), 0);

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            Welcome, <Box component="span" sx={{ background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</Box>
          </Typography>
          <Typography color="text.secondary">Manage your postings and find great talent</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/jobs/create')} sx={{ px: 3 }}>
          Post a Job
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        {[
          { icon: <Work sx={{ fontSize: 20, color: '#1a73e8' }} />, label: 'Active Postings', value: openJobs, color: '#1a73e8' },
          { icon: <People sx={{ fontSize: 20, color: '#00d4ff' }} />, label: 'Total Postings', value: jobs.length, color: '#00d4ff' },
          { icon: <TrendingUp sx={{ fontSize: 20, color: '#00ff88' }} />, label: 'Total Applicants', value: totalApplicants, color: '#00ff88' },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: `${stat.color}18`, border: `1px solid ${stat.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Jobs table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Your Job Postings</Typography>
        <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/jobs/create')} sx={{ color: '#00d4ff' }}>New Posting</Button>
      </Box>

      {jobs.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Work sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" mb={2}>No postings yet. Create your first job posting.</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/jobs/create')}>Post a Job</Button>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Applicants</TableCell>
                <TableCell>Pipeline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => {
                const stats = job.applicantStats || {};
                return (
                  <TableRow key={job._id} hover>
                    <TableCell>
                      <Typography fontWeight={600} sx={{ fontSize: '0.9rem' }}>{job.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{job.companyName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={700} sx={{ color: '#00d4ff' }}>{job.totalApplicants || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">total</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {Object.entries(stats).filter(([, v]) => (v as number) > 0).map(([stage, count]) => (
                          <Tooltip key={stage} title={`${stage}: ${count}`}>
                            <Box sx={{ px: 0.75, py: 0.2, borderRadius: '4px', background: `${STATUS_COLORS[stage]}22`, border: `1px solid ${STATUS_COLORS[stage]}44`, fontSize: '0.65rem', color: STATUS_COLORS[stage], fontWeight: 600, cursor: 'default' }}>
                              {String(count)}
                            </Box>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={job.status === 'open'}
                            onChange={() => handleToggleStatus(job._id)}
                            disabled={toggling === job._id}
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00ff88' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00ff88' } }}
                          />
                        }
                        label={<Typography variant="caption" sx={{ color: job.status === 'open' ? '#00ff88' : '#8aa3c8', textTransform: 'capitalize' }}>{job.status}</Typography>}
                        sx={{ m: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<People sx={{ fontSize: 14 }} />}
                          onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                          sx={{ fontSize: '0.72rem', py: 0.5 }}
                        >
                          Applicants
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Visibility sx={{ fontSize: 14 }} />}
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          sx={{ fontSize: '0.72rem', color: 'text.secondary', py: 0.5 }}
                        >
                          View
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
    </Box>
  );
};

export default RecruiterDashboard;
