import tokenManager from '../auth/tokenManager';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? '';

export interface HttpRequestOptions extends RequestInit {
  auth?: boolean;
  retryOnAuthFailure?: boolean;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
}

export class HttpError<T = unknown> extends Error {
  public readonly status: number;

  public readonly data: T | null;

  constructor(message: string, status: number, data: T | null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let refreshTimerId: number | undefined;

const buildUrl = (input: string): string =>
  input.startsWith('http://') || input.startsWith('https://') ? input : `${API_BASE_URL}${input}`;

const parseResponse = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse response JSON, returning raw text.', error);
    return text as unknown as T;
  }
};

const buildHeaders = (headersInit: HeadersInit | undefined, auth: boolean): Headers => {
  const headers = new Headers();

  if (headersInit) {
    const inputHeaders = new Headers(headersInit);
    inputHeaders.forEach((value, key) => {
      if (!auth && key.toLowerCase() === 'authorization') {
        return;
      }
      headers.append(key, value);
    });
  }

  if (auth) {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  return headers;
};

const clearRefreshTimer = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (refreshTimerId) {
    window.clearTimeout(refreshTimerId);
    refreshTimerId = undefined;
  }
};

const scheduleRefreshTimer = (expiresInSeconds: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  clearRefreshTimer();

  if (!Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
    return;
  }

  const refreshDelayMs = Math.max((expiresInSeconds - 60) * 1000, 5000);
  refreshTimerId = window.setTimeout(() => {
    void refreshAccessToken();
  }, refreshDelayMs);
};

const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed with status ${response.status}`);
    }

    const data = (await parseResponse<RefreshTokenResponse>(response)) as RefreshTokenResponse | null;
    if (!data?.token || !data.refresh_token || !data.expires_in) {
      throw new Error('Refresh response missing required fields');
    }

    tokenManager.saveTokens({
      accessToken: data.token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    });
    scheduleRefreshTimer(data.expires_in);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Token refresh failed:', error);
    tokenManager.clearTokens();
    clearRefreshTimer();
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
    return false;
  }
};

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
  unauthorizedHandler = handler;
};

export const startTokenAutoRefresh = (expiresInSeconds: number): void => {
  scheduleRefreshTimer(expiresInSeconds);
};

export const stopTokenAutoRefresh = (): void => {
  clearRefreshTimer();
};

export const httpRequest = async <T = unknown>(input: string, options: HttpRequestOptions = {}): Promise<T> => {
  const { auth = true, retryOnAuthFailure = true, headers: headersInit, ...rest } = options;
  const url = buildUrl(input);
  const headers = buildHeaders(headersInit, auth);

  if (!(rest.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...rest,
    headers,
  });

  if (response.status === 401 && auth && retryOnAuthFailure) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return httpRequest<T>(input, {
        ...rest,
        auth,
        retryOnAuthFailure: false,
        headers: headersInit,
      });
    }
  }

  if (!response.ok) {
    const errorData = await parseResponse(response);
    throw new HttpError(`Request failed with status ${response.status}`, response.status, errorData);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await parseResponse<T>(response);
  return (data ?? ({} as T)) as T;
};

export const publicRequest = async <T = unknown>(input: string, options: RequestInit = {}): Promise<T> =>
  httpRequest<T>(input, {
    ...options,
    auth: false,
  });

export const authClient = {
  httpRequest,
  publicRequest,
  setUnauthorizedHandler,
  startTokenAutoRefresh,
  stopTokenAutoRefresh,
};

export default httpRequest;
