import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type RoleType = 'mcn_talent' | 'brand' | 'mcn';
type QuoteType = 'CPM' | 'CPC' | 'CPA';
type ProjectStatus = 'accepted' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
type TimeRange = '7days' | '30days' | '3months';
type OrderPublishRange = 'all' | 'within_15_days' | 'within_30_days' | 'within_60_days';
type ProgressStage = 'all' | '0_25' | '25_50' | '50_75' | '75_100' | 'completed';

interface TalentRoleInfo {
  title: string;
  id: string;
  description: string;
  categories: Array<{ title: string; content: string }>;
}

interface BrandRoleInfo {
  title: string;
  stats: {
    followers: string;
    creators: string;
  };
  categories: Array<{ title: string; tags: string[] }>;
  bottomCategories: Array<{ title: string; tags: string[] }>;
}

interface McnRoleInfo {
  title: string;
  subtitle?: string;
  description: string;
  stats: {
    followers: string;
    creators: string;
  };
}

type RoleInfoMap = {
  mcn_talent: TalentRoleInfo;
  brand: BrandRoleInfo;
  mcn: McnRoleInfo;
};

interface ProjectBrand {
  name: string;
  logo: string;
  industry: string;
}

interface ProjectData {
  id: string;
  brand: ProjectBrand;
  product: string;
  quoteType: QuoteType;
  budget: number;
  orderTime: string;
  publishTime: string;
  bloggerCount: number;
  status: ProjectStatus;
  progress?: number;
  tags: string[];
  contactPerson: string;
  createdAt: string;
  activityName?: string;
  bloggerRequirement?: string;
}

interface ProjectFilters {
  role: RoleType;
  brand: string;
  status: ProjectStatus | 'all';
  timeRange: TimeRange;
  orderTimeRange: OrderPublishRange;
  publishTimeRange: OrderPublishRange;
  progressStage: ProgressStage;
  quoteType: QuoteType | 'all';
  searchTerm: string;
  page: number;
  pageSize: number;
}

interface LoadingState {
  projects: boolean;
  brands: boolean;
}

interface RoleInfoCardProps {
  role: RoleType;
}

type FilterChangeHandler = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => void;

type ProjectAction = 'contact' | 'detail' | 'viewDocument';

interface FilterBarProps {
  filters: ProjectFilters;
  brands: string[];
  loading: LoadingState;
  onFilterChange: FilterChangeHandler;
  onReset: () => void;
  selectedRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onCreateCampaign: () => void;
  onSearch?: () => void;
  onAIDataAnalysis: () => void;
}

interface ProjectTableProps {
  projects: ProjectData[];
  loading: boolean;
  onAction: (action: ProjectAction, project: ProjectData) => void;
  role: RoleType;
}

interface TableConfig {
  headers: string[];
  actions: ProjectAction[];
}

const createDefaultFilters = (role: RoleType): ProjectFilters => ({
  role,
  brand: 'all',
  status: 'all',
  timeRange: '30days',
  orderTimeRange: 'all',
  publishTimeRange: 'all',
  progressStage: 'all',
  quoteType: 'all',
  searchTerm: '',
  page: 1,
  pageSize: 10,
});

interface CommercialStats {
  totalBrands: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  avgProjectCycle: number;
  trends: {
    totalBrands: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    avgProjectCycle: number;
  };
}

interface CommercialProjectsResponse {
  projects: ProjectData[];
  total: number;
  page: number;
  pageSize: number;
}

interface CommercialApiService {
  getStats: () => Promise<CommercialStats>;
  getProjects: (filters: ProjectFilters) => Promise<CommercialProjectsResponse>;
  getBrands: () => Promise<string[]>;
}

// 角色信息卡片组件
const RoleInfoCard: React.FC<RoleInfoCardProps> = ({ role }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const roleInfo: RoleInfoMap = {
    'mcn_talent': {
      title: 'test',
      id: 'ID 12134234',
      description: '大牌名人',
      categories: [
        {
          title: '报价',
          content: '10w/贴吧 5000/图文'
        },
        {
          title: '排期',
          content: '9月20号以后有时间'
        },
        {
          title: '期望合作品类',
          content: '科技类、营养类、如美手术'
        },
        {
          title: '拍摄登好',
          content: '首次自己出场求来自的微信拍摄'
        }
      ]
    },
    'brand': {
      title: '小米',
      stats: {
        followers: '10.3亿',
        creators: '592'
      },
      categories: [
        {
          title: '主营品类',
          tags: ['3C数码家电', '二手商品']
        },
        {
          title: '主要带货方式',
          tags: ['商品卡链接']
        },
        {
          title: '主要受众',
          tags: ['男', '31-40', '广东']
        }
      ],
      bottomCategories: [
        {
          title: '主要发货地',
          tags: ['广东', '广东省']
        },
        {
          title: '商品好评率',
          tags: ['95.35%']
        },
        {
          title: '国别',
          tags: ['美国']
        }
      ]
    },
    'mcn': {
      title: '无忧传媒',
      subtitle: '北京无忧传媒传媒有限公司',
      description: '简介：无忧传媒成立于北京顺义，2017-2018年在杭州、成都、广州、上海、重庆、长沙、武汉、合肥、海南、香港等50城建立分公司或办事处。五年来公司规模迅速扩大，签约领域内容博主超300位，短视频内容博主超1000位，涵盖汽车、美妆、母婴、美食、宠物、时尚搭配、穿搭、旅行等垂直领域。分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析分析',
      stats: {
        followers: '10.3亿',
        creators: '592'
      }
    },
  };

  if (role === 'brand') {
    const info = roleInfo[role];
    return (
      <div style={styles.roleInfoCard}>
        <div style={styles.brandHeader}>
          <div style={styles.brandTitleSection}>
            <img 
              src="/PLUSCO-LOGO.jpg" 
              alt="Brand Logo" 
              style={styles.brandLogo}
            />
            <div style={styles.brandTitleInfo}>
              <h3 style={styles.brandTitle}>{info.title}</h3>
            </div>
          </div>
        </div>
        
        {/* 第一行分类信息 */}
        <div style={styles.mcnCategoriesRow}>
          {info.categories.map((category, index) => (
            <div key={index} style={styles.mcnCategory}>
              <span style={styles.mcnCategoryTitle}>{category.title}</span>
              <div style={styles.mcnTagsContainer}>
                {category.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} style={styles.mcnTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 第二行分类信息 */}
        <div style={styles.mcnCategoriesRow}>
          {info.bottomCategories.map((category, index) => (
            <div key={index} style={styles.mcnCategory}>
              <span style={styles.mcnCategoryTitle}>{category.title}</span>
              <div style={styles.mcnTagsContainer}>
                {category.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} style={styles.mcnTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MCN机构使用特殊布局（无忧传媒样式）
  if (role === 'mcn') {
    const info = roleInfo[role];
    return (
      <div style={styles.roleInfoCard}>
        <div style={styles.brandHeader}>
          <div style={styles.brandTitleSection}>
            <img 
              src="/PLUSCO-LOGO.jpg" 
              alt="MCN Logo" 
              style={styles.brandLogo}
            />
            <div style={styles.brandTitleInfo}>
              <h3 style={styles.brandTitle}>{info.title}</h3>
              {info.subtitle && <p style={styles.brandSubtitle}>{info.subtitle}</p>}
            </div>
          </div>
          <div style={styles.brandStats}>
            <div style={styles.brandStatItem}>
              <span style={styles.brandStatLabel}>粉丝数</span>
              <span style={styles.brandStatValue}>{info.stats.followers}</span>
            </div>
            <div style={styles.brandStatItem}>
              <span style={styles.brandStatLabel}>签约人数</span>
              <span style={styles.brandStatValue}>{info.stats.creators}</span>
            </div>
          </div>
        </div>
        <div style={styles.brandDescription}>
          <p style={styles.brandDescriptionText}>{info.description}</p>
        </div>
      </div>
    );
  }

  // MCN达人使用特殊布局
  if (role === 'mcn_talent') {
    const info = roleInfo[role];
    return (
      <div style={styles.roleInfoCard}>
        <div style={styles.talentHorizontalLayout}>
          {/* 左侧：头像和基本信息 */}
          <div style={styles.talentBasicInfo}>
            <img 
              src="/PLUSCO-LOGO.jpg" 
              alt="Talent Avatar" 
              style={styles.talentAvatar}
            />
            <div style={styles.talentInfo}>
              <div style={styles.talentNameRow}>
                <h3 style={styles.talentName}>{info.title}</h3>
                <span style={styles.talentId}>{info.id}</span>
              </div>
              <p style={styles.talentDescription}>{info.description}</p>
            </div>
          </div>
          
          {/* 中间：业务信息 */}
          <div style={styles.talentBusinessInfo}>
            {info.categories.map((category, index) => (
              <div key={index} style={styles.talentBusinessItem}>
                <span style={styles.talentDetailLabel}>{category.title}</span>
                <span style={styles.talentDetailContent}>{category.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div style={styles.roleInfoCard}>角色信息加载中...</div>;
};

// 筛选组件
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  brands,
  loading,
  onFilterChange,
  onReset,
  selectedRole,
  onRoleChange,
  onCreateCampaign,
  onSearch,
  onAIDataAnalysis,
}) => {
  const [searchInput, setSearchInput] = useState<string>(filters.searchTerm || '');

  useEffect(() => {
    setSearchInput(filters.searchTerm || '');
  }, [filters.searchTerm]);

  const handleSearchClick = () => {
    const value = searchInput.trim();
    onFilterChange('searchTerm', value);
    if (onSearch) {
      onSearch();
    }
  };

  const handleReset = () => {
    setSearchInput('');
    onReset();
  };

  const isBrandRole = selectedRole === 'brand';
  const isMCNTalentRole = selectedRole === 'mcn_talent';

  return (
    <div style={styles.filterSection}>
      <div style={styles.filterRow}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>用户角色</label>
          <select 
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as RoleType)}
            style={styles.filterSelect}
          >
            <option value="mcn_talent">MCN达人</option>
            <option value="brand">品牌方</option>
            <option value="mcn">MCN机构</option>
          </select>
        </div>

        {isBrandRole ? (
          <>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计下单时间</label>
              <select
                value={filters.orderTimeRange}
                onChange={(e) => onFilterChange('orderTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计发布时间</label>
              <select
                value={filters.publishTimeRange}
                onChange={(e) => onFilterChange('publishTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>进度</label>
              <select
                value={filters.progressStage}
                onChange={(e) => onFilterChange('progressStage', e.target.value as ProgressStage)}
                style={styles.filterSelect}
              >
                <option value="all">全部进度</option>
                <option value="0_25">0-25%</option>
                <option value="25_50">25-50%</option>
                <option value="50_75">50-75%</option>
                <option value="75_100">75-100%</option>
                <option value="completed">已完成</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>报价形式</label>
              <select
                value={filters.quoteType}
                onChange={(e) => onFilterChange('quoteType', e.target.value as ProjectFilters['quoteType'])}
                style={styles.filterSelect}
              >
                <option value="all">全部类型</option>
                <option value="CPM">CPM</option>
                <option value="CPC">CPC</option>
                <option value="CPA">CPA</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>活动/产品搜索</label>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
                placeholder="输入活动名或产品名"
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterActions}>
              <button type="button" style={styles.resetButton} onClick={handleReset}>
                重置
              </button>
              <button type="button" style={styles.searchButton} onClick={handleSearchClick}>
                搜索
              </button>
              <button 
                type="button"
                style={styles.campaignButton}
                onClick={onCreateCampaign}
              >
                添加营销活动
              </button>
              <button 
                type="button"
                style={styles.aiAnalysisButton}
                onClick={onAIDataAnalysis}
              >
                AI数据分析
              </button>
            </div>
          </>
        ) : isMCNTalentRole ? (
          <>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>品牌</label>
              <select 
                value={filters.brand}
                onChange={(e) => onFilterChange('brand', e.target.value)}
                style={styles.filterSelect}
                disabled={loading.brands}
              >
                <option value="all">全部品牌</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计下单时间</label>
              <select
                value={filters.orderTimeRange}
                onChange={(e) => onFilterChange('orderTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计发布时间</label>
              <select
                value={filters.publishTimeRange}
                onChange={(e) => onFilterChange('publishTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>报价形式</label>
              <select
                value={filters.quoteType}
                onChange={(e) => onFilterChange('quoteType', e.target.value as ProjectFilters['quoteType'])}
                style={styles.filterSelect}
              >
                <option value="all">全部类型</option>
                <option value="CPM">CPM</option>
                <option value="CPC">CPC</option>
                <option value="CPA">CPA</option>
              </select>
            </div>

            <div style={styles.filterActions}>
              <button type="button" style={styles.resetButton} onClick={handleReset}>
                重置
              </button>
              <button 
                type="button"
                style={styles.searchButton} 
                onClick={() => {
                  if (onSearch) {
                    onSearch();
                  }
                }}
              >
                搜索
              </button>
              <button 
                type="button"
                style={styles.aiAnalysisButton}
                onClick={onAIDataAnalysis}
              >
                AI数据分析
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>品牌</label>
              <select 
                value={filters.brand}
                onChange={(e) => onFilterChange('brand', e.target.value)}
                style={styles.filterSelect}
                disabled={loading.brands}
              >
                <option value="all">全部品牌</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计下单时间</label>
              <select
                value={filters.orderTimeRange}
                onChange={(e) => onFilterChange('orderTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>预计发布时间</label>
              <select
                value={filters.publishTimeRange}
                onChange={(e) => onFilterChange('publishTimeRange', e.target.value as OrderPublishRange)}
                style={styles.filterSelect}
              >
                <option value="all">全部时间</option>
                <option value="within_15_days">15天内</option>
                <option value="within_30_days">30天内</option>
                <option value="within_60_days">60天内</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>报价形式</label>
              <select
                value={filters.quoteType}
                onChange={(e) => onFilterChange('quoteType', e.target.value as ProjectFilters['quoteType'])}
                style={styles.filterSelect}
              >
                <option value="all">全部类型</option>
                <option value="CPM">CPM</option>
                <option value="CPC">CPC</option>
                <option value="CPA">CPA</option>
              </select>
            </div>
            
            <div style={styles.filterActions}>
              <button type="button" style={styles.resetButton} onClick={handleReset}>
                重置
              </button>
              <button 
                type="button"
                style={styles.searchButton}
                onClick={() => {
                  if (onSearch) {
                    onSearch();
                  }
                }}
              >
                搜索
              </button>
              <button 
                type="button"
                style={styles.aiAnalysisButton}
                onClick={onAIDataAnalysis}
              >
                AI数据分析
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 项目表格组件
const ProjectTable: React.FC<ProjectTableProps> = ({ projects, loading, onAction, role }) => {
  const getTableConfig = (currentRole: RoleType): TableConfig => {
    switch (currentRole) {
      case 'mcn_talent':
        return {
          headers: ['品牌名称', '产品', '需求文档', '报价形式', '预计下单时间', '预计发布时间', '预算', '操作'],
          actions: ['contact']
        };
      case 'mcn':
        return {
          headers: ['品牌名称', '产品', '报价形式', '预算', '预计下单时间', '预计发布时间', '需求博主数', '状态', '操作'],
          actions: ['contact', 'detail']
        };
      case 'brand':
        return {
          headers: ['活动名称', '产品', '报价形式', '预计下单时间', '预计发布时间', '博主数', '博主要求', '进度', '操作'],
          actions: ['detail']
        };
      default:
        return {
          headers: ['品牌名称', '产品', '报价形式', '预算', '预计下单时间', '预计发布时间', '需求博主数', '状态', '操作'],
          actions: ['contact', 'detail']
        };
    }
  };

  const tableConfig = getTableConfig(role);

  const getGridTemplateColumns = (currentRole: RoleType): string => {
    switch (currentRole) {
      case 'mcn_talent':
        return '1fr 0.8fr 1.5fr 0.7fr 1fr 1fr 0.7fr 0.6fr';
      case 'mcn':
        return '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.8fr 1fr';
      case 'brand':
        return '1.2fr 1fr 0.8fr 1fr 1fr 0.8fr 1fr 0.8fr 0.8fr';
      default:
        return '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.8fr 1fr';
    }
  };

  const gridColumns = getGridTemplateColumns(role);

  const renderTableRow = (
    project: ProjectData,
    currentRole: RoleType,
    actionHandler: ProjectTableProps['onAction']
  ) => {
    const statusConfig = utils.getStatusConfig(project.status);
    const progressValue = project.progress ?? 0;

    const commonCells = {
      brandName: (
        <div style={styles.tableCell}>
          <div style={styles.brandName}>{project.brand.name}</div>
        </div>
      ),
      product: (
        <div style={styles.tableCell}>
          <span style={styles.productText}>{project.product}</span>
        </div>
      ),
      quoteType: (
        <div style={styles.tableCell}>
          <span style={styles.quoteType}>{project.quoteType}</span>
        </div>
      ),
      budget: (
        <div style={styles.tableCell}>
          <span style={styles.budget}>{utils.formatCurrency(project.budget)}</span>
        </div>
      ),
      orderTime: (
        <div style={styles.tableCell}>{utils.formatDate(project.orderTime)}</div>
      ),
      publishTime: (
        <div style={styles.tableCell}>{utils.formatDate(project.publishTime)}</div>
      ),
      bloggerCount: (
        <div style={styles.tableCell}>
          <span style={styles.bloggerCount}>{project.bloggerCount}人</span>
        </div>
      ),
      status: (
        <div style={styles.tableCell}>
          <div style={styles.statusCell}>
            <div style={styles.statusIndicatorContainer}>
              <div
                style={{
                  ...styles.statusIndicator,
                  backgroundColor: statusConfig.color
                }}
              />
              <span
                style={{
                  ...styles.statusText,
                  color: statusConfig.color
                }}
              >
                {statusConfig.text}
              </span>
            </div>
          </div>
        </div>
      ),
      progress: (
        <div style={styles.tableCell}>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressValue}%`,
                  backgroundColor: statusConfig.color
                }}
              />
            </div>
            <span style={styles.progressText}>{progressValue}%</span>
          </div>
        </div>
      )
    };

    switch (currentRole) {
      case 'mcn_talent':
        return (
          <>
            {commonCells.brandName}
            {commonCells.product}
            <div style={styles.tableCell}>
              <button
                type="button"
                style={styles.linkButton}
                onClick={() => actionHandler('viewDocument', project)}
              >
                https://docs.plusco.com/campaign/xiaomi-product-launch-2024-Q3-detailed-requirements.pdf
              </button>
            </div>
            {commonCells.quoteType}
            {commonCells.orderTime}
            {commonCells.publishTime}
            {commonCells.budget}
            <div style={styles.tableCell}>
              <button
                style={styles.actionButton}
                onClick={() => actionHandler('contact', project)}
              >
                沟通
              </button>
            </div>
          </>
        );
      case 'mcn':
        return (
          <>
            {commonCells.brandName}
            {commonCells.product}
            {commonCells.quoteType}
            {commonCells.budget}
            {commonCells.orderTime}
            {commonCells.publishTime}
            {commonCells.bloggerCount}
            {commonCells.status}
            <div style={styles.tableCell}>
              <div style={styles.actionCell}>
                <button
                  style={styles.actionButton}
                  onClick={() => actionHandler('contact', project)}
                >
                  💬 沟通
                </button>
                <button
                  style={styles.actionButton}
                  onClick={() => actionHandler('detail', project)}
                >
                  详情
                </button>
              </div>
            </div>
          </>
        );
      case 'brand':
        return (
          <>
            <div style={styles.tableCell}>
              <span style={styles.projectName}>
                {project.activityName || `${project.product}推广活动`}
              </span>
            </div>
            {commonCells.product}
            {commonCells.quoteType}
            {commonCells.orderTime}
            {commonCells.publishTime}
            {commonCells.bloggerCount}
            <div style={styles.tableCell}>
              <span style={styles.requirement}>
                {project.bloggerRequirement || '粉丝量10W+，垂直领域'}
              </span>
            </div>
            {commonCells.progress}
            <div style={styles.tableCell}>
              <div style={styles.actionCell}>
                <button
                  style={styles.actionButton}
                  onClick={() => actionHandler('detail', project)}
                >
                  详情
                </button>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            {commonCells.brandName}
            {commonCells.product}
            {commonCells.quoteType}
            {commonCells.budget}
            {commonCells.orderTime}
            {commonCells.publishTime}
            {commonCells.bloggerCount}
            {commonCells.status}
            <div style={styles.tableCell}>
              <div style={styles.actionCell}>
                <button
                  style={styles.actionButton}
                  onClick={() => actionHandler('contact', project)}
                >
                  💬 沟通
                </button>
                <button
                  style={styles.actionButton}
                  onClick={() => actionHandler('detail', project)}
                >
                  详情
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.skeletonTable}>
          {[...Array(5)].map((_, index) => (
            <div key={index} style={styles.skeletonRow}>
              {[...Array(9)].map((_, colIndex) => (
                <div key={colIndex} style={styles.skeletonCell}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📊</div>
        <h4 style={styles.emptyTitle}>暂无项目数据</h4>
        <p style={styles.emptyDescription}>当前筛选条件下没有找到匹配的项目</p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <div style={{ ...styles.tableHeaderRow, gridTemplateColumns: gridColumns }}>
        {tableConfig.headers.map((header, index) => (
          <div key={header} style={styles.tableHeaderCell}>
            {header}
          </div>
        ))}
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          style={{ ...styles.tableRow, gridTemplateColumns: gridColumns }}
        >
          {renderTableRow(project, role, onAction)}
        </div>
      ))}
    </div>
  );
};

// 主组件
const CommercialDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleType>('mcn');
  const [loading, setLoading] = useState<LoadingState>({ projects: true, brands: true });
  const [filters, setFilters] = useState<ProjectFilters>(createDefaultFilters('mcn'));

  const fetchProjects = useCallback(async (currentFilters: ProjectFilters) => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const projectsData = await commercialApiService.getProjects(currentFilters);
      setProjects(projectsData.projects);
    } catch (error) {
      console.error('获取项目列表失败:', error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await commercialApiService.getStats();
      console.log('Statistics loaded:', statsData);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const brandsData = await commercialApiService.getBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('获取品牌列表失败:', error);
    } finally {
      setLoading((prev) => ({ ...prev, brands: false }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBrands();
  }, [fetchStats, fetchBrands]);

  useEffect(() => {
    fetchProjects(filters);
  }, [filters, fetchProjects]);

  const handleFilterChange: FilterChangeHandler = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(createDefaultFilters(selectedRole));
  };

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setFilters(createDefaultFilters(role));
  };

  const handleCreateCampaign = useCallback(() => {
    navigate('/commercial/marketing-campaign');
  }, [navigate]);

  const handleAIDataAnalysis = useCallback(() => {
    navigate('/data-analytics/ai-chat');
  }, [navigate]);

  const handleAction = (action: ProjectAction, project: ProjectData) => {
    console.log(`${action} action for:`, project);
    switch (action) {
      case 'contact': {
        const chatData = {
          projectId: project.id,
          projectName: `${project.product} 推广项目`,
          currentUserType: selectedRole,
          targetUserId: selectedRole === 'brand' ? 'mcn_001' : 'brand_001',
          targetUserType: selectedRole === 'brand' ? 'mcn' : 'brand',
          targetUserName: selectedRole === 'brand' ? '合作MCN' : project.brand.name,
          targetUserAvatar: '/PLUSCO-LOGO.jpg',
          conversationType: 'project_discussion',
        };
        navigate('/chat/new', { state: chatData });
        break;
      }
      case 'detail':
        if (selectedRole === 'brand') {
          navigate(`/commercial/project/${project.id}`);
        } else {
          alert(`查看 ${project.product} 的详细信息`);
        }
        break;
      case 'viewDocument':
        window.open('https://docs.plusco.com/campaign/xiaomi-product-launch-2024-Q3-detailed-requirements.pdf', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      <RoleInfoCard role={selectedRole} />

      <FilterBar
        filters={filters}
        brands={brands}
        loading={loading}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        onCreateCampaign={handleCreateCampaign}
        onSearch={() => fetchProjects(filters)}
        onAIDataAnalysis={handleAIDataAnalysis}
      />

      <div style={styles.tableSection}>
        <ProjectTable
          projects={projects}
          loading={loading.projects}
          onAction={handleAction}
          role={selectedRole}
        />
      </div>
    </div>
  );
};

// 数据服务 - 使用固定数据，便于后续替换为真实API
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const commercialApiService: CommercialApiService = {
  async getStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalBrands: 156,
      activeProjects: 23,
      completedProjects: 89,
      totalBudget: 24500000,
      avgProjectCycle: 45,
      trends: {
        totalBrands: 12,
        activeProjects: 5,
        completedProjects: 8,
        totalBudget: 15,
        avgProjectCycle: -2,
      },
    };
  },

  async getProjects(filters: ProjectFilters) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allProjects: ProjectData[] = [
      {
        id: '1',
        brand: { name: '小米', logo: '📱', industry: '科技' },
        product: '小米 SU7',
        quoteType: 'CPM',
        budget: 300000,
        orderTime: '2025-09-12',
        publishTime: '2025-10-12',
        bloggerCount: 100,
        status: 'accepted',
        progress: 100,
        tags: ['新能源汽车', '高端'],
        contactPerson: '张经理',
        createdAt: '2025-09-25',
        activityName: 'SU7 新品发布会',
      },
      {
        id: '2',
        brand: { name: '华为', logo: '🔧', industry: '科技' },
        product: 'Mate 60',
        quoteType: 'CPC',
        budget: 500000,
        orderTime: '2025-09-15',
        publishTime: '2025-10-15',
        bloggerCount: 150,
        status: 'pending',
        progress: 30,
        tags: ['手机', '旗舰'],
        contactPerson: '李总监',
        createdAt: '2025-09-28',
        bloggerRequirement: '科技类达人，粉丝50W+',
      },
      {
        id: '3',
        brand: { name: '苹果', logo: '🍎', industry: '科技' },
        product: 'iPhone 16',
        quoteType: 'CPA',
        budget: 800000,
        orderTime: '2025-09-20',
        publishTime: '2025-10-20',
        bloggerCount: 200,
        status: 'in_progress',
        progress: 75,
        tags: ['手机', '新品'],
        contactPerson: '王总',
        createdAt: '2025-10-01',
      },
      {
        id: '4',
        brand: { name: 'OPPO', logo: '⭕', industry: '科技' },
        product: 'Find X7',
        quoteType: 'CPM',
        budget: 250000,
        orderTime: '2025-09-08',
        publishTime: '2025-10-08',
        bloggerCount: 80,
        status: 'accepted',
        progress: 100,
        tags: ['手机', '摄影'],
        contactPerson: '赵经理',
        createdAt: '2025-10-03',
      },
      {
        id: '5',
        brand: { name: '耐克', logo: '👟', industry: '运动' },
        product: 'Air Max 2025',
        quoteType: 'CPC',
        budget: 400000,
        orderTime: '2025-09-25',
        publishTime: '2025-10-25',
        bloggerCount: 120,
        status: 'in_progress',
        progress: 60,
        tags: ['运动鞋', '限量'],
        contactPerson: '陈总监',
        createdAt: '2025-10-05',
      },
    ];

    let filteredProjects = [...allProjects];

    if (filters.brand !== 'all') {
      filteredProjects = filteredProjects.filter((project) => project.brand.name === filters.brand);
    }

    if (filters.status !== 'all') {
      filteredProjects = filteredProjects.filter((project) => project.status === filters.status);
    }

    const timeRanges: Record<TimeRange, number> = {
      '7days': 7,
      '30days': 30,
      '3months': 90,
    };
    const createdAtDays = timeRanges[filters.timeRange];
    if (createdAtDays) {
      const cutoffTimestamp = Date.now() - createdAtDays * DAY_IN_MS;
      filteredProjects = filteredProjects.filter(
        (project) => new Date(project.createdAt).getTime() >= cutoffTimestamp,
      );
    }

    if (filters.orderTimeRange !== 'all') {
      const orderRanges: Record<Exclude<OrderPublishRange, 'all'>, number> = {
        within_15_days: 15,
        within_30_days: 30,
        within_60_days: 60,
      };
      const daysLimit = orderRanges[filters.orderTimeRange];
      if (daysLimit) {
        const nowTimestamp = Date.now();
        filteredProjects = filteredProjects.filter((project) => {
          const diffDays = Math.abs(new Date(project.orderTime).getTime() - nowTimestamp) / DAY_IN_MS;
          return diffDays <= daysLimit;
        });
      }
    }

    if (filters.publishTimeRange !== 'all') {
      const publishRanges: Record<Exclude<OrderPublishRange, 'all'>, number> = {
        within_15_days: 15,
        within_30_days: 30,
        within_60_days: 60,
      };
      const daysLimit = publishRanges[filters.publishTimeRange];
      if (daysLimit) {
        const nowTimestamp = Date.now();
        filteredProjects = filteredProjects.filter((project) => {
          const diffDays = Math.abs(new Date(project.publishTime).getTime() - nowTimestamp) / DAY_IN_MS;
          return diffDays <= daysLimit;
        });
      }
    }

    if (filters.progressStage !== 'all') {
      if (filters.progressStage === 'completed') {
        filteredProjects = filteredProjects.filter((project) => (project.progress ?? 0) >= 100);
      } else {
        const progressRanges: Record<Exclude<ProgressStage, 'all' | 'completed'>, [number, number]> = {
          '0_25': [0, 25],
          '25_50': [25, 50],
          '50_75': [50, 75],
          '75_100': [75, 100],
        };
        const range = progressRanges[filters.progressStage];
        if (range) {
          const [min, max] = range;
          filteredProjects = filteredProjects.filter((project) => {
            const progress = project.progress ?? 0;
            return progress >= min && progress < max;
          });
        }
      }
    }

    if (filters.quoteType !== 'all') {
      filteredProjects = filteredProjects.filter((project) => project.quoteType === filters.quoteType);
    }

    if (filters.searchTerm.trim()) {
      const keyword = filters.searchTerm.trim().toLowerCase();
      filteredProjects = filteredProjects.filter((project) => {
        const activityName = (project.activityName ?? '').toLowerCase();
        const productName = project.product.toLowerCase();
        return activityName.includes(keyword) || productName.includes(keyword);
      });
    }

    return {
      projects: filteredProjects,
      total: filteredProjects.length,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 10,
    };
  },

  async getBrands() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return ['小米', '华为', '苹果', 'OPPO', '耐克', '阿迪达斯', '特斯拉', '可口可乐'];
  },
};

const utils = {
  formatCurrency(amount: number): string {
    if (amount >= 100000000) {
      return `¥ ${(amount / 100000000).toFixed(1)}亿`;
    }
    if (amount >= 10000) {
      return `¥ ${(amount / 10000).toFixed(1)}万`;
    }
    return `¥ ${amount}`;
  },

  formatDate(dateString: string): string {
    return dateString.replace(/-/g, '.');
  },

  getStatusConfig(status: ProjectStatus) {
    const configs: Record<ProjectStatus, { text: string; color: string; bgColor: string }> = {
      accepted: { text: '已接单', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      pending: { text: '待接单', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      in_progress: { text: '进行中', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      completed: { text: '已完成', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
      cancelled: { text: '已取消', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    };
    return configs[status];
  },
};

// 样式定义
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '8px 20px',
  },
  
  // 角色信息卡片样式
  roleInfoCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0'
  },
  
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  
  roleIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    marginRight: '10px',
    objectFit: 'contain',
    border: '1px solid #f0f0f0'
  },
  
  roleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  
  roleDescription: {
    fontSize: '13px',
    color: '#666',
    margin: '2px 0 0 0'
  },
  
  roleStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px',
    marginBottom: '8px'
  },
  
  statItem: {
    textAlign: 'center'
  },
  
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0
  },
  
  statLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '2px 0 0 0'
  },
  
  roleFeatures: {
    marginTop: '8px'
  },
  
  featuresTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '6px'
  },
  
  featuresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
  },
  
  featureTag: {
    padding: '4px 8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#495057',
    border: '1px solid #e9ecef'
  },

  // 品牌方特殊样式
  brandHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  
  brandTitleSection: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  
  brandLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    marginRight: '12px',
    objectFit: 'contain',
    border: '1px solid #e9ecef'
  },
  
  brandTitleInfo: {
    flex: 1
  },
  
  brandTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '8px 0 2px 0',
    lineHeight: '1.2'
  },
  
  brandSubtitle: {
    fontSize: '13px',
    color: '#666',
    margin: '0',
    lineHeight: '1.2'
  },
  
  brandStats: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  
  brandStatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  brandStatLabel: {
    fontSize: '11px',
    color: '#999',
    marginBottom: '2px'
  },
  
  brandStatValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  
  brandDescription: {
    marginBottom: '8px'
  },
  
  brandDescriptionText: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.4',
    margin: '0 0 6px 0'
  },
  
  expandButton: {
    background: 'none',
    border: 'none',
    color: '#1890ff',
    fontSize: '11px',
    cursor: 'pointer',
    padding: '2px 0',
    marginTop: '2px',
    textDecoration: 'underline'
  },

  // MCN达人特殊样式
  talentHorizontalLayout: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px'
  },
  
  talentBasicInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    minWidth: '180px'
  },
  
  talentAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    marginRight: '12px',
    objectFit: 'cover',
    border: '2px solid #f0f0f0'
  },
  
  talentInfo: {
    flex: 1
  },
  
  talentNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px'
  },
  
  talentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0'
  },
  
  talentId: {
    fontSize: '12px',
    color: '#999',
    margin: '0'
  },
  
  talentDescription: {
    fontSize: '13px',
    color: '#333',
    margin: '0',
    lineHeight: '1.4'
  },
  
  talentBusinessInfo: {
    display: 'flex',
    gap: '40px',
    flex: 1,
    flexWrap: 'wrap'
  },
  
  talentBusinessItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '120px'
  },
  
  talentDetailLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500'
  },
  
  talentDetailContent: {
    fontSize: '13px',
    color: '#333',
    lineHeight: '1.4'
  },
  
  talentActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '20px'
  },
  
  editAgentButton: {
    color: '#1890ff',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    padding: 0,
    ':hover': {
      color: '#40a9ff'
    }
  },

  // MCN机构特殊样式
  mcnCategoriesRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '8px',
    flexWrap: 'wrap'
  },
  
  mcnCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  
  mcnCategoryTitle: {
    fontSize: '11px',
    color: '#333',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  
  mcnTagsContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  },
  
  mcnTag: {
    padding: '2px 4px',
    backgroundColor: '#f5f5f5',
    borderRadius: '3px',
    fontSize: '11px',
    color: '#666',
    whiteSpace: 'nowrap'
  },
  
  // 布局和卡片
  section: { marginBottom: '16px' },
  sectionHeader: {
    marginBottom: '12px',
  },
  sectionTitle: { 
    fontSize: '20px', 
    fontWeight: '700', 
    margin: 0, 
    color: '#1a1a1a' 
  },
  
  // 统计卡片
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
    textAlign: 'center',
  },
  trend: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  trendUp: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#16a34a',
  },
  trendDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
  },
  
  // 筛选区域
  filterSection: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginBottom: '8px',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    minWidth: 'auto',
  },
  filterLabel: {
    fontSize: '13px',
    color: '#333',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  filterSelect: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: '#fff',
    minWidth: '140px',
  },
  filterInput: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: '#fff',
    outline: 'none',
    minWidth: '180px',
  },
  filterActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  
  // 按钮
  searchButton: {
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    padding: '7px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  resetButton: {
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #ddd',
    padding: '7px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  campaignButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '7px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  aiAnalysisButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
  },
  primaryButton: {
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  actionButton: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  linkButton: {
    padding: '3px 6px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#1890ff',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'left',
  },
  projectName: {
    fontSize: '11px',
    color: '#333',
    fontWeight: '500',
  },
  requirement: {
    fontSize: '10px',
    color: '#666',
    lineHeight: '1.3',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  progressText: {
    fontSize: '11px',
    color: '#666',
    minWidth: '35px',
    fontWeight: '500',
  },
  
  // 表格区域
  tableSection: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  tableTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
    color: '#333',
  },
  tableCount: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#666',
    marginLeft: '6px',
  },
  tableContainer: {
    borderBottom: '1px solid #e5e5e5',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    display: 'grid',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
  },
  tableHeaderCell: {
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    display: 'grid',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '12px 8px',
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    minHeight: '48px',
    overflow: 'hidden',
    minWidth: 0,
  },
  
  // 表格单元格特殊样式
  brandCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tableBrandLogo: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
  },
  brandName: {
    fontWeight: '500',
    color: '#333',
    fontSize: '12px',
  },
  industryTag: {
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#f3f4f6',
    padding: '1px 4px',
    borderRadius: '2px',
    marginTop: '2px',
  },
  productText: {
    fontWeight: '500',
    color: '#333',
    fontSize: '12px',
  },
  quoteType: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '500',
  },
  budget: {
    fontWeight: '600',
    color: '#059669',
    fontSize: '12px',
  },
  bloggerCount: {
    fontWeight: '500',
    color: '#7c3aed',
    fontSize: '12px',
  },
  statusCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statusIndicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '11px',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
    flex: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  actionCell: {
    display: 'flex',
    gap: '6px',
  },
  
  // 加载状态
  skeletonLine: {
    height: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  skeletonTable: {
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  skeletonRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 1fr 0.8fr 1.2fr',
    borderBottom: '1px solid #f3f4f6',
    padding: '12px 8px',
  },
  skeletonCell: {
    height: '20px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    margin: '0 4px',
  },
  loadingContainer: {
    padding: '40px 0',
  },
  
  // 空状态
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    border: '2px dashed #e5e5e5',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  emptyDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
} as Record<string, React.CSSProperties & { [key: string]: unknown }>;
// 悬停效果在内联样式中不会生效，保留原始样式定义即可。

export default CommercialDashboard;