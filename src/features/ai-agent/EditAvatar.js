import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAgentData, updateAgentData } from '../../utils/api';
import './EditAvatar.css';

// 顶部导航栏组件
const EditNavbar = ({ onBack }) => {
  return (
    <div className="ea-navbar">
      <div className="ea-nav-left">
        <button onClick={onBack} className="ea-back-button">← 返回</button>
        <h1 className="ea-nav-title">编辑分身</h1>
      </div>
      <button className="ea-publish-button">发布分身</button>
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
      <DefaultsTabs 
        agentData={agentData} 
        onAgeChange={onAgeChange}
        onGenderChange={onGenderChange}
      />
      <div>
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
    </Card>
  );
};

// 预览与调试组件
const PreviewAndDebug = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // initialize with a single AI greeting when component mounts
  useEffect(() => {
    setMessages([{ from: 'ai', text: '你好呀，我是你的AI经纪人' }]);
  }, []);

  const handleSend = () => {
    const txt = (input || '').trim();
    if (!txt) return;
    setMessages(prev => [...prev, { from: 'user', text: txt }]);
    setInput('');
  };

  return (
    <Card title="🔍 预设与调试" className="ea-preview-card">
      <div className="ea-preview-area">
        <div className="ea-preview-header">对话预览</div>
        <div className="ea-chat-container">
          {messages.map((m, idx) => (
            <div key={idx} className={m.from === 'ai' ? 'ea-message-bubble-bot' : 'ea-message-bubble-user'}>
              <div className="ea-message-content">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="ea-debug-input">
          <input
            type="text"
            placeholder="输入测试消息..."
            className="ea-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
          />
          <button className="ea-send-button" onClick={handleSend}>发送</button>
        </div>
      </div>
    </Card>
  );
};

// 主组件
const EditAvatar = () => {
  console.log('=== EditAvatar 组件开始渲染 ===');
  
  const navigate = useNavigate();
  const { userId } = useParams();
  
  console.log('从路由获取的 userId:', userId);
  console.log('当前页面 URL:', window.location.href);
  
  const [agentData, setAgentData] = useState({
    age: '26-35',
    gender: 'male',
    knowledge: '',
    background: '',
    voice: '帅气男声'
  });
  const [loading, setLoading] = useState(false);  // 默认不显示loading
  const [error, setError] = useState(null);

  const handleBack = () => navigate(-1);

  // 尝试加载后端数据，失败则使用默认值
  const loadAgentData = async () => {
    console.log('=== 直接访问后端API ===');
    console.log('userId:', userId);
    try {
      const apiUrl = `/api/v1/agents/${userId}`;
      console.log('请求URL:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId, // 使用路由参数中的userId作为当前用户ID
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      console.log('发送的请求头 X-User-ID:', userId);
      console.log('API响应状态:', response.status);
      console.log('API响应URL:', response.url);
      console.log('API响应headers:', Object.fromEntries(response.headers.entries()));
      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('API响应数据:', result);
        if (result.success && result.data) {
          setAgentData(prev => ({ ...prev, ...result.data }));
          console.log('成功更新agent数据:', result.data);
        } else {
          console.log('后端返回格式异常:', result);
        }
      } else {
        const text = await response.text();
        console.log('后端未返回JSON，原始内容:', text.substring(0, 200));
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

  // 页面始终渲染，不管是否成功加载后端数据

  return (
    <div className="ea-container">
      <EditNavbar onBack={handleBack} />
      

      
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
          <PreviewAndDebug />
        </div>
      </div>
    </div>
  );
};

// Styles have been migrated to EditAvatar.css

export default EditAvatar;
