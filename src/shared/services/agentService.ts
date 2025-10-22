import { apiRequest, getCurrentUserId } from '../api/restClient';

const BASE_URL = '/api/v1';

const buildNoCacheHeaders = (userId: string): Record<string, string> => ({
  'X-User-ID': userId,
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
});

export type AgentGender = 'male' | 'female';

export interface AgentProfile {
  id?: string;
  agent_id?: string;
  name?: string;
  age?: string;
  gender?: AgentGender;
  voice?: string;
  knowledge?: string;
  background?: string;
  [key: string]: unknown;
}

export interface PublishAgentPayload {
  age: string;
  gender: string;
  knowledge: string;
  background: string;
  voice: string;
}

export interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response?: {
    content: string;
    [key: string]: unknown;
  };
  conversation_context?: ConversationEntry[];
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: unknown;
}

export interface ChatOptions {
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export const getAgentDetails = async (agentId: string, userId?: string): Promise<ApiResponse<AgentProfile>> => {
  const resolvedUserId = userId ?? getCurrentUserId();
  return apiRequest<ApiResponse<AgentProfile>>(`${BASE_URL}/agents/${agentId}`, {
    method: 'GET',
    headers: buildNoCacheHeaders(resolvedUserId),
    cache: 'no-store',
  });
};

export const getUserAgents = async (userId?: string): Promise<ApiResponse<AgentProfile[]>> => {
  const resolvedUserId = userId ?? getCurrentUserId();
  return apiRequest<ApiResponse<AgentProfile[]>>(`${BASE_URL}/users/${resolvedUserId}/agents`, {
    method: 'GET',
    headers: buildNoCacheHeaders(resolvedUserId),
    cache: 'no-store',
  });
};

export const publishAgent = async (
  agentData: PublishAgentPayload,
  userId?: string,
  agentId?: string,
): Promise<ApiResponse<AgentProfile>> => {
  const resolvedUserId = userId ?? getCurrentUserId();
  const url = agentId ? `${BASE_URL}/agents/${agentId}/publish` : `${BASE_URL}/agents/publish`;

  const requestBody = agentId
    ? {
        age: agentData.age,
        gender: agentData.gender,
        knowledge: agentData.knowledge,
        background: agentData.background,
        voice: agentData.voice,
        agent_id: agentId,
        user_id: resolvedUserId,
      }
    : {
        age: agentData.age,
        gender: agentData.gender,
        knowledge: agentData.knowledge,
        background: agentData.background,
        voice: agentData.voice,
        user_id: resolvedUserId,
      };

  return apiRequest<ApiResponse<AgentProfile>>(url, {
    method: 'POST',
    headers: {
      'X-User-ID': resolvedUserId,
    },
    body: JSON.stringify(requestBody),
  });
};

export const sendChatMessage = async (
  message: string,
  agentId: string,
  conversationContext: ConversationEntry[] = [],
  userId?: string,
  options: ChatOptions = {},
): Promise<ApiResponse<ChatResponse>> => {
  const resolvedUserId = userId ?? getCurrentUserId();
  const requestBody = {
    agent_id: agentId,
    message,
    conversation_context: conversationContext,
    stream: options.stream ?? false,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.max_tokens ?? 1500,
  };

  return apiRequest<ApiResponse<ChatResponse>>(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'X-User-ID': resolvedUserId,
    },
    body: JSON.stringify(requestBody),
  });
};

export const uploadFile = async (file: File, userId?: string): Promise<ApiResponse<unknown>> => {
  const resolvedUserId = userId ?? getCurrentUserId();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', resolvedUserId);

  return apiRequest<ApiResponse<unknown>>(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'X-User-ID': resolvedUserId,
    },
    body: formData,
  });
};

const agentService = {
  getAgentDetails,
  getUserAgents,
  publishAgent,
  sendChatMessage,
  uploadFile,
};

export default agentService;
