import type { ApiResponse, Profile, Job, Bookmark } from './types';

const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error.message || 'API Error');
  }

  return data.data;
}

export const api = {
  // Profile
  getProfile: () => request<Profile | null>('/api/profile'),
  updateProfile: (data: Partial<Profile>) => request<Profile>('/api/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  updateProfileSection: (section: string, data: any) => 
    request<Profile>(`/api/profile/section/${section}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getProfileContext: () => request<{ contextString: string }>('/api/profile/context'),

  // Jobs
  getJobs: () => request<{ jobs: Job[], count: number }>('/api/jobs'),
  refreshJobs: () => request<{ fetched: number, scored: number }>('/api/jobs/refresh', { method: 'POST' }),
  scoreJobs: (jobIds: string[]) => request<{ scored: number }>('/api/jobs/score', { method: 'POST', body: JSON.stringify({ jobIds }) }),

  // Bookmarks
  getBookmarks: () => request<Bookmark[]>('/api/jobs/bookmarks'),
  addBookmark: (data: Partial<Bookmark>) => request<Bookmark>('/api/jobs/bookmarks', { method: 'POST', body: JSON.stringify(data) }),
  updateBookmark: (id: string, data: Partial<Bookmark>) => 
    request<Bookmark>(`/api/jobs/bookmarks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBookmark: (id: string) => request<null>(`/api/jobs/bookmarks/${id}`, { method: 'DELETE' }),

  // Freelance
  getFreelanceIdeas: () => request<{ gigs: any[] }>('/api/freelance/ideas'),
  getFreelanceRates: () => request<any>('/api/freelance/rates'),

  // Resume
  rewriteBullet: (bullet: string, jobDescription: string) => 
    request<any>('/api/resume/rewrite', { method: 'POST', body: JSON.stringify({ bullet, jobDescription }) }),
  generateCoverLetter: (job: { title: string; company: string; description: string }) => 
    request<any>('/api/resume/coverletter', { method: 'POST', body: JSON.stringify({ job }) }),

  // Assistant
  chat: (messages: { role: 'user' | 'assistant', content: string }[]) => 
    request<{ reply: string, suggestedFollowUps: string[] }>('/api/assistant/chat', { method: 'POST', body: JSON.stringify({ messages }) }),
};
