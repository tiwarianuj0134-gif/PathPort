import apiClient from './apiClient';

const jobService = {
  getJobs: async (params?: Record<string, string | number>) => {
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id: string) => {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  },

  createJob: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/jobs', data);
    return res.data;
  },

  updateJob: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/jobs/${id}`, data);
    return res.data;
  },

  toggleJobStatus: async (id: string) => {
    const res = await apiClient.patch(`/jobs/${id}/status`);
    return res.data;
  },

  deleteJob: async (id: string) => {
    const res = await apiClient.delete(`/jobs/${id}`);
    return res.data;
  },

  // Returns jobs with applicantStats and totalApplicants
  getMyJobs: async () => {
    const res = await apiClient.get('/jobs/recruiter/mine');
    return res.data;
  },

  applyToJob: async (jobId: string, coverMessage: string) => {
    const res = await apiClient.post('/applications', { jobId, coverMessage });
    return res.data;
  },

  getMyApplications: async () => {
    const res = await apiClient.get('/applications/mine');
    return res.data;
  },

  getApplicants: async (jobId: string) => {
    const res = await apiClient.get(`/applications/job/${jobId}`);
    return res.data;
  },

  updateApplicationStatus: async (appId: string, status: string, note?: string) => {
    const res = await apiClient.patch(`/applications/${appId}/status`, { status, note });
    return res.data;
  },

  updateRecruiterNote: async (appId: string, note: string) => {
    const res = await apiClient.patch(`/applications/${appId}/note`, { note });
    return res.data;
  },
};

export default jobService;
