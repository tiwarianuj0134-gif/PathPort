import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { OpenInNew, Delete, Edit } from '@mui/icons-material';

interface EvidenceCardData {
  _id: string;
  title: string;
  type: string;
  description: string;
  skills: string[];
  links: { label: string; url: string }[];
  createdAt: string;
}

interface Props {
  card: EvidenceCardData;
  onEdit?: (card: EvidenceCardData) => void;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  project: { color: '#1a73e8', bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)' },
  course: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' },
  hackathon: { color: '#ffb300', bg: 'rgba(255,179,0,0.1)', border: 'rgba(255,179,0,0.3)' },
  internship_task: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)' },
  simulation: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)' },
};

const EvidenceCard: React.FC<Props> = ({ card, onEdit, onDelete, readonly }) => {
  const cfg = typeConfig[card.type] || typeConfig.project;

  return (
    <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{
            px: 1, py: 0.3,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: '6px',
          }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color, textTransform: 'capitalize' }}>
              {card.type.replace('_', ' ')}
            </Typography>
          </Box>
          {!readonly && (
            <Box sx={{ display: 'flex', gap: 0.3 }}>
              {onEdit && (
                <IconButton size="small" onClick={() => onEdit(card)} sx={{ color: 'text.secondary', '&:hover': { color: '#00d4ff' } }}>
                  <Edit sx={{ fontSize: 15 }} />
                </IconButton>
              )}
              {onDelete && (
                <IconButton size="small" onClick={() => onDelete(card._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                  <Delete sx={{ fontSize: 15 }} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        <Typography variant="h6" fontWeight={600} mb={0.75} sx={{ fontSize: '0.95rem', lineHeight: 1.3 }}>
          {card.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1.5} sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5,
        }}>
          {card.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {card.skills.slice(0, 4).map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
          {card.skills.length > 4 && (
            <Chip label={`+${card.skills.length - 4}`} size="small" sx={{ background: 'rgba(26,115,232,0.1)', color: '#8aa3c8' }} />
          )}
        </Box>

        {card.links.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {card.links.map((link) => (
              <Box
                key={link.url}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: '#1a73e8', fontSize: '0.75rem', '&:hover': { color: '#00d4ff' } }}
              >
                <OpenInNew sx={{ fontSize: 11 }} />
                {link.label}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>

      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <Typography variant="caption" color="text.disabled">
          {new Date(card.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Typography>
      </Box>
    </Card>
  );
};

export default EvidenceCard;
