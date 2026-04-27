import apiClient from './apiClient';

const profileService = {
  getUser: async (id: string) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  },

  updateProfile: async (data: Record<string, unknown>) => {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },

  searchUsers: async (q: string) => {
    const res = await apiClient.get('/users/search', { params: { q } });
    return res.data;
  },

  endorseSkill: async (userId: string, skillName: string) => {
    const res = await apiClient.post(`/users/${userId}/endorse/${encodeURIComponent(skillName)}`);
    return res.data;
  },

  getMySkills: async () => {
    const res = await apiClient.get('/skills');
    return res.data;
  },

  getUserSkills: async (userId: string) => {
    const res = await apiClient.get(`/skills/user/${userId}`);
    return res.data;
  },

  createSkill: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/skills', data);
    return res.data;
  },

  updateSkill: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/skills/${id}`, data);
    return res.data;
  },

  deleteSkill: async (id: string) => {
    const res = await apiClient.delete(`/skills/${id}`);
    return res.data;
  },

  getConnections: async () => {
    const res = await apiClient.get('/connections');
    return res.data;
  },

  sendConnectionRequest: async (recipientId: string) => {
    const res = await apiClient.post('/connections/request', { recipientId });
    return res.data;
  },

  respondToConnection: async (id: string, status: 'accepted' | 'declined') => {
    const res = await apiClient.put(`/connections/${id}/respond`, { status });
    return res.data;
  },

  getPendingRequests: async () => {
    const res = await apiClient.get('/connections/pending');
    return res.data;
  },
};

export default profileService;
