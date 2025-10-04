import React, { useState } from 'react';

// 顶部导航栏组件
const EditNavbar = ({ onBack }) => {
  return (
    <div style={styles.navbar}>
      <div style={styles.navLeft}>
        <button onClick={onBack} style={styles.backButton}>
          ← 返回
        </button>
        <h1 style={styles.navTitle}>编辑分身</h1>
      </div>
      <button style={styles.publishButton}>
        发布分身
      </button>
    </div>
  );
};

// 卡片组件
const Card = ({ title, children, style }) => (
  <div style={{ ...styles.card, ...style }}>
    <h3 style={styles.cardTitle}>{title}</h3>
    {children}
  </div>
);

// 默认属性 tab（年龄、性格）
const DefaultsTabs = () => {
  const [age, setAge] = useState('26-35');
  const [personality, setPersonality] = useState('开朗');

  return (
    <div style={styles.defaultsRow}>
      <div style={styles.defaultTab}>
        <div style={styles.defaultLabel}>默认年龄</div>
        <select value={age} onChange={(e) => setAge(e.target.value)} style={styles.defaultSelect}>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46+">46+</option>
        </select>
      </div>
      <div style={styles.defaultTab}>
        <div style={styles.defaultLabel}>默认性格</div>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)} style={styles.defaultSelect}>
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
    <Card title="📚 知识库" style={styles.knowledgeCard}>
      <div style={styles.uploadArea}>
        <div style={styles.uploadIcon}>📄</div>
        <div style={styles.uploadText}>上传文档丰富分身知识</div>
        <button style={styles.uploadButton}>
          选择文件
        </button>
      </div>
    </Card>
  );
};

// 形象设置组件
const AppearanceSettings = () => {
  return (
    <Card title="🎨 默认形象" style={styles.appearanceCard}>
      <div style={styles.avatarUpload}>
        <div style={styles.avatarPlaceholder}>
          <div style={styles.avatarIcon}>👤</div>
          <div style={styles.avatarText}>点击上传背景图</div>
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
    <Card title="人物设定" style={styles.voiceCard}>
      <DefaultsTabs />
      <div style={styles.selectContainer}>
        <select 
          value={selectedVoice} 
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={styles.select}
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
  return (
    <Card title="🔍 预设与调试" style={styles.previewCard}>
      <div style={styles.previewArea}>
        <div style={styles.previewHeader}>对话预览</div>
        <div style={styles.chatContainer}>
          <div style={styles.messageBubbleBot}>
            <div style={styles.messageAvatar}>AI</div>
            <div style={styles.messageContent}>
              你好呀，我是你的经纪师刘经理
            </div>
          </div>
          <div style={styles.messageBubbleUser}>
            <div style={styles.messageContent}>
              你好呀，很高兴认识你
            </div>
            <div style={styles.messageAvatar}>你</div>
          </div>
          <div style={styles.messageBubbleBot}>
            <div style={styles.messageAvatar}>AI</div>
            <div style={styles.messageContent}>
              有什么我可以帮助你的吗？我很乐意为你提供专业的咨询服务
            </div>
          </div>
          <div style={styles.messageBubbleUser}>
            <div style={styles.messageContent}>
              我想了解一下如何提高直播的观看人数
            </div>
            <div style={styles.messageAvatar}>你</div>
          </div>
        </div>
        <div style={styles.debugInput}>
          <input 
            type="text" 
            placeholder="输入测试消息..." 
            style={styles.input}
          />
          <button style={styles.sendButton}>发送</button>
        </div>
      </div>
    </Card>
  );
};

// 主组件
const EditAvatar = () => {
  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div style={styles.container}>
      <EditNavbar onBack={handleBack} />
      
      <div style={styles.content}>
        {/* 中间栏 - 知识库、形象和声音设置 */}
        <div style={styles.middleColumn}>
          <KnowledgeBase />
          <AppearanceSettings />
          <VoiceSettings />
        </div>

        {/* 右侧栏 - 预设与调试 */}
        <div style={styles.rightColumn}>
          <PreviewAndDebug />
        </div>
      </div>
    </div>
  );
};

// 样式
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '12px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'relative',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  navTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  publishButton: {
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
    alignItems: 'stretch',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  middleColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'stretch',
    flex: '1 1 auto',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'stretch',
    flex: '1 1 auto',
  },
  card: {
    backgroundColor: '#fff',
    padding: '14px',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    margin: '0 0 8px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  // 模型选择卡片
  modelCard: {
    minHeight: '200px',
  },
  selectContainer: {
    marginBottom: '16px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  modelInfo: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '13px',
  },
  infoLabel: {
    color: '#666',
    fontWeight: '500',
  },
  // 知识库卡片
  knowledgeCard: {
    minHeight: '180px',
  },
  defaultsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'center',
    width: '100%',
  },
  defaultTab: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 0',
    },
    defaultTab: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      flex: '0 0 auto',
      alignItems: 'flex-start',
    },
  defaultLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '600',
  },
  defaultSelect: {
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    backgroundColor: '#fff',
    },
    defaultSelect: {
      padding: '6px 8px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '13px',
      backgroundColor: '#fff',
      width: '140px',
    },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  uploadText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  uploadButton: {
    padding: '8px 16px',
    border: '1px solid #1890ff',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#1890ff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '13px',
    transition: 'background-color 0.2s ease',
  },
  fileName: {
    fontWeight: '500',
  },
  fileSize: {
    color: '#999',
    fontSize: '12px',
  },
  // 形象设置卡片
  appearanceCard: {
    minHeight: '180px',
    },
    appearanceCard: {
      minHeight: '160px',
    },
  avatarUpload: {
    marginBottom: '16px',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100px',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    },
    avatarPlaceholder: {
      width: '100%',
      height: '84px',
      border: '2px dashed #ddd',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  avatarIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  avatarText: {
    fontSize: '13px',
    color: '#666',
  },
  // uploadImageButton removed
  // 声音设置卡片
  voiceCard: {
    minHeight: '150px',
    },
    voiceCard: {
      minHeight: '110px',
    },
  voicePreview: {
    marginTop: '8px',
  },
  defaultVoiceText: {
    color: '#1890ff',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'inline-block',
  },
  // 预览卡片
  previewCard: {
    height: 'fit-content',
    minHeight: '220px',
    },
    previewCard: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '220px',
      flex: '1 1 auto',
    },
  previewArea: {
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
  },
  previewHeader: {
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '1px solid #f0f0f0',
  },
  chatContainer: {
    padding: '12px',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: '1 1 auto',
    overflowY: 'auto',
  },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: 0,
    },
  messageBubbleBot: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  messageBubbleUser: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  messageContent: {
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.4',
    maxWidth: '70%',
  },
  debugInput: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
  },
  sendButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#1890ff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
};

// 添加悬停效果
Object.assign(styles, {
  backButton: {
    ...styles.backButton,
    ':hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#ccc',
    }
  },
  publishButton: {
    ...styles.publishButton,
    ':hover': {
      backgroundColor: '#d32f2f',
      transform: 'translateY(-1px)',
    }
  },
  uploadArea: {
    ...styles.uploadArea,
    ':hover': {
      borderColor: '#1890ff',
      backgroundColor: '#f8fbff',
    }
  },
  uploadButton: {
    ...styles.uploadButton,
    ':hover': {
      backgroundColor: '#1890ff',
      color: '#fff',
    }
  },
  fileItem: {
    ...styles.fileItem,
    ':hover': {
      backgroundColor: '#e9ecef',
    }
  },
  avatarPlaceholder: {
    ...styles.avatarPlaceholder,
    ':hover': {
      borderColor: '#1890ff',
      backgroundColor: '#f8fbff',
    }
  },
  
  sendButton: {
    ...styles.sendButton,
    ':hover': {
      backgroundColor: '#096dd9',
    }
  },
  messageBubbleBot: {
    ...styles.messageBubbleBot,
    '& $messageContent': {
      backgroundColor: '#e6f7ff',
      border: '1px solid #bae7ff',
    },
  },
  messageBubbleUser: {
    ...styles.messageBubbleUser,
    '& $messageContent': {
      backgroundColor: '#f6ffed',
      border: '1px solid #b7eb8f',
    },
  },
});

export default EditAvatar;