import React, { useState } from 'react';
import { designTokens } from '../constants/designTokens';
import copy from '../constants/copy.zh-CN.json';

const ContentRecommendations = () => {
  const [activeSection, setActiveSection] = useState('fanFavorites');

  const renderContent = () => {
    switch (activeSection) {
      case 'fanFavorites':
        return (
          <div style={styles.contentList}>
            {copy.fanFavorites.map((item, index) => (
              <div key={index} style={styles.contentItem}>
                {item}
              </div>
            ))}
          </div>
        );
      case 'hotTopics':
        return (
          <div style={styles.contentList}>
            {copy.hotTopics.map((item, index) => (
              <div key={index} style={styles.contentItem}>
                {item}
              </div>
            ))}
          </div>
        );
      case 'trends':
        return (
          <div style={styles.contentList}>
            {copy.trends.map((item, index) => (
              <div key={index} style={styles.contentItem}>
                {item}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* 标签页 */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'fanFavorites' && styles.activeTab)
          }}
          onClick={() => setActiveSection('fanFavorites')}
        >
          {copy.sections.fanFavorites}
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'hotTopics' && styles.activeTab)
          }}
          onClick={() => setActiveSection('hotTopics')}
        >
          {copy.sections.hotTopics}
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'trends' && styles.activeTab)
          }}
          onClick={() => setActiveSection('trends')}
        >
          {copy.sections.trends}
        </button>
      </div>

      {/* 内容区域 */}
      <div style={styles.content}>
        {renderContent()}
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
    height: 'fit-content',
  },
  
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
  },
  
  tab: {
    flex: 1,
    padding: `${designTokens.spacing.lg} ${designTokens.spacing.md}`,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    color: designTokens.colors.gray[600],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  
  activeTab: {
    color: designTokens.colors.gray[900],
    fontWeight: designTokens.typography.fontWeight.semibold,
    borderBottom: `2px solid ${designTokens.colors.primary}`,
  },
  
  content: {
    padding: designTokens.spacing.lg,
    minHeight: '200px',
  },
  
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.sm,
  },
  
  contentItem: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    backgroundColor: designTokens.colors.gray[50],
    borderRadius: designTokens.borderRadius.sm,
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.gray[700],
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: `1px solid ${designTokens.colors.gray[200]}`,
  },
};

// 添加悬停效果
Object.assign(styles, {
  tab: {
    ...styles.tab,
    ':hover': {
      backgroundColor: designTokens.colors.gray[50],
    }
  },
  contentItem: {
    ...styles.contentItem,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
    }
  },
});

export default ContentRecommendations;
