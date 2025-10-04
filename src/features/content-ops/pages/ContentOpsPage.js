import React, { useRef, useState } from 'react';
import { designTokens } from '../constants/designTokens';
import LeftSidebar from '../components/LeftSidebar';
import ContentInputPanel from '../components/ContentInputPanel';
import ContentRecommendations from '../components/ContentRecommendations';
import InspirationSnippets from '../components/InspirationSnippets';
import copy from '../constants/copy.zh-CN.json';

const ContentOpsPage = () => {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStopGeneration = () => {
    if (generatorTimerRef.current) {
      clearInterval(generatorTimerRef.current);
      generatorTimerRef.current = null;
    }
    setIsGenerating(false);
  };

  return (
    <div style={styles.container}>
      {/* 主内容区域 */}
      <div style={styles.contentWrapper}>
        {/* 左侧边栏 */}
        <LeftSidebar />
        
        {/* 主内容区域 */}
        <div style={styles.mainContent}>
        {/* 对话区域 - 独立滚动并自动滚动到底部 */}
        <div id="conversation-scroll" style={styles.conversationArea}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>{copy.placeholders.emptyState}</div>
          )}
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
        
        {/* 输入面板 */}
        <div style={styles.inputSection}>
          <ContentInputPanel 
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            onStop={handleStopGeneration}
          />
        </div>
        
        {/* 底部推荐区域 */}
        <div style={styles.recommendationsSection}>
          <div style={styles.recommendationsGrid}>
            <div style={styles.recommendationsLeft}>
              <ContentRecommendations />
            </div>
            <div style={styles.recommendationsRight}>
              <InspirationSnippets />
            </div>
          </div>
        </div>
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
    backgroundColor: designTokens.colors.background,
  },
  
  contentWrapper: {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 80px)', // 减去导航栏高度
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: designTokens.spacing['2xl'],
    gap: designTokens.spacing['2xl'],
    overflow: 'auto',
  },
  
  conversationArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.lg,
    height: '40vh',
    overflowY: 'auto',
    paddingRight: designTokens.spacing.md,
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
    bottom: 0,
    backgroundColor: designTokens.colors.background,
    paddingTop: designTokens.spacing.lg,
  },
  
  recommendationsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: designTokens.spacing['2xl'],
    height: '100%',
  },
  
  recommendationsLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  recommendationsRight: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default ContentOpsPage;
