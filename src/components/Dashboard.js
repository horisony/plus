import React, { useState } from 'react';

// 统计卡片组件
const StatCard = ({ label, value, children }) => (
  <div style={styles.statItem}>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
    {children}
  </div>
);

// 预警达人卡片组件
const WarningCard = ({ type, count, data }) => (
  <div style={{
    ...styles.warningCard,
    ...(type === 'low' ? styles.lowWarning : styles.highWarning)
  }}>
    <div style={styles.warningHeader}>
      <h3 style={styles.warningTitle}>
        {type === 'low' ? '😔 情绪低预警达人' : '😄 情绪高预警达人'} ({count})
      </h3>
    </div>
    <div style={styles.warningList}>
      {data.map((item, index) => (
        <div key={index} style={styles.avatarItem}>
          <div style={styles.avatarWrapper}>
            <img src="plusco.png" alt="avatar" style={styles.avatar} />
            <div style={styles.onlineIndicator}></div>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{item.name}</span>
            <span style={styles.userMessage}>{item.message}</span>
          </div>
          <div style={styles.timeBadge}>刚刚</div>
        </div>
      ))}
    </div>
  </div>
);

// 话题标签组件 - 圆形标签云
const TopicSection = ({ type, tags }) => {
  // 圆形标签云布局
  const renderCircularTagCloud = () => {
    const radius = 100; // 圆的半径
    const centerX = 150; // 圆心X坐标
    const centerY = 120; // 圆心Y坐标
    const totalTags = tags.length;
    
    return tags.map((tag, index) => {
      // 统一处理标签数据格式
      const tagData = {
        name: typeof tag === 'string' ? tag : tag.name || tag.label || '未知标签',
        weight: typeof tag === 'string' ? Math.random() : tag.weight || tag.count || Math.random(),
        id: typeof tag === 'string' ? index : tag.id || index
      };

      // 根据权重计算字体大小和透明度
      const fontSize = 12 + tagData.weight * 8; // 12-20px
      const opacity = 0.6 + tagData.weight * 0.4; // 0.6-1.0
      
      // 计算标签在圆上的位置（等间距分布）
      const angle = (index * 2 * Math.PI) / totalTags - Math.PI / 2; // 从顶部开始
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
    <div style={styles.topicSection}>
      <h3 style={styles.topicTitle}>
        {type === 'low' ? '📉 低预警话题' : '📈 高预警话题'}
      </h3>
      <div style={styles.circularCloudContainer}>
        {renderCircularTagCloud()}
      </div>
    </div>
  );
};

// 主组件
const Dashboard = ({ onEditAvatar }) => {
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
    { label: '聊天中的达人人数', value: '1,367' },
    { label: '情绪低预警达人人数', value: '63' },
    { label: '情绪高预警达人人数', value: '82' },
    { label: '总计对话数', value: '83,921' },
    { label: '全部达人人数', value: '24,351' }
  ];

  return (
    <div style={styles.container}>
      {/* 统计信息 - 合并到一个栏目 */}
      <div style={styles.statsContainer}>
        <div style={styles.statsCard}>
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard key={index} label={stat.label} value={stat.value} />
            ))}
          </div>
          <button onClick={onEditAvatar} style={styles.editButton}>
            ✏️ 编辑我的分身
          </button>
        </div>
      </div>

      {/* 预警达人和话题标签 */}
      <div style={styles.contentGrid}>
        <div style={styles.column}>
          <WarningCard 
            type="low" 
            count={63} 
            data={lowWarningData} 
          />
          <WarningCard 
            type="high" 
            count={82} 
            data={highWarningData} 
          />
        </div>
        
        <div style={styles.column}>
          <TopicSection type="low" tags={lowTags} />
          <TopicSection type="high" tags={highTags} />
        </div>
      </div>
    </div>
  );
};

// 样式定义
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  
  // 统计信息区域
  statsContainer: {
    marginBottom: '24px',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '20px',
    flex: 1,
  },
  statItem: {
    textAlign: 'center',
    padding: '10px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
  },
  editButton: {
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)',
    transition: 'all 0.2s ease',
    marginLeft: '20px',
    whiteSpace: 'nowrap',
  },
  
  // 内容网格布局
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  // 预警卡片样式
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  lowWarning: {
    borderLeft: '4px solid #ff4d4f',
  },
  highWarning: {
    borderLeft: '4px solid #52c41a',
  },
  warningHeader: {
    marginBottom: '16px',
  },
  warningTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
  },
  warningList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  avatarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    transition: 'background-color 0.2s ease',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    backgroundColor: '#52c41a',
    borderRadius: '50%',
    border: '2px solid #fff',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  userMessage: {
    fontSize: '12px',
    color: '#666',
  },
  timeBadge: {
    fontSize: '11px',
    color: '#999',
    backgroundColor: '#f0f0f0',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  
  // 话题标签区域
  topicSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  topicTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
  },
  
  // 圆形标签云样式
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
  lowTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
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

// 添加悬停效果
Object.assign(styles, {
  avatarItem: {
    ...styles.avatarItem,
    ':hover': {
      backgroundColor: '#e9ecef',
    }
  },
  editButton: {
    ...styles.editButton,
    ':hover': {
      backgroundColor: '#d32f2f',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(244, 67, 54, 0.4)',
    }
  },
  circularTagItem: {
    ...styles.circularTagItem,
    ':hover': {
      transform: 'translate(-50%, -50%) scale(1.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 100,
    }
  },
});

export default Dashboard;