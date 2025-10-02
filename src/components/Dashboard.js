import React, { useState } from 'react';

// 顶部导航栏组件
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
      <div style={styles.navLeft}>
        <div style={styles.logoContainer}>
          <span style={styles.brandName}>PlusCo</span>
        </div>
      </div>

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

      <div style={styles.navRight}>
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
          
          {showUserMenu && (
            <div style={styles.userMenu}>
              {userInfo ? (
                <>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{userInfo.name}</div>
                    <div style={styles.userEmail}>{userInfo.email}</div>
                  </div>
                  <div style={styles.menuDivider} />
                  <button style={styles.menuItem} onClick={onProfile}>
                    👤 个人资料
                  </button>
                  <button style={styles.menuItem} onClick={onLogout}>
                    🚪 退出登录
                  </button>
                </>
              ) : (
                <button style={styles.menuItem} onClick={onLogin}>
                  🔑 立即登录
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 卡片组件 - 统一卡片样式
const Card = ({ title, children, style, action }) => (
  <div style={{...styles.card, ...style}}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
      {action && <button style={styles.viewAllButton}>{action}</button>}
    </div>
    {children}
  </div>
);

// 统计卡片组件
const StatCard = ({ label, value, trend, action, onActionClick }) => (
  <div style={styles.statCard}>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
    {trend && (
      <div style={{
        ...styles.trend,
        ...(trend > 0 ? styles.trendUp : styles.trendDown)
      }}>
        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
      </div>
    )}
    {action && (
      <button 
        style={styles.statActionButton}
        onClick={onActionClick}
      >
        {action}
      </button>
    )}
  </div>
);

// 预警达人卡片组件
const WarningCard = ({ type, count, data }) => (
  <Card 
    title={
      <>{type === 'low' ? '📉' : '📈'} 
      {type === 'low' ? '情绪低预警达人' : '情绪高预警达人'} 
      <span style={styles.warningCount}>({count})</span></>
    }
    action="查看全部 →"
  >
    <div style={styles.warningList}>
      {data.map((item, index) => (
        <div key={index} style={styles.avatarItem}>
          <div style={styles.avatarWrapper}>
            <img src="plusco.png" alt="avatar" style={styles.avatar} />
            <div style={styles.onlineIndicator} />
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{item.name}</span>
            <span style={styles.userMessage}>{item.message}</span>
          </div>
          <div style={styles.timeBadge}>
            {type === 'low' ? '⚠️' : '🎯'} 刚刚
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// 话题标签组件
const TopicSection = ({ type, tags }) => {
  const renderCircularTagCloud = () => {
    const radius = 100;
    const centerX = 150;
    const centerY = 120;
    const totalTags = tags.length;
    
    return tags.map((tag, index) => {
      const tagData = {
        name: typeof tag === 'string' ? tag : tag.name || tag.label || '未知标签',
        weight: typeof tag === 'string' ? Math.random() : tag.weight || tag.count || Math.random(),
        id: typeof tag === 'string' ? index : tag.id || index
      };

      const fontSize = 12 + tagData.weight * 8;
      const opacity = 0.6 + tagData.weight * 0.4;
      
      const angle = (index * 2 * Math.PI) / totalTags - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return (
        <span
          key={tagData.id}
          style={{
            ...styles.circularTagItem,
            ...(type === 'low' ? styles.lowTag : styles.highTag),
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)',
            fontSize: `${fontSize}px`,
            opacity: opacity,
            zIndex: Math.round(tagData.weight * 10)
          }}
          title={tagData.name}
        >
          {tagData.name}
          {type === 'high' && <span style={styles.hotIndicator}>🔥</span>}
        </span>
      );
    });
  };

  return (
    <Card title={<>{type === 'low' ? '🔍' : '🔥'} {type === 'low' ? '低预警话题' : '高预警话题'}</>}>
      <div style={styles.circularCloudContainer}>
        {renderCircularTagCloud()}
      </div>
    </Card>
  );
};

// AI经纪人页面组件
const AIBrokerDashboard = ({ onEditAvatar }) => {
  // 模拟数据
  const lowWarningData = [
    { name: '萌叔', message: '直播怎么做起来呢' },
    { name: '小美', message: '最近流量好差啊' },
    { name: '大熊', message: '不知道怎么拍视频' }
  ];

  const highWarningData = [
    { name: '萌叔', message: '直播怎么做起来呢' },
    { name: '小花', message: '视频爆了太开心！' },
    { name: '阿强', message: '粉丝涨得飞快' }
  ];

  const lowTags = ['互动率', '投流', '提高播放量', '怎么拍摄', '涨粉', '没流量'];
  const highTags = ['互动率', '投流', '爆了', '几百万播放', '涨粉', '卖了十多万'];

  const stats = [
    { label: '聊天中的达人人数', value: '1,367', trend: 12 },
    { label: '总计对话数', value: '83,921', trend: 15 },
    { label: '情绪低预警达人', value: '63', trend: -5 },
    { label: '情绪高预警达人', value: '82', trend: 8 },
    { 
      label: '全部达人人数', 
      value: '24,351', 
      trend: 3,
      action: '🎭 编辑我的分身',
      onAction: onEditAvatar
    }
  ];

  return (
    <div>
      {/* 数据概览 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>数据概览</h2>
          <div style={styles.timeFilter}>
            <button style={styles.timeButton}>今日</button>
            <button style={{...styles.timeButton, ...styles.timeButtonActive}}>本周</button>
            <button style={styles.timeButton}>本月</button>
          </div>
        </div>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              label={stat.label} 
              value={stat.value} 
              trend={stat.trend}
              action={stat.action}
              onActionClick={stat.onAction}
            />
          ))}
        </div>
      </div>

      {/* 预警达人 - 水平排列 */}
      <div style={styles.warningRow}>
        <WarningCard type="low" count={63} data={lowWarningData} />
        <WarningCard type="high" count={82} data={highWarningData} />
      </div>

      {/* 预警话题 - 水平排列 */}
      <div style={styles.topicsRow}>
        <TopicSection type="low" tags={lowTags} />
        <TopicSection type="high" tags={highTags} />
      </div>
    </div>
  );
};

// 商业化页面组件 - 占位符
const CommercialDashboard = () => {
  return (
    <div style={styles.placeholderPage}>
      <div style={styles.placeholderContent}>
        <h2 style={styles.placeholderTitle}>商业化</h2>
        <p style={styles.placeholderText}>商业化页面正在开发中...</p>
        <div style={styles.placeholderStats}>
          <div style={styles.placeholderStat}>
            <div style={styles.placeholderStatValue}>¥ 0</div>
            <div style={styles.placeholderStatLabel}>今日收入</div>
          </div>
          <div style={styles.placeholderStat}>
            <div style={styles.placeholderStatValue}>0</div>
            <div style={styles.placeholderStatLabel}>合作品牌</div>
          </div>
          <div style={styles.placeholderStat}>
            <div style={styles.placeholderStatValue}>0</div>
            <div style={styles.placeholderStatLabel}>进行中项目</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 达人广场页面组件 - 占位符
const TalentSquareDashboard = () => {
  return (
    <div style={styles.placeholderPage}>
      <div style={styles.placeholderContent}>
        <h2 style={styles.placeholderTitle}>达人广场</h2>
        <p style={styles.placeholderText}>达人广场页面正在开发中...</p>
      </div>
    </div>
  );
};

// 内容运营页面组件 - 占位符
const ContentOperationDashboard = () => {
  return (
    <div style={styles.placeholderPage}>
      <div style={styles.placeholderContent}>
        <h2 style={styles.placeholderTitle}>内容运营</h2>
        <p style={styles.placeholderText}>内容运营页面正在开发中...</p>
      </div>
    </div>
  );
};

// 主组件
const Dashboard = ({ onEditAvatar }) => {
  const [activeTab, setActiveTab] = useState('ai');
  const [userInfo, setUserInfo] = useState({
    name: '张经理',
    email: 'zhang@plusco.com',
    avatar: null
  });

  // 渲染当前活跃的页面
  const renderActivePage = () => {
    switch (activeTab) {
      case 'talent':
        return <TalentSquareDashboard />;
      case 'content':
        return <ContentOperationDashboard />;
      case 'commercial':
        return <CommercialDashboard />;
      case 'ai':
      default:
        return <AIBrokerDashboard onEditAvatar={onEditAvatar} />;
    }
  };

  // 用户操作处理函数
  const handleLogin = () => console.log('跳转到登录页面');
  const handleLogout = () => {
    setUserInfo(null);
    console.log('用户已退出登录');
  };
  const handleProfile = () => console.log('跳转到个人资料页面');

  return (
    <div style={styles.container}>
      <TopNavbar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userInfo={userInfo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      
      <div style={styles.mainContent}>
        {renderActivePage()}
      </div>
    </div>
  );
};

// 样式定义
const styles = {
  container: {
    padding: '0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: '#1a1a1a',
  },
  mainContent: {
    padding: '16px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  
  // 页面布局样式
  warningRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  topicsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  
  // 占位符页面样式
  placeholderPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  placeholderContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  placeholderTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#2563eb',
  },
  placeholderText: {
    fontSize: '16px',
    color: '#666666',
    marginBottom: '32px',
  },
  placeholderStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '32px',
  },
  placeholderStat: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  placeholderStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '8px',
  },
  placeholderStatLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  
  // 导航栏样式
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  navLeft: { display: 'flex', alignItems: 'center' },
  navCenter: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '6px',
    padding: '4px',
    marginLeft: 'auto', 
    marginRight: '20px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  // 按钮和交互元素
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
  
  // 统计卡片样式
  statActionButton: {
    marginTop: '8px',
    padding: '6px 12px',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: '#2563eb',
    border: '1px solid rgba(37, 99, 235, 0.3)',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  
  // 用户菜单样式
  userArea: { position: 'relative', cursor: 'pointer' },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #e5e5e5',
  },
  avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
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
  userInfo: { padding: '12px', borderBottom: '1px solid #f0f0f0' },
  userName: { fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: '#1a1a1a' },
  userEmail: { fontSize: '12px', color: '#666666' },
  menuDivider: { height: '1px', backgroundColor: '#f0f0f0' },
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
  
  // 内容区域样式
  section: { marginBottom: '16px' },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sectionTitle: { fontSize: '20px', fontWeight: '700', margin: 0, color: '#1a1a1a' },
  timeFilter: {
    display: 'flex',
    gap: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '4px',
    padding: '2px',
  },
  timeButton: {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '2px',
    backgroundColor: 'transparent',
    color: '#666666',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  timeButtonActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: '#2563eb',
  },
  
  // 卡片通用样式
  card: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #e5e5e5',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  cardTitle: { fontSize: '16px', fontWeight: '600', margin: 0, color: '#1a1a1a' },
  viewAllButton: {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    color: '#666666',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // 统计卡片
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #e5e5e5',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  statValue: { fontSize: '24px', fontWeight: '700', marginBottom: '2px', color: '#2563eb' },
  statLabel: { fontSize: '12px', color: '#666666', fontWeight: '500' },
  trend: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 4px',
    borderRadius: '2px',
  },
  trendUp: { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' },
  trendDown: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' },
  
  // 预警列表
  warningList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  warningCount: { color: '#666666', fontWeight: '400' },
  avatarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #f1f3f4',
    transition: 'all 0.2s ease',
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: '36px', height: '36px', borderRadius: '6px' },
  onlineIndicator: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '6px',
    height: '6px',
    backgroundColor: '#16a34a',
    borderRadius: '50%',
    border: '1px solid #ffffff',
  },
  userName: { fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: '#1a1a1a' },
  userMessage: { fontSize: '12px', color: '#666666' },
  timeBadge: {
    fontSize: '10px',
    color: '#999999',
    backgroundColor: '#f0f0f0',
    padding: '3px 6px',
    borderRadius: '3px',
  },
  
  // 话题标签样式
  circularCloudContainer: {
    position: 'relative',
    width: '300px',
    height: '240px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
  },
  
  circularTagItem: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '1px solid transparent',
    fontFamily: '"Inter", sans-serif',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  
  // 低预警标签样式
  lowTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  
  // 高预警标签样式
  highTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    color: '#16a34a',
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  
  hotIndicator: {
    fontSize: '10px',
    marginLeft: '2px',
  },
};

export default Dashboard;