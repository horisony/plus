import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FilterPanel = ({ filters, onFilterChange, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const handleAIAnalysisClick = () => {
    navigate('/ai-analysis-chat');
  };

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

        {/* AI数据分析按钮 */}
        <button style={styles.aiAnalysisButton} onClick={handleAIAnalysisClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.messageIcon}>
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          AI数据分析
        </button>
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
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    whiteSpace: 'nowrap',
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
  aiAnalysisButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  messageIcon: {
    color: '#fff',
  },
};
