import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tab, Tabs, Grid,
} from '@mui/material';
import { SmartToy, Add, CheckCircle, Cancel, Schedule } from '@mui/icons-material';
import mentorService from '../services/mentorService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  requested: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)' },
  accepted: { color: '#1a73e8', bg: 'rgba(26,115,232,0.1)' },
  rejected: { color: '#ff4444', bg: 'rgba(255,68,68,0.08)' },
  completed: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)' },
};

const MentorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);
  const [acceptModal, setAcceptModal] = useState<{ open: boolean; sessionId: string }>({ open: false, sessionId: '' });
  const [acceptForm, setAcceptForm] = useState({ acceptedTime: '', meetingLink: '' });
  const [offerModal, setOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', format: 'one_time', capacity: 1, durationWeeks: 4, skillsCovered: '', targetAudience: '', isFree: true, price: 0 });
  const [savingOffer, setSavingOffer] = useState(false);

  const load = async () => {
    try {
      const [sessData, offData] = await Promise.all([
        mentorService.getSessionsAsMentor(),
        mentorService.getMyOffers(),
      ]);
      setSessions(sessData);
      setOffers(offData);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAccept = async () => {
    setUpdating(acceptModal.sessionId);
    try {
      await mentorService.updateSession(acceptModal.sessionId, { status: 'accepted', acceptedTime: acceptForm.acceptedTime, meetingLink: acceptForm.meetingLink });
      toast.success('Session accepted!');
      setAcceptModal({ open: false, sessionId: '' });
      load();
    } catch { toast.error('Failed to accept session.'); }
    finally { setUpdating(null); }
  };

  const handleReject = async (sessionId: string) => {
    setUpdating(sessionId);
    try {
      await mentorService.updateSession(sessionId, { status: 'rejected' });
      toast.success('Session declined.');
      load();
    } catch { toast.error('Failed to decline.'); }
    finally { setUpdating(null); }
  };

  const handleComplete = async (sessionId: string) => {
    setUpdating(sessionId);
    try {
      await mentorService.updateSession(sessionId, { status: 'completed' });
      toast.success('Session marked as completed!');
      load();
    } catch { toast.error('Failed to mark complete.'); }
    finally { setUpdating(null); }
  };

  const handleCreateOffer = async () => {
    if (!offerForm.title || !offerForm.description) { toast.error('Title and description required.'); return; }
    setSavingOffer(true);
    try {
      await mentorService.createOffer({ ...offerForm, skillsCovered: offerForm.skillsCovered.split(',').map((s) => s.trim()).filter(Boolean) });
      toast.success('Offer created!');
      setOfferModal(false);
      load();
    } catch { toast.error('Failed to create offer.'); }
    finally { setSavingOffer(false); }
  };

  const pending = sessions.filter((s) => s.status === 'requested');
  const upcoming = sessions.filter((s) => s.status === 'accepted');
  const past = sessions.filter((s) => s.status === 'completed' || s.status === 'rejected');

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;

  const SessionCard = ({ session, showActions }: { session: any; showActions: boolean }) => {
    const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.requested;
    const student = session.studentId;
    return (
      <Card sx={{ mb: 1.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Avatar src={student?.avatarUrl} sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontWeight: 700 }}>
                {student?.name?.[0]}
              </Avatar>
              <Box>
                <Typography fontWeight={600} sx={{ fontSize: '0.9rem' }}>{student?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{student?.headline}</Typography>
              </Box>
            </Box>
            <Chip label={session.status} size="small" sx={{ textTransform: 'capitalize', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44` }} />
          </Box>
          <Typography variant="body2" mt={1} color="text.secondary">
            <Box component="span" fontWeight={600} color="text.primary">Topic: </Box>{session.topic}
          </Typography>
          {session.requestedTimeSlots?.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Preferred slots: {session.requestedTimeSlots.join(', ')}
            </Typography>
          )}
          {session.acceptedTime && (
            <Typography variant="caption" sx={{ color: '#00d4ff' }} display="block" mt={0.5}>
              Scheduled: {session.acceptedTime}
            </Typography>
          )}
          {session.notes && <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>{session.notes}</Typography>}

          {showActions && session.status === 'requested' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Button size="small" variant="contained" startIcon={<CheckCircle sx={{ fontSize: 14 }} />} onClick={() => setAcceptModal({ open: true, sessionId: session._id })} disabled={updating === session._id} sx={{ fontSize: '0.75rem' }}>
                Accept
              </Button>
              <Button size="small" variant="outlined" startIcon={<Cancel sx={{ fontSize: 14 }} />} onClick={() => handleReject(session._id)} disabled={updating === session._id} sx={{ fontSize: '0.75rem', borderColor: 'rgba(255,68,68,0.3)', color: '#ff4444' }}>
                Decline
              </Button>
            </Box>
          )}
          {showActions && session.status === 'accepted' && (
            <Button size="small" variant="outlined" startIcon={<Schedule sx={{ fontSize: 14 }} />} onClick={() => handleComplete(session._id)} disabled={updating === session._id} sx={{ mt: 1.5, fontSize: '0.75rem', borderColor: 'rgba(0,255,136,0.3)', color: '#00ff88' }}>
              Mark Completed
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartToy sx={{ color: '#7c3aed', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Mentor Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Welcome, {user?.name?.split(' ')[0]}</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOfferModal(true)} sx={{ background: 'linear-gradient(135deg, #7c3aed, #1a73e8)' }}>
          Create Offer
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: 'Pending Requests', value: pending.length, color: '#ffb300' },
          { label: 'Upcoming Sessions', value: upcoming.length, color: '#1a73e8' },
          { label: 'Completed', value: past.filter((s) => s.status === 'completed').length, color: '#00ff88' },
          { label: 'Active Offers', value: offers.filter((o) => o.isActive).length, color: '#7c3aed' },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Pending (${pending.length})`} />
        <Tab label={`Upcoming (${upcoming.length})`} />
        <Tab label="Past" />
        <Tab label={`Offers (${offers.length})`} />
      </Tabs>

      {tab === 0 && (
        pending.length === 0 ? <Typography color="text.secondary">No pending requests.</Typography> :
        pending.map((s) => <SessionCard key={s._id} session={s} showActions />)
      )}
      {tab === 1 && (
        upcoming.length === 0 ? <Typography color="text.secondary">No upcoming sessions.</Typography> :
        upcoming.map((s) => <SessionCard key={s._id} session={s} showActions />)
      )}
      {tab === 2 && (
        past.length === 0 ? <Typography color="text.secondary">No past sessions.</Typography> :
        past.map((s) => <SessionCard key={s._id} session={s} showActions={false} />)
      )}
      {tab === 3 && (
        <Box>
          {offers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary" mb={2}>No offers yet. Create your first mentorship program.</Typography>
              <Button variant="outlined" onClick={() => setOfferModal(true)} sx={{ borderColor: 'rgba(124,58,237,0.4)', color: '#a78bfa' }}>Create Offer</Button>
            </Box>
          ) : (
            offers.map((offer) => (
              <Card key={offer._id} sx={{ mb: 1.5 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography fontWeight={600}>{offer.title}</Typography>
                    <Chip label={offer.isActive ? 'Active' : 'Inactive'} size="small" sx={{ background: offer.isActive ? 'rgba(0,255,136,0.1)' : 'rgba(74,96,128,0.2)', color: offer.isActive ? '#00ff88' : '#8aa3c8', fontSize: '0.68rem' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">{offer.description}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Accept Session Dialog */}
      <Dialog open={acceptModal.open} onClose={() => setAcceptModal({ open: false, sessionId: '' })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Accept Session</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Confirmed Time" value={acceptForm.acceptedTime} onChange={(e) => setAcceptForm((p) => ({ ...p, acceptedTime: e.target.value }))} fullWidth placeholder="e.g. Saturday 3 PM IST" />
          <TextField label="Meeting Link (optional)" value={acceptForm.meetingLink} onChange={(e) => setAcceptForm((p) => ({ ...p, meetingLink: e.target.value }))} fullWidth placeholder="https://meet.google.com/..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAcceptModal({ open: false, sessionId: '' })} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAccept} disabled={updating !== null}>Accept</Button>
        </DialogActions>
      </Dialog>

      {/* Create Offer Dialog */}
      <Dialog open={offerModal} onClose={() => setOfferModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Create Mentorship Offer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title *" value={offerForm.title} onChange={(e) => setOfferForm((p) => ({ ...p, title: e.target.value }))} fullWidth required placeholder="e.g. Frontend Interview Prep (4 weeks)" />
          <TextField label="Description *" value={offerForm.description} onChange={(e) => setOfferForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={3} required />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Duration (weeks)" type="number" value={offerForm.durationWeeks} onChange={(e) => setOfferForm((p) => ({ ...p, durationWeeks: Number(e.target.value) }))} fullWidth inputProps={{ min: 1 }} />
            <TextField label="Capacity" type="number" value={offerForm.capacity} onChange={(e) => setOfferForm((p) => ({ ...p, capacity: Number(e.target.value) }))} fullWidth inputProps={{ min: 1 }} />
          </Box>
          <TextField label="Skills Covered (comma-separated)" value={offerForm.skillsCovered} onChange={(e) => setOfferForm((p) => ({ ...p, skillsCovered: e.target.value }))} fullWidth placeholder="React, TypeScript, System Design" />
          <TextField label="Target Audience" value={offerForm.targetAudience} onChange={(e) => setOfferForm((p) => ({ ...p, targetAudience: e.target.value }))} fullWidth placeholder="2nd/3rd year CS/IT students" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOfferModal(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOffer} disabled={savingOffer} sx={{ background: 'linear-gradient(135deg, #7c3aed, #1a73e8)' }}>
            {savingOffer ? <CircularProgress size={18} color="inherit" /> : 'Create Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorDashboardPage;
