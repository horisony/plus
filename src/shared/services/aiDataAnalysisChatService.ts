import { apiRequest } from '../api/restClient';

const BASE_URL = '/api/chat';

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  has_more?: boolean;
}

export interface ChatSessionSummary {
  session_id: string;
  title: string;
  scenario?: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, unknown> | null;
  context_config?: Record<string, unknown> | null;
  message_count?: number;
}

export interface CreateSessionPayload {
  title: string;
  scenario?: string;
  context_config?: Record<string, unknown>;
}

export interface UpdateSessionPayload {
  title?: string;
  scenario?: string;
  status?: 'active' | 'archived' | 'deleted';
  context_config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ListSessionsParams {
  page?: number;
  size?: number;
  status?: string;
}

export interface ChatAttachment {
  type: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface SendMessagePayload {
  content: string;
  message_type?: 'text' | 'system' | 'ai_response' | 'user';
  attachments?: ChatAttachment[];
  options?: Record<string, unknown>;
}

export interface ChatMessage {
  message_id: string;
  session_id: string;
  content: string;
  message_type: 'user' | 'ai_response' | 'system';
  created_at: string;
  is_compressed?: boolean;
  importance_score?: number;
  metadata?: Record<string, unknown>;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  context_summary?: Record<string, unknown>;
  pagination?: Pagination;
}

const buildQueryString = (params: Record<string, string | number | boolean | undefined>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    searchParams.append(key, String(value));
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const createSession = async (payload: CreateSessionPayload): Promise<ApiResponse<ChatSessionSummary>> => {
  return apiRequest<ApiResponse<ChatSessionSummary>>(`${BASE_URL}/sessions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const listSessions = async (
  params: ListSessionsParams = {},
): Promise<ApiResponse<{ sessions: ChatSessionSummary[]; pagination?: Pagination }>> => {
  const query = buildQueryString({ page: params.page, size: params.size, status: params.status });
  return apiRequest<ApiResponse<{ sessions: ChatSessionSummary[]; pagination?: Pagination }>>(
    `${BASE_URL}/sessions${query}`,
    {
      method: 'GET',
    },
  );
};

export const updateSession = async (
  sessionId: string,
  payload: UpdateSessionPayload,
): Promise<ApiResponse<ChatSessionSummary>> =>
  apiRequest<ApiResponse<ChatSessionSummary>>(`${BASE_URL}/sessions/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteSession = async (sessionId: string): Promise<ApiResponse<{ session_id: string }>> => {
  return apiRequest<ApiResponse<{ session_id: string }>>(`${BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
  });
};

export const sendMessage = async (
  sessionId: string,
  payload: SendMessagePayload,
): Promise<ApiResponse<ChatMessage>> => {
  return apiRequest<ApiResponse<ChatMessage>>(`${BASE_URL}/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      message_type: 'text',
      ...payload,
    }),
  });
};

export const getMessages = async (
  sessionId: string,
  params: { page?: number; size?: number; context_optimized?: boolean } = {},
): Promise<ApiResponse<MessagesResponse>> => {
  const query = buildQueryString({
    page: params.page,
    size: params.size,
    context_optimized: params.context_optimized,
  });
  return apiRequest<ApiResponse<MessagesResponse>>(`${BASE_URL}/sessions/${sessionId}/messages${query}`, {
    method: 'GET',
  });
};

export const getSessionContext = async (
  sessionId: string,
): Promise<ApiResponse<Record<string, unknown>>> => {
  return apiRequest<ApiResponse<Record<string, unknown>>>(`${BASE_URL}/sessions/${sessionId}/context`, {
    method: 'GET',
  });
};

export const searchMessages = async (
  query: string,
  sessionId?: string,
  timeRange?: string,
): Promise<ApiResponse<Record<string, unknown>>> => {
  const queryString = buildQueryString({ query, session_id: sessionId, time_range: timeRange });
  return apiRequest<ApiResponse<Record<string, unknown>>>(`${BASE_URL}/search${queryString}`, {
    method: 'GET',
  });
};

const aiDataAnalysisChatService = {
  createSession,
  listSessions,
  updateSession,
  deleteSession,
  sendMessage,
  getMessages,
  getSessionContext,
  searchMessages,
};

export default aiDataAnalysisChatService;
