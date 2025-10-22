export type LoginType = 'mcn' | 'brand' | 'talent';

export interface AuthRole {
  roleId: string;
  name: string;
  modules: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  roles: AuthRole[];
  modules: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  preferredLoginType?: LoginType;
}

export interface LoginPayload {
  phone: string;
  smsCode: string;
  rememberMe: boolean;
  loginType: LoginType;
}
