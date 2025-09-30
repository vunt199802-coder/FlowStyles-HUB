const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export const BASE_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = response.statusText || 'Request failed';

    if (errorText) {
      try {
        const parsed = JSON.parse(errorText);
        message = parsed.error || parsed.message || errorText;
      } catch {
        message = errorText;
      }
    }

    const error = new Error(message);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response;
}
