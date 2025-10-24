import httpRequest, { publicRequest } from '../api/httpClient';

export interface CaptchaParams {
  phone: string;
  type?: string;
}

export interface LoginRequestBody {
  phone: string;
  captcha: string;
  login_type: string;
}

export interface RoleInfo {
  role_id: string;
  name: string;
  modules: string[];
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    user_id: string;
    user_name: string;
    phone: string;
    roles: RoleInfo[];
    modules: string[];
  };
}


type LoginEnvelope = LoginResponse | Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickErrorMessage = (payload: Record<string, unknown>): string => {
  const messageKeys = ['message', 'msg', 'error', 'detail'] as const;
  for (const key of messageKeys) {
    const candidate = payload[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return '登录失败，请稍后重试';
};

const isLoginResponsePayload = (value: unknown): value is LoginResponse => {
  if (!isRecord(value)) {
    return false;
  }
  if (typeof value.token !== 'string' || typeof value.refresh_token !== 'string') {
    return false;
  }
  if (typeof value.expires_in !== 'number') {
    return false;
  }
  if (!isRecord(value.user)) {
    return false;
  }
  const user = value.user as Record<string, unknown>;
  if (typeof user.user_id !== 'string') {
    return false;
  }
  if (typeof user.user_name !== 'string') {
    return false;
  }
  if (typeof user.phone !== 'string') {
    return false;
  }
  return true;
};

const unwrapLoginResponse = (raw: LoginEnvelope): LoginResponse => {
  if (isLoginResponsePayload(raw)) {
    return raw;
  }

  if (!isRecord(raw)) {
    throw new Error('登录响应格式不符合预期');
  }

  if ('code' in raw) {
    const { code } = raw;
    if (typeof code !== 'number') {
      throw new Error('登录响应格式不符合预期');
    }
    if (code !== 200) {
      throw new Error(pickErrorMessage(raw));
    }
    if (!('data' in raw)) {
      throw new Error('登录响应缺少数据字段');
    }
    return unwrapLoginResponse(raw.data as LoginEnvelope);
  }

  if ('success' in raw && raw.success === false) {
    throw new Error(pickErrorMessage(raw));
  }

  const nestedKeys: Array<keyof typeof raw> = ['data', 'result', 'payload', 'response'];
  for (const key of nestedKeys) {
    if (key in raw) {
      const nested = raw[key];
      if (nested !== null && nested !== undefined) {
        return unwrapLoginResponse(nested as LoginEnvelope);
      }
    }
  }

  throw new Error('登录响应缺少必要字段');
};

export interface RefreshResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface VerifyResponse {
  valid: boolean;
  user_id: string;
  expires_at: string;
  issued_at: string;
  token_id: string;
  user_type: string;
  modules: string[];
  phone: string;
}

export interface PermissionsResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
    role_name: string;
  };
  available_modules: string[];
}

export const requestCaptcha = async ({ phone, type }: CaptchaParams): Promise<void> => {
  const query = new URLSearchParams({ phone });
  if (type) {
    query.append('type', type);
  }

  await publicRequest<void>(`/auth/captcha?${query.toString()}`, {
    method: 'GET',
  });
};

export const loginWithCaptcha = async (body: LoginRequestBody): Promise<LoginResponse> => {
  const rawResponse = await publicRequest<LoginEnvelope>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const normalized = unwrapLoginResponse(rawResponse);
  if (!normalized.user || !normalized.user.user_id) {
    throw new Error('登录响应缺少用户信息');
  }

  return normalized;
};

export const refreshToken = async (refreshTokenValue: string): Promise<RefreshResponse> =>
  publicRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  });

export const verifyToken = async (): Promise<VerifyResponse> =>
  httpRequest<VerifyResponse>('/auth/verify', {
    method: 'POST',
  });

export const logout = async (): Promise<void> => {
  await httpRequest<void>('/auth/logout', {
    method: 'POST',
  });
};

export const fetchPermissions = async (): Promise<PermissionsResponse> =>
  httpRequest<PermissionsResponse>('/me/permissions', {
    method: 'GET',
  });

const authService = {
  requestCaptcha,
  loginWithCaptcha,
  refreshToken,
  verifyToken,
  logout,
  fetchPermissions,
};

export default authService;
