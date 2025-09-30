import { apiFetch } from '@/api/client';
import type { Provider } from '@/types/api';

export interface SearchFilters {
  type?: string;
  city?: string;
  state?: string;
}

const mockProviders: Provider[] = [
  {
    id: 'mock-1',
    businessName: 'Glamour Studio',
    businessType: 'stylist',
    bio: 'Professional hair styling with 10+ years experience',
    city: 'Los Angeles',
    state: 'CA',
    services: [
      { id: 's1', name: 'Haircut & Style', description: 'Full service haircut', basePrice: '65.00', duration: 60 },
      { id: 's2', name: 'Color Treatment', description: 'Full color service', basePrice: '120.00', duration: 120 }
    ],
    portfolio: [
      { id: 'p1', afterImage: '/placeholder-after.jpg', beforeImage: '/placeholder-before.jpg', title: 'Color Transformation' }
    ]
  },
  {
    id: 'mock-2',
    businessName: 'Elite Cuts',
    businessType: 'barber',
    bio: 'Master barber specializing in modern cuts',
    city: 'New York',
    state: 'NY',
    services: [
      { id: 's3', name: 'Classic Cut', description: 'Traditional barbering', basePrice: '45.00', duration: 45 }
    ],
    portfolio: []
  }
];

export async function searchProviders(filters: SearchFilters = {}): Promise<Provider[]> {
  const params = new URLSearchParams();
  
  if (filters.type) {
    params.append('type', filters.type.toLowerCase());
  }
  if (filters.city) {
    params.append('city', filters.city);
  }
  if (filters.state) {
    params.append('state', filters.state);
  }

  const response = await apiFetch(`/api/service-providers/search?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }

  const data = await response.json();

  if (data.total === 0) {
    return mockProviders;
  }

  return data.providers.map((provider: any) => ({
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
