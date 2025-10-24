import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Avatar, Typography, Space, message, List, Popconfirm, Spin } from 'antd';
import { 
  SendOutlined, 
  ArrowLeftOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeleteOutlined,
  MessageOutlined
} from '@ant-design/icons';
import useAuth from '../auth/hooks/useAuth';
import aiDataAnalysisChatService, {
  ChatMessage as ApiChatMessage,
  ChatSessionSummary as ApiChatSessionSummary,
  UpdateSessionPayload,
} from '../../shared/services/aiDataAnalysisChatService';
import './AIDataAnalysisChat.css';

const { TextArea } = Input;
const { Text, Title } = Typography;

const DEFAULT_CONTEXT_CONFIG = {
  max_tokens: 8000,
  compression_threshold: 200,
  retention_rules: ['summary', 'attribution', 'conclusion'],
};

type MessageSender = 'user' | 'ai' | 'system';

interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  metadata?: Record<string, unknown>;
  isPending?: boolean;
}

interface ChatSession {
  sessionId: string;
  title: string;
  status: 'active' | 'archived' | 'deleted';
  createdAt: string;
  scenario?: string;
  messageCount?: number;
}

interface LoadSessionsOptions {
  loadMessagesForSelection?: boolean;
}

const mapSender = (type: ApiChatMessage['message_type']): MessageSender => {
  if (type === 'ai_response') {
    return 'ai';
  }
  if (type === 'system') {
    return 'system';
  }
  return 'user';
};

const mapApiMessage = (apiMessage: ApiChatMessage): ChatMessage => ({
  id: apiMessage.message_id,
  content: apiMessage.content,
  sender: mapSender(apiMessage.message_type),
  timestamp: apiMessage.created_at,
  metadata: apiMessage.metadata,
});

const mapApiSession = (session: ApiChatSessionSummary): ChatSession => ({
  sessionId: session.session_id,
  title: session.title,
  status: session.status,
  createdAt: session.created_at,
  scenario: session.scenario,
  messageCount: session.message_count,
});

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toLocaleString();
};

const AIDataAnalysisChat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [contextSummary, setContextSummary] = useState<Record<string, unknown> | null>(null);

  const userRoleLabel = useMemo(() => {
    if (!user?.roles?.length) {
      return '—';
    }
    return user.roles.map((role) => role.name).join('、');
  }, [user]);

  const keyPoints = useMemo(() => {
    if (!contextSummary) {
      return [];
    }
    const summary = contextSummary as { key_points?: unknown };
    if (!Array.isArray(summary.key_points)) {
      return [];
    }
    return summary.key_points.map((point) => String(point));
  }, [contextSummary]);

  const totalTokens = useMemo(() => {
    if (!contextSummary) {
      return null;
    }
    const summary = contextSummary as { total_tokens?: unknown };
    return typeof summary.total_tokens === 'number' ? summary.total_tokens : null;
  }, [contextSummary]);

  const compressedMessages = useMemo(() => {
    if (!contextSummary) {
      return null;
    }
    const summary = contextSummary as { compressed_messages?: unknown };
    return typeof summary.compressed_messages === 'number' ? summary.compressed_messages : null;
  }, [contextSummary]);

  const loadMessages = useCallback(async (sessionId: string) => {
    setIsMessagesLoading(true);
    try {
      const response = await aiDataAnalysisChatService.getMessages(sessionId, {
        page: 1,
        size: 50,
        context_optimized: true,
      });

      if (response.code !== 200) {
        throw new Error(response.message ?? '加载消息失败');
      }

      const apiData = response.data ?? { messages: [] };
      const mappedMessages = (apiData.messages ?? []).map(mapApiMessage);
      setMessages(mappedMessages);
      setContextSummary(apiData.context_summary ?? null);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '加载消息失败');
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const loadSessions = useCallback(
    async (preferredSessionId?: string, options: LoadSessionsOptions = {}): Promise<boolean> => {
      const { loadMessagesForSelection = true } = options;

      try {
        const response = await aiDataAnalysisChatService.listSessions({ page: 1, size: 20, status: 'active' });
        if (response.code !== 200) {
          throw new Error(response.message ?? '加载对话列表失败');
        }

        const apiSessions = response.data?.sessions ?? [];
        const mappedSessions = apiSessions.map(mapApiSession);
        setConversations(mappedSessions);

        if (mappedSessions.length === 0) {
          setChatSession(null);
          setCurrentSessionId(null);
          setMessages([]);
          setContextSummary(null);
          return false;
        }

        const selectedSession =
          mappedSessions.find((session) => session.sessionId === preferredSessionId) ?? mappedSessions[0];

        setChatSession(selectedSession);
        setCurrentSessionId(selectedSession.sessionId);

        if (loadMessagesForSelection) {
          await loadMessages(selectedSession.sessionId);
        }

        return true;
      } catch (error) {
        message.error(error instanceof Error ? error.message : '加载对话列表失败');
        return false;
      }
    },
    [loadMessages],
  );

  const handleCreateSession = useCallback(async () => {
    if (!user) {
      message.warning('请先登录后再创建新对话');
      return;
    }

    setIsSessionsLoading(true);
    try {
      const response = await aiDataAnalysisChatService.createSession({
        title: '新对话',
        scenario: 'data_analysis',
        context_config: DEFAULT_CONTEXT_CONFIG,
      });

      if (response.code !== 200 || !response.data) {
        throw new Error(response.message ?? '创建对话失败');
      }

      await loadSessions(response.data.session_id);
      message.success('已创建新对话');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '创建对话失败');
    } finally {
      setIsSessionsLoading(false);
    }
  }, [user, loadSessions]);

  const handleSelectConversation = (sessionId: string) => {
    if (sessionId === currentSessionId) {
      return;
    }

    const selected = conversations.find((session) => session.sessionId === sessionId);
    if (selected) {
      setChatSession(selected);
      setCurrentSessionId(sessionId);
      setContextSummary(null);
      void loadMessages(sessionId);
    } else {
      void loadSessions(sessionId);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setIsSessionsLoading(true);
    try {
      const response = await aiDataAnalysisChatService.deleteSession(conversationId);
      if (response.code !== 200) {
        throw new Error(response.message ?? '删除对话失败');
      }

      const preferred = currentSessionId === conversationId ? undefined : currentSessionId ?? undefined;
      await loadSessions(preferred);
      message.success('对话已删除');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除对话失败');
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    if (!chatSession) {
      message.warning('会话初始化中，请稍后重试');
      return;
    }

    const sessionId = chatSession.sessionId;
    const optimisticId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      content: trimmed,
      sender: 'user',
      timestamp: now,
      isPending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputValue('');
    setIsSending(true);

    const shouldRename = chatSession.title === '新对话';

    try {
      const response = await aiDataAnalysisChatService.sendMessage(sessionId, {
        content: trimmed,
        message_type: 'text',
        options: {
          enable_search: true,
          enable_code_generation: true,
          priority: 'normal',
        },
      });

      if (response.code !== 200 || !response.data) {
        throw new Error(response.message ?? '发送消息失败');
      }

      await loadMessages(sessionId);
      void loadSessions(sessionId, { loadMessagesForSelection: false });

      if (shouldRename) {
        const newTitle = trimmed.length > 20 ? `${trimmed.slice(0, 20)}...` : trimmed;

        setChatSession((prev) => (prev ? { ...prev, title: newTitle } : prev));
        setConversations((prev) =>
          prev.map((session) => (session.sessionId === sessionId ? { ...session, title: newTitle } : session)),
        );

        const payload: UpdateSessionPayload = { title: newTitle };
        void aiDataAnalysisChatService
          .updateSession(sessionId, payload)
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn('更新会话标题失败:', error);
          });
      }
    } catch (error) {
      setMessages((prev) => prev.filter((messageEntry) => messageEntry.id !== optimisticId));
      message.error(error instanceof Error ? error.message : '发送消息失败');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setMessages([]);
      setChatSession(null);
      setCurrentSessionId(null);
      setContextSummary(null);
      return;
    }

    let cancelled = false;

    const initialize = async () => {
      setIsSessionsLoading(true);
      const hasSessions = await loadSessions();
      if (!cancelled && !hasSessions) {
        await handleCreateSession();
      }
      if (!cancelled) {
        setIsSessionsLoading(false);
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [user, loadSessions, handleCreateSession]);

  const loadConversation = (conversationId: string) => {
    handleSelectConversation(conversationId);
  };

  const deleteConversation = (conversationId: string) => {
    void handleDeleteConversation(conversationId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="ai-chat-error">
        <Card>
          <Text>请先登录后再使用AI数据分析功能</Text>
          <Button 
            type="primary" 
            onClick={() => navigate('/login')}
            style={{ marginLeft: 16 }}
          >
            去登录
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="ai-data-analysis-chat">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-controls-left">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-toggle"
            />
            {sidebarCollapsed && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/data')}
                className="sidebar-back-button"
                title="返回数据分析"
              />
            )}
          </div>
          {!sidebarCollapsed && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => void handleCreateSession()}
              className="new-chat-button"
              size="small"
            >
              新对话
            </Button>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="conversations-list">
            <List
              size="small"
              dataSource={conversations}
              loading={isSessionsLoading}
              renderItem={(conversation) => (
                <List.Item
                  key={conversation.sessionId}
                  className={`conversation-item ${currentSessionId === conversation.sessionId ? 'active' : ''}`}
                  onClick={() => loadConversation(conversation.sessionId)}
                  actions={[
                    <Popconfirm
                      key="delete"
                      title="确定删除这个对话吗？"
                      onConfirm={() => deleteConversation(conversation.sessionId)}
                      onCancel={(e) => e?.stopPropagation()}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        className="delete-button"
                      />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<MessageOutlined />} size="small" />}
                    title={
                      <Text ellipsis className="conversation-title">
                        {conversation.title}
                      </Text>
                    }
                    description={
                      <Space size={8} direction="horizontal">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTimestamp(conversation.createdAt)}
                        </Text>
                        {typeof conversation.messageCount === 'number' && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            消息 {conversation.messageCount}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无对话历史' }}
            />
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`chat-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/data')}
              className="back-button"
            >
              返回数据分析
            </Button>
            <Title level={4} className="chat-title">
              {chatSession?.title ?? 'AI数据分析助手'}
            </Title>
          </div>
          <div className="user-info">
            <Text type="secondary">当前用户：{user.name}</Text>
            <Text type="secondary" style={{ marginLeft: 16 }}>
              角色：{userRoleLabel}
            </Text>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {isMessagesLoading ? (
            <div className="messages-loading">
              <Spin tip="加载消息中..." />
            </div>
          ) : (
            messages.map((messageEntry) => (
              <div
                key={messageEntry.id}
                className={`message-wrapper ${messageEntry.sender}`}
              >
                <Card
                  size="small"
                  className={`message-card ${messageEntry.sender} ${messageEntry.isPending ? 'pending' : ''}`}
                >
                  <Space direction="vertical" size={4}>
                    <Text>{messageEntry.content}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {messageEntry.isPending ? '发送中…' : formatTimestamp(messageEntry.timestamp)}
                    </Text>
                  </Space>
                </Card>
              </div>
            ))
          )}

          {isSending && (
            <div className="message-wrapper ai">
              <Card size="small" className="message-card ai loading">
                <Text>AI正在思考中...</Text>
              </Card>
            </div>
          )}
        </div>

        {(keyPoints.length > 0 || totalTokens !== null || compressedMessages !== null) && (
          <Card size="small" className="context-summary-card">
            <Space direction="vertical" size={4}>
              <Text type="secondary">
                上下文摘要
                {totalTokens !== null ? ` · Tokens ${totalTokens}` : ''}
                {compressedMessages !== null ? ` · 压缩消息 ${compressedMessages}` : ''}
              </Text>
              {keyPoints.length > 0 && (
                <div className="context-summary-points">
                  {keyPoints.map((point) => (
                    <Text key={point} type="secondary" style={{ display: 'block' }}>
                      • {point}
                    </Text>
                  ))}
                </div>
              )}
            </Space>
          </Card>
        )}

        {/* Input Area */}
        <div className="input-area">
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题或数据分析需求..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isSending || !chatSession}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending || !chatSession}
              style={{ height: 'auto' }}
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* Debug Info (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card 
          size="small" 
          title="调试信息" 
          style={{ 
            position: 'fixed', 
            bottom: 120, 
            right: 20, 
            width: 300,
            fontSize: '12px',
            zIndex: 1000
          }}
        >
          <Text>Session ID: {chatSession?.sessionId ?? '—'}</Text><br/>
          <Text>Status: {chatSession?.status ?? '—'}</Text><br/>
          <Text>Scenario: {chatSession?.scenario ?? '—'}</Text><br/>
          <Text>Messages Loaded: {messages.length}</Text><br/>
          <Text>Context Keys: {contextSummary ? Object.keys(contextSummary).length : 0}</Text>
        </Card>
      )}
    </div>
  );
};

export default AIDataAnalysisChat;