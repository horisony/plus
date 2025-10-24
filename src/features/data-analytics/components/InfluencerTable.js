import React, { useState } from 'react';
import { formatNumber, formatPercentage, formatCurrency } from '../data/mockData';
import { AudienceProfileChart } from './AudienceProfileChart';

export const InfluencerTable = ({ influencers, onInfluencerSelect }) => {
  const [sortField, setSortField] = useState('fans');
  const [sortDirection, setSortDirection] = useState('desc');

  // 排序逻辑
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedInfluencers = [...influencers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // 获取预警状态样式
  const getWarningStatusStyle = (status) => {
    switch (status) {
      case 'normal':
        return { ...styles.warningStatus, ...styles.normalStatus };
      case 'high':
        return { ...styles.warningStatus, ...styles.highStatus };
      case 'low':
        return { ...styles.warningStatus, ...styles.lowStatus };
      default:
        return { ...styles.warningStatus, ...styles.normalStatus };
    }
  };

  const getWarningStatusText = (status) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'high':
        return '高预警';
      case 'low':
        return '低预警';
      default:
        return '正常';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.trendIcon}>
          <path d="M7 14l5-5 5 5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.trendIcon}>
          <path d="M7 10l5 5 5-5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <colgroup>
            <col style={{width: '120px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '180px'}} />
          </colgroup>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>达人</th>
              <th 
                style={{...styles.headerCell, ...styles.sortableHeader}}
                onClick={() => handleSort('fans')}
              >
                粉丝总量
                {sortField === 'fans' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th style={styles.headerCell}>播放量</th>
              <th style={styles.headerCell}>互动率</th>
              <th style={styles.headerCell}>完播率</th>
              <th style={styles.headerCell}>预期CPM</th>
              <th style={styles.headerCell}>预期CPE</th>
              <th style={styles.headerCell}>观众画像</th>
              <th style={styles.headerCell}>近期趋势</th>
              <th style={styles.headerCell}>数据预警</th>
              <th style={styles.headerCell}>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedInfluencers.map((influencer) => (
              <tr key={influencer.id} style={styles.dataRow}>
                {/* 达人信息 */}
                <td style={styles.dataCell}>
                  <div style={styles.influencerNameOnly}>
                    <div style={styles.influencerName}>{influencer.name}</div>
                    <div style={styles.influencerCategory}>{influencer.category}</div>
                  </div>
                </td>

                {/* 粉丝总量 */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatNumber(influencer.fans)}
                    <span style={styles.changeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 播放量 */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatNumber(influencer.views)}
                    <span style={styles.changeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 互动率 */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatPercentage(influencer.engagementRate)}
                    <span style={styles.changeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 完播率 */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatPercentage(influencer.completionRate)}
                    <span style={styles.changeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 预期CPM */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatCurrency(influencer.expectedCPM)}
                    <span style={styles.negativeChangeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 预期CPE */}
                <td style={styles.dataCell}>
                  <div style={styles.metricValue}>
                    {formatCurrency(influencer.expectedCPE)}
                    <span style={styles.negativeChangeIndicator}>+{influencer.changeRate}%</span>
                  </div>
                </td>

                {/* 观众画像 */}
                <td style={styles.dataCell}>
                  <AudienceProfileChart demographics={influencer.demographics} />
                </td>

                {/* 近期趋势 */}
                <td style={styles.dataCell}>
                  <div style={styles.trendContainer}>
                    {getTrendIcon(influencer.recentTrend)}
                  </div>
                </td>

                {/* 数据预警 */}
                <td style={styles.dataCell}>
                  <div style={getWarningStatusStyle(influencer.warningStatus)}>
                    <div style={styles.warningDot}></div>
                    {getWarningStatusText(influencer.warningStatus)}
                  </div>
                </td>

                {/* 操作 */}
                <td style={styles.dataCell}>
                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e5e7eb';
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.color = '#1f2937';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.color = '#374151';
                      }}
                      onClick={() => onInfluencerSelect(influencer)}
                    >
                      归因报告
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed', // 固定表格布局，确保列宽一致
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  headerCell: {
    padding: '16px 12px',
    textAlign: 'center', // 改为居中对齐
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  sortableHeader: {
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
  },
  sortIcon: {
    marginLeft: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  dataRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
  },
  dataCell: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
    textAlign: 'center', // 改为居中对齐
  },
  influencerNameOnly: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 居中对齐
  },
  influencerName: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '2px',
  },
  influencerCategory: {
    fontSize: '12px',
    color: '#6b7280',
  },
  metricValue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 居中对齐
  },
  changeIndicator: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '2px',
  },
  negativeChangeIndicator: {
    fontSize: '12px',
    color: '#ef4444', // 红色，表示CPM/CPE增长不是好事
    marginTop: '2px',
  },
  audienceProfile: {
    display: 'flex',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: '20px',
  },
  trendContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  trendIcon: {
    width: '16px',
    height: '16px',
  },
  warningStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 居中对齐
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },
  warningDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  normalStatus: {
    color: '#10b981',
  },
  highStatus: {
    color: '#2563eb',
  },
  lowStatus: {
    color: '#ef4444',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row', // 改为横向排列
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // 允许换行
  },
  actionButton: {
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    minWidth: '60px',
  },
  actionButtonHover: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
    color: '#1f2937',
  },
};
