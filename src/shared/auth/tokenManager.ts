export type StoragePreference = 'local' | 'session';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch milliseconds
}

const TOKEN_STORAGE_KEY = 'plusco.auth.tokens';
const STORAGE_PREFERENCE_KEY = 'plusco.auth.storage';

const getStoragePreference = (): StoragePreference => {
  if (typeof window === 'undefined') {
    return 'local';
  }
  const stored = window.localStorage.getItem(STORAGE_PREFERENCE_KEY);
  return stored === 'session' ? 'session' : 'local';
};

const setStoragePreference = (preference: StoragePreference): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_PREFERENCE_KEY, preference);
};

const getStorageByPreference = (preference: StoragePreference): Storage =>
  preference === 'session' ? window.sessionStorage : window.localStorage;

const readTokensFromStorage = (storage: Storage): StoredTokens | null => {
  const raw = storage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as StoredTokens;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.expiresAt) {
      return null;
    }
    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse stored tokens:', error);
    return null;
  }
};

const persistTokens = (tokens: StoredTokens, preference: StoragePreference): void => {
  const targetStorage = getStorageByPreference(preference);
  targetStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));

  const oppositeStorage = getStorageByPreference(preference === 'local' ? 'session' : 'local');
  oppositeStorage.removeItem(TOKEN_STORAGE_KEY);
};

export interface SaveTokensParams {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  preference?: StoragePreference;
}

const saveTokens = ({ accessToken, refreshToken, expiresIn, preference }: SaveTokensParams): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const resolvedPreference = preference ?? getStoragePreference();
  const expiresAt = Date.now() + expiresIn * 1000;
  const payload: StoredTokens = {
    accessToken,
    refreshToken,
    expiresAt,
  };

  persistTokens(payload, resolvedPreference);
  setStoragePreference(resolvedPreference);
};

const clearTokens = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

const getStoredTokens = (): StoredTokens | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const preference = getStoragePreference();
  const primaryStorageTokens = readTokensFromStorage(getStorageByPreference(preference));
  if (primaryStorageTokens) {
    return primaryStorageTokens;
  }

  const fallbackStorage = getStorageByPreference(preference === 'local' ? 'session' : 'local');
  return readTokensFromStorage(fallbackStorage);
};

const getAccessToken = (): string | null => {
  const tokens = getStoredTokens();
  return tokens?.accessToken ?? null;
};

const getRefreshToken = (): string | null => {
  const tokens = getStoredTokens();
  return tokens?.refreshToken ?? null;
};

const getExpiresAt = (): number | null => {
  const tokens = getStoredTokens();
  return tokens?.expiresAt ?? null;
};

const isTokenExpired = (bufferSeconds = 0): boolean => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) {
    return true;
  }
  const bufferMs = bufferSeconds * 1000;
  return Date.now() >= expiresAt - bufferMs;
};

const tokenManager = {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getExpiresAt,
  isTokenExpired,
  getStoragePreference,
  setStoragePreference,
};

export default tokenManager;
