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

type JobsResponse = Job[] | { jobs?: Job[] } | Array<Record<string, unknown>>;

export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  const params = new URLSearchParams();

  params.append('status', filters.status || 'open');
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.state) params.append('state', filters.state);

  const queryString = params.toString();
  const response = await apiFetch(`/api/jobs${queryString ? `?${queryString}` : ''}`);
  const data = (await response.json()) as JobsResponse;

  const jobsArray = Array.isArray(data)
    ? data
    : Array.isArray((data as { jobs?: Job[] }).jobs)
      ? (data as { jobs?: Job[] }).jobs ?? []
      : [];

  return jobsArray.map((job: any) => ({
    id: job.id,
    title: job.title ?? 'Untitled Job',
    description: job.description ?? '',
    category: job.category ?? 'uncategorized',
    city: job.city ?? '',
    state: job.state ?? '',
    budgetMin: job.budgetMin ?? job.budget_min ?? null,
    budgetMax: job.budgetMax ?? job.budget_max ?? null,
    urgency: job.urgency ?? job.jobUrgency ?? null,
    status: job.status ?? 'open',
    createdAt: job.createdAt ?? job.created_at ?? new Date().toISOString(),
    poster: job.poster,
  }));
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const body = {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    city: payload.city,
    state: payload.state,
    ...(payload.budgetMin ? { budgetMin: payload.budgetMin } : {}),
    ...(payload.budgetMax ? { budgetMax: payload.budgetMax } : {}),
    ...(payload.urgency ? { urgency: payload.urgency } : {}),
  };

  const response = await apiFetch('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return response.json();
}
