import React from 'react';

export const FilterPanel = ({ filters, onFilterChange, searchQuery, onSearchChange }) => {
  const scopeOptions = [
    { value: 'all', label: '全部' },
    { value: 'cooperating', label: '合作中' },
    { value: 'completed', label: '已完成' },
    { value: 'mine', label: '我名下的' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: '近7天' },
    { value: '30d', label: '近30天' },
    { value: '90d', label: '近90天' }
  ];

  const platformOptions = [
    { value: 'douyin', label: '抖音' },
    { value: 'xhs', label: '小红书' }
  ];

  const dataDimensionOptions = [
    { value: 'fans,views', label: '粉丝总量, 播放...' },
    { value: 'engagement', label: '互动率, 完播率' },
    { value: 'cpm,cpe', label: 'CPM, CPE' }
  ];

  return (
    <div style={styles.container}>
      {/* 单行横向排列所有筛选器 */}
      <div style={styles.filterRow}>
        {/* 达人范围 */}
        <div style={styles.filterGroup}>
          <div style={styles.filterLabel}>达人范围</div>
          <div style={styles.scopeButtons}>
            {scopeOptions.map(option => (
              <button
                key={option.value}
                style={{
                  ...styles.scopeButton,
                  ...(filters.scope === option.value && styles.activeScopeButton)
                }}
                onClick={() => onFilterChange({ scope: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 时间范围 */}
        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>时间范围</div>
          <select
            style={styles.select}
            value={filters.timeRange}
            onChange={(e) => onFilterChange({ timeRange: e.target.value })}
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 平台 */}
        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>平台</div>
          <select
            style={styles.select}
            value={filters.platform}
            onChange={(e) => onFilterChange({ platform: e.target.value })}
          >
            {platformOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 数据维度 */}
        <div style={styles.filterItem}>
          <div style={styles.filterLabel}>数据维度</div>
          <select
            style={styles.select}
            value={filters.dataDimension}
            onChange={(e) => onFilterChange({ dataDimension: e.target.value })}
          >
            {dataDimensionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 搜索框 */}
        <div style={styles.searchContainer}>
          <div style={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#9fb0c7" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="输入你想筛选的达人特点"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // 让内容填满横向容器
    gap: '24px',
    flexWrap: 'nowrap',
    width: '100%',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  scopeButtons: {
    display: 'flex',
    gap: '8px',
  },
  scopeButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  activeScopeButton: {
    backgroundColor: '#e0f2fe', // 淡蓝色背景
    color: '#0277bd', // 蓝色文字
    borderColor: '#81d4fa', // 淡蓝色边框
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '14px',
    cursor: 'pointer',
    minWidth: '120px',
  },
  searchContainer: {
    flex: 1,
    maxWidth: '300px',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
};
