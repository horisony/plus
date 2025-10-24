import httpRequest from './httpClient';

export const getCurrentUserId = (): string => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    return storedUserId;
  }
  return '550e8400-e29b-41d4-a716-446655440000';
};

export const apiRequest = async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
  const currentUserId = getCurrentUserId();

  const defaultHeaders: Record<string, string> = {
    'X-User-ID': currentUserId,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const headers = new Headers({
    ...defaultHeaders,
    ...(options.headers as Record<string, string> | undefined),
  });

  if (options.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  try {
    return await httpRequest<T>(url, {
      ...options,
      headers,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API request error:', error);
    throw error;
  }
};

export const fetchAgentData = async <T = unknown>(agentId: string): Promise<T> =>
  apiRequest<T>(`/api/v1/agents/${agentId}`, {
    method: 'GET',
  });

export const updateAgentData = async <T = unknown>(agentId: string, data: unknown): Promise<T> =>
  apiRequest<T>(`/api/v1/agents/${agentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
