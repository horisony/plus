import React, { useState, useEffect, useCallback } from 'react';

// 统计卡片组件
const StatCard = ({ label, value, trend, loading = false }) => {
  if (loading) {
    return (
      <div style={styles.statCard}>
        <div style={styles.skeletonLine}></div>
        <div style={{...styles.skeletonLine, width: '60%'}}></div>
      </div>
    );
  }

  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      {trend !== undefined && (
        <div style={{
          ...styles.trend,
          ...(trend > 0 ? styles.trendUp : styles.trendDown)
        }}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

// 筛选组件
const FilterBar = ({ filters, brands, loading, onFilterChange, onReset }) => {
  return (
    <div style={styles.filterSection}>
      <div style={styles.filterRow}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>品牌筛选</label>
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
          <label style={styles.filterLabel}>项目状态</label>
          <select 
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">全部状态</option>
            <option value="accepted">已接单</option>
            <option value="pending">待接单</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>时间范围</label>
          <select 
            value={filters.timeRange}
            onChange={(e) => onFilterChange('timeRange', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="7days">近7天</option>
            <option value="30days">近30天</option>
            <option value="3months">近3个月</option>
          </select>
        </div>
        
        <div style={styles.filterActions}>
          <button style={styles.primaryButton}>
            🔍 筛选
          </button>
          
          <button style={styles.secondaryButton} onClick={onReset}>
            🔄 重置
          </button>
        </div>
      </div>
    </div>
  );
};

// 项目表格组件
const ProjectTable = ({ projects, loading, onAction }) => {
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
      {/* 表头 */}
      <div style={styles.tableHeaderRow}>
        <div style={styles.tableHeaderCell}>品牌名称</div>
        <div style={styles.tableHeaderCell}>产品</div>
        <div style={styles.tableHeaderCell}>报价形式</div>
        <div style={styles.tableHeaderCell}>预算</div>
        <div style={styles.tableHeaderCell}>预计下单时间</div>
        <div style={styles.tableHeaderCell}>预计发布时间</div>
        <div style={styles.tableHeaderCell}>需求博主数</div>
        <div style={styles.tableHeaderCell}>状态</div>
        <div style={styles.tableHeaderCell}>操作</div>
      </div>
      
      {/* 表格内容 */}
      {projects.map((project) => (
        <div key={project.id} style={styles.tableRow}>
          <div style={styles.tableCell}>
            <div style={styles.brandCell}>
              <div style={styles.brandLogo}>{project.brand.logo}</div>
              <div>
                <div style={styles.brandName}>{project.brand.name}</div>
                <div style={styles.industryTag}>{project.brand.industry}</div>
              </div>
            </div>
          </div>
          
          <div style={styles.tableCell}>
            <span style={styles.productText}>{project.product}</span>
          </div>
          
          <div style={styles.tableCell}>
            <span style={styles.quoteType}>{project.quoteType}</span>
          </div>
          
          <div style={styles.tableCell}>
            <span style={styles.budget}>{utils.formatCurrency(project.budget)}</span>
          </div>
          
          <div style={styles.tableCell}>
            {utils.formatDate(project.orderTime)}
          </div>
          
          <div style={styles.tableCell}>
            {utils.formatDate(project.publishTime)}
          </div>
          
          <div style={styles.tableCell}>
            <span style={styles.bloggerCount}>{project.bloggerCount}人</span>
          </div>
          
          <div style={styles.tableCell}>
            <div style={styles.statusCell}>
              <div style={styles.statusIndicatorContainer}>
                <div
                  style={{
                    ...styles.statusIndicator,
                    backgroundColor: utils.getStatusConfig(project.status).color
                  }}
                />
                <span style={{
                  ...styles.statusText,
                  color: utils.getStatusConfig(project.status).color
                }}>
                  {utils.getStatusConfig(project.status).text}
                </span>
              </div>
              {project.progress && (
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${project.progress}%`,
                      backgroundColor: utils.getStatusConfig(project.status).color
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.tableCell}>
            <div style={styles.actionCell}>
              <button 
                style={styles.actionButton}
                onClick={() => onAction('contact', project)}
              >
                💬 沟通
              </button>
              <button 
                style={styles.actionButton}
                onClick={() => onAction('detail', project)}
              >
                📋 详情
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 主组件
const CommercialDashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    projects: true,
    brands: true
  });
  const [filters, setFilters] = useState({
    brand: 'all',
    status: 'all',
    timeRange: '30days',
    page: 1,
    pageSize: 10
  });

  // 使用useCallback包装fetchProjects，避免无限循环
  const fetchProjects = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(prev => ({ ...prev, projects: true }));
      // 这里先用固定数据，后续可以替换为API调用
      const projectsData = await commercialApiService.getProjects(currentFilters);
      setProjects(projectsData.projects);
    } catch (error) {
      console.error('获取项目列表失败:', error);
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  }, [filters]);

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    try {
      // 这里先用固定数据，后续可以替换为API调用
      const statsData = await commercialApiService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  // 获取品牌列表
  const fetchBrands = useCallback(async () => {
    try {
      // 这里先用固定数据，后续可以替换为API调用
      const brandsData = await commercialApiService.getBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('获取品牌列表失败:', error);
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    fetchStats();
    fetchProjects();
    fetchBrands();
  }, [fetchStats, fetchProjects, fetchBrands]);

  // 筛选条件变化时重新获取项目
  useEffect(() => {
    if (!loading.brands) {
      fetchProjects(filters);
    }
  }, [filters, loading.brands, fetchProjects]);

  // 处理筛选条件变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // 处理重置筛选
  const handleResetFilters = () => {
    setFilters({
      brand: 'all',
      status: 'all',
      timeRange: '30days',
      page: 1,
      pageSize: 10
    });
  };

  // 处理操作
  const handleAction = (action, project) => {
    console.log(`${action} action for:`, project);
    // 实际业务逻辑
    switch (action) {
      case 'contact':
        alert(`联系 ${project.brand.name} 的 ${project.contactPerson}`);
        break;
      case 'detail':
        alert(`查看 ${project.product} 的详细信息`);
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      {/* 数据概览 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>商业化概览</h2>
        </div>
        <div style={styles.statsGrid}>
          <StatCard 
            label="总合作品牌" 
            value={stats ? stats.totalBrands.toLocaleString() : '0'}
            trend={stats?.trends?.totalBrands}
            loading={loading.stats}
          />
          <StatCard 
            label="进行中项目" 
            value={stats ? stats.activeProjects.toLocaleString() : '0'}
            trend={stats?.trends?.activeProjects}
            loading={loading.stats}
          />
          <StatCard 
            label="已完成项目" 
            value={stats ? stats.completedProjects.toLocaleString() : '0'}
            trend={stats?.trends?.completedProjects}
            loading={loading.stats}
          />
          <StatCard 
            label="总预算金额" 
            value={stats ? utils.formatCurrency(stats.totalBudget) : '¥ 0'}
            trend={stats?.trends?.totalBudget}
            loading={loading.stats}
          />
          <StatCard 
            label="平均项目周期" 
            value={stats ? `${stats.avgProjectCycle}天` : '0天'}
            trend={stats?.trends?.avgProjectCycle}
            loading={loading.stats}
          />
        </div>
      </div>

      {/* 筛选栏 */}
      <FilterBar 
        filters={filters}
        brands={brands}
        loading={loading}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 表格部分 */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>
            合作项目列表
            {projects.length > 0 && (
              <span style={styles.tableCount}>(共 {projects.length} 个项目)</span>
            )}
          </h3>
          <button style={styles.primaryButton}>
            ➕ 新建项目
          </button>
        </div>
        
        <ProjectTable 
          projects={projects}
          loading={loading.projects}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};

// 数据服务 - 使用固定数据，便于后续替换为真实API
const commercialApiService = {
  async getStats() {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
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
        avgProjectCycle: -2
      }
    };
  },

  async getProjects(filters = {}) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 固定数据
    const allProjects = [
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
        createdAt: '2025-08-01'
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
        createdAt: '2025-08-05'
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
        createdAt: '2025-08-10'
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
        createdAt: '2025-07-28'
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
        createdAt: '2025-08-15'
      }
    ];

    // 应用筛选逻辑 - 这里可以替换为真实的后端筛选
    let filteredProjects = [...allProjects];
    
    if (filters.brand && filters.brand !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.brand.name === filters.brand
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.status === filters.status
      );
    }
    
    if (filters.timeRange) {
      const now = new Date();
      const timeRanges = {
        '7days': 7,
        '30days': 30,
        '3months': 90
      };
      
      const days = timeRanges[filters.timeRange];
      if (days) {
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        filteredProjects = filteredProjects.filter(project => 
          new Date(project.createdAt) >= cutoffDate
        );
      }
    }

    return {
      projects: filteredProjects,
      total: filteredProjects.length,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10
    };
  },

  async getBrands() {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return ['小米', '华为', '苹果', 'OPPO', '耐克', '阿迪达斯', '特斯拉', '可口可乐'];
  }
};

// 工具函数
const utils = {
  formatCurrency(amount) {
    if (amount >= 100000000) {
      return `¥ ${(amount / 100000000).toFixed(1)}亿`;
    } else if (amount >= 10000) {
      return `¥ ${(amount / 10000).toFixed(1)}万`;
    }
    return `¥ ${amount}`;
  },

  formatDate(dateString) {
    return dateString.replace(/-/g, '.');
  },

  getStatusConfig(status) {
    const configs = {
      accepted: { text: '已接单', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
      pending: { text: '待接单', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      in_progress: { text: '进行中', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      completed: { text: '已完成', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
      cancelled: { text: '已取消', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };
    return configs[status] || configs.pending;
  }
};

// 样式定义
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  
  // 布局和卡片
  section: { marginBottom: '24px' },
  sectionHeader: {
    marginBottom: '16px',
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
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
    textAlign: 'center',
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
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '150px',
  },
  filterLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  filterActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
  },
  
  // 按钮
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
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // 表格区域
  tableSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#333',
  },
  tableCount: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#666',
    marginLeft: '8px',
  },
  tableContainer: {
    border: '1px solid #e5e5e5',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 1fr 0.8fr 1.2fr',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e5e5e5',
  },
  tableHeaderCell: {
    padding: '12px 8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 1fr 1fr 1fr 0.8fr 1.2fr',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '12px 8px',
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    minHeight: '52px',
  },
  
  // 表格单元格特殊样式
  brandCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  brandName: {
    fontWeight: '500',
    color: '#333',
  },
  industryTag: {
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '3px',
    marginTop: '2px',
  },
  productText: {
    fontWeight: '500',
    color: '#333',
  },
  quoteType: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },
  budget: {
    fontWeight: '600',
    color: '#059669',
  },
  bloggerCount: {
    fontWeight: '500',
    color: '#7c3aed',
  },
  statusCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statusIndicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '13px',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: '#f3f4f6',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
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
};

// 添加悬停效果
Object.assign(styles, {
  tableRow: {
    ...styles.tableRow,
    ':hover': {
      backgroundColor: '#f9fafb',
    }
  },
  primaryButton: {
    ...styles.primaryButton,
    ':hover': {
      backgroundColor: '#d32f2f',
    }
  },
  secondaryButton: {
    ...styles.secondaryButton,
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  actionButton: {
    ...styles.actionButton,
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
});

export default CommercialDashboard;