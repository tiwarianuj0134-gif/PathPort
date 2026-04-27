import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Grid, Chip, Select, MenuItem,
  FormControl, InputLabel, Divider, IconButton, Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Delete, ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EXP_TYPES = ['internship', 'part_time', 'full_time', 'volunteer', 'project', 'freelance'];

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    headline: '',
    about: '',
    avatarUrl: '',
    location: '',
    resumeUrl: '',
    careerGoal: '',
    socialLinks: { github: '', linkedin: '', portfolioUrl: '' },
    education: [] as any[],
    experience: [] as any[],
    skills: [] as any[],
  });

  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });

  useEffect(() => {
    profileService.getUser(user!._id)
      .then((data) => {
        setForm({
          headline: data.headline || '',
          about: data.about || '',
          avatarUrl: data.avatarUrl || '',
          location: data.location || '',
          resumeUrl: data.resumeUrl || '',
          careerGoal: data.careerGoal || '',
          socialLinks: data.socialLinks || { github: '', linkedin: '', portfolioUrl: '' },
          education: data.education || [],
          experience: data.experience || [],
          skills: data.skills || [],
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile(form);
      toast.success('Profile updated!');
      navigate(`/profile/${user!._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setForm((p) => ({ ...p, education: [...p.education, { college: '', degree: '', branch: '', startYear: '', endYear: '', cgpa: '' }] }));
  };

  const updateEducation = (i: number, field: string, value: string) => {
    setForm((p) => {
      const edu = [...p.education];
      edu[i] = { ...edu[i], [field]: value };
      return { ...p, education: edu };
    });
  };

  const removeEducation = (i: number) => {
    setForm((p) => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));
  };

  const addExperience = () => {
    setForm((p) => ({ ...p, experience: [...p.experience, { role: '', company: '', type: 'internship', startDate: '', endDate: '', isCurrent: false, description: '', skills: [] }] }));
  };

  const updateExperience = (i: number, field: string, value: any) => {
    setForm((p) => {
      const exp = [...p.experience];
      exp[i] = { ...exp[i], [field]: value };
      return { ...p, experience: exp };
    });
  };

  const removeExperience = (i: number) => {
    setForm((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    if (form.skills.find((s) => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      toast.error('Skill already added.');
      return;
    }
    setForm((p) => ({ ...p, skills: [...p.skills, { name: newSkill.name.trim(), level: newSkill.level, years: 0, verified: false, endorsements: 0 }] }));
    setNewSkill({ name: '', level: 'Beginner' });
  };

  const removeSkill = (name: string) => {
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s.name !== name) }));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>;

  return (
    <Box className="page-enter" sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(`/profile/${user!._id}`)} sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}>
        Back to Profile
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Edit Profile</Typography>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />} onClick={handleSave} disabled={saving}>
          Save Changes
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Headline" value={form.headline} onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))} fullWidth placeholder="e.g. Aspiring Full-Stack Developer | React & Node.js" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="About / Summary" value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))} fullWidth multiline rows={4} placeholder="Tell recruiters and mentors about yourself..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} fullWidth placeholder="e.g. Bangalore, India" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Career Goal" value={form.careerGoal} onChange={(e) => setForm((p) => ({ ...p, careerGoal: e.target.value }))} fullWidth placeholder="e.g. Full-Stack Developer" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))} fullWidth placeholder="https://..." />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Resume URL" value={form.resumeUrl} onChange={(e) => setForm((p) => ({ ...p, resumeUrl: e.target.value }))} fullWidth placeholder="https://drive.google.com/... or cloud storage link" helperText="Paste a public link to your resume (Google Drive, Dropbox, etc.)" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Social Links</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="GitHub" value={form.socialLinks.github} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, github: e.target.value } }))} fullWidth placeholder="https://github.com/..." />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="LinkedIn" value={form.socialLinks.linkedin} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))} fullWidth placeholder="https://linkedin.com/in/..." />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Portfolio" value={form.socialLinks.portfolioUrl} onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, portfolioUrl: e.target.value } }))} fullWidth placeholder="https://..." />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Education */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Education</Typography>
            <Button size="small" startIcon={<Add />} onClick={addEducation} variant="outlined" sx={{ fontSize: '0.78rem' }}>Add</Button>
          </Box>
          {form.education.map((edu, i) => (
            <Box key={i} sx={{ mb: 2, p: 2, background: 'rgba(26,115,232,0.04)', border: '1px solid rgba(26,115,232,0.12)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton size="small" onClick={() => removeEducation(i)} sx={{ color: 'error.main' }}><Delete sx={{ fontSize: 16 }} /></IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="College/University" value={edu.college} onChange={(e) => updateEducation(i, 'college', e.target.value)} fullWidth size="small" /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} fullWidth size="small" placeholder="B.Tech, B.Sc, MBA..." /></Grid>
                <Grid item xs={12} sm={4}><TextField label="Branch/Field" value={edu.branch} onChange={(e) => updateEducation(i, 'branch', e.target.value)} fullWidth size="small" /></Grid>
                <Grid item xs={6} sm={2}><TextField label="Start Year" value={edu.startYear} onChange={(e) => updateEducation(i, 'startYear', e.target.value)} fullWidth size="small" type="number" /></Grid>
                <Grid item xs={6} sm={2}><TextField label="End Year" value={edu.endYear} onChange={(e) => updateEducation(i, 'endYear', e.target.value)} fullWidth size="small" type="number" /></Grid>
                <Grid item xs={12} sm={4}><TextField label="CGPA/Grade" value={edu.cgpa} onChange={(e) => updateEducation(i, 'cgpa', e.target.value)} fullWidth size="small" placeholder="8.5 / 10" /></Grid>
              </Grid>
            </Box>
          ))}
          {form.education.length === 0 && <Typography variant="body2" color="text.secondary">No education added yet.</Typography>}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Experience</Typography>
            <Button size="small" startIcon={<Add />} onClick={addExperience} variant="outlined" sx={{ fontSize: '0.78rem' }}>Add</Button>
          </Box>
          {form.experience.map((exp, i) => (
            <Box key={i} sx={{ mb: 2, p: 2, background: 'rgba(26,115,232,0.04)', border: '1px solid rgba(26,115,232,0.12)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton size="small" onClick={() => removeExperience(i)} sx={{ color: 'error.main' }}><Delete sx={{ fontSize: 16 }} /></IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="Role/Position" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} fullWidth size="small" /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Company/Organization" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} fullWidth size="small" /></Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select value={exp.type} label="Type" onChange={(e) => updateExperience(i, 'type', e.target.value)}>
                      {EXP_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t.replace('_', ' ')}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}><TextField label="Start Date" value={exp.startDate ? exp.startDate.slice(0, 10) : ''} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="End Date" value={exp.endDate ? exp.endDate.slice(0, 10) : ''} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} disabled={exp.isCurrent} />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch size="small" checked={exp.isCurrent} onChange={(e) => updateExperience(i, 'isCurrent', e.target.checked)} />}
                    label={<Typography variant="caption" color="text.secondary">Currently working here</Typography>}
                  />
                </Grid>
                <Grid item xs={12}><TextField label="Description" value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} fullWidth size="small" multiline rows={2} placeholder="What did you do? What did you achieve?" /></Grid>
              </Grid>
            </Box>
          ))}
          {form.experience.length === 0 && <Typography variant="body2" color="text.secondary">No experience added yet.</Typography>}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Skills</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              size="small"
              sx={{ flexGrow: 1, minWidth: 150 }}
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Level</InputLabel>
              <Select value={newSkill.level} label="Level" onChange={(e) => setNewSkill((p) => ({ ...p, level: e.target.value }))}>
                {SKILL_LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={addSkill} startIcon={<Add />} size="small">Add</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {form.skills.map((skill) => (
              <Chip
                key={skill.name}
                label={`${skill.name} · ${skill.level}`}
                onDelete={() => removeSkill(skill.name)}
                size="small"
                sx={{ background: 'rgba(26,115,232,0.1)', border: '1px solid rgba(26,115,232,0.25)', color: '#8aa3c8' }}
              />
            ))}
          </Box>
          {form.skills.length === 0 && <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>}
        </CardContent>
      </Card>

      <Button variant="contained" size="large" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={handleSave} disabled={saving} sx={{ px: 4 }}>
        Save All Changes
      </Button>
    </Box>
  );
};

export default EditProfilePage;
