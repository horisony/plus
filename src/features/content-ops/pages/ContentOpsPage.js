import React, { useRef, useState } from 'react';
import { designTokens } from '../constants/designTokens';
import LeftSidebar from '../components/LeftSidebar';
import ContentInputPanel from '../components/ContentInputPanel';
// import ContentRecommendations from '../components/ContentRecommendations';
// import InspirationSnippets from '../components/InspirationSnippets';
import copy from '../constants/copy.zh-CN.json';

const ContentOpsPage = ({ onNavigateToSnippets }) => {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 用于模拟流式生成
  const generatorTimerRef = useRef(null);
  const generatorIndexRef = useRef(0);
  const currentAiMessageIdRef = useRef(null);

  const MOCK_RESPONSE = 
    '这是为您生成的短视频文案示例：\n' +
    '标题：AR 眼镜，带你看见未来\n' +
    '开场：15 秒反转开头，引出痛点与场景\n' +
    '卖点：轻、清晰、长续航；三点结构递进\n' +
    '结尾：强召回+优惠口播+关注引导。';

  const startMockGenerator = () => {
    // 清理旧定时器
    if (generatorTimerRef.current) {
      clearInterval(generatorTimerRef.current);
    }
    generatorIndexRef.current = 0;
    setIsGenerating(true);
    setIsPaused(false);
    
    generatorTimerRef.current = setInterval(() => {
      if (isPaused) return;
      const nextIndex = generatorIndexRef.current + 1;
      const nextContent = MOCK_RESPONSE.slice(0, nextIndex);
      generatorIndexRef.current = nextIndex;
      const aiId = currentAiMessageIdRef.current;
      setMessages(prev => prev.map(m => (
        m.id === aiId ? { ...m, content: nextContent } : m
      )));
      if (nextIndex >= MOCK_RESPONSE.length) {
        clearInterval(generatorTimerRef.current);
        generatorTimerRef.current = null;
        setIsGenerating(false);
        // 滚动到最底部
        const el = document.getElementById('conversation-scroll');
        if (el) el.scrollTop = el.scrollHeight;
      }
    }, 40);
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: '好的，请稍等，正在为您生成短视频文案...',
      timestamp: new Date()
    };
    currentAiMessageIdRef.current = aiMessage.id;
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    startMockGenerator();
    // 发送后滚动到底部
    setTimeout(() => {
      const el = document.getElementById('conversation-scroll');
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  };

  const handleStopGeneration = () => {
    if (generatorTimerRef.current) {
      clearInterval(generatorTimerRef.current);
      generatorTimerRef.current = null;
    }
    setIsGenerating(false);
  };


  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    // 这里可以调用API上传文件
    console.log('上传文件:', files);
  };

  return (
    <div style={styles.container}>
      {/* 主内容区域 */}
      <div style={styles.contentWrapper}>
        {/* 左侧边栏 */}
        <LeftSidebar />
        
        {/* 主内容区域 */}
        <div style={{
          ...styles.mainContent,
          justifyContent: messages.length > 0 ? 'space-between' : 'flex-start'
        }}>
        {/* 对话区域：只有产生对话后才显示，避免首屏大空白 */}
        {messages.length > 0 && (
          <div id="conversation-scroll" style={styles.conversationArea}>
            {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageBubble,
                    ...(message.type === 'user' ? styles.userMessage : styles.aiMessage)
                  }}
                >
                  <div style={styles.messageContent}>
                    {message.content}
                  </div>
                  {message.type === 'ai' && isGenerating && (
                    <div style={styles.generatingIndicator}>
                      <div style={styles.typingDots}>
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                </div>
            ))}
          </div>
        )}
        
        {/* 输入面板 */}
        <div style={styles.inputSection}>
          <ContentInputPanel 
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            onStop={handleStopGeneration}
            hasMessages={messages.length > 0}
          />
        </div>
        
        {/* 底部四卡片推荐区域：只在没有消息时显示 */}
        {messages.length === 0 && (
          <div style={styles.recommendationsSection}>
            <div style={styles.cardsGrid4}>
            <div>
              <div style={styles.cardTitleOutside}>{copy.sections.fanFavorites}</div>
              <div style={styles.cardBox}>
              <div>
                {copy.fanFavorites.map((item, index) => (
                  <div
                    key={index}
                    style={styles.cardItem}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item);
                      e.target.style.opacity = '0.5';
                      e.target.style.transform = 'scale(0.95)';
                    }}
                    onDragEnd={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div>
              <div style={styles.cardTitleOutside}>{copy.sections.hotTopics}</div>
              <div style={styles.cardBox}>
              <div>
                {copy.hotTopics.map((item, index) => (
                  <div
                    key={index}
                    style={styles.cardItem}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item);
                      e.target.style.opacity = '0.5';
                      e.target.style.transform = 'scale(0.95)';
                    }}
                    onDragEnd={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div>
              <div style={styles.cardTitleOutside}>{copy.sections.trends}</div>
              <div style={styles.cardBox}>
              <div>
                {copy.trends.map((item, index) => (
                  <div
                    key={index}
                    style={styles.cardItem}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item);
                      e.target.style.opacity = '0.5';
                      e.target.style.transform = 'scale(0.95)';
                    }}
                    onDragEnd={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div>
              <div style={styles.cardTitleWithButton}>
                <span>{copy.sections.inspirationSnippets}</span>
                <button 
                  style={styles.addSnippetButton}
                  onClick={onNavigateToSnippets}
                >
                  添加碎片
                </button>
              </div>
              <div style={styles.cardBox}>
                <div>
                  {copy.inspirationSnippets.map((item, index) => (
                    <div
                      key={index}
                      style={styles.inspirationItem}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item);
                        e.target.style.opacity = '0.5';
                        e.target.style.transform = 'scale(0.95)';
                      }}
                      onDragEnd={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh', // 确保不超过视口高度
    backgroundColor: designTokens.colors.background,
    overflow: 'hidden', // 防止页面滚动
  },
  
  contentWrapper: {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 80px)', // 减去导航栏高度
    maxHeight: 'calc(100vh - 80px)', // 确保不超过计算高度
    overflow: 'hidden', // 防止内容溢出
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: `${designTokens.spacing['2xl']} ${designTokens.spacing['3xl']}`,
    gap: designTokens.spacing['2xl'],
    overflow: 'hidden', // 防止整个页面滚动
    height: '100%', // 限制高度
    maxHeight: '100%', // 确保不超过父容器高度
  },
  
  conversationArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.lg,
    flex: 1, // 占据剩余空间
    overflowY: 'auto',
    paddingRight: designTokens.spacing.md,
    minHeight: 0, // 允许flex子项收缩
    maxHeight: '100%', // 限制最大高度
  },

  emptyState: {
    alignSelf: 'center',
    marginTop: '8vh',
    padding: `${designTokens.spacing.md} ${designTokens.spacing['2xl']}`,
    backgroundColor: designTokens.colors.gray[100],
    color: designTokens.colors.gray[600],
    borderRadius: designTokens.borderRadius.lg,
    boxShadow: designTokens.shadows.sm,
    fontSize: designTokens.typography.fontSize.xl,
    lineHeight: '1.6',
  },
  
  messageBubble: {
    maxWidth: '70%',
    padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
    borderRadius: designTokens.borderRadius.xl,
    boxShadow: designTokens.shadows.sm,
  },
  
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: designTokens.colors.accent.yellow,
  },
  
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: designTokens.colors.white,
    border: `1px solid ${designTokens.colors.gray[200]}`,
  },
  
  messageContent: {
    fontSize: designTokens.typography.fontSize.base,
    lineHeight: '1.5',
    color: designTokens.colors.gray[900],
  },
  
  generatingIndicator: {
    marginTop: designTokens.spacing.sm,
  },
  
  typingDots: {
    display: 'flex',
    gap: designTokens.spacing.xs,
  },
  
  'typingDots span': {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: designTokens.colors.gray[400],
    animation: 'typing 1.4s infinite ease-in-out',
  },
  
  inputSection: {
    flexShrink: 0,
    position: 'sticky',
    bottom: '56px', // 固定约1.5cm的底部空隙
    backgroundColor: designTokens.colors.background,
    paddingTop: designTokens.spacing['3xl'],
    paddingBottom: designTokens.spacing['md'], // 外部已有固定空隙，适当减小内部padding
    maxHeight: '50vh', // 限制输入区域最大高度
    overflow: 'hidden', // 防止输入区域撑破容器
  },
  
  recommendationsSection: {
    flexShrink: 0, // 防止被挤压
    display: 'flex',
    flexDirection: 'column',
  },
  
  cardsGrid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: designTokens.spacing['3xl'],
  },
  cardBox: {
    backgroundColor: designTokens.colors.white,
    borderRadius: '16px',
    boxShadow: designTokens.shadows.lg,
    padding: designTokens.spacing.lg,
    minHeight: 360, // 更长的长方形，符合设计稿
  },
  cardTitleOutside: {
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[800],
    marginBottom: designTokens.spacing.lg, // 标题与卡片间距更大
    paddingLeft: designTokens.spacing.xs,
  },
  cardTitle: {
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[900],
    marginBottom: designTokens.spacing.md,
  },
  cardItem: {
    padding: `${designTokens.spacing.md} 0`,
    color: designTokens.colors.gray[700],
    fontSize: designTokens.typography.fontSize.base, // 增大字体
    cursor: 'grab',
    marginBottom: designTokens.spacing.md, // 增大间距
    borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    paddingLeft: designTokens.spacing.xs,
    paddingRight: designTokens.spacing.xs,
    lineHeight: '1.6', // 增加行高
  },
  
  'cardItem:hover': {
    backgroundColor: designTokens.colors.primaryLight,
    color: designTokens.colors.primary,
    transform: 'translateY(-1px)',
  },
  
  'cardItem:active': {
    cursor: 'grabbing',
    transform: 'scale(0.98)',
  },
  
  recommendationsLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  recommendationsRight: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  cardTitleWithButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
    paddingLeft: designTokens.spacing.xs,
  },
  
  addSnippetButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.fontSize.sm,
    cursor: 'pointer',
    padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },
  
  inspirationItem: {
    padding: `${designTokens.spacing.md} 0`,
    color: designTokens.colors.gray[700],
    fontSize: designTokens.typography.fontSize.sm,
    cursor: 'grab',
    marginBottom: designTokens.spacing.lg, // 灵感碎片间距更大
    borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    paddingLeft: designTokens.spacing.xs,
    paddingRight: designTokens.spacing.xs,
    lineHeight: '1.6',
  },
  
  addSnippetPanel: {
    marginTop: designTokens.spacing.md,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.gray[50],
    borderRadius: '8px',
    border: `1px solid ${designTokens.colors.gray[200]}`,
    animation: 'slideDown 0.3s ease-out',
  },
  
  snippetTextarea: {
    width: '100%',
    minHeight: '80px',
    padding: designTokens.spacing.sm,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: '6px',
    fontSize: designTokens.typography.fontSize.sm,
    fontFamily: designTokens.typography.fontFamily,
    resize: 'vertical',
    outline: 'none',
    marginBottom: designTokens.spacing.md,
  },
  
  uploadSection: {
    marginBottom: designTokens.spacing.md,
  },
  
  uploadButton: {
    display: 'inline-block',
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    backgroundColor: designTokens.colors.gray[100],
    color: designTokens.colors.gray[700],
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: designTokens.typography.fontSize.sm,
    transition: 'all 0.2s ease',
  },
  
  uploadedFiles: {
    marginTop: designTokens.spacing.sm,
  },
  
  uploadedFile: {
    padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
    backgroundColor: designTokens.colors.white,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: '4px',
    fontSize: designTokens.typography.fontSize.xs,
    marginBottom: designTokens.spacing.xs,
  },
  
  snippetActions: {
    display: 'flex',
    gap: designTokens.spacing.sm,
    justifyContent: 'flex-end',
  },
  
  cancelButton: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    backgroundColor: 'transparent',
    color: designTokens.colors.gray[600],
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: designTokens.typography.fontSize.sm,
  },
  
  saveButton: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    backgroundColor: designTokens.colors.primary,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: designTokens.typography.fontSize.sm,
  },
};

// 添加悬停效果
Object.assign(styles, {
  cardItem: {
    ...styles.cardItem,
    ':hover': {
      backgroundColor: designTokens.colors.primaryLight,
      color: designTokens.colors.primary,
      transform: 'translateY(-1px)',
    }
  },
  inspirationItem: {
    ...styles.inspirationItem,
    ':hover': {
      backgroundColor: designTokens.colors.primaryLight,
      color: designTokens.colors.primary,
      transform: 'translateY(-1px)',
    }
  },
  addSnippetButton: {
    ...styles.addSnippetButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
    }
  },
  uploadButton: {
    ...styles.uploadButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[200],
    }
  },
  cancelButton: {
    ...styles.cancelButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[50],
    }
  },
  saveButton: {
    ...styles.saveButton,
    ':hover': {
      backgroundColor: designTokens.colors.primaryDark,
    }
  },
});

export default ContentOpsPage;
