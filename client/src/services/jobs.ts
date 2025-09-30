import { apiFetch } from '@/api/client';
import type { Job } from '@/types/api';

export interface JobFilters {
  status?: string;
  category?: string;
  city?: string;
  state?: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  budgetMin?: string;
  budgetMax?: string;
  urgency?: string;
}

export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.state) params.append('state', filters.state);

  const response = await apiFetch(`/api/jobs?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const response = await apiFetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  
  return response.json();
}
