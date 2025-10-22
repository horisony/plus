import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService, { LoginResponse } from '../../../shared/services/authService';
import tokenManager, { StoragePreference } from '../../../shared/auth/tokenManager';
import { authClient } from '../../../shared/api/httpClient';
import type { AuthState, AuthUser, LoginType } from '../types';

interface AuthContextValue extends AuthState {
  login: (params: {
    phone: string;
    smsCode: string;
    loginType: LoginType;
    rememberMe: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setPreferredLoginType: (loginType?: LoginType) => void;
  refreshUserProfile: () => Promise<void>;
}

const USER_STORAGE_KEY = 'plusco.auth.user';

const defaultAuthState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  preferredLoginType: undefined,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapLoginResponseToUser = (response: LoginResponse): AuthUser => {
  const user = response.user;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const modules = Array.isArray(user.modules) ? user.modules : [];

  return {
    id: user.user_id,
    name: user.user_name,
    phone: user.phone,
    roles: roles.map((role) => ({
      roleId: role.role_id,
      name: role.name,
      modules: Array.isArray(role.modules) ? role.modules : [],
    })),
    modules,
  };
};

const loadStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(USER_STORAGE_KEY) ?? window.sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse stored user info:', error);
    return null;
  }
};

const persistUser = (user: AuthUser, preference: StoragePreference): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (preference === 'local') {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.sessionStorage.removeItem(USER_STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
};

const clearStoredUser = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.sessionStorage.removeItem(USER_STORAGE_KEY);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  const setPreferredLoginType = useCallback((loginType?: LoginType) => {
    setState((prev) => ({ ...prev, preferredLoginType: loginType }));
  }, []);

  const forcedLogout = useCallback(
    async (notifyServer = true) => {
      if (notifyServer) {
        try {
          await authService.logout();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Logout request failed:', error);
        }
      }
      tokenManager.clearTokens();
      clearStoredUser();
      authClient.stopTokenAutoRefresh();
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        preferredLoginType: undefined,
      });
    },
    [],
  );

  const applyLoginResult = useCallback(
    (response: LoginResponse, rememberMe: boolean) => {
      const preference: StoragePreference = rememberMe ? 'local' : 'session';
      const user = mapLoginResponseToUser(response);
      tokenManager.saveTokens({
        accessToken: response.token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
        preference,
      });
      if (process.env.NODE_ENV !== 'production') {
        // 仅在非生产环境输出 Token 辅助调试
        // eslint-disable-next-line no-console
        console.info('[Auth] Access token updated:', response.token);
      }
      persistUser(user, preference);
      authClient.startTokenAutoRefresh(response.expires_in);
      setState((prev) => ({
        user,
        isAuthenticated: true,
        loading: false,
        preferredLoginType: prev.preferredLoginType,
      }));
    },
    [],
  );

  const initializeAuth = useCallback(async () => {
    const tokensExpired = tokenManager.isTokenExpired(30);
    const storedUser = loadStoredUser();

    if (!tokensExpired && storedUser) {
      const expiresAt = tokenManager.getExpiresAt();
      if (expiresAt) {
        const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);
        if (expiresIn > 0) {
          authClient.startTokenAutoRefresh(expiresIn);
        }
      }

      setState({
        user: storedUser,
        isAuthenticated: true,
        loading: false,
        preferredLoginType: undefined,
      });
      try {
        await authService.verifyToken();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Stored token verification failed:', error);
        await forcedLogout(false);
      }
      return;
    }

    await forcedLogout(false);
  }, [forcedLogout]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    authClient.setUnauthorizedHandler(() => {
      void forcedLogout(false);
    });
    return () => {
      authClient.setUnauthorizedHandler(null);
    };
  }, [forcedLogout]);

  const login = useCallback(
    async ({ phone, smsCode, loginType, rememberMe }: {
      phone: string;
      smsCode: string;
      loginType: LoginType;
      rememberMe: boolean;
    }) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const response = await authService.loginWithCaptcha({
          phone,
          captcha: smsCode,
          login_type: loginType,
        });
        applyLoginResult(response, rememberMe);
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [applyLoginResult],
  );

  const logout = useCallback(async () => {
    await forcedLogout();
  }, [forcedLogout]);

  const refreshUserProfile = useCallback(async () => {
    try {
      const permissions = await authService.fetchPermissions();
      const updatedUser: AuthUser = {
        id: permissions.user.id,
        name: permissions.user.name,
        phone: permissions.user.phone,
        roles: state.user?.roles ?? [],
        modules: permissions.available_modules ?? [],
      };
      const preference = tokenManager.getStoragePreference();
      persistUser(updatedUser, preference);
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to refresh user profile:', error);
    }
  }, [state.user]);

  const contextValue = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    logout,
    setPreferredLoginType,
    refreshUserProfile,
  }), [login, logout, state, setPreferredLoginType, refreshUserProfile]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
