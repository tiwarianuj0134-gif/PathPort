import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Link, Alert, CircularProgress, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { School, Business, People, SmartToy } from '@mui/icons-material';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const roles = [
  { value: 'student', label: 'Student', icon: <School sx={{ fontSize: 18 }} /> },
  { value: 'recruiter', label: 'Recruiter', icon: <Business sx={{ fontSize: 18 }} /> },
  { value: 'mentor', label: 'Mentor', icon: <People sx={{ fontSize: 18 }} /> },
];

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: searchParams.get('role') || 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Welcome to PathPort!');
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #050b18 0%, #0a1628 100%)',
      p: 2, position: 'relative', overflow: 'hidden',
    }}>
      <Box className="grid-bg" sx={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
      <Box sx={{ position: 'absolute', bottom: '20%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <Card sx={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '14px', mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(26,115,232,0.4)',
            }}>
              <SmartToy sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #e8f0fe, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PathPort
            </Typography>
            <Typography variant="h6" fontWeight={600} mt={0.5} color="text.primary">Create your account</Typography>
            <Typography variant="body2" color="text.secondary">Start your proof of growth journey</Typography>
          </Box>

          <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">I am a...</Typography>
          <ToggleButtonGroup
            value={form.role}
            exclusive
            onChange={(_, val) => val && setForm((prev) => ({ ...prev, role: val }))}
            fullWidth
            sx={{ mb: 3 }}
          >
            {roles.map((r) => (
              <ToggleButton key={r.value} value={r.value} sx={{ gap: 0.75, fontSize: '0.82rem', py: 1 }}>
                {r.icon} {r.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required autoComplete="email" />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required autoComplete="new-password" helperText="Minimum 6 characters" />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.3 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2.5} color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#00d4ff', fontWeight: 600 }}>Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
