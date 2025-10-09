// 聊天相关的API服务
import { apiRequest } from './api';

class ChatApiService {
  constructor() {
    this.baseUrl = '/api/chat';
  }

  /**
   * 获取用户的对话列表
   * @param {string} userId - 用户ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 对话列表
   */
  async getConversations(userId, params = {}) {
    try {
      const queryParams = new URLSearchParams({ userId, ...params }).toString();
      const response = await apiRequest(`${this.baseUrl}/conversations?${queryParams}`, {
        method: 'GET'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取对话列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取单个对话详情
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 对话详情
   */
  async getConversation(conversationId) {
    try {
      const response = await apiRequest(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取对话详情失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 创建新对话
   * @param {Object} conversationData - 对话数据
   * @returns {Promise<Object>} 创建结果
   */
  async createConversation(conversationData) {
    try {
      const response = await apiRequest(`${this.baseUrl}/conversations`, {
        method: 'POST',
        body: JSON.stringify(conversationData)
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('创建对话失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取对话消息列表
   * @param {string} conversationId - 对话ID
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 消息列表
   */
  async getMessages(conversationId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}/conversations/${conversationId}/messages${queryParams ? '?' + queryParams : ''}`;
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取消息列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 发送消息
   * @param {string} conversationId - 对话ID
   * @param {Object} messageData - 消息数据
   * @returns {Promise<Object>} 发送结果
   */
  async sendMessage(conversationId, messageData) {
    try {
      const response = await apiRequest(`${this.baseUrl}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('发送消息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 标记消息为已读
   * @param {string} conversationId - 对话ID
   * @param {string} messageId - 消息ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 标记结果
   */
  async markAsRead(conversationId, messageId = null, userId) {
    try {
      const response = await apiRequest(`${this.baseUrl}/conversations/${conversationId}/read`, {
        method: 'POST',
        body: JSON.stringify({
          messageId,
          userId
        })
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('标记已读失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 上传聊天附件
   * @param {File} file - 文件对象
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 上传结果
   */
  async uploadAttachment(file, conversationId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      // 对于FormData，我们需要移除Content-Type头，让浏览器自动设置
      const response = await apiRequest(`${this.baseUrl}/attachments`, {
        method: 'POST',
        body: formData,
        headers: {
          // 移除Content-Type，让浏览器自动处理multipart/form-data
          'Content-Type': undefined
        }
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('上传附件失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 用户信息
   */
  async getUserInfo(userId) {
    try {
      const response = await apiRequest(`/api/users/${userId}`, {
        method: 'GET'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 搜索对话
   * @param {string} query - 搜索关键词
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 搜索结果
   */
  async searchConversations(query, userId) {
    try {
      const queryParams = new URLSearchParams({ query, userId }).toString();
      const response = await apiRequest(`${this.baseUrl}/search?${queryParams}`, {
        method: 'GET'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('搜索对话失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 删除对话
   * @param {string} conversationId - 对话ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteConversation(conversationId, userId) {
    try {
      const response = await apiRequest(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId })
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('删除对话失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 建立WebSocket连接用于实时消息
   * @param {string} conversationId - 对话ID
   * @param {string} userId - 用户ID
   * @param {Object} handlers - 事件处理器
   * @returns {WebSocket} WebSocket实例
   */
  connectWebSocket(conversationId, userId, handlers = {}) {
    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/ws/chat/${conversationId}?userId=${userId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = (event) => {
        console.log('WebSocket连接已建立');
        if (handlers.onOpen) handlers.onOpen(event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('收到WebSocket消息:', data);
          if (handlers.onMessage) handlers.onMessage(data);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket连接已关闭');
        if (handlers.onClose) handlers.onClose(event);
      };

      ws.onerror = (event) => {
        console.error('WebSocket连接错误:', event);
        if (handlers.onError) handlers.onError(event);
      };

      return ws;
    } catch (error) {
      console.error('建立WebSocket连接失败:', error);
      return null;
    }
  }
}

// 导出单例实例
export const chatApi = new ChatApiService();

// 聊天数据结构定义
export const ChatDataStructures = {
  // 对话结构
  Conversation: {
    conversationId: 'string', // 对话唯一ID
    projectId: 'string', // 关联项目ID（可选）
    projectName: 'string', // 项目名称（可选）
    participants: [
      {
        userId: 'string', // 用户ID
        userType: 'brand|mcn|mcn_talent', // 用户类型
        name: 'string', // 用户名称
        avatar: 'string', // 用户头像URL
        role: 'string', // 具体角色
        lastActiveAt: 'datetime' // 最后活跃时间
      }
    ],
    conversationType: 'project_discussion|negotiation|support|general', // 对话类型
    status: 'active|archived|closed', // 对话状态
    createdAt: 'datetime', // 创建时间
    updatedAt: 'datetime', // 更新时间
    lastMessageAt: 'datetime', // 最后消息时间
    unreadCount: 'number', // 未读消息数
    metadata: {} // 额外元数据
  },

  // 消息结构
  Message: {
    messageId: 'string', // 消息唯一ID
    conversationId: 'string', // 所属对话ID
    senderId: 'string', // 发送者ID
    content: {
      type: 'text|image|file|system|location', // 消息类型
      text: 'string', // 文本内容
      attachments: [
        {
          id: 'string',
          type: 'image|file|video|audio',
          url: 'string',
          name: 'string',
          size: 'number',
          mimeType: 'string'
        }
      ],
      metadata: {} // 额外内容数据
    },
    timestamp: 'datetime', // 消息时间
    readBy: ['string'], // 已读用户ID列表
    isSystemMessage: 'boolean', // 是否为系统消息
    replyTo: 'string', // 回复的消息ID（可选）
    editedAt: 'datetime', // 编辑时间（可选）
    deletedAt: 'datetime' // 删除时间（可选）
  },

  // 用户状态
  UserStatus: {
    userId: 'string',
    status: 'online|offline|busy|away',
    lastSeenAt: 'datetime',
    currentConversation: 'string' // 当前所在对话ID
  }
};

export default chatApi;