import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserId } from '../../utils/api';

// 个人信息卡片组件
const ProfileCard = ({ onEditAvatar }) => (
  <div style={styles.profileCard}>
    <div style={styles.profileLeft}>
      <img src="/PLUSCO-LOGO.jpg" alt="avatar" style={styles.profileAvatar} />
      <div style={styles.profileInfo}>
        <div style={styles.profileNameRow}>
          <span style={styles.profileName}>刘经理 - 无忧传媒</span>
        </div>
        <div style={styles.profileMeta}>
          <span style={styles.metaItem}>年龄 30-40岁</span>
          <span style={styles.metaItem}>性格 温柔</span>
        </div>
      </div>
    </div>
    <button onClick={onEditAvatar} style={styles.editAvatarButton}>
      编辑我的分身
    </button>
  </div>
);

// 统计卡片组件
const StatsSection = ({ stats }) => (
  <div style={styles.statsSection}>
    <div style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} style={styles.statCard}>
          <div style={styles.statLabel}>{stat.label}</div>
          <div style={styles.statValue}>{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
);

// 达人列表组件
const TalentList = ({ talents, activeTab }) => {
  return (
    <div style={styles.talentListContainer}>
      <div style={styles.talentTable}>
        {/* 表头 */}
        <div style={styles.talentTableHeader}>
          <div style={styles.talentHeaderCell}>达人</div>
          <div style={styles.talentHeaderCell}>心情状态</div>
          <div style={styles.talentHeaderCell}>维度修改</div>
          <div style={styles.talentHeaderCell}>带货</div>
          <div style={styles.talentHeaderCell}>疑议条件</div>
          <div style={styles.talentHeaderCell}></div>
        </div>
        
        {/* 数据行 */}
        {talents.map((talent, index) => (
          <div key={index} style={styles.talentTableRow}>
            <div style={styles.talentCell}>
              <img src="/PLUSCO-LOGO.jpg" alt={talent.name} style={styles.talentAvatar} />
              <div style={styles.talentInfo}>
                <div style={styles.talentName}>{talent.name}</div>
                <div style={styles.talentSubtitle}>{talent.subtitle}</div>
              </div>
            </div>
            <div style={styles.talentCell}>{talent.mood}</div>
            <div style={styles.talentCell}>{talent.dimension}</div>
            <div style={styles.talentCell}>{talent.sales}</div>
            <div style={styles.talentCell}>{talent.condition}</div>
            <div style={styles.talentCell}>
              <button style={styles.contactButton}>联系达人</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主组件
const AIAgent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('high'); // 'high', 'normal', 'low'

  // 统计数据
  const stats = [
    { label: '聊天中的达人数', value: '1367' },
    { label: '低成长达人数', value: '63' },
    { label: '匀速长达人数', value: '82' },
    { label: '高成长达人数', value: '82' },
    { label: '总计对话数', value: '83921' },
    { label: '全部达人数', value: '24351' }
  ];

  // 模拟达人数据
  const mockTalents = [
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    },
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    },
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    },
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    },
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    },
    {
      name: '萌叔',
      subtitle: '科技数码',
      mood: '近期直播被提起现不住，导致情绪低落，一度想放弃',
      dimension: '通过改视频测试啊，为还入产出更优质的需流量的视频',
      sales: '',
      condition: '通过改视频测试啊，为还入产出更优质的需流量的视频'
    }
  ];

  const handleEditAvatar = () => {
    const userId = getCurrentUserId();
    navigate(`/edit-avatar/${userId}`);
  };

  return (
    <div style={styles.container}>
      {/* 个人信息卡片 */}
      <ProfileCard onEditAvatar={handleEditAvatar} />

      {/* 统计数据区域 */}
      <StatsSection stats={stats} />

      {/* 达人列表区域 */}
      <div style={styles.talentSection}>
        {/* 标签页 */}
        <div style={styles.tabsContainer}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'high' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('high')}
          >
            高成长达人
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'normal' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('normal')}
          >
            匀速成长达人
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'low' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('low')}
          >
            低成长达人
          </button>
        </div>

        {/* 达人列表 */}
        <TalentList talents={mockTalents} activeTab={activeTab} />
      </div>
    </div>
  );
};

// 样式定义
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '8px 20px',
  },
  
  // 个人信息卡片
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  profileAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #f0f0f0',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  profileNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#666',
  },
  editAvatarButton: {
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    fontSize: '13px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  
  // 统计数据区域
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '20px',
  },
  statCard: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  
  // 达人列表区域
  talentSection: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
  },
  
  // 标签页
  tabsContainer: {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid #e5e5e5',
    marginBottom: '16px',
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#1890ff',
    borderBottom: '2px solid #1890ff',
  },
  
  // 达人表格
  talentListContainer: {
    overflow: 'hidden',
  },
  talentTable: {
    borderBottom: '1px solid #e5e5e5',
    overflow: 'hidden',
  },
  talentTableHeader: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 1fr 100px 1fr 120px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
  },
  talentHeaderCell: {
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  talentTableRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 1fr 100px 1fr 120px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  talentCell: {
    padding: '12px 8px',
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '72px',
    textAlign: 'center',
  },
  talentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '12px',
    border: '2px solid #f0f0f0',
  },
  talentInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
  talentName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  talentSubtitle: {
    fontSize: '11px',
    color: '#999',
  },
  contactButton: {
    backgroundColor: '#fff',
    border: '1px solid #1890ff',
    color: '#1890ff',
    padding: '6px 16px',
    fontSize: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
};

// 添加悬停效果
Object.assign(styles, {
  editAvatarButton: {
    ...styles.editAvatarButton,
    ':hover': {
      backgroundColor: '#40a9ff',
    }
  },
  tab: {
    ...styles.tab,
    ':hover': {
      color: '#1890ff',
    }
  },
  talentTableRow: {
    ...styles.talentTableRow,
    ':hover': {
      backgroundColor: '#f9fafb',
    }
  },
  contactButton: {
    ...styles.contactButton,
    ':hover': {
      backgroundColor: '#1890ff',
      color: '#fff',
    }
  },
});

export default AIAgent;