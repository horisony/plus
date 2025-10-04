import React from 'react';
import { designTokens } from '../constants/designTokens';
import copy from '../constants/copy.zh-CN.json';

const InspirationSnippets = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{copy.sections.inspirationSnippets}</h3>
      </div>
      
      <div style={styles.content}>
        {copy.inspirationSnippets.map((snippet, index) => (
          <div key={index} style={styles.snippetItem}>
            <div style={styles.snippetIcon}>💡</div>
            <div style={styles.snippetText}>{snippet}</div>
          </div>
        ))}
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
  
  header: {
    padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
    backgroundColor: designTokens.colors.gray[50],
  },
  
  title: {
    margin: 0,
    fontSize: designTokens.typography.fontSize.lg,
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[900],
  },
  
  content: {
    padding: designTokens.spacing.xl,
  },
  
  snippetItem: {
    display: 'flex',
    gap: designTokens.spacing.md,
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.gray[50],
    borderRadius: designTokens.borderRadius.md,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    marginBottom: designTokens.spacing.md,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  
  snippetIcon: {
    fontSize: designTokens.typography.fontSize.xl,
    flexShrink: 0,
    marginTop: designTokens.spacing.xs,
  },
  
  snippetText: {
    fontSize: designTokens.typography.fontSize.sm,
    lineHeight: '1.5',
    color: designTokens.colors.gray[700],
    flex: 1,
  },
};

// 添加悬停效果
Object.assign(styles, {
  snippetItem: {
    ...styles.snippetItem,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
      borderColor: designTokens.colors.gray[300],
      transform: 'translateY(-1px)',
    }
  },
});

export default InspirationSnippets;
