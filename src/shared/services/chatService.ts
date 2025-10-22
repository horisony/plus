import { apiRequest } from '../api/restClient';

const DEFAULT_WS_URL = process.env.REACT_APP_WS_URL ?? 'ws://localhost:8000';

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ConversationParticipant {
  userId: string;
  userType: 'brand' | 'mcn' | 'mcn_talent';
  name: string;
  avatar?: string;
  role?: string;
  lastActiveAt?: string;
}

export interface ConversationSummary {
  conversationId: string;
  projectId?: string;
  projectName?: string;
  participants: ConversationParticipant[];
  conversationType: 'project_discussion' | 'negotiation' | 'support' | 'general';
  status: 'active' | 'archived' | 'closed';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  unreadCount?: number;
  metadata?: Record<string, unknown>;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface MessageContent {
  type: 'text' | 'image' | 'file' | 'system' | 'location';
  text?: string;
  attachments?: MessageAttachment[];
  metadata?: Record<string, unknown>;
}

export interface ConversationMessage {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: MessageContent;
  timestamp: string;
  readBy?: string[];
  isSystemMessage?: boolean;
  replyTo?: string;
  editedAt?: string;
  deletedAt?: string;
}

export interface UserStatusSnapshot {
  userId: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeenAt?: string;
  currentConversation?: string;
}

interface WebSocketHandlers {
  onOpen?: (event: Event) => void;
  onMessage?: (data: unknown) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export interface ConversationQuery {
  [key: string]: string | number | boolean | undefined;
}

export interface MessageQuery {
  [key: string]: string | number | boolean | undefined;
}

export interface CreateConversationPayload {
  [key: string]: unknown;
}

export interface SendMessagePayload {
  [key: string]: unknown;
}

export interface SearchConversationsResult<T = unknown> extends ApiResult<T> {}

class ChatApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/chat') {
    this.baseUrl = baseUrl;
  }

  async getConversations<T = ConversationSummary[]>(userId: string, params: ConversationQuery = {}): Promise<ApiResult<T>> {
    try {
      const queryParams = new URLSearchParams({ userId, ...this.normalizeParams(params) }).toString();
      const response = await apiRequest<T>(`${this.baseUrl}/conversations?${queryParams}`, {
        method: 'GET',
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('获取对话列表失败', error);
      return this.buildErrorResult(error);
    }
  }

  async getConversation<T = ConversationSummary>(conversationId: string): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET',
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('获取对话详情失败', error);
      return this.buildErrorResult(error);
    }
  }

  async createConversation<T = ConversationSummary>(conversationData: CreateConversationPayload): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`${this.baseUrl}/conversations`, {
        method: 'POST',
        body: JSON.stringify(conversationData),
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('创建对话失败', error);
      return this.buildErrorResult(error);
    }
  }

  async getMessages<T = ConversationMessage[]>(conversationId: string, params: MessageQuery = {}): Promise<ApiResult<T>> {
    try {
      const queryString = new URLSearchParams(this.normalizeParams(params)).toString();
      const url = `${this.baseUrl}/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ''}`;
      const response = await apiRequest<T>(url, { method: 'GET' });
      return { success: true, data: response };
    } catch (error) {
      this.logError('获取消息列表失败', error);
      return this.buildErrorResult(error);
    }
  }

  async sendMessage<T = ConversationMessage>(conversationId: string, messageData: SendMessagePayload): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('发送消息失败', error);
      return this.buildErrorResult(error);
    }
  }

  async markAsRead<T = { conversationId: string; messageId?: string | null; userId: string }>(
    conversationId: string,
    messageId: string | null = null,
    userId?: string,
  ): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`${this.baseUrl}/conversations/${conversationId}/read`, {
        method: 'POST',
        body: JSON.stringify({ messageId, userId }),
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('标记已读失败', error);
      return this.buildErrorResult(error);
    }
  }

  async uploadAttachment<T = unknown>(file: File, conversationId: string): Promise<ApiResult<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await apiRequest<T>(`${this.baseUrl}/attachments`, {
        method: 'POST',
        body: formData,
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('上传附件失败', error);
      return this.buildErrorResult(error);
    }
  }

  async getUserInfo<T = Record<string, unknown>>(userId: string): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`/api/users/${userId}`, { method: 'GET' });
      return { success: true, data: response };
    } catch (error) {
      this.logError('获取用户信息失败', error);
      return this.buildErrorResult(error);
    }
  }

  async searchConversations<T = ConversationSummary[]>(query: string, userId: string): Promise<SearchConversationsResult<T>> {
    try {
      const queryParams = new URLSearchParams({ query, userId }).toString();
      const response = await apiRequest<T>(`${this.baseUrl}/search?${queryParams}`, { method: 'GET' });
      return { success: true, data: response };
    } catch (error) {
      this.logError('搜索对话失败', error);
      return this.buildErrorResult(error);
    }
  }

  async deleteConversation<T = { conversationId: string }>(conversationId: string, userId: string): Promise<ApiResult<T>> {
    try {
      const response = await apiRequest<T>(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      });
      return { success: true, data: response };
    } catch (error) {
      this.logError('删除对话失败', error);
      return this.buildErrorResult(error);
    }
  }

  connectWebSocket(conversationId: string, userId: string, handlers: WebSocketHandlers = {}): WebSocket | null {
    try {
      const wsUrl = `${DEFAULT_WS_URL}/ws/chat/${conversationId}?userId=${encodeURIComponent(userId)}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = (event) => {
        // eslint-disable-next-line no-console
        console.log('WebSocket连接已建立');
        handlers.onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // eslint-disable-next-line no-console
          console.log('收到WebSocket消息:', data);
          handlers.onMessage?.(data);
        } catch (error) {
          this.logError('解析WebSocket消息失败', error);
        }
      };

      ws.onclose = (event) => {
        // eslint-disable-next-line no-console
        console.log('WebSocket连接已关闭');
        handlers.onClose?.(event);
      };

      ws.onerror = (event) => {
        this.logError('WebSocket连接错误', event);
        handlers.onError?.(event);
      };

      return ws;
    } catch (error) {
      this.logError('建立WebSocket连接失败', error);
      return null;
    }
  }

  private normalizeParams(params: ConversationQuery | MessageQuery): Record<string, string> {
    const entries = Object.entries(params).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (value === undefined || value === null) {
        return accumulator;
      }
      return { ...accumulator, [key]: String(value) };
    }, {});
    return entries;
  }

  private buildErrorResult(error: unknown): ApiResult<never> {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  private logError(message: string, error: unknown): void {
    // eslint-disable-next-line no-console
    console.error(`${message}:`, error);
  }
}

export const chatService = new ChatApiService();

export const ChatDataStructures = {
  Conversation: {
    conversationId: 'string',
    projectId: 'string',
    projectName: 'string',
    participants: [
      {
        userId: 'string',
        userType: 'brand|mcn|mcn_talent',
        name: 'string',
        avatar: 'string',
        role: 'string',
        lastActiveAt: 'datetime',
      },
    ],
    conversationType: 'project_discussion|negotiation|support|general',
    status: 'active|archived|closed',
    createdAt: 'datetime',
    updatedAt: 'datetime',
    lastMessageAt: 'datetime',
    unreadCount: 'number',
    metadata: {},
  },
  Message: {
    messageId: 'string',
    conversationId: 'string',
    senderId: 'string',
    content: {
      type: 'text|image|file|system|location',
      text: 'string',
      attachments: [
        {
          id: 'string',
          type: 'image|file|video|audio',
          url: 'string',
          name: 'string',
          size: 'number',
          mimeType: 'string',
        },
      ],
      metadata: {},
    },
    timestamp: 'datetime',
    readBy: ['string'],
    isSystemMessage: 'boolean',
    replyTo: 'string',
    editedAt: 'datetime',
    deletedAt: 'datetime',
  },
  UserStatus: {
    userId: 'string',
    status: 'online|offline|busy|away',
    lastSeenAt: 'datetime',
    currentConversation: 'string',
  },
} as const;

export default chatService;
