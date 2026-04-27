import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SmartToy } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
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
      <Box sx={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,115,232,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <Card sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
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
            <Typography variant="h6" fontWeight={600} mt={0.5} color="text.primary">Welcome back</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your career cockpit</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required autoComplete="email" />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required autoComplete="current-password" />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.3 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2.5} color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#00d4ff', fontWeight: 600 }}>Sign up free</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
