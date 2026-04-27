import apiClient from './apiClient';

export interface JarvisResponse {
  message: string;
  source: 'openai' | 'fallback';
  notice?: string;
}

export const aiService = {
  jarvis: async (payload: { mode: string; message?: string; jobId?: string }): Promise<JarvisResponse> => {
    const res = await apiClient.post<JarvisResponse>('/ai/jarvis', payload);
    return res.data;
  },

  support: async (message: string): Promise<JarvisResponse> => {
    const res = await apiClient.post<JarvisResponse>('/ai/support', { message });
    return res.data;
  },

  translate: async (text: string): Promise<{ bullets: string; source: string }> => {
    const res = await apiClient.post<{ bullets: string; source: string }>('/ai/translate', { text });
    return res.data;
  },
};
