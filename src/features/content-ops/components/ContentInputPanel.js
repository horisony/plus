import React, { useState } from 'react';
import { designTokens } from '../constants/designTokens';
import copy from '../constants/copy.zh-CN.json';

const ContentInputPanel = ({ onSendMessage, isGenerating, onStop }) => {
  const [activeTab, setActiveTab] = useState('shortVideo');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (promptType) => {
    const promptText = copy.quickPrompts[promptType];
    setMessage(promptText);
  };

  return (
    <div style={styles.container}>
      {/* 输入区域 */}
      <div style={styles.inputContainer}>
        {/* 小 tab 放在输入框左上 */}
        <div style={styles.quickPrompts}>
          <button 
            style={styles.quickPromptButton}
            onClick={() => handleQuickPrompt('shortVideo')}
          >
            {copy.quickPrompts.shortVideo}
          </button>
          <button 
            style={styles.quickPromptButton}
            onClick={() => handleQuickPrompt('liveStream')}
          >
            {copy.quickPrompts.liveStream}
          </button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={copy.placeholders.messageInput}
          style={styles.textarea}
          disabled={isGenerating}
        />
        
        {/* 工具栏 */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button style={styles.toolButton} aria-label="附件">
              📎
            </button>
            <button style={styles.toolButton} aria-label="图片">
              🖼️
            </button>
            <button style={styles.toolButton} aria-label="视频">
              🎥
            </button>
          </div>
          
          <div style={styles.actionButtons}>
            <button 
              style={styles.sendButton} 
              onClick={isGenerating ? onStop : handleSend}
              disabled={!message.trim() && !isGenerating}
              aria-label="发送"
            >
              {isGenerating ? <span style={{width: 12, height: 12, background: '#111', display: 'block', borderRadius: 2}} /> : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.xl,
    boxShadow: designTokens.shadows.md,
    overflow: 'hidden',
  },
  
  quickPrompts: {
    display: 'flex',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.md,
    justifyContent: 'flex-start',
  },
  
  quickPromptButton: {
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[700],
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  
  inputContainer: {
    padding: designTokens.spacing.xl,
  },
  
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: designTokens.spacing.xl,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.lg,
    fontSize: designTokens.typography.fontSize.lg,
    fontFamily: designTokens.typography.fontFamily,
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[900],
    boxSizing: 'border-box',
  },
  
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
  },
  
  toolbarLeft: {
    display: 'flex',
    gap: designTokens.spacing.md,
  },
  
  actionButtons: {
    display: 'flex',
    gap: designTokens.spacing.sm,
    alignItems: 'center',
  },
  
  toolButton: {
    width: '40px',
    height: '40px',
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.white,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: designTokens.typography.fontSize.lg,
    transition: 'all 0.2s ease',
  },
  
  pauseButton: {
    width: '40px',
    height: '40px',
    border: `1px solid ${designTokens.colors.gray[300]}`,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.white,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: designTokens.typography.fontSize.lg,
    transition: 'all 0.2s ease',
    color: designTokens.colors.gray[600],
  },
  
  sendButton: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.accent.yellow,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: designTokens.typography.fontSize.lg,
    transition: 'all 0.2s ease',
    opacity: 1,
  },
  
  'sendButton:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// 添加悬停效果
Object.assign(styles, {
  quickPromptButton: {
    ...styles.quickPromptButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[50],
      borderColor: designTokens.colors.gray[300],
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }
  },
  textarea: {
    ...styles.textarea,
    ':focus': {
      borderColor: designTokens.colors.primaryBlue,
    },
    '::placeholder': {
      color: designTokens.colors.gray[400],
      opacity: 1,
    }
  },
  toolButton: {
    ...styles.toolButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[50],
      borderColor: designTokens.colors.gray[300],
    }
  },
  pauseButton: {
    ...styles.pauseButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[50],
      borderColor: designTokens.colors.gray[400],
    }
  },
  sendButton: {
    ...styles.sendButton,
    ':hover': {
      backgroundColor: designTokens.colors.accent.orange,
      transform: 'translateY(-1px)',
    }
  },
});

export default ContentInputPanel;
