import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider,
} from '@mui/material';
import { LocationOn, Work, AccessTime, AttachMoney, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import OQIBadge from '../components/OQIBadge';
import jobService from '../services/jobServices';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverMessage, setCoverMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    jobService.getJobById(id)
      .then(setJob)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await jobService.applyToJob(id!, coverMessage);
      toast.success('Application submitted!');
      setApplied(true);
      setApplyOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!job) return null;

  return (
    <Box className="page-enter">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/jobs')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}
      >
        Back to Jobs
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} mb={0.5}>{job.title}</Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight={400}>{job.companyName}</Typography>
                </Box>
                <OQIBadge score={job.oqiScore} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {[
                  { icon: <LocationOn sx={{ fontSize: 15 }} />, text: job.isRemote ? 'Remote' : job.location },
                  { icon: <Work sx={{ fontSize: 15 }} />, text: job.type.replace('_', ' ') },
                  ...(job.stipendMin || job.stipendMax ? [{ icon: <AttachMoney sx={{ fontSize: 15 }} />, text: `₹${job.stipendMin}–₹${job.stipendMax}/mo` }] : []),
                  ...(job.applicationDeadline ? [{ icon: <AccessTime sx={{ fontSize: 15 }} />, text: `Apply by ${new Date(job.applicationDeadline).toLocaleDateString()}` }] : []),
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    {item.icon}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Typography variant="h6" fontWeight={600} mb={1.5}>Description</Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5} sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{job.description}</Typography>

              {job.responsibilities && (
                <>
                  <Typography variant="h6" fontWeight={600} mb={1.5}>Responsibilities</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2.5} sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{job.responsibilities}</Typography>
                </>
              )}

              <Typography variant="h6" fontWeight={600} mb={1.5}>Required Skills</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {job.requiredSkills.map((skill: string) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Apply Now</Typography>

              {applied ? (
                <Alert severity="success" sx={{ mb: 2 }}>You've applied to this position!</Alert>
              ) : user?.role === 'student' ? (
                <Button variant="contained" fullWidth size="large" onClick={() => setApplyOpen(true)} sx={{ mb: 2 }}>
                  Apply with PathPort Profile
                </Button>
              ) : !user ? (
                <Button variant="contained" fullWidth onClick={() => navigate('/login')} sx={{ mb: 2 }}>
                  Login to Apply
                </Button>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>Only students can apply.</Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">Opportunity Quality</Typography>
                <OQIBadge score={job.oqiScore} />
                <Typography variant="caption" color="text.disabled" display="block" mt={0.75}>
                  Based on {job.reviewCount ?? 0} student review{job.reviewCount !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {job.oqiScore !== null && job.oqiScore < 40 && (
                <Alert severity="warning" sx={{ mt: 2, fontSize: '0.78rem' }}>
                  Low OQI score. Students have reported concerns about this opportunity.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Apply to {job.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Your PathPort profile will be shared with the recruiter.
          </Typography>
          <TextField
            label="Cover Message (optional)"
            multiline rows={4} fullWidth
            value={coverMessage}
            onChange={(e) => setCoverMessage(e.target.value)}
            placeholder="Tell them why you're a great fit..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApplyOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} disabled={applying}>
            {applying ? <CircularProgress size={18} color="inherit" /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDetailPage;
