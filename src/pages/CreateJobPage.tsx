import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Select, MenuItem, FormControl,
  InputLabel, FormControlLabel, Switch, Chip, Grid,
} from '@mui/material';
import { Add, ArrowBack, Work } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobServices';
import { toast } from 'react-toastify';

const JOB_TYPES = ['internship', 'full_time', 'part_time', 'contract', 'freelance'];

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
    isRemote: false,
    type: 'internship',
    description: '',
    responsibilities: '',
    requiredSkills: [] as string[],
    stipendMin: '',
    stipendMax: '',
    applicationDeadline: '',
  });

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (form.requiredSkills.includes(skill)) return;
    setForm((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, skill] }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, requiredSkills: prev.requiredSkills.filter((s) => s !== skill) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.companyName || !form.description || !form.type) {
      setError('Title, company, type, and description are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        stipendMin: form.stipendMin ? Number(form.stipendMin) : null,
        stipendMax: form.stipendMax ? Number(form.stipendMax) : null,
        applicationDeadline: form.applicationDeadline || null,
      };
      await jobService.createJob(payload);
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="page-enter" sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Work sx={{ color: '#1a73e8', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Post a Job / Internship</Typography>
          <Typography variant="body2" color="text.secondary">Create a new opportunity for students</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Basic Info */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Job Title *"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  fullWidth required
                  placeholder="e.g. Frontend Developer Intern"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Type *</InputLabel>
                  <Select value={form.type} label="Type *" onChange={(e) => handleChange('type', e.target.value)}>
                    {JOB_TYPES.map((t) => (
                      <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t.replace('_', ' ')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Company Name *"
              value={form.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              fullWidth required
              placeholder="e.g. TechCorp Solutions"
            />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  label="Location"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  fullWidth
                  placeholder="e.g. Bangalore, India"
                  disabled={form.isRemote}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isRemote}
                      onChange={(e) => handleChange('isRemote', e.target.checked)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00d4ff' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a73e8' } }}
                    />
                  }
                  label="Remote"
                  sx={{ color: 'text.secondary' }}
                />
              </Grid>
            </Grid>

            {/* Compensation */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mt: 1 }}>
              Compensation & Deadline
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Stipend Min (₹/mo)"
                  type="number"
                  value={form.stipendMin}
                  onChange={(e) => handleChange('stipendMin', e.target.value)}
                  fullWidth
                  placeholder="e.g. 5000"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Stipend Max (₹/mo)"
                  type="number"
                  value={form.stipendMax}
                  onChange={(e) => handleChange('stipendMax', e.target.value)}
                  fullWidth
                  placeholder="e.g. 15000"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Application Deadline"
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Description */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mt: 1 }}>
              Job Details
            </Typography>

            <TextField
              label="Job Description *"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth multiline rows={5} required
              placeholder="Describe the role, what the intern/employee will do, what they'll learn..."
            />

            <TextField
              label="Responsibilities"
              value={form.responsibilities}
              onChange={(e) => handleChange('responsibilities', e.target.value)}
              fullWidth multiline rows={3}
              placeholder="List key responsibilities (one per line)..."
            />

            {/* Skills */}
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mt: 1 }}>
              Required Skills
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                size="small"
                sx={{ flexGrow: 1 }}
                placeholder="e.g. React, Python, Figma"
              />
              <Button variant="outlined" onClick={addSkill} startIcon={<Add />} size="small" sx={{ flexShrink: 0 }}>
                Add
              </Button>
            </Box>

            {form.requiredSkills.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {form.requiredSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    size="small"
                    sx={{ background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', color: '#8aa3c8' }}
                  />
                ))}
              </Box>
            )}

            {/* Submit */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                sx={{ px: 4 }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Post Job'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateJobPage;
