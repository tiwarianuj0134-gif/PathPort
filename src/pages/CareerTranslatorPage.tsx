import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Chip,
} from '@mui/material';
import { Translate, ContentCopy, CheckCircle } from '@mui/icons-material';
import { aiService } from '../services/aiServices';
import { toast } from 'react-toastify';

const EXAMPLES = [
  'Maine ek website banaya jisme users login kar sakte hain aur apna data save kar sakte hain',
  'I helped my college fest team manage registrations using Excel and Google Forms',
  'Built a chatbot for our college library using Python that answers basic questions',
  'Kiya ek data analysis project jisme maine sales data se insights nikale',
];

const CareerTranslatorPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState('');

  const handleTranslate = async () => {
    if (!input.trim()) { toast.error('Please enter a description.'); return; }
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await aiService.translate(input);
      setOutput(res.bullets);
      setSource(res.source);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box className="page-enter" sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Translate sx={{ color: '#00d4ff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Career Translator</Typography>
          <Typography variant="body2" color="text.secondary">
            Describe your project in any language — get professional ATS-friendly bullet points
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">
            Try an example:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
            {EXAMPLES.map((ex, i) => (
              <Chip
                key={i}
                label={`Example ${i + 1}`}
                size="small"
                onClick={() => setInput(ex)}
                sx={{ cursor: 'pointer', background: 'rgba(26,115,232,0.08)', border: '1px solid rgba(26,115,232,0.2)', color: '#8aa3c8', '&:hover': { background: 'rgba(26,115,232,0.15)', color: '#00d4ff' } }}
              />
            ))}
          </Box>

          <TextField
            label="Describe your project or experience (any language, even Hinglish)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth multiline rows={4}
            placeholder="e.g. Maine ek website banaya... / I built a project that... / Kiya ek internship jisme..."
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Translate />}
            sx={{ px: 3 }}
          >
            {loading ? 'Translating...' : 'Translate to Professional Bullets'}
          </Button>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {output && (
        <Card sx={{ border: '1px solid rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.03)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#00ff88', fontSize: 18 }} />
                <Typography variant="h6" fontWeight={600} sx={{ color: '#00ff88' }}>Professional Bullets</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {source === 'fallback' && (
                  <Chip label="Smart Fallback" size="small" sx={{ background: 'rgba(255,179,0,0.1)', color: '#ffb300', border: '1px solid rgba(255,179,0,0.3)', fontSize: '0.68rem' }} />
                )}
                <Button
                  size="small"
                  startIcon={copied ? <CheckCircle sx={{ fontSize: 14 }} /> : <ContentCopy sx={{ fontSize: 14 }} />}
                  onClick={handleCopy}
                  sx={{ color: copied ? '#00ff88' : 'text.secondary', fontSize: '0.78rem' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
            </Box>
            <Box sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 2, p: 2 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}>
                {output}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.disabled" display="block" mt={1.5}>
              💡 Copy these bullets into your Experience section, Evidence Card, or resume.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">How it works</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { step: '1', text: 'Describe your project in plain language — Hindi, English, or Hinglish' },
              { step: '2', text: 'AI converts it to professional, ATS-friendly English bullet points' },
              { step: '3', text: 'Copy the bullets into your Experience section or Evidence Card' },
            ].map((item) => (
              <Box key={item.step} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(26,115,232,0.15)', border: '1px solid rgba(26,115,232,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a73e8' }}>{item.step}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">{item.text}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CareerTranslatorPage;
