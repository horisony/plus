// Agent相关的API接口统一管理

const BASE_URL = '/api/v1';

/**
 * 统一的API请求封装
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
};

/**
 * 获取Agent详情
 * @param {string} agentId - Agent ID
 * @param {string} userId - 用户ID
 * @returns {Promise} - Agent详情数据
 */
export const getAgentDetails = async (agentId, userId) => {
  const url = `${BASE_URL}/agents/${agentId}`;
  console.log('获取Agent详情 URL:', url);
  
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'X-User-ID': userId,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    cache: 'no-store'
  });
};

/**
 * 获取用户的所有Agent
 * @param {string} userId - 用户ID
 * @returns {Promise} - 用户的所有Agent列表
 */
export const getUserAgents = async (userId) => {
  const url = `${BASE_URL}/users/${userId}/agents`;
  console.log('获取用户所有Agent URL:', url);
  
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'X-User-ID': userId,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    cache: 'no-store'
  });
};



/**
 * 统一的Agent发布接口（自动判断创建或更新）
 * @param {Object} agentData - Agent数据
 * @param {string} userId - 用户ID
 * @param {string|null} agentId - Agent ID（可选，有则更新，无则创建）
 * @returns {Promise} - 发布结果
 */
export const publishAgent = async (agentData, userId, agentId = null) => {
  let url, requestBody;
  
  if (agentId) {
    // 更新现有Agent
    url = `${BASE_URL}/agents/${agentId}/publish`;
    requestBody = {
      age: agentData.age,
      gender: agentData.gender,
      knowledge: agentData.knowledge,
      background: agentData.background,
      voice: agentData.voice,
      agent_id: agentId,
      user_id: userId
    };
    console.log('更新Agent URL:', url);
    console.log('更新Agent请求体:', requestBody);
  } else {
    // 创建新Agent
    url = `${BASE_URL}/agents/publish`;
    requestBody = {
      age: agentData.age,
      gender: agentData.gender,
      knowledge: agentData.knowledge,
      background: agentData.background,
      voice: agentData.voice,
      user_id: userId
    };
    console.log('创建新Agent URL:', url);
    console.log('创建新Agent请求体:', requestBody);
  }

  return apiRequest(url, {
    method: 'POST',
    headers: {
      'X-User-ID': userId || 'anonymous'
    },
    body: JSON.stringify(requestBody)
  });
};

/**
 * 聊天API
 * @param {string} message - 用户消息
 * @param {string} agentId - Agent ID
 * @param {Array} conversationContext - 对话上下文
 * @param {string} userId - 用户ID
 * @param {Object} options - 可选参数
 * @returns {Promise} - 聊天响应
 */
export const sendChatMessage = async (message, agentId, conversationContext = [], userId, options = {}) => {
  const url = `${BASE_URL}/chat`;
  console.log('聊天API URL:', url);
  
  const requestBody = {
    agent_id: agentId || "test-agent-123",
    message: message,
    conversation_context: conversationContext,
    stream: options.stream || false,
    temperature: options.temperature || 0.8,
    max_tokens: options.max_tokens || 1500
  };

  console.log('聊天请求体:', requestBody);
  
  return apiRequest(url, {
    method: 'POST',
    headers: {
      'X-User-ID': userId || 'test-user-123'
    },
    body: JSON.stringify(requestBody)
  });
};

/**
 * 上传文件API (预留)
 * @param {File} file - 要上传的文件
 * @param {string} userId - 用户ID
 * @returns {Promise} - 上传结果
 */
export const uploadFile = async (file, userId) => {
  const url = `${BASE_URL}/upload`;
  console.log('文件上传 URL:', url);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);

  return fetch(url, {
    method: 'POST',
    headers: {
      'X-User-ID': userId
    },
    body: formData
  }).then(response => response.json());
};

// 默认导出所有API函数
export default {
  getAgentDetails,
  getUserAgents,
  publishAgent,
  sendChatMessage,
  uploadFile
};