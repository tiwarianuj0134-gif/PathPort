import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button,
  CircularProgress, Alert, TextField, Chip, InputAdornment, Rating,
} from '@mui/material';
import { Search, Star, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import mentorService from '../services/mentorService';

const EXPERTISE_AREAS = ['Web Dev', 'Data Science', 'Mobile Dev', 'DevOps', 'UI/UX', 'Product', 'Finance', 'Marketing'];

const MentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [expertise, setExpertise] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (q) params.q = q;
      if (expertise) params.expertise = expertise;
      const data = await mentorService.getMentors(params);
      setMentors(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [expertise]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') load();
  };

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <People sx={{ color: '#7c3aed', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Find a Mentor</Typography>
          <Typography variant="body2" color="text.secondary">Connect with industry professionals for guidance</Typography>
        </Box>
      </Box>

      {/* Search & filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search mentors..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearch}
          size="small"
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: 'text.secondary' }} /></InputAdornment> }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
        <Chip label="All" size="small" onClick={() => setExpertise('')} sx={{ cursor: 'pointer', background: !expertise ? 'rgba(124,58,237,0.2)' : 'transparent', border: '1px solid rgba(124,58,237,0.3)', color: !expertise ? '#a78bfa' : '#8aa3c8' }} />
        {EXPERTISE_AREAS.map((area) => (
          <Chip key={area} label={area} size="small" onClick={() => setExpertise(area === expertise ? '' : area)} sx={{ cursor: 'pointer', background: expertise === area ? 'rgba(124,58,237,0.15)' : 'transparent', border: '1px solid rgba(124,58,237,0.2)', color: expertise === area ? '#a78bfa' : '#8aa3c8' }} />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : mentors.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <People sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">No mentors found. Try different filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {mentors.map((mentor) => (
            <Grid item xs={12} sm={6} md={4} key={mentor._id}>
              <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <Avatar src={mentor.avatarUrl} sx={{ width: 52, height: 52, background: 'linear-gradient(135deg, #7c3aed, #1a73e8)', fontSize: '1.2rem', fontWeight: 700 }}>
                      {mentor.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{mentor.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{mentor.headline}</Typography>
                      {mentor.mentorProfile?.rating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                          <Star sx={{ fontSize: 13, color: '#ffb300' }} />
                          <Typography variant="caption" sx={{ color: '#ffb300', fontWeight: 600 }}>{mentor.mentorProfile.rating}</Typography>
                          <Typography variant="caption" color="text.disabled">({mentor.mentorProfile.totalSessions} sessions)</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {mentor.mentorProfile?.currentRole && (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {mentor.mentorProfile.currentRole} @ {mentor.mentorProfile.currentCompany}
                    </Typography>
                  )}

                  {mentor.mentorProfile?.areasOfExpertise?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                      {mentor.mentorProfile.areasOfExpertise.slice(0, 3).map((area: string) => (
                        <Chip key={area} label={area} size="small" sx={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: '0.68rem' }} />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={mentor.mentorProfile?.mentorType || '1-1'}
                      size="small"
                      sx={{ background: 'rgba(26,115,232,0.08)', color: '#8aa3c8', fontSize: '0.68rem' }}
                    />
                    {mentor.mentorProfile?.isAvailable && (
                      <Chip label="Available" size="small" sx={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.25)', fontSize: '0.68rem' }} />
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  <Button variant="outlined" fullWidth size="small" onClick={() => navigate(`/mentor/${mentor._id}`)}>
                    View Profile
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MentorsPage;
