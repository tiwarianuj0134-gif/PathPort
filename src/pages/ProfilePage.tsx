import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button,
  Chip, CircularProgress, Alert, Tab, Tabs, Divider, LinearProgress,
} from '@mui/material';
import { GitHub, LinkedIn, Language, PersonAdd, Edit, Description, Work } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import evidenceService from '../services/evidenceService';
import EvidenceCard from '../components/EvidenceCard';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const SKILL_LEVEL_COLORS: Record<string, string> = {
  Beginner: '#4a6080',
  Intermediate: '#ffb300',
  Advanced: '#00ff88',
};

const EXP_TYPE_COLORS: Record<string, string> = {
  internship: '#1a73e8',
  part_time: '#ffb300',
  full_time: '#00ff88',
  volunteer: '#7c3aed',
  project: '#00d4ff',
  freelance: '#ff6b00',
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const isOwn = currentUser?._id === id;

  useEffect(() => {
    if (!id) return;
    Promise.all([profileService.getUser(id), evidenceService.getUserEvidence(id)])
      .then(([profileData, evidenceData]) => { setProfile(profileData); setEvidence(evidenceData); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConnect = async () => {
    if (!id) return;
    setConnecting(true);
    try {
      await profileService.sendConnectionRequest(id);
      toast.success('Connection request sent!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return null;

  return (
    <Box className="page-enter">
      {/* Profile header */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <Box sx={{ height: 80, background: 'linear-gradient(135deg, rgba(26,115,232,0.3), rgba(0,212,255,0.15))', borderRadius: '16px 16px 0 0' }} />
        <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', mt: -4, mb: 2, flexWrap: 'wrap' }}>
            <Avatar
              src={profile.avatarUrl}
              sx={{
                width: 80, height: 80,
                background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
                fontSize: '2rem', fontWeight: 700,
                border: '3px solid rgba(26,115,232,0.4)',
                boxShadow: '0 0 20px rgba(26,115,232,0.3)',
              }}
            >
              {profile.name?.[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1, pb: 0.5 }}>
              <Typography variant="h5" fontWeight={700}>{profile.name}</Typography>
              {profile.headline && <Typography color="text.secondary" mb={0.25}>{profile.headline}</Typography>}
              {profile.location && <Typography variant="caption" color="text.disabled">{profile.location}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pb: 0.5 }}>
              {profile.socialLinks?.github && (
                <Button size="small" startIcon={<GitHub sx={{ fontSize: 15 }} />} href={profile.socialLinks.github} target="_blank" variant="outlined" sx={{ fontSize: '0.78rem' }}>GitHub</Button>
              )}
              {profile.socialLinks?.linkedin && (
                <Button size="small" startIcon={<LinkedIn sx={{ fontSize: 15 }} />} href={profile.socialLinks.linkedin} target="_blank" variant="outlined" sx={{ fontSize: '0.78rem' }}>LinkedIn</Button>
              )}
              {profile.socialLinks?.portfolioUrl && (
                <Button size="small" startIcon={<Language sx={{ fontSize: 15 }} />} href={profile.socialLinks.portfolioUrl} target="_blank" variant="outlined" sx={{ fontSize: '0.78rem' }}>Portfolio</Button>
              )}
              {profile.resumeUrl && (
                <Button size="small" startIcon={<Description sx={{ fontSize: 15 }} />} href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ fontSize: '0.78rem', borderColor: 'rgba(0,255,136,0.3)', color: '#00ff88' }}>
                  Resume
                </Button>
              )}
              {isOwn ? (
                <Button variant="outlined" size="small" startIcon={<Edit sx={{ fontSize: 15 }} />} onClick={() => navigate('/profile/edit')} sx={{ fontSize: '0.78rem' }}>
                  Edit Profile
                </Button>
              ) : currentUser ? (
                <Button variant="contained" size="small" startIcon={<PersonAdd sx={{ fontSize: 15 }} />} onClick={handleConnect} disabled={connecting} sx={{ fontSize: '0.78rem' }}>
                  {connecting ? 'Sending...' : 'Connect'}
                </Button>
              ) : null}
            </Box>
          </Box>

          {profile.careerGoal && (
            <Chip
              label={`🎯 ${profile.careerGoal}`}
              size="small"
              sx={{ background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', color: '#00d4ff' }}
            />
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Experience" />
        <Tab label={`Portfolio (${evidence.length})`} />
      </Tabs>

      {/* Overview tab */}
      {tab === 0 && (
        <Grid container spacing={3}>
          {profile.about && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" fontWeight={600} mb={1.5}>About</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{profile.about}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {profile.education?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Education</Typography>
                  {profile.education.map((edu: any, i: number) => (
                    <Box key={i} mb={i < profile.education.length - 1 ? 2 : 0}>
                      <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>{edu.degree} — {edu.branch}</Typography>
                      <Typography variant="body2" color="text.secondary">{edu.college}</Typography>
                      <Typography variant="caption" color="text.disabled">
                        {edu.startYear} – {edu.endYear || 'Present'}{edu.cgpa ? ` · CGPA: ${edu.cgpa}` : ''}
                      </Typography>
                      {i < profile.education.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {profile.skills?.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Skills</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {profile.skills.map((skill: any) => {
                      const color = SKILL_LEVEL_COLORS[skill.level] || '#8aa3c8';
                      const progress = skill.level === 'Advanced' ? 100 : skill.level === 'Intermediate' ? 60 : 30;
                      return (
                        <Box key={skill.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight={500}>{skill.name}</Typography>
                              {skill.endorsements > 0 && (
                                <Chip label={`+${skill.endorsements}`} size="small" sx={{ height: 16, fontSize: '0.6rem', background: 'rgba(26,115,232,0.1)', color: '#8aa3c8' }} />
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color }}>{skill.level}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { background: color } }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Experience tab */}
      {tab === 1 && (
        profile.experience?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Work sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" mb={2}>No experience added yet.</Typography>
            {isOwn && <Button variant="outlined" onClick={() => navigate('/profile/edit')}>Add Experience</Button>}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {profile.experience?.map((exp: any, i: number) => {
              const typeColor = EXP_TYPE_COLORS[exp.type] || '#8aa3c8';
              return (
                <Card key={i}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography fontWeight={600} sx={{ fontSize: '1rem' }}>{exp.role}</Typography>
                        <Typography variant="body2" color="text.secondary">{exp.company}</Typography>
                      </Box>
                      <Chip
                        label={exp.type.replace('_', ' ')}
                        size="small"
                        sx={{ textTransform: 'capitalize', background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}33`, fontSize: '0.7rem' }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.disabled" display="block" mb={1}>
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                      {' – '}
                      {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                    </Typography>
                    {exp.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{exp.description}</Typography>
                    )}
                    {exp.skills?.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
                        {exp.skills.map((s: string) => (
                          <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: '0.68rem' }} />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )
      )}

      {/* Portfolio tab */}
      {tab === 2 && (
        evidence.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No evidence cards yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {evidence.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card._id}>
                <EvidenceCard card={card} readonly />
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Box>
  );
};

export default ProfilePage;
