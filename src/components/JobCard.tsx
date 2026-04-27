import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { LocationOn, Work, AccessTime, AttachMoney } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import OQIBadge from './OQIBadge';

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  isRemote: boolean;
  type: string;
  requiredSkills: string[];
  stipendMin?: number;
  stipendMax?: number;
  applicationDeadline?: string;
  oqiScore?: number | null;
}

const typeColors: Record<string, string> = {
  internship: 'rgba(26,115,232,0.15)',
  full_time: 'rgba(0,255,136,0.1)',
  part_time: 'rgba(255,179,0,0.1)',
  contract: 'rgba(124,58,237,0.15)',
  freelance: 'rgba(0,212,255,0.1)',
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const navigate = useNavigate();

  const stipendText =
    job.stipendMin || job.stipendMax
      ? `₹${job.stipendMin ?? '?'}–₹${job.stipendMax ?? '?'}/mo`
      : 'Unpaid / Not disclosed';

  return (
    <Card className="hover-lift" sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job._id}`)}>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem', lineHeight: 1.3, color: 'text.primary' }}>
              {job.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8aa3c8', mt: 0.3 }}>{job.companyName}</Typography>
          </Box>
          <OQIBadge score={job.oqiScore ?? null} showLabel={false} />
        </Box>

        {/* Meta */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <LocationOn sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {job.isRemote ? 'Remote' : job.location || 'On-site'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <Work sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {job.type.replace('_', ' ')}
            </Typography>
          </Box>
          {job.applicationDeadline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <AccessTime sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(job.applicationDeadline).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stipend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <AttachMoney sx={{ fontSize: 14, color: '#00d4ff' }} />
          <Typography variant="caption" sx={{ color: '#00d4ff', fontWeight: 600 }}>{stipendText}</Typography>
        </Box>

        {/* Type badge */}
        <Chip
          label={job.type.replace('_', ' ')}
          size="small"
          sx={{
            mb: 1.5,
            background: typeColors[job.type] || 'rgba(26,115,232,0.1)',
            color: 'text.primary',
            border: '1px solid rgba(26,115,232,0.2)',
            textTransform: 'capitalize',
            fontSize: '0.7rem',
          }}
        />

        {/* Skills */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {job.requiredSkills.slice(0, 4).map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
          {job.requiredSkills.length > 4 && (
            <Chip label={`+${job.requiredSkills.length - 4}`} size="small" sx={{ background: 'rgba(26,115,232,0.1)', color: '#8aa3c8' }} />
          )}
        </Box>
      </CardContent>

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          variant="outlined"
          fullWidth
          size="small"
          onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job._id}`); }}
          sx={{ fontSize: '0.8rem' }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default JobCard;
