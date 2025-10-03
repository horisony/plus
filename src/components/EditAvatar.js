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
        🚀 发布分身
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

// 模型选择组件
const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState('DeepSeek R1');

  return (
    <Card title="🤖 模型选择" style={styles.modelCard}>
      <div style={styles.selectContainer}>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          style={styles.select}
        >
          <option>DeepSeek R1</option>
          <option>GPT-4</option>
          <option>Claude-3</option>
          <option>文心一言</option>
        </select>
      </div>
      <div style={styles.modelInfo}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>版本:</span>
          <span>最新版</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>上下文:</span>
          <span>128K tokens</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>特点:</span>
          <span>推理能力强，适合对话场景</span>
        </div>
      </div>
    </Card>
  );
};

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
      <div style={styles.fileList}>
        <div style={styles.fileItem}>
          <span style={styles.fileName}>产品手册.pdf</span>
          <span style={styles.fileSize}>2.3MB</span>
        </div>
        <div style={styles.fileItem}>
          <span style={styles.fileName}>常见问题.docx</span>
          <span style={styles.fileSize}>1.1MB</span>
        </div>
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
      <button style={styles.uploadImageButton}>
        上传背景图
      </button>
    </Card>
  );
};

// 声音设置组件
const VoiceSettings = () => {
  const [selectedVoice, setSelectedVoice] = useState('帅气男声');

  return (
    <Card title="🔊 默认声音" style={styles.voiceCard}>
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
      <div style={styles.voicePreview}>
        <button style={styles.previewButton}>
          ▶️ 试听声音
        </button>
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
        {/* 左侧栏 - 模型选择和知识库 */}
        <div style={styles.leftColumn}>
          <ModelSelection />
          <KnowledgeBase />
        </div>

        {/* 中间栏 - 形象和声音设置 */}
        <div style={styles.middleColumn}>
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
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '16px 24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  middleColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
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
    minHeight: '250px',
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
    padding: '8px 12px',
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
    minHeight: '250px',
  },
  avatarUpload: {
    marginBottom: '16px',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '120px',
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
  uploadImageButton: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  // 声音设置卡片
  voiceCard: {
    minHeight: '180px',
  },
  voicePreview: {
    marginTop: '12px',
  },
  previewButton: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  // 预览卡片
  previewCard: {
    height: 'fit-content',
  },
  previewArea: {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewHeader: {
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '1px solid #f0f0f0',
  },
  chatContainer: {
    padding: '16px',
    backgroundColor: '#fafafa',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    padding: '16px',
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
  uploadImageButton: {
    ...styles.uploadImageButton,
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  previewButton: {
    ...styles.previewButton,
    ':hover': {
      backgroundColor: '#f5f5f5',
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