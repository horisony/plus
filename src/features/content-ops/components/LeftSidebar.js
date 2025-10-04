import React from 'react';
import { designTokens } from '../constants/designTokens';
import copy from '../constants/copy.zh-CN.json';

const LeftSidebar = () => {
  return (
    <div style={styles.sidebar}>
      {/* 新建对话按钮 */}
      <button style={styles.newConversationButton}>
        <span style={styles.plusIcon}>+</span>
        {copy.navigation.newConversation}
      </button>
      
      {/* 竞品视频跟踪 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>{copy.navigation.competitorTracking}</div>
      </div>
      
      {/* 历史对话 */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>{copy.navigation.historyConversations}</div>
        <div style={styles.conversationList}>
          {copy.historyConversations.map((conversation, index) => (
            <div key={index} style={styles.conversationItem}>
              {conversation}
            </div>
          ))}
        </div>
      </div>
      
      {/* 底部提示 */}
      <div style={styles.footer}>
        <div style={styles.footerText}>{copy.navigation.commercialIntent}</div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    backgroundColor: designTokens.colors.gray[50],
    padding: designTokens.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.lg,
    borderRight: `1px solid ${designTokens.colors.gray[200]}`,
  },
  
  newConversationButton: {
    width: '100%',
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    backgroundColor: designTokens.colors.gray[100],
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    fontSize: designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.medium,
    color: designTokens.colors.gray[700],
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    transition: 'all 0.2s ease',
  },
  
  plusIcon: {
    fontSize: designTokens.typography.fontSize.lg,
    fontWeight: designTokens.typography.fontWeight.bold,
  },
  
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.sm,
  },
  
  sectionTitle: {
    fontSize: designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[600],
    marginBottom: designTokens.spacing.xs,
    textAlign: 'left',
  },
  
  conversationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.xs,
  },
  
  conversationItem: {
    padding: `${designTokens.spacing.sm} 0`,
    fontSize: designTokens.typography.fontSize.base,
    color: designTokens.colors.gray[700],
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
    textAlign: 'left',
  },
  
  footer: {
    marginTop: 'auto',
    paddingTop: designTokens.spacing.lg,
  },
  
  footerText: {
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.gray[500],
    lineHeight: '1.4',
  },
};

// 添加悬停效果
Object.assign(styles, {
  newConversationButton: {
    ...styles.newConversationButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[200],
    }
  },
  conversationItem: {
    ...styles.conversationItem,
    ':hover': {
      color: designTokens.colors.gray[900],
    }
  },
});

export default LeftSidebar;
