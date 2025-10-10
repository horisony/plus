import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditAvatar.css';
import { getAgentDetails, publishAgent, sendChatMessage } from '../../utils/agentApi';

// 顶部导航栏组件
const EditNavbar = ({ onBack, onPublish, isPublishing }) => {
  return (
    <div className="ea-navbar">
      <div className="ea-nav-left">
        <button onClick={onBack} className="ea-back-button">← 返回</button>
        <h1 className="ea-nav-title">编辑分身</h1>
      </div>
      <button 
        className="ea-publish-button" 
        onClick={onPublish}
        disabled={isPublishing}
        style={{
          opacity: isPublishing ? 0.6 : 1,
          cursor: isPublishing ? 'not-allowed' : 'pointer'
        }}
      >
        {isPublishing ? '发布中...' : '发布分身'}
      </button>
    </div>
  );
};

// 卡片组件 - accepts optional className to allow specialized card variants
const Card = ({ title, children, className }) => (
  <div className={`ea-card ${className || ''}`}>
    <h3 className="ea-card-title">{title}</h3>
    {children}
  </div>
);

// 默认属性 tab（年龄、性格）
const DefaultsTabs = ({ agentData, onAgeChange, onGenderChange }) => {
  const [age, setAge] = useState(agentData?.age || '26-35');
  const [gender, setGender] = useState(agentData?.gender || 'male');

  useEffect(() => {
    setAge(agentData?.age || '26-35');
    setGender(agentData?.gender || 'male');
  }, [agentData?.age, agentData?.gender]);

  const handleAgeChange = (e) => {
    const newAge = e.target.value;
    setAge(newAge);
    if (onAgeChange) {
      onAgeChange(newAge);
    }
  };

  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    setGender(newGender);
    if (onGenderChange) {
      onGenderChange(newGender);
    }
  };

  return (
    <div className="ea-defaults-row">
      <div className="ea-default-tab">
        <div className="ea-default-label">默认年龄</div>
        <select value={age} onChange={handleAgeChange} className="ea-default-select">
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46+">46+</option>
        </select>
      </div>
      <div className="ea-default-tab">
        <div className="ea-default-label">性别</div>
        <select value={gender} onChange={handleGenderChange} className="ea-default-select">
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>
      </div>
    </div>
  );
};

// 模型选择组件 （已移除）

// 知识库组件
const KnowledgeBase = ({ agentData, onKnowledgeChange }) => {
  const [knowledge, setKnowledge] = useState(agentData?.knowledge || '');

  useEffect(() => {
    setKnowledge(agentData?.knowledge || '');
  }, [agentData?.knowledge]);

  const handleKnowledgeChange = (e) => {
    const newKnowledge = e.target.value;
    setKnowledge(newKnowledge);
    if (onKnowledgeChange) {
      onKnowledgeChange(newKnowledge);
    }
  };

  return (
    <Card title="📚 知识库">
      {knowledge ? (
        <div style={{ marginBottom: '16px' }}>
          <textarea
            value={knowledge}
            onChange={handleKnowledgeChange}
            placeholder="编辑知识库内容..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '13px',
              resize: 'vertical'
            }}
          />
        </div>
      ) : null}
      <div className="ea-upload-area">
        <div className="ea-upload-icon">📄</div>
        <div className="ea-upload-text">
          {knowledge ? '添加更多文档' : '上传文档丰富分身知识'}
        </div>
        <button className="ea-upload-button">选择文件</button>
      </div>
    </Card>
  );
};

// 形象设置组件
const AppearanceSettings = ({ agentData, onBackgroundChange }) => {
  const [background, setBackground] = useState(agentData?.background || '');

  useEffect(() => {
    setBackground(agentData?.background || '');
  }, [agentData?.background]);

  const handleBackgroundUpload = () => {
    // TODO: 实现文件上传逻辑
    console.log('Upload background image');
  };

  return (
    <Card title="🎨 默认形象">
      <div>
        {background ? (
          <div style={{ marginBottom: '12px' }}>
            <img 
              src={background} 
              alt="Background" 
              style={{
                width: '100%',
                height: '84px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        ) : null}
        <div className="ea-avatar-placeholder" onClick={handleBackgroundUpload}>
          <div className="ea-avatar-icon">👤</div>
          <div className="ea-avatar-text">
            {background ? '点击更换背景图' : '点击上传背景图'}
          </div>
        </div>
      </div>
      {/* 上传背景图 按钮已移除，点击占位框上传 */}
    </Card>
  );
};

// 声音设置组件
const VoiceSettings = ({ agentData, onVoiceChange, onAgeChange, onGenderChange }) => {
  const [selectedVoice, setSelectedVoice] = useState(agentData?.voice || '帅气男声');

  useEffect(() => {
    setSelectedVoice(agentData?.voice || '帅气男声');
  }, [agentData?.voice]);

  const handleVoiceChange = (e) => {
    const newVoice = e.target.value;
    setSelectedVoice(newVoice);
    if (onVoiceChange) {
      onVoiceChange(newVoice);
    }
  };

  return (
    <Card title="人物设定">
      <div className="ea-defaults-row">
        <div className="ea-default-tab">
          <div className="ea-default-label">默认年龄</div>
          <select value={agentData?.age || '26-35'} onChange={onAgeChange} className="ea-default-select">
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>
        </div>
        <div className="ea-default-tab">
          <div className="ea-default-label">性别</div>
          <select value={agentData?.gender || 'male'} onChange={onGenderChange} className="ea-default-select">
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div className="ea-default-tab">
          <div className="ea-default-label">声音</div>
          <select 
            value={selectedVoice} 
            onChange={handleVoiceChange}
            className="ea-default-select"
          >
            <option>帅气男声</option>
            <option>温柔女声</option>
            <option>可爱童声</option>
            <option>成熟男声</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

// 预览与调试组件
const PreviewAndDebug = ({ agentData, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const chatContainerRef = useRef(null);

  // initialize with a single AI greeting when component mounts
  useEffect(() => {
    setMessages([{ 
      from: 'ai', 
      text: '你好呀，我是你的AI助手，现在你可以和我对话了！',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 调用聊天API
  const callChatAPI = async (userMessage) => {
    try {
      const result = await sendChatMessage(
        userMessage, 
        userId || "test-agent-123", 
        conversationContext, 
        userId || 'test-user-123',
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
    <Card title="� AI对话测试" className="ea-preview-card">
      <div className="ea-preview-area">
        <div className="ea-preview-header">
          实时对话预览 
          {isLoading && <span style={{marginLeft: '10px', color: '#666', fontSize: '12px'}}>AI思考中...</span>}
        </div>
        <div 
          ref={chatContainerRef}
          className="ea-chat-container" 
          style={{maxHeight: '400px', overflowY: 'auto', scrollBehavior: 'smooth'}}
        >
          {messages.map((m, idx) => (
            <div key={idx} className={m.from === 'ai' ? 'ea-message-bubble-bot' : 'ea-message-bubble-user'}>
              <div className="ea-message-content">{m.text}</div>
              {m.timestamp && (
                <div style={{fontSize: '10px', color: '#999', marginTop: '4px'}}>
                  {new Date(m.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="ea-message-bubble-bot">
              <div className="ea-message-content" style={{fontStyle: 'italic', color: '#666'}}>
                正在思考...
              </div>
            </div>
          )}
        </div>
        <div className="ea-debug-input">
          <input
            type="text"
            placeholder={isLoading ? "AI正在回复中..." : "输入消息和AI对话..."}
            className="ea-input"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                handleSend(); 
              } 
            }}
          />
          <button 
            className="ea-send-button" 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              opacity: (isLoading || !input.trim()) ? 0.5 : 1,
              cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        <div style={{fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center'}}>
          使用 Agent ID: {userId || 'test-agent-123'} | 共 {messages.length} 条消息
        </div>
      </div>
    </Card>
  );
};

// 主组件
const EditAvatar = () => {  
  const navigate = useNavigate();
  const { userId } = useParams();
  
  console.log('从路由获取的 userId:', userId);  
  const [agentData, setAgentData] = useState({
    age: '26-35',
    gender: 'male',
    knowledge: '',
    background: '',
    voice: '帅气男声'
  });
  const [loading, setLoading] = useState(false);  // 默认不显示loading
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);  // 发布状态
  const [agentId, setAgentId] = useState(null);  // 存储agent_id

  const handleBack = () => navigate(-1);

  // 尝试加载后端数据，失败则使用默认值
  const loadAgentData = async () => {
    try {
      const result = await getAgentDetails(userId, userId);
      console.log('API响应数据:', result);
      
      if (result.success && result.data) {
        setAgentData(prev => ({ ...prev, ...result.data }));
        // 存储agent_id，用于后续的发布操作
        if (result.data.agent_id || result.data.id) {
          setAgentId(result.data.agent_id || result.data.id);
        }
        console.log('成功更新agent数据:', result.data);
      } else {
        console.log('后端返回格式异常:', result);
      }
    } catch (err) {
      console.log('API调用失败:', err.message);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    console.log('EditAvatar组件挂载，userId:', userId);
    if (userId) {
      console.log('userId存在，尝试加载后端数据（但不阻塞渲染）');
      loadAgentData();
    } else {
      console.log('userId不存在，使用默认数据');
    }
  }, [userId]);

  // 处理数据变更的回调函数
  const handleDataChange = (field, value) => {
    setAgentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 发布分身的功能
  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    setError(null);

    try {
      const result = await publishAgent(agentData, userId, agentId);
      console.log('发布分身 API 响应:', result);

      if (result.success) {
        // 发布成功
        if (result.data && result.data.agent_id) {
          setAgentId(result.data.agent_id);
        }
        alert('分身发布成功！');
        // 可以选择跳转到其他页面或刷新数据
        // navigate('/agents'); // 跳转到分身列表页
      } else {
        console.error('发布分身失败:', result);
        setError(result.message || '发布失败，请重试');
        alert('发布失败：' + (result.message || '请重试'));
      }
    } catch (err) {
      console.error('发布分身请求失败:', err);
      setError('网络错误，请检查连接后重试');
      alert('网络错误，请检查连接后重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // 页面始终渲染，不管是否成功加载后端数据

  return (
    <div className="ea-container">
      <EditNavbar 
        onBack={handleBack} 
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
      

      
      <div className="ea-content">
        {/* 中间栏 - 知识库、形象和声音设置 */}
        <div className="ea-middle-column">
          <KnowledgeBase 
            agentData={agentData}
            onKnowledgeChange={(value) => handleDataChange('knowledge', value)}
          />
          <AppearanceSettings 
            agentData={agentData}
            onBackgroundChange={(value) => handleDataChange('background', value)}
          />
          <VoiceSettings 
            agentData={agentData}
            onVoiceChange={(value) => handleDataChange('voice', value)}
            onAgeChange={(value) => handleDataChange('age', value)}
            onGenderChange={(value) => handleDataChange('gender', value)}
          />
        </div>

        {/* 右侧栏 - 预设与调试 */}
        <div className="ea-right-column">
          <PreviewAndDebug agentData={agentData} userId={userId} />
        </div>
      </div>
    </div>
  );
};

// Styles have been migrated to EditAvatar.css

export default EditAvatar;