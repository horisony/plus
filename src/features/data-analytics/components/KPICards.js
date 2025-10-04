import React from 'react';
import { formatNumber, formatPercentage } from '../data/mockData';

export const KPICards = ({ influencers }) => {
  // 计算总体KPI数据
  const calculateKPIs = () => {
    if (!influencers || influencers.length === 0) {
      return {
        totalFans: 0,
        totalViews: 0,
        avgEngagement: 0,
        avgCompletion: 0
      };
    }

    const totalFans = influencers.reduce((sum, inf) => sum + inf.fans, 0);
    const totalViews = influencers.reduce((sum, inf) => sum + inf.views, 0);
    const avgEngagement = influencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / influencers.length;
    const avgCompletion = influencers.reduce((sum, inf) => sum + inf.completionRate, 0) / influencers.length;

    return {
      totalFans,
      totalViews,
      avgEngagement,
      avgCompletion
    };
  };

  const kpis = calculateKPIs();

  const kpiCards = [
    {
      label: '粉丝总量',
      value: formatNumber(kpis.totalFans),
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      label: '播放量',
      value: formatNumber(kpis.totalViews),
      change: '+3.8%',
      changeType: 'positive'
    },
    {
      label: '互动率',
      value: formatPercentage(kpis.avgEngagement),
      change: '+2.1%',
      changeType: 'positive'
    },
    {
      label: '完播率',
      value: formatPercentage(kpis.avgCompletion),
      change: '+1.5%',
      changeType: 'positive'
    }
  ];

  return (
    <div style={styles.container}>
      {kpiCards.map((kpi, index) => (
        <div key={index} style={styles.kpiCard}>
          <div style={styles.kpiLabel}>{kpi.label}</div>
          <div style={styles.kpiValue}>{kpi.value}</div>
          <div style={{
            ...styles.kpiChange,
            ...(kpi.changeType === 'positive' ? styles.positiveChange : styles.negativeChange)
          }}>
            {kpi.change}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '20px',
  },
  kpiCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  kpiLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500',
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
  },
  kpiChange: {
    fontSize: '12px',
    fontWeight: '500',
  },
  positiveChange: {
    color: '#10b981',
  },
  negativeChange: {
    color: '#ef4444',
  },
};
