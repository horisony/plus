import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
const DefaultsTabs = () => {
  const [age, setAge] = useState('26-35');
  const [personality, setPersonality] = useState('开朗');

  return (
    <div className="ea-defaults-row">
      <div className="ea-default-tab">
        <div className="ea-default-label">默认年龄</div>
        <select value={age} onChange={(e) => setAge(e.target.value)} className="ea-default-select">
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46+">46+</option>
        </select>
      </div>
      <div className="ea-default-tab">
        <div className="ea-default-label">默认性格</div>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)} className="ea-default-select">
          <option>开朗</option>
          <option>温和</option>
          <option>专业</option>
          <option>幽默</option>
        </select>
      </div>
    </div>
  );
};

// 模型选择组件 （已移除）

// 知识库组件
const KnowledgeBase = () => {
  return (
    <Card title="📚 知识库">
      <div className="ea-upload-area">
        <div className="ea-upload-icon">📄</div>
        <div className="ea-upload-text">上传文档丰富分身知识</div>
        <button className="ea-upload-button">选择文件</button>
      </div>
    </Card>
  );
};

// 形象设置组件
const AppearanceSettings = () => {
  return (
    <Card title="🎨 默认形象">
      <div>
        <div className="ea-avatar-placeholder">
          <div className="ea-avatar-icon">👤</div>
          <div className="ea-avatar-text">点击上传背景图</div>
        </div>
      </div>
      {/* 上传背景图 按钮已移除，点击占位框上传 */}
    </Card>
  );
};

// 声音设置组件
const VoiceSettings = () => {
  const [selectedVoice, setSelectedVoice] = useState('帅气男声');

  return (
    <Card title="人物设定">
      <DefaultsTabs />
      <div>
        <select 
          value={selectedVoice} 
          onChange={(e) => setSelectedVoice(e.target.value)}
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
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="ea-container">
      <EditNavbar onBack={handleBack} />
      
      <div className="ea-content">
        {/* 中间栏 - 知识库、形象和声音设置 */}
        <div className="ea-middle-column">
          <KnowledgeBase />
          <AppearanceSettings />
          <VoiceSettings />
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