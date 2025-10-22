import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, Select, Input, Space } from 'antd';

type RouteParams = {
  projectId?: string;
};

type TabKey = 'mcn' | 'talent';

interface Project {
  id: string;
  name: string;
  target: string;
  coreHighlights: string[];
  contentRequirements: string[];
  pricing: string[];
  editLink: string;
}

interface McnItem {
  id: number;
  name: string;
  logo: string;
  matchRate: string;
  description: string;
  totalTalents: number;
  talentTypes: string;
  status: string;
  statusColor: string;
}

interface TalentItem {
  id: number;
  avatar: string;
  name: string;
  matchRate: string;
  fans: string;
  price: string;
  views: string;
  engagement: string;
  completion: string;
  expectedCPM: string;
  expectedCPE: string;
  audience: string;
  trend: string;
}

type DescriptionExpansionMap = Record<number, boolean>;

type ChatTargetType = 'mcn' | 'mcn_talent';

interface FilterState {
  dateRange: [string | null, string | null];
  platform: string[];
  fansMin: string;
  fansMax: string;
  industry: string[];
  contentTags: string[];
  dataDimension: string[];
  warningStatus: string[];
}

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ChatNavigationState {
  projectId: string;
  projectName: string;
  currentUserType: 'brand';
  targetUserId: string;
  targetUserType: ChatTargetType;
  targetUserName: string;
  targetUserAvatar: string;
  conversationType: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '8px 20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '14px',
    color: '#666',
  },
  backButton: {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    color: '#1890ff',
    marginBottom: '4px',
    transition: 'color 0.2s ease',
    textAlign: 'left',
    textDecoration: 'none',
    display: 'block',
    width: 'auto',
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px 16px 14px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
    textAlign: 'left',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px',
  },
  titleAndTarget: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    alignItems: 'flex-start',
  },
  projectTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
    textAlign: 'left',
  },
  editButton: {
    padding: '6px 14px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  projectContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  projectSection: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  projectRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
  },
  projectColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#1a1a1a',
    minWidth: '60px',
    textAlign: 'left',
  },
  sectionContent: {
    fontSize: '11px',
    color: '#666',
    lineHeight: 1.4,
  },
  bulletList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  bulletItem: {
    fontSize: '11px',
    color: '#666',
    lineHeight: 1.4,
    marginBottom: '4px',
    textAlign: 'left',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '8px 8px 0 0',
    padding: 0,
    marginBottom: 0,
    borderBottom: '1px solid #e5e5e5',
  },
  tabButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    backgroundColor: '#fff',
    color: '#1890ff',
    borderBottom: '2px solid #1890ff',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    borderBottom: '1px solid #e5e5e5',
  },
  batchActionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #e5e5e5',
  },
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#333',
  },
  selectAllText: {
    fontSize: '12px',
    fontWeight: 500,
  },
  batchInviteButton: {
    padding: '6px 16px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  batchInviteButtonDisabled: {
    backgroundColor: '#d9d9d9',
    cursor: 'not-allowed',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '50px 150px 80px 1fr 110px 130px 90px 90px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
  },
  talentTableHeader: {
    display: 'grid',
    gridTemplateColumns: '50px 120px 70px 90px 90px 90px 80px 80px 90px 90px 120px 90px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
  },
  headerCell: {
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '50px 150px 80px 1fr 110px 130px 90px 90px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  talentListItem: {
    display: 'grid',
    gridTemplateColumns: '50px 120px 70px 90px 90px 90px 80px 80px 90px 90px 120px 90px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  checkboxCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    minHeight: '48px',
  },
  mcnCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    gap: '6px',
    minHeight: '48px',
  },
  talentCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    gap: '6px',
    minHeight: '48px',
  },
  mcnName: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#333',
  },
  talentAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '8px',
    border: '1px solid #e5e5e5',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    minWidth: 0,
    overflow: 'hidden',
    minHeight: '48px',
  },
  matchRate: {
    fontSize: '12px',
    color: '#333',
    fontWeight: 600,
  },
  description: {
    fontSize: '11px',
    color: '#666',
    lineHeight: 1.4,
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    display: 'inline',
  },
  descriptionCollapsed: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  descriptionExpanded: {
    display: 'inline',
  },
  descriptionContainer: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    textAlign: 'left',
  },
  expandButton: {
    padding: '0 0 0 4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1890ff',
    fontSize: '10px',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s ease',
    display: 'inline',
    whiteSpace: 'nowrap',
  },
  talentCount: {
    fontSize: '12px',
    color: '#333',
    fontWeight: 500,
  },
  talentTypes: {
    fontSize: '11px',
    color: '#666',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  status: {
    fontSize: '11px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionButton: {
    padding: '5px 10px',
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'flex-end',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  filterLabel: {
    fontSize: '12px',
    color: '#333',
    fontWeight: 500,
  },
  filterSelect: {
    minWidth: '120px',
  },
  filterInput: {
    width: '80px',
  },
  fansRangeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>('mcn');
  const [project, setProject] = useState<Project | null>(null);
  const [mcnList, setMcnList] = useState<McnItem[]>([]);
  const [talentList, setTalentList] = useState<TalentItem[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<DescriptionExpansionMap>({});
  const [selectedMcnIds, setSelectedMcnIds] = useState<number[]>([]);
  const [selectedTalentIds, setSelectedTalentIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: [null, null],
    platform: [],
    fansMin: '',
    fansMax: '',
    industry: [],
    contentTags: [],
    dataDimension: [],
    warningStatus: [],
  });

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const projectData: Project = {
      id: projectId,
      name: '小米SU7 发布会',
      target: '科学小米汽车智能科技与品质价比，提升品牌美誉度与品牌转化',
      coreHighlights: [
        '高性价比机，手机王鼠标互联',
        '独家设计＆强劲性能',
        '小米全生态整合（车+家+AloT）',
        '同频品牌车型对比',
      ],
      contentRequirements: [
        '形式：视频/图文，30-60秒，真实场景演绎',
        '内容：科技感、美学化',
        '卖点：竞品对比、业界成存、数智运营',
      ],
      pricing: [
        'CPM：¥80-120/千次曝光',
        '垂类预测参考：¥8,000-12,000（10万预算案例）',
      ],
      editLink: '编辑活动信息',
    };

    const mcnData: McnItem[] = [
      {
        id: 1,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '沟通中',
        statusColor: '#52c41a',
      },
      {
        id: 2,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '待确认入驻',
        statusColor: '#fa8c16',
      },
      {
        id: 3,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '待确认需求',
        statusColor: '#fa8c16',
      },
      {
        id: 4,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '待确认人选',
        statusColor: '#fa8c16',
      },
      {
        id: 5,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '待确认奖项',
        statusColor: '#fa8c16',
      },
      {
        id: 6,
        name: '帝光MCN',
        logo: '🏢',
        matchRate: '90%',
        description: '介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍',
        totalTalents: 8923,
        talentTypes: '科技数码，养生，娱乐',
        status: '沟通中',
        statusColor: '#52c41a',
      },
    ];

    const talentData: TalentItem[] = [
      {
        id: 1,
        avatar: '/PLUSCO-LOGO.jpg',
        name: '科技达人张三',
        matchRate: '95%',
        fans: '125万',
        price: '5000元/条',
        views: '50万',
        engagement: '8.5%',
        completion: '75%',
        expectedCPM: '¥12',
        expectedCPE: '¥0.8',
        audience: '男性为主/25-35岁',
        trend: '上升',
      },
      {
        id: 2,
        avatar: '/PLUSCO-LOGO.jpg',
        name: '汽车测评李四',
        matchRate: '92%',
        fans: '89万',
        price: '4000元/条',
        views: '35万',
        engagement: '7.2%',
        completion: '68%',
        expectedCPM: '¥15',
        expectedCPE: '¥1.2',
        audience: '男性/30-40岁',
        trend: '稳定',
      },
      {
        id: 3,
        avatar: '/PLUSCO-LOGO.jpg',
        name: '数码玩家王五',
        matchRate: '88%',
        fans: '56万',
        price: '3000元/条',
        views: '28万',
        engagement: '9.1%',
        completion: '72%',
        expectedCPM: '¥10',
        expectedCPE: '¥0.6',
        audience: '男性/20-30岁',
        trend: '上升',
      },
      {
        id: 4,
        avatar: '/PLUSCO-LOGO.jpg',
        name: '极客小赵',
        matchRate: '90%',
        fans: '78万',
        price: '3500元/条',
        views: '42万',
        engagement: '6.8%',
        completion: '65%',
        expectedCPM: '¥13',
        expectedCPE: '¥0.9',
        audience: '男女均衡/25-35岁',
        trend: '下降',
      },
    ];

    setProject(projectData);
    setMcnList(mcnData);
    setTalentList(talentData);
  }, [projectId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditCampaign = () => {
    if (!projectId || !project) {
      return;
    }
    navigate(`/marketing-campaign/${projectId}`, {
      state: {
        projectData: project,
        mode: 'edit',
      },
    });
  };

  const handleCommunicate = (item: McnItem | TalentItem) => {
    if (!project) {
      return;
    }

    const chatData: ChatNavigationState = {
      projectId: project.id,
      projectName: project.name,
      currentUserType: 'brand',
      targetUserId: String(item.id),
      targetUserType: activeTab === 'mcn' ? 'mcn' : 'mcn_talent',
      targetUserName: item.name,
      targetUserAvatar: '/PLUSCO-LOGO.jpg',
      conversationType: 'project_negotiation',
    };

    navigate('/chat/new', { state: chatData });
  };

  const toggleDescription = (itemId: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleMcnSelect = (mcnId: number) => {
    setSelectedMcnIds((prev) =>
      prev.includes(mcnId) ? prev.filter((id) => id !== mcnId) : [...prev, mcnId],
    );
  };

  const handleSelectAllMcn = () => {
    if (selectedMcnIds.length === mcnList.length) {
      setSelectedMcnIds([]);
    } else {
      setSelectedMcnIds(mcnList.map((mcn) => mcn.id));
    }
  };

  const handleTalentSelect = (talentId: number) => {
    setSelectedTalentIds((prev) =>
      prev.includes(talentId) ? prev.filter((id) => id !== talentId) : [...prev, talentId],
    );
  };

  const handleSelectAllTalent = () => {
    if (selectedTalentIds.length === talentList.length) {
      setSelectedTalentIds([]);
    } else {
      setSelectedTalentIds(talentList.map((talent) => talent.id));
    }
  };

  const handleBatchInvite = () => {
    const selectedIds = activeTab === 'mcn' ? selectedMcnIds : selectedTalentIds;
    const selectedItems =
      activeTab === 'mcn'
        ? mcnList.filter((mcn) => selectedIds.includes(mcn.id))
        : talentList.filter((talent) => selectedIds.includes(talent.id));

    if (selectedIds.length === 0) {
      window.alert('请先选择要邀约的对象');
      return;
    }

    console.log('批量发起邀约:', selectedItems);
    window.alert(`已向 ${selectedIds.length} 个${activeTab === 'mcn' ? 'MCN' : '达人'}发起邀约`);

    if (activeTab === 'mcn') {
      setSelectedMcnIds([]);
    } else {
      setSelectedTalentIds([]);
    }
  };

  if (!project) {
    return <div style={styles.loading}>加载中...</div>;
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderFilterBar = () => (
    <div style={styles.filterContainer}>
      <div style={styles.filterRow}>
        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>时间范围</div>
          <RangePicker
            size="small"
            placeholder={['开始日期', '结束日期']}
            onChange={(dates, dateStrings) => handleFilterChange('dateRange', dateStrings)}
          />
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>平台选择</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择平台"
            style={styles.filterSelect}
            value={filters.platform}
            onChange={(value) => handleFilterChange('platform', value)}
          >
            <Option value="douyin">抖音</Option>
            <Option value="xiaohongshu">小红书</Option>
            <Option value="weibo">微博</Option>
            <Option value="bilibili">哔哩哔哩</Option>
            <Option value="kuaishou">快手</Option>
          </Select>
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>粉丝量级</div>
          <div style={styles.fansRangeContainer}>
            <Input
              size="small"
              placeholder="最小值"
              style={styles.filterInput}
              value={filters.fansMin}
              onChange={(e) => handleFilterChange('fansMin', e.target.value)}
              suffix="万"
            />
            <span>-</span>
            <Input
              size="small"
              placeholder="最大值"
              style={styles.filterInput}
              value={filters.fansMax}
              onChange={(e) => handleFilterChange('fansMax', e.target.value)}
              suffix="万"
            />
          </div>
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>商单行业</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择行业"
            style={styles.filterSelect}
            value={filters.industry}
            onChange={(value) => handleFilterChange('industry', value)}
          >
            <Option value="tech">科技数码</Option>
            <Option value="auto">汽车</Option>
            <Option value="fashion">时尚美妆</Option>
            <Option value="food">美食</Option>
            <Option value="travel">旅游</Option>
            <Option value="health">健康养生</Option>
          </Select>
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>内容标签</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择标签"
            style={styles.filterSelect}
            value={filters.contentTags}
            onChange={(value) => handleFilterChange('contentTags', value)}
          >
            <Option value="review">评测</Option>
            <Option value="unbox">开箱</Option>
            <Option value="tutorial">教程</Option>
            <Option value="comparison">对比</Option>
            <Option value="lifestyle">生活方式</Option>
          </Select>
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>数据维度</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择维度"
            style={styles.filterSelect}
            value={filters.dataDimension}
            onChange={(value) => handleFilterChange('dataDimension', value)}
          >
            <Option value="views">播放量</Option>
            <Option value="engagement">互动率</Option>
            <Option value="completion">完播率</Option>
            <Option value="cpm">CPM</Option>
            <Option value="cpe">CPE</Option>
          </Select>
        </div>

        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>预警状态</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择状态"
            style={styles.filterSelect}
            value={filters.warningStatus}
            onChange={(value) => handleFilterChange('warningStatus', value)}
          >
            <Option value="normal">正常</Option>
            <Option value="warning">预警</Option>
            <Option value="danger">危险</Option>
            <Option value="monitoring">监控中</Option>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTabSwitcher = () => (
    <div style={styles.tabContainer}>
      <button
        type="button"
        style={{
          ...styles.tabButton,
          ...(activeTab === 'mcn' ? styles.activeTab : {}),
        }}
        onClick={() => setActiveTab('mcn')}
      >
        MCN(99)
      </button>
      <button
        type="button"
        style={{
          ...styles.tabButton,
          ...(activeTab === 'talent' ? styles.activeTab : {}),
        }}
        onClick={() => setActiveTab('talent')}
      >
        达人(373)
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.projectCard}>
        <button type="button" style={styles.backButton} onClick={handleBack}>
          ← 返回
        </button>

        <div style={styles.projectHeader}>
          <div style={styles.titleAndTarget}>
            <h1 style={styles.projectTitle}>{project.name}</h1>
            <div style={styles.projectSection}>
              <div style={styles.sectionTitle}>目标：</div>
              <div style={styles.sectionContent}>{project.target}</div>
            </div>
          </div>
          <button type="button" style={styles.editButton} onClick={handleEditCampaign}>
            {project.editLink}
          </button>
        </div>

        <div style={styles.projectContent}>
          <div style={styles.projectRow}>
            <div style={styles.projectColumn}>
              <div style={styles.sectionTitle}>产品核心卖点</div>
              <ul style={styles.bulletList}>
                {project.coreHighlights.map((item, index) => (
                  <li key={item} style={styles.bulletItem}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.projectColumn}>
              <div style={styles.sectionTitle}>内容要求：</div>
              <ul style={styles.bulletList}>
                {project.contentRequirements.map((item) => (
                  <li key={item} style={styles.bulletItem}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.projectColumn}>
              <div style={styles.sectionTitle}>合作价格：</div>
              <ul style={styles.bulletList}>
                {project.pricing.map((item) => (
                  <li key={item} style={styles.bulletItem}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {renderFilterBar()}

      {activeTab === 'mcn' && (
        <div style={styles.listContainer}>
          {renderTabSwitcher()}

          <div style={styles.batchActionBar}>
            <label style={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectedMcnIds.length === mcnList.length && mcnList.length > 0}
                onChange={handleSelectAllMcn}
                style={styles.checkbox}
              />
              <span style={styles.selectAllText}>全选</span>
            </label>
            <button
              type="button"
              style={{
                ...styles.batchInviteButton,
                ...(selectedMcnIds.length === 0 ? styles.batchInviteButtonDisabled : {}),
              }}
              onClick={handleBatchInvite}
              disabled={selectedMcnIds.length === 0}
            >
              发起邀约 ({selectedMcnIds.length})
            </button>
          </div>

          <div style={styles.tableHeader}>
            <div style={styles.headerCell}>选择</div>
            <div style={styles.headerCell}>MCN</div>
            <div style={styles.headerCell}>匹配度</div>
            <div style={styles.headerCell}>MCN简介</div>
            <div style={styles.headerCell}>合作的达人数</div>
            <div style={styles.headerCell}>达人类型</div>
            <div style={styles.headerCell}>状态</div>
            <div style={styles.headerCell}>操作</div>
          </div>

          {mcnList.map((mcn) => (
            <div key={mcn.id} style={styles.listItem}>
              <div style={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectedMcnIds.includes(mcn.id)}
                  onChange={() => handleMcnSelect(mcn.id)}
                  style={styles.checkbox}
                />
              </div>

              <div style={styles.mcnCell}>
                <div style={styles.mcnName}>{mcn.name}</div>
              </div>

              <div style={styles.cell}>
                <span style={styles.matchRate}>{mcn.matchRate}</span>
              </div>

              <div style={styles.cell}>
                <div style={styles.descriptionContainer}>
                  <span
                    style={{
                      ...styles.description,
                      ...(expandedDescriptions[mcn.id]
                        ? styles.descriptionExpanded
                        : styles.descriptionCollapsed),
                    }}
                  >
                    {mcn.description}
                  </span>
                  {mcn.description.length > 30 && (
                    <button
                      type="button"
                      style={styles.expandButton}
                      onClick={() => toggleDescription(mcn.id)}
                    >
                      {expandedDescriptions[mcn.id] ? '收起' : '展开'}
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{mcn.totalTalents}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentTypes}>{mcn.talentTypes}</span>
              </div>

              <div style={styles.cell}>
                <span
                  style={{
                    ...styles.status,
                    color: mcn.statusColor,
                  }}
                >
                  ● {mcn.status}
                </span>
              </div>

              <div style={styles.cell}>
                <button
                  type="button"
                  style={styles.actionButton}
                  onClick={() => handleCommunicate(mcn)}
                >
                  沟通
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'talent' && (
        <div style={styles.listContainer}>
          {renderTabSwitcher()}

          <div style={styles.batchActionBar}>
            <label style={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectedTalentIds.length === talentList.length && talentList.length > 0}
                onChange={handleSelectAllTalent}
                style={styles.checkbox}
              />
              <span style={styles.selectAllText}>全选</span>
            </label>
            <button
              type="button"
              style={{
                ...styles.batchInviteButton,
                ...(selectedTalentIds.length === 0 ? styles.batchInviteButtonDisabled : {}),
              }}
              onClick={handleBatchInvite}
              disabled={selectedTalentIds.length === 0}
            >
              发起邀约 ({selectedTalentIds.length})
            </button>
          </div>

          <div style={styles.talentTableHeader}>
            <div style={styles.headerCell}>选择</div>
            <div style={styles.headerCell}>达人</div>
            <div style={styles.headerCell}>匹配度</div>
            <div style={styles.headerCell}>粉丝总量</div>
            <div style={styles.headerCell}>报价</div>
            <div style={styles.headerCell}>播放量</div>
            <div style={styles.headerCell}>互动率</div>
            <div style={styles.headerCell}>完播率</div>
            <div style={styles.headerCell}>预期CPM</div>
            <div style={styles.headerCell}>预期CPE</div>
            <div style={styles.headerCell}>观众画像</div>
            <div style={styles.headerCell}>操作</div>
          </div>

          {talentList.map((talent) => (
            <div key={talent.id} style={styles.talentListItem}>
              <div style={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectedTalentIds.includes(talent.id)}
                  onChange={() => handleTalentSelect(talent.id)}
                  style={styles.checkbox}
                />
              </div>

              <div style={styles.talentCell}>
                <img src={talent.avatar} alt={talent.name} style={styles.talentAvatar} />
                <div style={styles.mcnName}>{talent.name}</div>
              </div>

              <div style={styles.cell}>
                <span style={styles.matchRate}>{talent.matchRate}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{talent.fans}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{talent.price}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{talent.views}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.matchRate}>{talent.engagement}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.matchRate}>{talent.completion}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{talent.expectedCPM}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentCount}>{talent.expectedCPE}</span>
              </div>

              <div style={styles.cell}>
                <span style={styles.talentTypes}>{talent.audience}</span>
              </div>

              <div style={styles.cell}>
                <button
                  type="button"
                  style={styles.actionButton}
                  onClick={() => handleCommunicate(talent)}
                >
                  沟通
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
