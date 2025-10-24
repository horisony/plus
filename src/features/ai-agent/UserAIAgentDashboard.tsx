import React, { useEffect, useRef, useState } from 'react';
import './UserAIAgentDashboard.css';
import { getUserAgents, sendChatMessage } from '../../shared/services/agentService';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

interface TaskListProps {
  userId: string;
}

interface AgentSummary {
  id: string;
  name?: string;
  age: string;
  gender: 'male' | 'female';
  voice: string;
  knowledge?: string;
  background?: string;
}

interface MyAgentsListProps {
  agents: AgentSummary[];
  selectedAgent: AgentSummary | null;
  onSelectAgent: (agent: AgentSummary) => void;
  userId: string;
}

interface AIChatProps {
  selectedAgent: AgentSummary | null;
  userId: string;
}

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatApiResponse {
  success: boolean;
  data?: {
    response: { content: string };
    conversation_context?: ConversationEntry[];
  };
  message?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => (
  <div className={`ud-card ${className ?? ''}`}>
    {title && <h3 className="ud-card-title">{title}</h3>}
    {children}
  </div>
);

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const mockTasks: Task[] = [
          { id: 'task-001', title: '识别并杜绝平台违规', status: 'pending', priority: 'high', dueDate: '2025-10-10' },
          { id: 'task-002', title: '本周发布30条短视频', status: 'in_progress', priority: 'medium', dueDate: '2025-10-12' },
          { id: 'task-003', title: '熟悉平台推荐机制TGBM', status: 'completed', priority: 'low', dueDate: '2025-10-08' },
        ];
        setTasks(mockTasks);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('加载任务列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadTasks();
  }, [userId]);

  const getStatusIcon = (status: Task['status']): string => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
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
            <div className="ud-task-status">{getStatusIcon(task.status)}</div>
            <div className="ud-task-content">
              <div className="ud-task-name">{task.title}</div>
              <div className="ud-task-meta">
                <span className="ud-task-priority" style={{ color: getPriorityColor(task.priority) }}>
                  {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
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

const MyAgentsList: React.FC<MyAgentsListProps> = ({ agents, onSelectAgent, selectedAgent, userId }) => (
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
            <button
              type="button"
              key={agent.id}
              className={`ud-agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
              onClick={() => onSelectAgent(agent)}
            >
              <div className="ud-agent-avatar">
                {agent.background ? (
                  <img src={agent.background} alt={agent.name ?? 'Agent'} />
                ) : (
                  <div className="ud-agent-placeholder">{agent.gender === 'female' ? '👩' : '👨'}</div>
                )}
              </div>
              <div className="ud-agent-info">
                <div className="ud-agent-name">{agent.name ?? `分身-${agent.id.slice(0, 8)}`}</div>
                <div className="ud-agent-meta">
                  {agent.age} • {agent.gender === 'male' ? '男性' : '女性'} • {agent.voice}
                </div>
                <div className="ud-agent-knowledge">
                  {agent.knowledge ? `${agent.knowledge.substring(0, 50)}...` : '暂无知识库'}
                </div>
              </div>
              <div className="ud-agent-actions">
                <button
                  type="button"
                  className="ud-edit-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    window.open(`/edit-avatar/${agent.id}`, '_blank');
                  }}
                >
                  ✏️
                </button>
              </div>
            </button>
          ))}

          <TaskList userId={userId} />
        </>
      )}
    </div>
  </Card>
);

const AIChat: React.FC<AIChatProps> = ({ selectedAgent, userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationEntry[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedAgent) {
      setMessages([
        {
          from: 'ai',
          text: `你好！我是你的AI分身助手${selectedAgent.name ? ` - ${selectedAgent.name}` : ''}。有什么可以帮助你的吗？`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setConversationContext([]);
    } else {
      setMessages([
        {
          from: 'ai',
          text: '你好！请先选择一个分身开始对话，或者创建一个新的分身。',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const callChatAPI = async (userMessage: string): Promise<string> => {
    if (!selectedAgent) {
      return '请先选择一个分身再开始对话。';
    }

    try {
      const result = (await sendChatMessage(
        userMessage,
        selectedAgent.id,
        conversationContext,
        userId || 'anonymous',
        {
          stream: false,
          temperature: 0.8,
          max_tokens: 1500,
        },
      )) as ChatApiResponse;

      if (result.success && result.data) {
        if (result.data.conversation_context) {
          setConversationContext(result.data.conversation_context);
        }
        return result.data.response.content;
      }

      return '抱歉，我现在无法回复，请稍后再试。';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('聊天请求失败:', error);
      return '网络连接出现问题，请检查连接后重试。';
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      from: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setIsLoading(true);

    setConversationContext((previous) => [
      ...previous,
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const aiResponse = await callChatAPI(message);
      const aiMessage: ChatMessage = {
        from: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((previous) => [...previous, aiMessage]);

      setConversationContext((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          from: 'ai',
          text: '抱歉，处理你的消息时出现了错误。',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="ud-chat-card">
      <div className="ud-chat-area">
        <div className="ud-chat-header">
          {selectedAgent ? (
            <div className="ud-chat-agent-info">
              <div className="ud-chat-agent-avatar">
                {selectedAgent.background ? (
                  <img src={selectedAgent.background} alt="Agent" />
                ) : (
                  <div className="ud-chat-agent-placeholder">{selectedAgent.gender === 'female' ? '👩' : '👨'}</div>
                )}
              </div>
              <div>
                <div className="ud-chat-agent-name">{selectedAgent.name ?? '我的分身'}</div>
                <div className="ud-chat-agent-status">{isLoading ? 'AI思考中...' : '在线'}</div>
              </div>
            </div>
          ) : (
            <div className="ud-chat-no-agent">请选择一个分身开始对话</div>
          )}
        </div>

        <div ref={chatContainerRef} className="ud-chat-container">
          {messages.map((message, index) => (
            <div key={`${message.from}-${index}`} className={message.from === 'ai' ? 'ud-message-bubble-bot' : 'ud-message-bubble-user'}>
              <div className="ud-message-content">{message.text}</div>
              {message.timestamp && <div className="ud-message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>}
            </div>
          ))}
          {isLoading && (
            <div className="ud-message-bubble-bot">
              <div className="ud-message-content ud-thinking">正在思考...</div>
            </div>
          )}
        </div>

        <div className="ud-chat-input">
          <div className="ud-input-panel">
            <textarea
              placeholder={isLoading ? 'AI正在回复中...' : selectedAgent ? '输入消息...' : '请先选择分身'}
              value={input}
              disabled={isLoading || !selectedAgent}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              className="ud-content-textarea"
            />
            <div className="ud-toolbar">
              <div className="ud-toolbar-left">
                <button type="button" className="ud-tool-button" aria-label="附件">
                  📎
                </button>
                <button type="button" className="ud-tool-button" aria-label="图片">
                  🖼️
                </button>
                <button type="button" className="ud-tool-button" aria-label="视频">
                  🎥
                </button>
              </div>
              <div className="ud-action-buttons">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !selectedAgent}
                  className="ud-content-send-button"
                  aria-label="发送"
                >
                  {isLoading ? <div className="ud-stop-icon" /> : '➤'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ud-chat-stats">
          当前对话: {messages.length} 条消息 | 分身: {selectedAgent ? selectedAgent.name ?? selectedAgent.id.slice(0, 8) : '未选择'}
        </div>
      </div>
    </Card>
  );
};

const UserAIAgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 'user-dashboard-123';

  useEffect(() => {
    const loadUserAgents = async () => {
      try {
        setLoading(true);
        const result = await getUserAgents(userId);

        if (result.success && Array.isArray(result.data)) {
          setAgents(result.data as AgentSummary[]);
          if (result.data.length > 0) {
            setSelectedAgent(result.data[0] as AgentSummary);
          }
          return;
        }

        const mockAgents: AgentSummary[] = [
          {
            id: 'agent-001',
            name: '小助手',
            age: '26-35',
            gender: 'female',
            voice: '温柔女声',
            knowledge: '我是一个专业的AI助手，擅长回答各种问题，包括工作、学习、生活等各个方面。我会用温柔耐心的语气为您解答疑问。',
            background: '',
          },
        ];

        setAgents(mockAgents);
        setSelectedAgent(mockAgents[0]);
      } catch (err) {
        setError('加载分身列表失败');
      } finally {
        setLoading(false);
      }
    };

    void loadUserAgents();
  }, [userId]);

  const handleSelectAgent = (agent: AgentSummary) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="ud-container">
      {error && <div className="ud-error-banner">{error}</div>}
      <div className="ud-content">
        <div className="ud-left-column">
          <MyAgentsList agents={agents} selectedAgent={selectedAgent} onSelectAgent={handleSelectAgent} userId={userId} />
        </div>
        <div className="ud-right-column">
          <AIChat selectedAgent={selectedAgent} userId={userId} />
        </div>
      </div>
      {loading && <div className="ud-loading-overlay">正在加载分身...</div>}
    </div>
  );
};

export default UserAIAgentDashboard;
