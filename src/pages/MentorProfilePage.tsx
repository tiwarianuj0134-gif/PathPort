import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Rating, Divider,
} from '@mui/material';
import { Star, AccessTime, Group, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import mentorService from '../services/mentorService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<{ mentor: any; offers: any[]; reviews: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionModal, setSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({ topic: '', requestedTimeSlots: '', notes: '', offerId: '' });
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!id) return;
    mentorService.getMentorById(id)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequestSession = async () => {
    if (!sessionForm.topic.trim()) { toast.error('Topic is required.'); return; }
    setRequesting(true);
    try {
      await mentorService.requestSession(id!, {
        topic: sessionForm.topic,
        requestedTimeSlots: sessionForm.requestedTimeSlots.split('\n').map((s) => s.trim()).filter(Boolean),
        notes: sessionForm.notes,
        offerId: sessionForm.offerId || undefined,
      });
      toast.success('Session request sent!');
      setSessionModal(false);
      setSessionForm({ topic: '', requestedTimeSlots: '', notes: '', offerId: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to request session');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  const { mentor, offers, reviews } = data;
  const mp = mentor.mentorProfile || {};

  return (
    <Box className="page-enter">
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/mentors')} sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: '#a78bfa' } }}>
        Back to Mentors
      </Button>

      <Grid container spacing={3}>
        {/* Left: Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar src={mentor.avatarUrl} sx={{ width: 80, height: 80, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #7c3aed, #1a73e8)', fontSize: '2rem', fontWeight: 700 }}>
                {mentor.name?.[0]}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{mentor.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={0.5}>{mentor.headline}</Typography>
              {mp.currentRole && <Typography variant="body2" color="text.secondary">{mp.currentRole} @ {mp.currentCompany}</Typography>}

              {mp.rating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  <Star sx={{ color: '#ffb300', fontSize: 18 }} />
                  <Typography fontWeight={700} sx={{ color: '#ffb300' }}>{mp.rating}</Typography>
                  <Typography variant="caption" color="text.secondary">({mp.totalSessions} sessions)</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', flexWrap: 'wrap', mt: 1.5 }}>
                {mp.isAvailable && <Chip label="Available" size="small" sx={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)', fontSize: '0.7rem' }} />}
                <Chip icon={<AccessTime sx={{ fontSize: 12 }} />} label={`${mp.slotsPerWeek || 2} slots/week`} size="small" sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.7rem' }} />
                <Chip icon={<Group sx={{ fontSize: 12 }} />} label={mp.mentorType || '1-1'} size="small" sx={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: '0.7rem' }} />
              </Box>

              {user?.role === 'student' && (
                <Button variant="contained" fullWidth sx={{ mt: 2, background: 'linear-gradient(135deg, #7c3aed, #1a73e8)' }} onClick={() => setSessionModal(true)}>
                  Request Session
                </Button>
              )}
            </CardContent>
          </Card>

          {mp.areasOfExpertise?.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Areas of Expertise</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {mp.areasOfExpertise.map((area: string) => (
                    <Chip key={area} label={area} size="small" sx={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: '0.72rem' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right: Bio, Offers, Reviews */}
        <Grid item xs={12} md={8}>
          {mp.bio && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={600} mb={1.5}>About</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{mp.bio}</Typography>
              </CardContent>
            </Card>
          )}

          {offers.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Mentorship Programs</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {offers.map((offer) => (
                    <Box key={offer._id} sx={{ p: 2, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>{offer.title}</Typography>
                        <Chip label={offer.isFree ? 'Free' : `₹${offer.price}`} size="small" sx={{ background: offer.isFree ? 'rgba(0,255,136,0.1)' : 'rgba(255,179,0,0.1)', color: offer.isFree ? '#00ff88' : '#ffb300', fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>{offer.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={offer.format.replace('_', ' ')} size="small" sx={{ textTransform: 'capitalize', background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.68rem' }} />
                        <Chip label={`${offer.durationWeeks}w`} size="small" sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.68rem' }} />
                        <Chip label={`${offer.capacity} spots`} size="small" sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.68rem' }} />
                      </Box>
                      {user?.role === 'student' && (
                        <Button size="small" variant="outlined" sx={{ mt: 1.5, borderColor: 'rgba(124,58,237,0.4)', color: '#a78bfa' }} onClick={() => { setSessionForm((p) => ({ ...p, offerId: offer._id, topic: offer.title })); setSessionModal(true); }}>
                          Request This Program
                        </Button>
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {reviews.length > 0 && (
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Student Reviews</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {reviews.map((review) => (
                    <Box key={review._id}>
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 0.75 }}>
                        <Avatar src={review.studentId?.avatarUrl} sx={{ width: 30, height: 30, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.75rem' }}>
                          {review.studentId?.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{review.studentId?.name}</Typography>
                          <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#ffb300' } }} />
                        </Box>
                      </Box>
                      {review.comment && <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5 }}>{review.comment}</Typography>}
                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Request Session Dialog */}
      <Dialog open={sessionModal} onClose={() => setSessionModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Request a Session with {mentor.name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Topic *" value={sessionForm.topic} onChange={(e) => setSessionForm((p) => ({ ...p, topic: e.target.value }))} fullWidth required placeholder="e.g. Resume review, Interview prep, Career guidance" />
          <TextField label="Preferred Time Slots (one per line)" value={sessionForm.requestedTimeSlots} onChange={(e) => setSessionForm((p) => ({ ...p, requestedTimeSlots: e.target.value }))} fullWidth multiline rows={3} placeholder="e.g. Saturday 3-4 PM&#10;Sunday 10-11 AM" />
          <TextField label="Additional Notes" value={sessionForm.notes} onChange={(e) => setSessionForm((p) => ({ ...p, notes: e.target.value }))} fullWidth multiline rows={2} placeholder="Anything specific you'd like to discuss..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSessionModal(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleRequestSession} disabled={requesting} sx={{ background: 'linear-gradient(135deg, #7c3aed, #1a73e8)' }}>
            {requesting ? <CircularProgress size={18} color="inherit" /> : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorProfilePage;
