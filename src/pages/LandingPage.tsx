import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent, Chip,
  Popover, List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { AccountTree, Folder, SmartToy, TrendingUp, ArrowForward, CheckCircle, WhatsApp, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <AccountTree sx={{ fontSize: 32, color: '#1a73e8' }} />,
    title: 'Skill Pathway Map',
    desc: 'Interactive graph of your skills tied to your career goal. See exactly what to learn next.',
    color: '#1a73e8',
  },
  {
    icon: <Folder sx={{ fontSize: 32, color: '#ffb300' }} />,
    title: 'Proof Portfolio',
    desc: 'Evidence cards for every project, course, and hackathon. Real proof, not just claims.',
    color: '#ffb300',
  },
  {
    icon: <SmartToy sx={{ fontSize: 32, color: '#00d4ff' }} />,
    title: 'AI Jarvis (Voice)',
    desc: 'Voice-enabled AI career co-pilot. Speak to it. It analyzes your profile and guides you.',
    color: '#00d4ff',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 32, color: '#00ff88' }} />,
    title: 'Opportunity Quality Index',
    desc: 'Every job rated by students who worked there. No more blind applications.',
    color: '#00ff88',
  },
];

const steps = [
  { num: '01', title: 'Build your proof', desc: 'Add skills, create evidence cards, map your growth journey.' },
  { num: '02', title: 'Discover quality opportunities', desc: 'Find internships rated by real students with OQI scores.' },
  { num: '03', title: 'Grow with AI guidance', desc: 'Jarvis analyzes your profile and gives specific, actionable advice.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'CS Student, IIT Delhi', text: 'PathPort helped me understand exactly what skills I needed. Got my first internship in 3 months.' },
  { name: 'Rahul M.', role: 'ECE Student, NIT Trichy', text: 'The OQI score saved me from a bad internship. I could see reviews before applying.' },
  { name: 'Ananya K.', role: 'MBA Student, XLRI', text: 'Jarvis wrote my cover letter better than I could. The voice feature is incredible.' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [contactAnchor, setContactAnchor] = useState<HTMLElement | null>(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Navbar */}
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,11,24,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26,115,232,0.15)',
        px: { xs: 2, md: 4 }, py: 1.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(26,115,232,0.4)',
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>PP</Typography>
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>PathPort</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="contained" size="small" onClick={() => navigate('/register')}>Sign Up Free</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #050b18 0%, #0a1628 50%, #0d1f3c 100%)',
        pt: 8,
      }}>
        {/* Grid background */}
        <Box className="grid-bg" sx={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

        {/* Glow orbs */}
        <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,115,232,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Chip
              label="🚀 For Higher-Education Students"
              sx={{
                mb: 3, background: 'rgba(26,115,232,0.15)',
                border: '1px solid rgba(26,115,232,0.3)',
                color: '#00d4ff', fontWeight: 600,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #e8f0fe 0%, #00d4ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              Not just a profile.
              <br />Your proof of growth.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: '#8aa3c8', maxWidth: 560, mx: 'auto', mb: 5, fontWeight: 400, lineHeight: 1.7 }}
            >
              PathPort is a futuristic career cockpit for students — skill maps, evidence portfolios, AI voice guidance, and transparent opportunities.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/register')}
                sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register?role=recruiter')}
                sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
              >
                Post Internship
              </Button>
            </Box>

            {/* Trust badges */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 5, flexWrap: 'wrap' }}>
              {['Voice AI Jarvis', 'OQI Scores', 'Skill Map', 'Evidence Portfolio'].map((badge) => (
                <Box key={badge} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 14, color: '#00ff88' }} />
                  <Typography variant="caption" sx={{ color: '#8aa3c8' }}>{badge}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: 10, background: 'rgba(10,22,40,0.5)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={1} sx={{ background: 'linear-gradient(135deg, #e8f0fe, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            How PathPort works
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={6}>Three steps to a stronger career foundation</Typography>
          <Grid container spacing={4}>
            {steps.map((s, i) => (
              <Grid item xs={12} md={4} key={s.num}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Typography sx={{ fontSize: '5rem', fontWeight: 800, color: 'rgba(26,115,232,0.1)', lineHeight: 1, mb: -2 }}>{s.num}</Typography>
                  <Typography variant="h5" fontWeight={700} mb={1} sx={{ color: 'text.primary' }}>{s.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{s.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" mb={1} sx={{ background: 'linear-gradient(135deg, #e8f0fe, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          What makes PathPort different
        </Typography>
        <Typography color="text.secondary" textAlign="center" mb={6}>Built for students who want to grow, not just get hired</Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <Card className="hover-lift" sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: '16px', mx: 'auto', mb: 2,
                    background: `rgba(${f.color === '#1a73e8' ? '26,115,232' : f.color === '#ffb300' ? '255,179,0' : f.color === '#00d4ff' ? '0,212,255' : '0,255,136'},0.1)`,
                    border: `1px solid ${f.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} mb={1}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ py: 10, background: 'rgba(10,22,40,0.5)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={6} sx={{ background: 'linear-gradient(135deg, #e8f0fe, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            What students say
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card className="hover-lift" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body1" mb={2.5} sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.7 }}>
                      "{t.text}"
                    </Typography>
                    <Typography fontWeight={600} color="text.primary">{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{
        py: 10, textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(26,115,232,0.1) 0%, rgba(0,212,255,0.05) 100%)',
        borderTop: '1px solid rgba(26,115,232,0.15)',
      }}>
        <Container maxWidth="sm">
          <Typography variant="h3" fontWeight={700} mb={2} sx={{ background: 'linear-gradient(135deg, #e8f0fe, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to prove your growth?
          </Typography>
          <Typography color="text.secondary" mb={4} sx={{ lineHeight: 1.7 }}>
            Join students building their proof of work on PathPort.
          </Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={() => navigate('/register')} sx={{ px: 5, py: 1.5 }}>
            Create Your PathPort
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(26,115,232,0.1)' }}>
        <Typography variant="body2" color="text.disabled" sx={{ mb: 0.5, letterSpacing: '0.03em' }}>
          © {new Date().getFullYear()} PathPort · Not just a profile. Your proof of growth.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(138,163,200,0.6)', letterSpacing: '0.04em' }}>
          Crafted with precision by{' '}
          <Box
            component="span"
            onClick={(e: React.MouseEvent<HTMLElement>) => setContactAnchor(e.currentTarget)}
            sx={{
              color: '#1a73e8',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -1,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, #1a73e8, #00d4ff)',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
              },
              '&:hover::after': { transform: 'scaleX(1)' },
              '&:hover': { color: '#00d4ff' },
              transition: 'color 0.2s ease',
            }}
          >
            Anuj Tiwari
          </Box>
        </Typography>

        {/* Contact Popover */}
        <Popover
          open={Boolean(contactAnchor)}
          anchorEl={contactAnchor}
          onClose={() => setContactAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0d1b2e, #0a1628)',
              border: '1px solid rgba(26,115,232,0.3)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: 220,
              overflow: 'hidden',
            },
          }}
        >
          <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#8aa3c8', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Connect with Anuj
            </Typography>
          </Box>
          <List dense disablePadding sx={{ pb: 1 }}>
            <ListItemButton
              onClick={() => { window.open('https://wa.me/7607768611', '_blank'); setContactAnchor(null); }}
              sx={{ px: 2, py: 1, '&:hover': { background: 'rgba(37,211,102,0.08)' } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <WhatsApp sx={{ color: '#25D366', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Chat on WhatsApp"
                secondary="7607768611"
                primaryTypographyProps={{ fontSize: '0.875rem', color: '#e0e8f0', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: '#8aa3c8' }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => { window.open('mailto:anuj.tiwari@universalai.in', '_blank'); setContactAnchor(null); }}
              sx={{ px: 2, py: 1, '&:hover': { background: 'rgba(26,115,232,0.08)' } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Email sx={{ color: '#1a73e8', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Send an Email"
                secondary="anuj.tiwari@universalai.in"
                primaryTypographyProps={{ fontSize: '0.875rem', color: '#e0e8f0', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: '#8aa3c8' }}
              />
            </ListItemButton>
          </List>
        </Popover>
      </Box>
    </Box>
  );
};

export default LandingPage;
