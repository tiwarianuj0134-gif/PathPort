import React from 'react';
import { Chip, Tooltip, Box } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

interface Props {
  score: number | null;
  showLabel?: boolean;
}

const getGrade = (score: number | null) => {
  if (score === null || score === undefined) return { label: 'N/A', grade: 'N/A', color: '#4a6080', bg: 'rgba(74,96,128,0.15)', border: 'rgba(74,96,128,0.3)' };
  if (score >= 70) return { label: `${score}`, grade: 'High', color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)' };
  if (score >= 40) return { label: `${score}`, grade: 'Medium', color: '#ffb300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.3)' };
  return { label: `${score}`, grade: 'Low', color: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)' };
};

const OQIBadge: React.FC<Props> = ({ score, showLabel = true }) => {
  const { label, grade, color, bg, border } = getGrade(score);

  return (
    <Tooltip
      title={`Opportunity Quality Index: ${grade}${score !== null ? ` (${score}/100)` : ''} — based on student reviews`}
      arrow
    >
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.5,
        px: 1, py: 0.3,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        cursor: 'default',
      }}>
        <TrendingUp sx={{ fontSize: 12, color }} />
        <Box component="span" sx={{ fontSize: '0.7rem', fontWeight: 700, color, letterSpacing: '0.02em' }}>
          OQI {label}
        </Box>
        {showLabel && score !== null && (
          <Box component="span" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
            · {grade}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default OQIBadge;
