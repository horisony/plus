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
      
    </div>
  );
};

const styles = {
  sidebar: {
    width: '210px',
    backgroundColor: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  newConversationButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#E7EEFD',
    color: '#1356F0',
    border: 'none',
    borderRadius: '20px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  plusIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  
  sectionTitle: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
    marginBottom: '4px',
    textAlign: 'left',
  },
  
  conversationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  
  conversationItem: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    padding: '6px 0',
    textAlign: 'left',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  
};

// 添加悬停效果
Object.assign(styles, {
  newConversationButton: {
    ...styles.newConversationButton,
    ':hover': {
      backgroundColor: '#D1E0FF',
      transform: 'translateY(-1px)',
    }
  },
  conversationItem: {
    ...styles.conversationItem,
    ':hover': {
      color: '#3b82f6',
    }
  },
});

export default LeftSidebar;
