import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, TextField, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Alert, Pagination,
  InputAdornment,
} from '@mui/material';
import { Search, Work } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import jobService from '../services/jobServices';

const TYPES = ['', 'internship', 'full_time', 'part_time', 'contract', 'freelance'];

const JobsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = useCallback(async (query: string, jobType: string, pageNum: number) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = { page: pageNum, limit: 12 };
      if (query) params.q = query;
      if (jobType) params.type = jobType;
      const data = await jobService.getJobs(params);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(q, type, page); }, [type, page]);

  const handleSearch = (value: string) => {
    setQ(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => { setPage(1); fetchJobs(value, type, 1); }, 400);
    setDebounceTimer(timer);
  };

  return (
    <Box className="page-enter">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(26,115,232,0.12)', border: '1px solid rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Work sx={{ color: '#1a73e8', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>Jobs & Internships</Typography>
          <Typography variant="body2" color="text.secondary">Discover quality opportunities with transparent OQI scores</Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by title, company..."
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: 'text.secondary' }} /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {TYPES.map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                {t ? t.replace('_', ' ') : 'All Types'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Work sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">No jobs found matching your criteria.</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
            {total} opportunit{total !== 1 ? 'ies' : 'y'} found
          </Typography>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={pages}
                page={page}
                onChange={(_, p) => setPage(p)}
                sx={{
                  '& .MuiPaginationItem-root': { color: 'text.secondary', borderColor: 'rgba(26,115,232,0.2)' },
                  '& .Mui-selected': { background: 'rgba(26,115,232,0.2) !important', color: '#00d4ff' },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default JobsPage;
