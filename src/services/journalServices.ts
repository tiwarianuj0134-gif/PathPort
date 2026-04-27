import apiClient from './apiClient';

const journalService = {
  getAll: async () => {
    const res = await apiClient.get('/journal');
    return res.data;
  },

  create: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/journal', data);
    return res.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/journal/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/journal/${id}`);
    return res.data;
  },
};

export default journalService;
