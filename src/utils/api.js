// API configuration and utilities
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// 获取当前用户ID的工具函数
export const getCurrentUserId = () => {
  // 优先从localStorage获取
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    return storedUserId;
  }
  
  // 如果没有存储的用户ID，可以从其他地方获取
  // 例如：从JWT token解析、从session storage等
  
  // 临时返回测试用的用户ID
  return 'test-user-123';
};

// 创建带有认证头的fetch请求
export const apiRequest = async (url, options = {}) => {
  const currentUserId = getCurrentUserId();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  console.log('发送API请求:', {
    url: fullUrl,
    method: config.method || 'GET',
    headers: config.headers,
    currentUserId
  });
  
  try {
    const response = await fetch(fullUrl, config);
    
    console.log('API响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// 获取agent数据的专用函数
export const fetchAgentData = async (agentId) => {
  console.log('fetchAgentData 被调用，agentId:', agentId);
  return apiRequest(`/api/v1/agents/${agentId}`, {
    method: 'GET',
  });
};

// 更新agent数据的专用函数
export const updateAgentData = async (agentId, data) => {
  return apiRequest(`/api/v1/agents/${agentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};