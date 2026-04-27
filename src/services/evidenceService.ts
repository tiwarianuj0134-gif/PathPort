import apiClient from './apiClient';

const evidenceService = {
  getMyEvidence: async () => {
    const res = await apiClient.get('/evidence');
    return res.data;
  },

  getUserEvidence: async (userId: string) => {
    const res = await apiClient.get(`/evidence/user/${userId}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get(`/evidence/${id}`);
    return res.data;
  },

  create: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/evidence', data);
    return res.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/evidence/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/evidence/${id}`);
    return res.data;
  },

  addFeedback: async (id: string, data: { rating: number; comment: string }) => {
    const res = await apiClient.post(`/evidence/${id}/feedback`, data);
    return res.data;
  },
};

export default evidenceService;
