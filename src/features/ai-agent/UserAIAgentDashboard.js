import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAIAgentDashboard.css';
import { getAgentDetails, getUserAgents, sendChatMessage } from '../../utils/agentApi';



// 卡片组件
const Card = ({ title, children, className }) => (
  <div className={`ud-card ${className || ''}`}>
    {title && <h3 className="ud-card-title">{title}</h3>}
    {children}
  </div>
);

// 任务列表组件
const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载任务列表
  const loadTasks = async () => {
    try {
      setLoading(true);
      // TODO: 实现获取任务列表的API
      // const result = await getUserTasks(userId);
      
      // 模拟任务数据
      const mockTasks = [
        {
          id: 'task-001',
          title: '识别并杜绝平台违规',
          status: 'pending',
          priority: 'high',
          dueDate: '2025-10-10'
        },
        {
          id: 'task-002',
          title: '本周发布30条短视频',
          status: 'in_progress',
          priority: 'medium',
          dueDate: '2025-10-12'
        },
        {
          id: 'task-003',
          title: '熟悉平台推荐机制TGBM',
          status: 'completed',
          priority: 'low',
          dueDate: '2025-10-08'
        }
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      console.error('加载任务列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="ud-task-list">
      <div className="ud-task-header">
        <h4 className="ud-task-title">📋 我的任务</h4>
        {loading && <div className="ud-task-loading">加载中...</div>}
      </div>
      <div className="ud-task-items">
        {tasks.map((task) => (
          <div key={task.id} className="ud-task-item">
            <div className="ud-task-status">
              {getStatusIcon(task.status)}
            </div>
            <div className="ud-task-content">
              <div className="ud-task-name">{task.title}</div>
              <div className="ud-task-meta">
                <span 
                  className="ud-task-priority"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  {task.priority === 'high' ? '高优先级' : 
                   task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
                <span className="ud-task-date">截止: {task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 我的分身列表组件
const MyAgentsList = ({ agents, onSelectAgent, selectedAgent, userId }) => {
  return (
    <Card className="ud-agents-card">
      <div className="ud-agents-list">
        {agents.length === 0 ? (
          <div className="ud-empty-state">
            <div className="ud-empty-icon">🤖</div>
            <p className="ud-empty-text">还没有创建分身</p>
            <p className="ud-empty-desc">点击右上角创建你的第一个AI分身</p>
          </div>
        ) : (
          <>
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className={`ud-agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                onClick={() => onSelectAgent(agent)}
              >
                <div className="ud-agent-avatar">
                  {agent.background ? (
                    <img src={agent.background} alt={agent.name || 'Agent'} />
                  ) : (
                    <div className="ud-agent-placeholder">
                      {agent.gender === 'female' ? '👩' : '👨'}
                    </div>
                  )}
                </div>
                <div className="ud-agent-info">
                  <div className="ud-agent-name">{agent.name || `分身-${agent.id.slice(0, 8)}`}</div>
                  <div className="ud-agent-meta">
                    {agent.age} • {agent.gender === 'male' ? '男性' : '女性'} • {agent.voice}
                  </div>
                  <div className="ud-agent-knowledge">
                    {agent.knowledge ? agent.knowledge.substring(0, 50) + '...' : '暂无知识库'}
                  </div>
                </div>
                <div className="ud-agent-actions">
                  <button 
                    className="ud-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/edit-avatar/${agent.id}`, '_blank');
                    }}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
            
            {/* 任务列表子模块 */}
            <TaskList userId={userId} />
          </>
        )}
      </div>
    </Card>
  );
};

// AI对话组件
const AIChat = ({ selectedAgent, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const chatContainerRef = useRef(null);

  // 当选择不同分身时重置对话
  useEffect(() => {
    if (selectedAgent) {
      setMessages([{ 
        from: 'ai', 
        text: `你好！我是你的AI分身助手${selectedAgent.name ? ` - ${selectedAgent.name}` : ''}。有什么可以帮助你的吗？`,
        timestamp: new Date().toISOString()
      }]);
      setConversationContext([]);
    } else {
      setMessages([{ 
        from: 'ai', 
        text: '你好！请先选择一个分身开始对话，或者创建一个新的分身。',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [selectedAgent]);

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 调用聊天API
  const callChatAPI = async (userMessage) => {
    if (!selectedAgent) {
      return '请先选择一个分身再开始对话。';
    }

    try {
      const result = await sendChatMessage(
        userMessage, 
        selectedAgent.id, 
        conversationContext, 
        userId || 'anonymous',
        {
          stream: false,
          temperature: 0.8,
          max_tokens: 1500
        }
      );
      
      console.log('聊天API响应:', result);

      if (result.success && result.data) {
        // 更新对话上下文
        if (result.data.conversation_context) {
          setConversationContext(result.data.conversation_context);
        }
        
        return result.data.response.content;
      } else {
        console.error('聊天API错误:', result);
        return '抱歉，我现在无法回复，请稍后再试。';
      }
    } catch (error) {
      console.error('聊天请求失败:', error);
      return '网络连接出现问题，请检查连接后重试。';
    }
  };

  const handleSend = async () => {
    const txt = (input || '').trim();
    if (!txt || isLoading) return;
    
    // 添加用户消息
    const userMessage = {
      from: 'user', 
      text: txt,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 更新对话上下文
    setConversationContext(prev => [...prev, {
      role: 'user',
      content: txt,
      timestamp: new Date().toISOString()
    }]);

    try {
      // 调用API获取AI回复
      const aiResponse = await callChatAPI(txt);
      
      // 添加AI回复
      const aiMessage = {
        from: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // 更新对话上下文
      setConversationContext(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('处理AI回复时出错:', error);
      setMessages(prev => [...prev, {
        from: 'ai',
        text: '抱歉，处理你的消息时出现了错误。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="ud-chat-card"
    >
      <div className="ud-chat-area">
        <div className="ud-chat-header">
          {selectedAgent ? (
            <div className="ud-chat-agent-info">
              <div className="ud-chat-agent-avatar">
                {selectedAgent.background ? (
                  <img src={selectedAgent.background} alt="Agent" />
                ) : (
                  <div className="ud-chat-agent-placeholder">
                    {selectedAgent.gender === 'female' ? '👩' : '👨'}
                  </div>
                )}
              </div>
              <div>
                <div className="ud-chat-agent-name">{selectedAgent.name || '我的分身'}</div>
                <div className="ud-chat-agent-status">
                  {isLoading ? 'AI思考中...' : '在线'}
                </div>
              </div>
            </div>
          ) : (
            <div className="ud-chat-no-agent">请选择一个分身开始对话</div>
          )}
        </div>
        
        <div 
          ref={chatContainerRef}
          className="ud-chat-container"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={m.from === 'ai' ? 'ud-message-bubble-bot' : 'ud-message-bubble-user'}>
              <div className="ud-message-content">{m.text}</div>
              {m.timestamp && (
                <div className="ud-message-time">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="ud-message-bubble-bot">
              <div className="ud-message-content ud-thinking">
                正在思考...
              </div>
            </div>
          )}
        </div>
        
        <div className="ud-chat-input">
          <div className="ud-input-panel">
            <textarea
              placeholder={isLoading ? "AI正在回复中..." : selectedAgent ? "输入消息..." : "请先选择分身"}
              value={input}
              disabled={isLoading || !selectedAgent}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSend(); 
                } 
              }}
              className="ud-content-textarea"
            />
            <div className="ud-toolbar">
              <div className="ud-toolbar-left">
                <button className="ud-tool-button" aria-label="附件">📎</button>
                <button className="ud-tool-button" aria-label="图片">🖼️</button>
                <button className="ud-tool-button" aria-label="视频">🎥</button>
              </div>
              <div className="ud-action-buttons">
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !selectedAgent}
                  className="ud-content-send-button"
                  aria-label="发送"
                >
                  {isLoading ? <div className="ud-stop-icon"></div> : '➤'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ud-chat-stats">
          当前对话: {messages.length} 条消息 | 
          分身: {selectedAgent ? selectedAgent.name || selectedAgent.id.slice(0, 8) : '未选择'}
        </div>
      </div>
    </Card>
  );
};

// 主组件
const UserAIAgentDashboard = () => {  
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 'user-dashboard-123'; // 可以从路由或context获取

  // 加载用户的所有分身
  const loadUserAgents = async () => {
    try {
      setLoading(true);
      
      // 尝试从后端获取用户分身列表
      try {
        const result = await getUserAgents(userId);
        console.log('获取用户分身列表响应:', result);
        
        if (result.success && result.data && Array.isArray(result.data)) {
          setAgents(result.data);
          if (result.data.length > 0) {
            setSelectedAgent(result.data[0]);
          }
          return;
        }
      } catch (apiError) {
        console.log('API调用失败，使用模拟数据:', apiError.message);
      }
      
      // 如果API失败，使用模拟数据
      const mockAgents = [
        {
          id: 'agent-001',
          name: '小助手',
          age: '26-35',
          gender: 'female',
          voice: '温柔女声',
          knowledge: '我是一个专业的AI助手，擅长回答各种问题，包括工作、学习、生活等各个方面。我会用温柔耐心的语气为您解答疑问。',
          background: ''
        }
      ];
      
      setAgents(mockAgents);
      if (mockAgents.length > 0) {
        setSelectedAgent(mockAgents[0]);
      }
    } catch (err) {
      console.error('加载分身列表失败:', err);
      setError('加载分身列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadUserAgents();
  }, []);

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="ud-container">
      <div className="ud-content">
        {/* 左侧栏 - 分身列表 */}
        <div className="ud-left-column">
          <MyAgentsList 
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={handleSelectAgent}
            userId={userId}
          />
        </div>

        {/* 右侧栏 - AI对话 */}
        <div className="ud-right-column">
          <AIChat selectedAgent={selectedAgent} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UserAIAgentDashboard;