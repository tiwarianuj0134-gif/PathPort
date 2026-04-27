import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Rating,
} from '@mui/material';
import { School, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import mentorService from '../services/mentorService';
import { toast } from 'react-toastify';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  requested: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)' },
  accepted: { color: '#1a73e8', bg: 'rgba(26,115,232,0.1)' },
  rejected: { color: '#ff4444', bg: 'rgba(255,68,68,0.08)' },
  completed: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)' },
};

const StudentMentorshipsPage: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModal, setReviewModal] = useState<{ open: boolean; sessionId: string }>({ open: false, sessionId: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    mentorService.getMySessionsAsStudent()
      .then(setSessions)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      await mentorService.submitReview(reviewModal.sessionId, reviewForm);
      toast.success('Review submitted!');
      setReviewModal({ open: false, sessionId: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <School sx={{ color: '#7c3aed', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Mentorships</Typography>
          <Typography variant="body2" color="text.secondary">Your booked and upcoming sessions</Typography>
        </Box>
      </Box>

      {sessions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <School sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" mb={2}>No mentorship sessions yet.</Typography>
            <Button variant="outlined" onClick={() => navigate('/mentors')} sx={{ borderColor: 'rgba(124,58,237,0.4)', color: '#a78bfa' }}>Find a Mentor</Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sessions.map((session) => {
            const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.requested;
            const mentor = session.mentorId;
            return (
              <Card key={session._id} className="hover-lift">
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Avatar src={mentor?.avatarUrl} sx={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7c3aed, #1a73e8)', fontWeight: 700 }}>
                        {mentor?.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{mentor?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{mentor?.headline}</Typography>
                      </Box>
                    </Box>
                    <Chip label={session.status} size="small" sx={{ textTransform: 'capitalize', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44` }} />
                  </Box>

                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" fontWeight={600}>Topic: <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>{session.topic}</Box></Typography>
                    {session.acceptedTime && (
                      <Typography variant="body2" fontWeight={600} mt={0.5}>Scheduled: <Box component="span" sx={{ fontWeight: 400, color: '#00d4ff' }}>{session.acceptedTime}</Box></Typography>
                    )}
                    {session.meetingLink && (
                      <Box component="a" href={session.meetingLink} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', mt: 0.5, color: '#1a73e8', fontSize: '0.82rem', '&:hover': { color: '#00d4ff' } }}>
                        → Join Meeting
                      </Box>
                    )}
                    {session.offerId && (
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Program: {session.offerId?.title}</Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/mentor/${mentor?._id}`)} sx={{ fontSize: '0.75rem', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                      View Mentor
                    </Button>
                    {session.status === 'completed' && (
                      <Button size="small" variant="outlined" startIcon={<Star sx={{ fontSize: 14 }} />} onClick={() => setReviewModal({ open: true, sessionId: session._id })} sx={{ fontSize: '0.75rem', borderColor: 'rgba(255,179,0,0.3)', color: '#ffb300' }}>
                        Leave Review
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewModal.open} onClose={() => setReviewModal({ open: false, sessionId: '' })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Rate Your Session</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">Rating</Typography>
            <Rating value={reviewForm.rating} onChange={(_, v) => setReviewForm((p) => ({ ...p, rating: v || 5 }))} sx={{ '& .MuiRating-iconFilled': { color: '#ffb300' } }} />
          </Box>
          <TextField label="Comment (optional)" value={reviewForm.comment} onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} fullWidth multiline rows={3} placeholder="How was your session?" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReviewModal({ open: false, sessionId: '' })} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitReview} disabled={submitting}>
            {submitting ? <CircularProgress size={18} color="inherit" /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentMentorshipsPage;
