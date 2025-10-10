import React, { useState, useRef, useEffect } from 'react';
import { AiOutlinePaperClip, AiOutlinePicture, AiOutlineVideoCamera, AiOutlineSend } from 'react-icons/ai';
import { designTokens } from '../constants/designTokens';
import copy from '../constants/copy.zh-CN.json';

const ContentInputPanel = ({ onSendMessage, isGenerating, onStop, hasMessages = false }) => {
  const [activeTab, setActiveTab] = useState('shortVideo');
  const [message, setMessage] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [activeMentionTab, setActiveMentionTab] = useState('fanFavorites');
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMentionDropdown && 
          dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          textareaRef.current && !textareaRef.current.contains(event.target)) {
        setShowMentionDropdown(false);
      }
    };

    if (showMentionDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMentionDropdown]);

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };


  // 处理@输入
  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setMessage(value);
    
    // 检查是否输入了@
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // 检查@后是否有空格或换行，如果有说明@标签已经完成，应该关闭下拉菜单
      if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
        setShowMentionDropdown(false);
        return;
      }
      
      // 检查@后是否有其他@符号，如果有说明开始了新的@标签
      const nextAtIndex = textAfterAt.indexOf('@');
      if (nextAtIndex !== -1) {
        setShowMentionDropdown(false);
        return;
      }
      
      // 检查是否在@标签内部（允许空格，但不允许换行）
      if (!textAfterAt.includes('\n')) {
        // 计算下拉框位置
        const rect = e.target.getBoundingClientRect();
        
        // 根据是否有对话来决定弹窗位置
        if (hasMessages) {
          // 有对话时，弹窗悬浮在输入框上方，与输入框重叠显示
          setMentionPosition({
            top: rect.top - 180, // 向上悬浮，与输入框重叠显示
            left: rect.left
          });
        } else {
          // 初次对话时，弹窗在输入框下方
          setMentionPosition({
            top: rect.bottom + 5,
            left: rect.left
          });
        }
        
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
    
    // 不要强制重置光标位置，让浏览器自然处理
    // 只有在特殊情况下才需要手动设置光标位置
  };

  // 获取当前tab的内容
  const getCurrentTabContent = () => {
    switch (activeMentionTab) {
      case 'fanFavorites':
        return copy.fanFavorites;
      case 'hotTopics':
        return copy.hotTopics;
      case 'trends':
        return copy.trends;
      case 'inspirationSnippets':
        return copy.inspirationSnippets;
      default:
        return copy.fanFavorites;
    }
  };

  // 选择@选项
  const selectMention = (mention) => {
    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPos);
    const textAfterCursor = message.substring(cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const beforeAt = textBeforeCursor.substring(0, lastAtIndex);
      const newText = beforeAt + `@${mention} ` + textAfterCursor;
      setMessage(newText);
      setShowMentionDropdown(false);
      
      // 设置光标位置到@标签后面，确保在文字最后
      setTimeout(() => {
        const newCursorPos = beforeAt.length + mention.length + 2; // +2 for @ and space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
        
        // 确保光标在正确位置，如果位置不对则重新设置
        setTimeout(() => {
          if (textareaRef.current.selectionStart !== newCursorPos) {
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 10);
      }, 0);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleQuickPrompt = (promptType) => {
    const promptText = copy.quickPrompts[promptType];
    setMessage(promptText);
  };

  // 拖拽到输入框以填充内容
  const handleDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      // 将拖拽的内容转换为@标签格式
      const mentionText = `@${text} `;
      setMessage(prev => (prev ? prev + mentionText : mentionText));
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  // 渲染消息内容，将@标签高亮显示
  const renderMessage = (text) => {
    // 获取所有预定义的@标签内容
    const allMentions = [
      ...copy.fanFavorites,
      ...copy.hotTopics,
      ...copy.trends,
      ...copy.inspirationSnippets
    ];
    
    // 简单的文本分割和识别
    const parts = [];
    let lastIndex = 0;
    
    // 查找所有@符号
    const atMatches = [...text.matchAll(/@/g)];
    
    for (const match of atMatches) {
      const atIndex = match.index;
      
      // 添加@符号前的文本
      if (atIndex > lastIndex) {
        parts.push(text.substring(lastIndex, atIndex));
      }
      
      // 查找@后的内容，直到遇到空格或换行
      let mentionEnd = atIndex + 1;
      while (mentionEnd < text.length && text[mentionEnd] !== ' ' && text[mentionEnd] !== '\n') {
        mentionEnd++;
      }
      
      const mentionText = text.substring(atIndex, mentionEnd);
      const mentionContent = mentionText.substring(1); // 去掉@符号
      
      // 检查是否是预定义的@标签
      if (allMentions.includes(mentionContent)) {
        parts.push(mentionText);
      } else {
        parts.push(mentionText);
      }
      
      lastIndex = mentionEnd;
    }
    
    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const mentionContent = part.substring(1);
        if (allMentions.includes(mentionContent)) {
          return (
            <span key={index} style={styles.mentionTag}>
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  // 处理键盘事件，实现@标签整体删除
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // 处理删除键
    if (e.key === 'Backspace') {
      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = message.substring(0, cursorPos);
      const textAfterCursor = message.substring(cursorPos);
      
      // 检查光标前是否有预定义的@标签
      const allMentions = [
        ...copy.fanFavorites,
        ...copy.hotTopics,
        ...copy.trends,
        ...copy.inspirationSnippets
      ];
      
      // 查找最后一个@符号
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        
        // 检查@后的内容是否是完整的预定义标签（以空格结尾）
        const isCompleteMention = allMentions.some(mention => 
          textAfterAt === mention + ' '
        );
        
        if (isCompleteMention) {
          // 如果是完整的@标签，整体删除
          e.preventDefault();
          const beforeMention = textBeforeCursor.substring(0, lastAtIndex);
          setMessage(beforeMention + textAfterCursor);
          setShowMentionDropdown(false);
          
          // 设置光标位置
          setTimeout(() => {
            textareaRef.current.setSelectionRange(beforeMention.length, beforeMention.length);
            textareaRef.current.focus();
          }, 0);
        } else if (textAfterAt.length === 0) {
          // 如果@后没有内容，删除@符号
          e.preventDefault();
          const beforeAt = textBeforeCursor.substring(0, lastAtIndex);
          setMessage(beforeAt + textAfterCursor);
          setShowMentionDropdown(false);
          
          // 设置光标位置
          setTimeout(() => {
            textareaRef.current.setSelectionRange(beforeAt.length, beforeAt.length);
            textareaRef.current.focus();
          }, 0);
        }
        // 其他情况（部分@标签或普通文本）让浏览器正常处理，不阻止默认行为
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Tab 放在输入框外面 */}
      <div style={styles.tabsContainer}>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'shortVideo' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('shortVideo')}
        >
          {copy.quickPrompts.shortVideo}
        </button>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'liveStream' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('liveStream')}
        >
          {copy.quickPrompts.liveStream}
        </button>
      </div>
      
      {/* 输入区域 */}
      <div style={styles.container}>
        <div style={styles.inputContainer}>
          <div style={styles.textareaWrapper}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              placeholder={copy.placeholders.messageInput}
              style={styles.textarea}
              disabled={isGenerating}
            />
            {/* @标签高亮显示层 */}
            <div style={styles.textareaOverlay}>
              {renderMessage(message)}
            </div>
          </div>
          
          {/* 工具栏 */}
          <div style={styles.toolbar}>
            <div style={styles.toolbarLeft}>
              <button style={styles.toolButton} aria-label="附件">
                <AiOutlinePaperClip />
              </button>
              <button style={styles.toolButton} aria-label="图片">
                <AiOutlinePicture />
              </button>
              <button style={styles.toolButton} aria-label="视频">
                <AiOutlineVideoCamera />
              </button>
            </div>
            
            <div style={styles.actionButtons}>
              <button 
                style={{
                  ...styles.sendButton,
                  ...(isGenerating
                    ? { backgroundColor: designTokens.colors.primaryDark, color: '#fff' }
                    : message.trim()
                      ? { backgroundColor: designTokens.colors.primary, color: '#fff' }
                      : { backgroundColor: designTokens.colors.primaryLight, color: designTokens.colors.primary })
                }} 
                onClick={isGenerating ? onStop : handleSend}
                disabled={!message.trim() && !isGenerating}
                aria-label="发送"
              >
                {isGenerating 
                  ? <span style={{ width: 14, height: 14, background: '#fff', borderRadius: 3 }} />
                  : <AiOutlineSend />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* @下拉框 - 横向tab设计 */}
      {showMentionDropdown && (
        <div 
          ref={dropdownRef}
          style={{
            ...styles.mentionDropdown,
            top: mentionPosition.top,
            left: mentionPosition.left
          }}
        >
          {/* 横向tab选择器 */}
          <div style={styles.mentionTabs}>
            <button
              style={{
                ...styles.mentionTab,
                ...(activeMentionTab === 'fanFavorites' ? styles.activeMentionTab : {})
              }}
              onClick={() => setActiveMentionTab('fanFavorites')}
            >
              粉丝喜欢看
              {activeMentionTab === 'fanFavorites' && (
                <div style={styles.tabUnderline}></div>
              )}
            </button>
            <button
              style={{
                ...styles.mentionTab,
                ...(activeMentionTab === 'hotTopics' ? styles.activeMentionTab : {})
              }}
              onClick={() => setActiveMentionTab('hotTopics')}
            >
              热点
              {activeMentionTab === 'hotTopics' && (
                <div style={styles.tabUnderline}></div>
              )}
            </button>
            <button
              style={{
                ...styles.mentionTab,
                ...(activeMentionTab === 'trends' ? styles.activeMentionTab : {})
              }}
              onClick={() => setActiveMentionTab('trends')}
            >
              趋势
              {activeMentionTab === 'trends' && (
                <div style={styles.tabUnderline}></div>
              )}
            </button>
            <button
              style={{
                ...styles.mentionTab,
                ...(activeMentionTab === 'inspirationSnippets' ? styles.activeMentionTab : {})
              }}
              onClick={() => setActiveMentionTab('inspirationSnippets')}
            >
              灵感碎片
              {activeMentionTab === 'inspirationSnippets' && (
                <div style={styles.tabUnderline}></div>
              )}
            </button>
          </div>
          
          {/* 当前tab的内容 */}
          <div style={styles.mentionContent}>
            {getCurrentTabContent().map((mention, index) => (
              <div
                key={`${activeMentionTab}-${index}`}
                style={styles.mentionOption}
                onClick={() => selectMention(mention)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
                  e.target.style.boxShadow = '0 0 0 1px rgba(37, 99, 235, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {mention}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 840,
    margin: '0 auto',
  },
  
  tabsContainer: {
    display: 'flex',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.lg,
    justifyContent: 'flex-start',
  },
  
  tab: {
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: '999px',
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[700],
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  
  activeTab: {
    backgroundColor: designTokens.colors.gray[100],
    color: designTokens.colors.gray[900],
    fontWeight: designTokens.typography.fontWeight.semibold,
  },
  
  container: {
    backgroundColor: designTokens.colors.white,
    borderRadius: '16px',
    boxShadow: designTokens.shadows.md,
    overflow: 'hidden',
  },
  
  inputContainer: {
    padding: designTokens.spacing.lg,
  },
  
  textareaWrapper: {
    position: 'relative',
    width: '100%',
  },
  
  textarea: {
    width: '100%',
    minHeight: '120px',
    maxHeight: '300px', // 限制最大高度，防止撑破容器
    padding: designTokens.spacing.lg,
    border: 'none',
    borderRadius: '12px',
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily,
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'transparent',
    color: 'transparent', // 隐藏原始文字，显示高亮层
    boxSizing: 'border-box',
    caretColor: designTokens.colors.gray[900], // 保持光标可见
    textAlign: 'left', // 确保文字左对齐
    verticalAlign: 'top', // 确保文字从顶部开始
    overflow: 'auto', // 允许滚动
    zIndex: 1, // 确保textarea在覆盖层之上
    position: 'relative', // 确保z-index生效
  },
  
  textareaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: designTokens.spacing.lg,
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily,
    lineHeight: '1.5',
    color: designTokens.colors.gray[900],
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'flex-start',
    zIndex: 0,
  },
  
  mentionTag: {
    backgroundColor: designTokens.colors.primaryLight,
    color: designTokens.colors.primary,
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: designTokens.typography.fontWeight.medium,
  },
  
  mentionDropdown: {
    position: 'fixed',
    backgroundColor: designTokens.colors.white,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.lg,
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)', // 增强阴影效果，让重叠悬浮更明显
    zIndex: 1000,
    minWidth: '300px',
    maxWidth: '500px',
    overflow: 'hidden',
  },
  
  mentionTabs: {
    display: 'flex',
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
    backgroundColor: designTokens.colors.gray[50],
    position: 'relative',
  },
  
  mentionTab: {
    flex: 1,
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: designTokens.typography.fontSize.xs, // 调小字体
    fontWeight: designTokens.typography.fontWeight.medium,
    color: designTokens.colors.gray[600],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap', // 确保不换行
    textAlign: 'left', // 左对齐
    position: 'relative',
  },
  
  activeMentionTab: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.fontWeight.semibold,
    backgroundColor: designTokens.colors.white,
  },
  
  tabUnderline: {
    position: 'absolute',
    bottom: '-1px',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: designTokens.colors.primary,
  },
  
  mentionContent: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  
  mentionOption: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    cursor: 'pointer',
    fontSize: designTokens.typography.fontSize.xs, // 调小字体
    color: designTokens.colors.gray[700],
    borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
    transition: 'all 0.2s ease',
    textAlign: 'left', // 左对齐
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
  mentionTab: {
    ...styles.mentionTab,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
    }
  },
});

export default ContentInputPanel;
