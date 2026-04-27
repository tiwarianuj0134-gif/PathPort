import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress,
  Chip, Avatar, IconButton, Tooltip,
} from '@mui/material';
import { SmartToy, Person, Send, Mic, MicOff, VolumeUp, VolumeOff, Stop } from '@mui/icons-material';
import { aiService } from '../services/aiServices';
import { toast } from 'react-toastify';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: '🔍 Analyze Profile', mode: 'profile_analysis' },
  { label: '🎯 Next Skills', mode: 'next_skills' },
  { label: '💡 Project Ideas', mode: 'project_ideas' },
];

// Extend window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const AiJarvisPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello. I'm Jarvis — your AI career co-pilot. I can analyze your profile, suggest skills, generate project ideas, or write cover letters. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support
  const speechSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (synthSupported) synthRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak text using Web Speech API
  const speak = useCallback((text: string) => {
    if (!synthSupported || !voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    utterance.volume = 1;
    // Prefer a deeper voice if available
    const voices = synthRef.current.getVoices();
    const preferred = voices.find((v) => v.name.includes('Google UK English Male') || v.name.includes('Daniel') || v.name.includes('Alex'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => { setIsSpeaking(true); setOrbState('speaking'); };
    utterance.onend = () => { setIsSpeaking(false); setOrbState('idle'); };
    utterance.onerror = () => { setIsSpeaking(false); setOrbState('idle'); };
    synthRef.current.speak(utterance);
  }, [voiceEnabled, synthSupported]);

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setOrbState('idle');
  };

  // Start voice recognition
  const startListening = () => {
    if (!speechSupported) {
      toast.info('Voice input not supported in this browser. Use Chrome for best experience.');
      return;
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => { setIsListening(true); setOrbState('listening'); };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setInput(transcript);
    };
    recognition.onend = () => { setIsListening(false); setOrbState('idle'); };
    recognition.onerror = (e) => {
      setIsListening(false);
      setOrbState('idle');
      if (e.error !== 'no-speech') toast.error('Voice recognition error. Please try again.');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setOrbState('idle');
  };

  const sendMessage = async (mode: string, overrideMessage?: string) => {
    const userText = overrideMessage || input.trim();
    if (!userText && mode === 'general_question') return;

    const displayText = userText || mode.replace(/_/g, ' ');
    setMessages((prev) => [...prev, { role: 'user', content: displayText, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    setOrbState('thinking');

    try {
      const res = await aiService.jarvis({ mode, message: userText });
      const reply = res.message;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      // Show a subtle notice if using fallback due to quota
      if (res.source === 'fallback' && res.notice) {
        // Don't toast — just show in the message naturally
      }
      if (voiceEnabled) speak(reply);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Jarvis is unavailable right now.';
      toast.error(msg);
      setOrbState('idle');
    } finally {
      setLoading(false);
      if (!voiceEnabled) setOrbState('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('general_question');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Orb + status */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            className={`jarvis-orb ${orbState === 'listening' ? 'listening' : orbState === 'speaking' ? 'speaking' : ''}`}
            onClick={isListening ? stopListening : startListening}
            sx={{ width: 120, height: 120 }}
          >
            <Box className="jarvis-orb-ring" />
            <Box className="jarvis-orb-ring-2" />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isListening ? (
                <div className="voice-wave">
                  {[1,2,3,4,5,6,7].map((i) => <div key={i} className="voice-wave-bar" />)}
                </div>
              ) : (
                <SmartToy sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
              )}
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#8aa3c8', mb: 0.5 }}>
          {orbState === 'listening' ? '🎙 Listening...' :
           orbState === 'thinking' ? '⚡ Processing...' :
           orbState === 'speaking' ? '🔊 Speaking...' :
           speechSupported ? 'Click orb to speak' : 'Voice not supported'}
        </Typography>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {speechSupported && (
            <Tooltip title={isListening ? 'Stop listening' : 'Start voice input'}>
              <IconButton
                onClick={isListening ? stopListening : startListening}
                sx={{
                  color: isListening ? '#00ff88' : '#8aa3c8',
                  background: isListening ? 'rgba(0,255,136,0.1)' : 'transparent',
                  border: `1px solid ${isListening ? 'rgba(0,255,136,0.3)' : 'rgba(26,115,232,0.2)'}`,
                  '&:hover': { background: 'rgba(26,115,232,0.1)' },
                }}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            </Tooltip>
          )}
          {synthSupported && (
            <Tooltip title={voiceEnabled ? 'Mute Jarvis voice' : 'Enable Jarvis voice'}>
              <IconButton
                onClick={() => { setVoiceEnabled((v) => !v); if (isSpeaking) stopSpeaking(); }}
                sx={{
                  color: voiceEnabled ? '#00d4ff' : '#4a6080',
                  border: '1px solid rgba(26,115,232,0.2)',
                  '&:hover': { background: 'rgba(26,115,232,0.1)' },
                }}
              >
                {voiceEnabled ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>
          )}
          {isSpeaking && (
            <Tooltip title="Stop speaking">
              <IconButton onClick={stopSpeaking} sx={{ color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }}>
                <Stop />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Quick actions */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {QUICK_ACTIONS.map((action) => (
          <Chip
            key={action.mode}
            label={action.label}
            onClick={() => sendMessage(action.mode)}
            clickable
            disabled={loading}
            sx={{
              background: 'rgba(26,115,232,0.1)',
              border: '1px solid rgba(26,115,232,0.25)',
              color: '#8aa3c8',
              fontSize: '0.78rem',
              '&:hover': { background: 'rgba(26,115,232,0.2)', color: '#00d4ff', borderColor: '#1a73e8' },
            }}
          />
        ))}
      </Box>

      {/* Chat messages */}
      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(26,115,232,0.1)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            className="chat-bubble"
            sx={{ display: 'flex', gap: 1.5, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
          >
            <Avatar sx={{
              width: 30, height: 30, flexShrink: 0,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #1a73e8, #00d4ff)'
                : 'linear-gradient(135deg, #ffb300, #ff6b00)',
              fontSize: '0.75rem',
            }}>
              {msg.role === 'user' ? <Person sx={{ fontSize: 16 }} /> : <SmartToy sx={{ fontSize: 16 }} />}
            </Avatar>
            <Box sx={{
              maxWidth: '80%',
              p: 1.5,
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, rgba(26,115,232,0.3), rgba(0,212,255,0.2))'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(26,115,232,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary' }}>
                {msg.content}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, background: 'linear-gradient(135deg, #ffb300, #ff6b00)' }}>
              <SmartToy sx={{ fontSize: 16 }} />
            </Avatar>
            <Box sx={{ p: 1.5, borderRadius: '12px 12px 12px 4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} sx={{ color: '#00d4ff' }} />
              <Typography variant="caption" color="text.secondary">Jarvis is thinking...</Typography>
            </Box>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={isListening ? 'Listening...' : 'Ask Jarvis anything...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          multiline
          maxRows={3}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        />
        <Button
          variant="contained"
          onClick={() => sendMessage('general_question')}
          disabled={loading || !input.trim()}
          sx={{ minWidth: 48, px: 1.5, borderRadius: '10px' }}
        >
          <Send sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default AiJarvisPanel;
