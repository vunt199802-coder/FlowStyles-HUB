import { apiFetch } from '@/api/client';

export interface Provider {
  id: string;
  businessName: string;
  businessType: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  services?: Array<{
    id: string;
    name: string;
    description: string | null;
    basePrice: string;
    duration: number;
  }>;
  portfolio?: Array<{
    id: string;
    afterImage: string;
    beforeImage: string | null;
    title: string | null;
  }>;
}

export interface SearchFilters {
  type?: string;
  city?: string;
  state?: string;
}

export async function searchProviders(filters: SearchFilters = {}): Promise<Provider[]> {
  const params = new URLSearchParams();
  
  if (filters.type) {
    params.append('role', filters.type.toLowerCase());
  }
  if (filters.city) {
    params.append('city', filters.city);
  }
  if (filters.state) {
    params.append('state', filters.state);
  }

  const response = await apiFetch(`/api/service-providers?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }

  const data = await response.json();

  return data.map((provider: any) => ({
    id: provider.id,
    businessName: provider.fullName || provider.username,
    businessType: provider.role,
    bio: provider.bio,
    city: provider.city,
    state: provider.state,
    services: provider.services || [],
    portfolio: provider.portfolioPreview || [],
  }));
}
