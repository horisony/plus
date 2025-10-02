import React, { useState } from 'react';

const TopNavbar = ({ 
  activeTab, 
  onTabChange, 
  userInfo,
  onLogin,
  onLogout,
  onProfile 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { key: 'talent', label: '达人广场' },
    { key: 'content', label: '内容运营' },
    { key: 'commercial', label: '商业化' },
    { key: 'ai', label: 'AI 经纪人' }
  ];

  return (
    <div style={styles.navbar}>
      {/* 左侧品牌Logo */}
      <div style={styles.navLeft}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🤖</div>
          <span style={styles.brandName}>PlusCo</span>
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
          <button style={styles.upgradeButton}>
            ⚡ 专业版
          </button>
        </div>
        <div 
          style={styles.userArea}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <div style={styles.userAvatar}>
            {userInfo?.avatar ? (
              <img src={userInfo.avatar} alt="avatar" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {userInfo?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          {/* 用户下拉菜单 */}
          {showUserMenu && (
            <div style={styles.userMenu}>
              {userInfo ? (
                <>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{userInfo.name}</div>
                    <div style={styles.userEmail}>{userInfo.email}</div>
                  </div>
                  <div style={styles.menuDivider}></div>
                  <button 
                    style={styles.menuItem}
                    onClick={onProfile}
                  >
                    <span style={styles.menuIcon}>👤</span>
                    个人资料
                  </button>
                  <button 
                    style={styles.menuItem}
                    onClick={onLogout}
                  >
                    <span style={styles.menuIcon}>🚪</span>
                    退出登录
                  </button>
                </>
              ) : (
                <button 
                  style={styles.menuItem}
                  onClick={onLogin}
                >
                  <span style={styles.menuIcon}>🔑</span>
                  立即登录
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 样式定义
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navCenter: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '6px',
    padding: '4px',
  },
  tabButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#666666',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: '#2563eb',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  upgradeButton: {
    padding: '6px 12px',
    border: '1px solid rgba(37, 99, 235, 0.3)',
    borderRadius: '4px',
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  userArea: {
    position: 'relative',
    cursor: 'pointer',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #e5e5e5',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  userMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '180px',
    zIndex: 1000,
    overflow: 'hidden',
    border: '1px solid #e5e5e5',
  },
  userInfo: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '2px',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666666',
  },
  menuDivider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
  },
  menuItem: {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease',
  },
};

// 添加悬停效果
Object.assign(styles, {
  tabButton: {
    ...styles.tabButton,
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }
  },
  upgradeButton: {
    ...styles.upgradeButton,
    ':hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderColor: 'rgba(37, 99, 235, 0.5)',
    }
  },
  menuItem: {
    ...styles.menuItem,
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
});

export default TopNavbar;