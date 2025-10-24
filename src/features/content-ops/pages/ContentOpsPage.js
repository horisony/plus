import React, { useRef, useState } from 'react';
import { designTokens } from '../constants/designTokens';
import LeftSidebar from '../components/LeftSidebar';
import ContentInputPanel from '../components/ContentInputPanel';
import { FileIcon, ImageIcon, VideoIcon, PlusIcon, SendIcon } from '../../../assets/icons';
// import ContentRecommendations from '../components/ContentRecommendations';
// import InspirationSnippets from '../components/InspirationSnippets';
import copy from '../constants/copy.zh-CN.json';

const ContentOpsPage = ({ onNavigateToSnippets }) => {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [snippetPage, setSnippetPage] = useState(0);
  const [inputMessage, setInputMessage] = useState('');
  const [showPopover, setShowPopover] = useState(false);

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
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    
    const aiMessage = {
      id: Date.now() + 1,
      sender: 'ai',
      content: '好的，请稍等，正在为您生成短视频文案...',
      timestamp: new Date()
    };
    currentAiMessageIdRef.current = aiMessage.id;
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputMessage('');
    startMockGenerator();
    // 发送后滚动到底部
    setTimeout(() => {
      const el = document.getElementById('conversation-scroll');
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <div style={styles.chatArea}>
          {/* 消息显示区域 */}
          {messages.length > 0 && (
            <div style={styles.messagesContainer}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={message.sender === 'user' ? styles.userMessage : styles.aiMessage}
                >
                  {message.content}
                </div>
              ))}
            </div>
          )}

          {/* 输入面板 - 当有消息时移到底部 */}
          <div style={messages.length > 0 ? styles.inputContainerChat : styles.inputContainer}>
            {messages.length > 0 ? (
              <div style={styles.inputArea}>
                <div style={styles.inputIcons}>
                  <div style={styles.inputIcon} onClick={() => setShowPopover(!showPopover)}>
                    <PlusIcon />
                  </div>
                  {showPopover && (
                    <div style={styles.popover}>
                      <div style={styles.popoverItem}>
                        <FileIcon />
                        <span>文件</span>
                      </div>
                      <div style={styles.popoverItem}>
                        <ImageIcon />
                        <span>图片</span>
                      </div>
                      <div style={styles.popoverItem}>
                        <VideoIcon />
                        <span>视频</span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="发消息"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.messageInput}
                />
                <button style={styles.sendButton} onClick={handleSendMessage}>
                  <SendIcon style={styles.sendIcon} />
                </button>
              </div>
            ) : (
              <ContentInputPanel 
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                onStop={handleStopGeneration}
                hasMessages={messages.length > 0}
              />
            )}
          </div>
          
          {/* 四卡片推荐区域 - 只在没有消息时显示 */}
          {messages.length === 0 && (
            <div style={styles.recommendationsSection}>
            <div style={styles.cardsGrid4}>
            <div>
              <div style={styles.cardTitleOutside}>{copy.sections.fanFavorites}</div>
              <div style={styles.cardBox}>
                <div style={styles.cardContent}>
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
                <div style={styles.cardContent}>
                  {copy.hotTopics.map((item, index) => (
                    <div
                      key={index}
                      style={styles.cardItem}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item);
                        e.target.style.opacity = '0.5';
                        e.target.style.transform = 'scale(0.95)';
                        e.target.style.backgroundColor = '#E7EEFD';
                      }}
                      onDragEnd={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = '';
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
                <div style={styles.cardContent}>
                  {copy.trends.map((item, index) => (
                    <div
                      key={index}
                      style={styles.cardItem}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item);
                        e.target.style.opacity = '0.5';
                        e.target.style.transform = 'scale(0.95)';
                        e.target.style.backgroundColor = '#E7EEFD';
                      }}
                      onDragEnd={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = '';
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={styles.cardTitleOutside}>
                {copy.sections.inspirationSnippets}
                <button 
                  style={styles.addSnippetButton}
                  onClick={onNavigateToSnippets}
                >
                  添加碎片
                </button>
              </div>
              <div style={styles.cardBox}>
                <div style={styles.snippetsContent}>
                  {copy.inspirationSnippets.slice(snippetPage * 3, (snippetPage + 1) * 3).map((item, index) => (
                    <div
                      key={snippetPage * 3 + index}
                      style={styles.inspirationItem}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item);
                        e.target.style.opacity = '0.5';
                        e.target.style.transform = 'scale(0.95)';
                        e.target.style.backgroundColor = '#E7EEFD';
                      }}
                      onDragEnd={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = '';
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div style={styles.paginationContainer}>
                  <button 
                    style={{
                      ...styles.paginationButton,
                      ...(snippetPage === 0 ? styles.paginationButtonDisabled : {})
                    }}
                    onClick={() => setSnippetPage(Math.max(0, snippetPage - 1))}
                    disabled={snippetPage === 0}
                  >
                    ‹
                  </button>
                  <span style={styles.paginationInfo}>
                    {snippetPage + 1} / {Math.max(1, Math.ceil(copy.inspirationSnippets.length / 3))}
                  </span>
                  <button 
                    style={{
                      ...styles.paginationButton,
                      ...(snippetPage >= Math.max(1, Math.ceil(copy.inspirationSnippets.length / 3)) - 1 ? styles.paginationButtonDisabled : {})
                    }}
                    onClick={() => setSnippetPage(Math.min(Math.max(1, Math.ceil(copy.inspirationSnippets.length / 3)) - 1, snippetPage + 1))}
                    disabled={snippetPage >= Math.max(1, Math.ceil(copy.inspirationSnippets.length / 3)) - 1}
                  >
                    ›
                  </button>
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
  
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
    maxWidth: '880px',
    margin: '0 auto',
    padding: '20px',
  },
  
  
  inputContainer: {
    flexShrink: 0,
    marginBottom: '0',
  },
  
  inputContainerChat: {
    flexShrink: 0,
    padding: '20px',
    backgroundColor: '#f5f7fa',
  },
  
  messagesContainer: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  
  userMessage: {
    backgroundColor: '#E7EEFD',
    color: '#333',
    alignSelf: 'flex-end',
    borderRadius: '12px 6px 12px 12px',
    maxWidth: '70%',
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  
  aiMessage: {
    backgroundColor: '#ffffff',
    color: '#374151',
    alignSelf: 'flex-start',
    borderRadius: '6px 12px 12px 12px',
    maxWidth: '70%',
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '8px 12px',
    gap: '8px',
  },
  
  inputIcons: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
  },
  
  inputIcon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
  },
  
  messageInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    padding: '8px 0',
    color: '#374151',
  },
  
  sendButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  
  sendIcon: {
    fontSize: '14px',
    color: '#ffffff',
  },
  
  popover: {
    position: 'absolute',
    bottom: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
    zIndex: 1000,
    minWidth: '120px',
  },
  
  popoverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
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
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  
  userMessage: {
    backgroundColor: '#E7EEFD',
    color: '#333',
    alignSelf: 'flex-end',
    borderRadius: '12px 6px 12px 12px',
  },
  
  aiMessage: {
    backgroundColor: '#ffffff',
    color: '#374151',
    alignSelf: 'flex-start',
    borderRadius: '6px 12px 12px 12px',
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
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px',
  },
  
  cardsGrid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardTitleOutside: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  cardContent: {
    flex: 1,
    overflowY: 'auto', // 如果内容过长可以滚动
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[900],
    marginBottom: designTokens.spacing.md,
  },
  cardItem: {
    padding: '8px 0',
    color: '#6b7280',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '8px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    paddingLeft: '4px',
    paddingRight: '4px',
    lineHeight: '1.5',
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
  
  
  addSnippetButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3b82f6',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  },
  
  snippetsContent: {
    flex: 1,
    overflowY: 'auto', // 如果内容过长可以滚动
    display: 'flex',
    flexDirection: 'column',
  },

  inspirationItem: {
    padding: '8px 0',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
    marginBottom: '12px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    paddingLeft: '4px',
    paddingRight: '4px',
    lineHeight: '1.4',
  },
  
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: designTokens.spacing.md,
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  
  paginationButton: {
    background: 'none',
    border: 'none',
    color: designTokens.colors.gray[900],
    fontSize: '18px',
    cursor: 'pointer',
    padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
    borderRadius: designTokens.borderRadius.sm,
    transition: 'all 0.2s ease',
  },
  
  paginationButtonDisabled: {
    color: designTokens.colors.gray[300],
    cursor: 'not-allowed',
  },
  
  paginationInfo: {
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.gray[600],
    fontWeight: designTokens.typography.fontWeight.medium,
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

