import apiClient from './apiClient';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'mentor' | 'admin';
  avatarUrl?: string;
  headline?: string;
}

const authService = {
  register: async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await apiClient.post<AuthUser>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<AuthUser>('/auth/login', data);
    return res.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const res = await apiClient.get<AuthUser>('/auth/me');
    return res.data;
  },
};

export default authService;
