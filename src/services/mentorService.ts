import apiClient from './apiClient';

const mentorService = {
  getMentors: async (params?: Record<string, string>) => {
    const res = await apiClient.get('/mentors', { params });
    return res.data;
  },

  getMentorById: async (id: string) => {
    const res = await apiClient.get(`/mentors/${id}`);
    return res.data;
  },

  updateMentorProfile: async (data: Record<string, unknown>) => {
    const res = await apiClient.put('/mentors/profile/me', data);
    return res.data;
  },

  // Offers
  getMyOffers: async () => {
    const res = await apiClient.get('/mentors/offers/mine');
    return res.data;
  },

  createOffer: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/mentors/offers', data);
    return res.data;
  },

  updateOffer: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/mentors/offers/${id}`, data);
    return res.data;
  },

  // Sessions — student
  requestSession: async (mentorId: string, data: Record<string, unknown>) => {
    const res = await apiClient.post(`/mentors/${mentorId}/request-session`, data);
    return res.data;
  },

  getMySessionsAsStudent: async () => {
    const res = await apiClient.get('/mentors/sessions/mine');
    return res.data;
  },

  // Sessions — mentor
  getSessionsAsMentor: async () => {
    const res = await apiClient.get('/mentors/sessions/incoming');
    return res.data;
  },

  updateSession: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.patch(`/mentors/sessions/${id}`, data);
    return res.data;
  },

  submitReview: async (sessionId: string, data: { rating: number; comment: string }) => {
    const res = await apiClient.post(`/mentors/sessions/${sessionId}/review`, data);
    return res.data;
  },
};

export default mentorService;
