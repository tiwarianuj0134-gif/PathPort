import apiClient from './apiClient';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'mentor' | 'admin';
  avatarUrl?: string;
  headline?: string;
  careerGoal?: string;
  location?: string;
  resumeUrl?: string;
}

// Store token response from login/register
interface AuthResponse extends AuthUser {
  token?: string;
}

const saveToken = (data: AuthResponse) => {
  if (data.token) localStorage.setItem('pp_token', data.token);
};

const authService = {
  register: async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    saveToken(res.data);
    return res.data as AuthUser;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    saveToken(res.data);
    return res.data as AuthUser;
  },

  logout: async () => {
    localStorage.removeItem('pp_token');
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const res = await apiClient.get<AuthUser>('/auth/me');
    return res.data;
  },
};

export default authService;
