import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditAvatar.css';
import { getAgentDetails, publishAgent, sendChatMessage } from '../../shared/services/agentService';

interface AgentData {
  age: string;
  gender: string;
  knowledge: string;
  background: string;
  voice: string;
}

interface EditNavbarProps {
  onBack: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

interface CardProps {
  title: string;
  children?: React.ReactNode; // ✅ 改为可选
  className?: string;
}

interface KnowledgeBaseProps {
  agentData: AgentData;
  onKnowledgeChange: (value: string) => void;
}

interface AppearanceSettingsProps {
  agentData: AgentData;
  onBackgroundChange: (value: string) => void;
}

interface VoiceSettingsProps {
  agentData: AgentData;
  onVoiceChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
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

interface PreviewAndDebugProps {
  agentData: AgentData;
  userId?: string;
}

const EditNavbar: React.FC<EditNavbarProps> = ({ onBack, onPublish, isPublishing }) => (
  <div className="ea-navbar">
    <div className="ea-nav-left">
      <button type="button" onClick={onBack} className="ea-back-button">
        ← 返回
      </button>
      <h1 className="ea-nav-title">编辑分身</h1>
    </div>
    <button
      type="button"
      className="ea-publish-button"
      onClick={onPublish}
      disabled={isPublishing}
      style={{
        opacity: isPublishing ? 0.6 : 1,
        cursor: isPublishing ? 'not-allowed' : 'pointer',
      }}
    >
      {isPublishing ? '发布中...' : '发布分身'}
    </button>
  </div>
);

const Card: React.FC<CardProps> = ({ title, children, className }) => (
  <div className={`ea-card ${className ?? ''}`}>
    <h3 className="ea-card-title">{title}</h3>
    {children}
  </div>
);

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ agentData, onKnowledgeChange }) => {
  const [knowledge, setKnowledge] = useState(agentData.knowledge || '');

  useEffect(() => {
    setKnowledge(agentData.knowledge || '');
  }, [agentData.knowledge]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setKnowledge(value);
    onKnowledgeChange(value);
  };

  return (
    <Card title="📚 知识库">
      <div>
        {knowledge && (
          <div style={{ marginBottom: '16px' }}>
            <textarea
              value={knowledge}
              onChange={handleChange}
              placeholder="编辑知识库内容..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                resize: 'vertical',
              }}
            />
          </div>
        )}
        <div className="ea-upload-area">
          <div className="ea-upload-icon">📄</div>
          <div className="ea-upload-text">{knowledge ? '添加更多文档' : '上传文档丰富分身知识'}</div>
          <button type="button" className="ea-upload-button">
            选择文件
          </button>
        </div>
      </div>
    </Card>
  );
};

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ agentData, onBackgroundChange }) => {
  const [background, setBackground] = useState(agentData.background || '');

  useEffect(() => {
    setBackground(agentData.background || '');
  }, [agentData.background]);

  const handleBackgroundUpload = () => {
    // TODO: 替换为真实上传逻辑
    const placeholder = '/PLUSCO-LOGO.jpg';
    setBackground(placeholder);
    onBackgroundChange(placeholder);
  };

  return (
    <Card title="🎨 默认形象">
      <div>
        {background && (
          <div style={{ marginBottom: '12px' }}>
            <img
              src={background}
              alt="Background"
              style={{
                width: '100%',
                height: '84px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          </div>
        )}
        <button type="button" className="ea-avatar-placeholder" onClick={handleBackgroundUpload}>
          <div className="ea-avatar-icon">👤</div>
          <div className="ea-avatar-text">{background ? '点击更换背景图' : '点击上传背景图'}</div>
        </button>
      </div>
    </Card>
  );
};

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ agentData, onVoiceChange, onAgeChange, onGenderChange }) => {
  const [selectedVoice, setSelectedVoice] = useState(agentData.voice || '帅气男声');

  useEffect(() => {
    setSelectedVoice(agentData.voice || '帅气男声');
  }, [agentData.voice]);

  const handleVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedVoice(value);
    onVoiceChange(value);
  };

  return (
    <Card title="人物设定">
      <div>
        <div className="ea-defaults-row">
        <div className="ea-default-tab">
          <div className="ea-default-label">默认年龄</div>
          <select value={agentData.age || '26-35'} onChange={(event) => onAgeChange(event.target.value)} className="ea-default-select">
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>
        </div>
        <div className="ea-default-tab">
          <div className="ea-default-label">性别</div>
          <select value={agentData.gender || 'male'} onChange={(event) => onGenderChange(event.target.value)} className="ea-default-select">
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div className="ea-default-tab">
          <div className="ea-default-label">声音</div>
          <select value={selectedVoice} onChange={handleVoice} className="ea-default-select">
            <option>帅气男声</option>
            <option>温柔女声</option>
            <option>可爱童声</option>
            <option>成熟男声</option>
          </select>
        </div>
        </div>
      </div>
    </Card>
  );
};

const PreviewAndDebug: React.FC<PreviewAndDebugProps> = ({ userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationEntry[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([
      {
        from: 'ai',
        text: '你好呀，我是你的AI助手，现在你可以和我对话了！',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const callChatAPI = async (userMessage: string) => {
    try {
      const result = await sendChatMessage(
        userMessage,
        userId ?? 'test-agent-123',
        conversationContext,
        userId ?? 'test-user-123',
        {
          stream: false,
          temperature: 0.8,
          max_tokens: 1500,
        },
      );

      if (result.success && result.data) {
        if (result.data.conversation_context) {
          setConversationContext(result.data.conversation_context as ConversationEntry[]);
        }
        return result.data.response?.content ?? '好的，我已经收到你的消息。';
      }

      return '抱歉，我现在无法回复，请稍后再试。';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('聊天请求失败:', error);
      return '网络连接出现问题，请检查连接后重试。';
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      from: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setConversationContext((prev) => [
      ...prev,
      {
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const aiResponse = await callChatAPI(text);
      const aiMessage: ChatMessage = {
        from: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      setConversationContext((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
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
    <Card title="🤖 AI对话测试" className="ea-preview-card">
      <div className="ea-preview-area">
        <div className="ea-preview-header">
          实时对话预览
          {isLoading && (
            <span style={{ marginLeft: '10px', color: '#666', fontSize: '12px' }}>AI思考中...</span>
          )}
        </div>
        <div ref={chatContainerRef} className="ea-chat-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <div key={`${message.from}-${index}`} className={message.from === 'ai' ? 'ea-message-bubble-bot' : 'ea-message-bubble-user'}>
              <div className="ea-message-content">{message.text}</div>
              {message.timestamp && (
                <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="ea-message-bubble-bot">
              <div className="ea-message-content" style={{ fontStyle: 'italic', color: '#666' }}>
                正在思考...
              </div>
            </div>
          )}
        </div>
        <div className="ea-debug-input">
          <input
            type="text"
            placeholder={isLoading ? 'AI正在回复中...' : '输入消息和AI对话...'}
            className="ea-input"
            value={input}
            disabled={isLoading}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            className="ea-send-button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              opacity: isLoading || !input.trim() ? 0.5 : 1,
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
          使用 Agent ID: {userId ?? 'test-agent-123'} | 共 {messages.length} 条消息
        </div>
      </div>
    </Card>
  );
};

const EditAvatar: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();

  const [agentData, setAgentData] = useState<AgentData>({
    age: '26-35',
    gender: 'male',
    knowledge: '',
    background: '',
    voice: '帅气男声',
  });
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  const handleBack = () => navigate(-1);

  const loadAgentData = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const result = await getAgentDetails(userId ?? '', userId ?? '');
      if (result.success && result.data) {
        setAgentData((previous) => ({ ...previous, ...result.data }));
        if (result.data.agent_id || result.data.id) {
          setAgentId(result.data.agent_id ?? result.data.id ?? null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '拉取分身信息失败');
    }
  }, [userId]);

  useEffect(() => {
    void loadAgentData();
  }, [loadAgentData]);

  const handleDataChange = (field: keyof AgentData, value: string) => {
    setAgentData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePublish = async () => {
    if (isPublishing) {
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const result = await publishAgent(agentData, userId ?? '', agentId ?? undefined);
      if (result.success) {
        if (result.data?.agent_id) {
          setAgentId(result.data.agent_id);
        }
        window.alert('分身发布成功！');
      } else {
        const message = result.message ?? '发布失败，请重试';
        setError(message);
        window.alert(`发布失败：${message}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '网络错误，请检查连接后重试';
      setError(message);
      window.alert(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="ea-container">
      <EditNavbar onBack={handleBack} onPublish={handlePublish} isPublishing={isPublishing} />

      {error && (
        <div className="ea-error-banner">
          {error}
        </div>
      )}

      <div className="ea-content">
        <div className="ea-middle-column">
          <KnowledgeBase agentData={agentData} onKnowledgeChange={(value) => handleDataChange('knowledge', value)} />
          <AppearanceSettings agentData={agentData} onBackgroundChange={(value) => handleDataChange('background', value)} />
          <VoiceSettings
            agentData={agentData}
            onVoiceChange={(value) => handleDataChange('voice', value)}
            onAgeChange={(value) => handleDataChange('age', value)}
            onGenderChange={(value) => handleDataChange('gender', value)}
          />
        </div>

        <div className="ea-right-column">
          <PreviewAndDebug agentData={agentData} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default EditAvatar;
