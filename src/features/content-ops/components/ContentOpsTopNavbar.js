import React from 'react';
import { designTokens } from '../constants/designTokens';

const ContentOpsTopNavbar = ({ 
  activeTab, 
  onTabChange, 
  userInfo,
  onLogin,
  onLogout,
  onProfile 
}) => {
  const tabs = [
    { key: 'dataManager', label: '智慧数据管家' },
    { key: 'content', label: '内容运营' },
    { key: 'commercial', label: '商业化' },
    { key: 'ai', label: 'AI 经纪师' }
  ];

  return (
    <div style={styles.navbar}>
      {/* 左侧品牌Logo */}
      <div style={styles.navLeft}>
        <div style={styles.logoContainer}>
          <img 
            src="/brand/PLUSCO-logo.png" 
            alt="PLUSCO" 
            style={styles.logoImage}
          />
          <span style={styles.brandName}>PLUSCO</span>
        </div>
      </div>

      {/* 中间导航标签 */}
      <div style={styles.navCenter}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.key && styles.activeTab)
            }}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && <div style={styles.activeIndicator} />}
          </button>
        ))}
      </div>

      {/* 右侧用户区域 */}
      <div style={styles.navRight}>
        <div style={styles.actions}>
          <button style={styles.notificationButton}>
            <span style={styles.notificationIcon}>💬</span>
            <span style={styles.notificationBadge}>3</span>
          </button>
        </div>
        <div style={styles.userArea}>
          <div style={styles.userAvatar}>
            {userInfo?.avatar ? (
              <img src={userInfo.avatar} alt="avatar" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {userInfo?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${designTokens.spacing.lg} ${designTokens.spacing['2xl']}`,
    backgroundColor: designTokens.colors.white,
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
    boxShadow: designTokens.shadows.sm,
    height: '80px',
  },
  
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  
  logoImage: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  
  brandName: {
    fontSize: designTokens.typography.fontSize['2xl'],
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.gray[900],
  },
  
  navCenter: {
    display: 'flex',
    gap: designTokens.spacing.xs,
    backgroundColor: designTokens.colors.gray[50],
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.xs,
  },
  
  tabButton: {
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    border: 'none',
    borderRadius: designTokens.borderRadius.sm,
    backgroundColor: 'transparent',
    color: designTokens.colors.gray[600],
    fontSize: designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  
  activeTab: {
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[900],
    fontWeight: designTokens.typography.fontWeight.semibold,
    boxShadow: designTokens.shadows.sm,
  },
  
  activeIndicator: {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '2px',
    backgroundColor: designTokens.colors.accent.orange,
    borderRadius: '1px',
  },
  
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.lg,
  },
  
  actions: {
    display: 'flex',
    gap: designTokens.spacing.md,
  },
  
  notificationButton: {
    position: 'relative',
    padding: designTokens.spacing.md,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: designTokens.borderRadius.md,
    transition: 'background-color 0.2s ease',
  },
  
  notificationIcon: {
    fontSize: designTokens.typography.fontSize.lg,
  },
  
  notificationBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '16px',
    height: '16px',
    backgroundColor: designTokens.colors.primary,
    color: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.full,
    fontSize: designTokens.typography.fontSize.xs,
    fontWeight: designTokens.typography.fontWeight.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  userArea: {
    cursor: 'pointer',
  },
  
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: designTokens.borderRadius.full,
    overflow: 'hidden',
    border: `2px solid ${designTokens.colors.gray[200]}`,
  },
  
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${designTokens.colors.primaryBlue}, ${designTokens.colors.primary})`,
    color: designTokens.colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.bold,
  },
};

// 添加悬停效果
Object.assign(styles, {
  tabButton: {
    ...styles.tabButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
    }
  },
  notificationButton: {
    ...styles.notificationButton,
    ':hover': {
      backgroundColor: designTokens.colors.gray[100],
    }
  },
});

export default ContentOpsTopNavbar;
