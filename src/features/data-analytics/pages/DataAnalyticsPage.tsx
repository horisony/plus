import React, { useCallback, useMemo, useState } from 'react';
import { Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CompanyInfoCard } from '../components/CompanyInfoCard';
import { TalentInfoCard } from '../components/TalentInfoCard';
import { InfluencerTable } from '../components/InfluencerTable';
import { FilterPanel } from '../components/FilterPanel';
import { TopVideosTable } from '../components/TopVideosTable';
import { RecentLiveTable } from '../components/RecentLiveTable';
import { mockInfluencerData, type InfluencerRecord } from '../data/mockData';
import type { DataAnalyticsFilters } from '../types';
import useAuth from '../../auth/hooks/useAuth';

const { Title } = Typography;

const initialFilters: DataAnalyticsFilters = {
  scope: 'all',
  timeRange: '30d',
  platform: [],
  fansMin: '',
  fansMax: '',
  industry: [],
  contentTags: [],
  dataDimension: [],
  warningStatus: [],
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '24px 24px 32px',
};

const DataAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DataAnalyticsFilters>(initialFilters);
  const { scope, platform, timeRange, dataDimension } = filters;
  const { user } = useAuth();

  // 判断是否为达人角色
  const isTalentRole = useMemo(() => {
    if (!user?.roles?.length) {
      return false;
    }
    return user.roles.some((role) => {
      const roleId = role.roleId?.toLowerCase() || '';
      return roleId.includes('talent') || roleId === 'plusco_role_mcn_talent' || roleId === 'plusco_role_wild_talent';
    });
  }, [user?.roles]);

  const filteredInfluencers = useMemo(() => {
    return mockInfluencerData.filter((influencer) => {
      if (scope === 'cooperating' && influencer.status !== 'cooperating') {
        return false;
      }
      if (scope === 'completed' && influencer.status !== 'completed') {
        return false;
      }
      if (scope === 'mine' && influencer.owner !== 'mine') {
        return false;
      }

      // 平台筛选（多选）
      if (platform.length > 0 && !platform.includes(influencer.platform as any)) {
        return false;
      }

      if (!influencer.timeRanges.includes(timeRange)) {
        return false;
      }

      // 数据维度筛选（多选）
      if (dataDimension.length > 0 && !dataDimension.some(dim => influencer.focusDimensions.includes(dim))) {
        return false;
      }

      return true;
    });
  }, [scope, platform, timeRange, dataDimension]);

  const handleFilterChange = useCallback((partial: Partial<DataAnalyticsFilters>) => {
    setFilters((previous) => ({ ...previous, ...partial }));
  }, []);



  const handleInfluencerSelect = useCallback((influencer: InfluencerRecord) => {
    // 暂用日志占位，后续可替换成跳转或弹窗
    // eslint-disable-next-line no-console
    console.log('Selected influencer:', influencer);
  }, []);

  const handleAIDataAnalysis = useCallback(() => {
    navigate('/ai-agent/ai-data-analysis-chat');
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* 根据角色动态显示信息面板 */}
        {isTalentRole ? <TalentInfoCard /> : <CompanyInfoCard />}

        {/* 根据角色显示不同的内容区域 */}
        {isTalentRole ? (
          <>
            {/* 达人角色：显示短视频和直播数据表格 */}
            <Card 
              bordered={false} 
              bodyStyle={{ padding: 20 }}
              title={
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                  近期短视频Top5
                </Title>
              }
            >
              <TopVideosTable />
            </Card>

            <Card 
              bordered={false} 
              bodyStyle={{ padding: 20 }}
              title={
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                  近期直播
                </Title>
              }
            >
              <RecentLiveTable />
            </Card>
          </>
        ) : (
          <>
            {/* 非达人角色：显示原有的筛选和表格 */}
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onAIDataAnalysis={handleAIDataAnalysis}
            />

            <Card bordered={false} bodyStyle={{ padding: 0 }}>
              <InfluencerTable
                influencers={filteredInfluencers}
                onInfluencerSelect={handleInfluencerSelect}
              />
            </Card>
          </>
        )}
      </Space>
    </div>
  );
};

export { DataAnalyticsPage };
export type { DataAnalyticsFilters };
