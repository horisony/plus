import React from 'react';
import { Button, Card, Input, Select, Typography } from 'antd';
import type { 
  DataAnalyticsFilters, 
  FilterTimeRange, 
  FilterPlatform, 
  FilterDimension,
  FilterIndustry,
  FilterContentTag,
  FilterWarningStatus
} from '../types';

const { Text } = Typography;

interface FilterPanelProps {
  filters: DataAnalyticsFilters;
  onFilterChange: (partial: Partial<DataAnalyticsFilters>) => void;
  onAIDataAnalysis?: () => void;
}

const timeRangeOptions: { label: string; value: FilterTimeRange }[] = [
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: '90d', label: '近90天' },
];

const platformOptions: { label: string; value: FilterPlatform }[] = [
  { value: 'douyin', label: '抖音' },
  { value: 'xhs', label: '小红书' },
  { value: 'weibo', label: '微博' },
  { value: 'bilibili', label: '哔哩哔哩' },
  { value: 'kuaishou', label: '快手' },
];

const dataDimensionOptions: { label: string; value: FilterDimension }[] = [
  { value: 'fans,views', label: '粉丝与播放' },
  { value: 'engagement', label: '互动与完播' },
  { value: 'cpm,cpe', label: 'CPM 与 CPE' },
];

const industryOptions: { label: string; value: FilterIndustry }[] = [
  { value: 'tech', label: '科技数码' },
  { value: 'auto', label: '汽车' },
  { value: 'fashion', label: '时尚美妆' },
  { value: 'food', label: '美食餐饮' },
  { value: 'travel', label: '旅游出行' },
  { value: 'health', label: '健康养生' },
];

const contentTagOptions: { label: string; value: FilterContentTag }[] = [
  { value: 'review', label: '测评' },
  { value: 'unbox', label: '开箱' },
  { value: 'tutorial', label: '教程' },
  { value: 'comparison', label: '对比' },
  { value: 'lifestyle', label: '生活方式' },
];

const warningStatusOptions: { label: string; value: FilterWarningStatus }[] = [
  { value: 'normal', label: '正常' },
  { value: 'warning', label: '预警' },
  { value: 'danger', label: '危险' },
  { value: 'monitoring', label: '监控中' },
];

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  rowGap: 12,
  alignItems: 'center',
};

const filterItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onAIDataAnalysis }) => (
  <Card bordered={false} bodyStyle={{ padding: '16px 20px' }}>
    <div style={filterBarStyle}>
      {/* 时间范围 */}
      <div style={filterItemStyle}>
        <Text type="secondary">时间范围：</Text>
        <Select
          style={{ minWidth: 120 }}
          value={filters.timeRange}
          options={timeRangeOptions}
          onChange={(value) => onFilterChange({ timeRange: value })}
          placeholder="选择时间"
        />
      </div>

      {/* 平台选择 */}
      <div style={filterItemStyle}>
        <Text type="secondary">平台选择：</Text>
        <Select
          mode="multiple"
          style={{ minWidth: 160 }}
          value={filters.platform}
          options={platformOptions}
          onChange={(value) => onFilterChange({ platform: value })}
          placeholder="选择平台"
          maxTagCount={2}
        />
      </div>

      {/* 粉丝量级 */}
      <div style={filterItemStyle}>
        <Text type="secondary">粉丝量级：</Text>
        <Input
          style={{ width: 80 }}
          value={filters.fansMin}
          onChange={(e) => onFilterChange({ fansMin: e.target.value })}
          placeholder="最小值"
        />
        <span>-</span>
        <Input
          style={{ width: 80 }}
          value={filters.fansMax}
          onChange={(e) => onFilterChange({ fansMax: e.target.value })}
          placeholder="最大值"
        />
        <Text type="secondary" style={{ fontSize: 12 }}>W</Text>
      </div>

      {/* 商单行业 */}
      <div style={filterItemStyle}>
        <Text type="secondary">商单行业：</Text>
        <Select
          mode="multiple"
          style={{ minWidth: 160 }}
          value={filters.industry}
          options={industryOptions}
          onChange={(value) => onFilterChange({ industry: value })}
          placeholder="选择行业"
          maxTagCount={2}
        />
      </div>

      {/* 内容标签 */}
      <div style={filterItemStyle}>
        <Text type="secondary">内容标签：</Text>
        <Select
          mode="multiple"
          style={{ minWidth: 160 }}
          value={filters.contentTags}
          options={contentTagOptions}
          onChange={(value) => onFilterChange({ contentTags: value })}
          placeholder="选择标签"
          maxTagCount={2}
        />
      </div>

      {/* 数据维度 */}
      <div style={filterItemStyle}>
        <Text type="secondary">数据维度：</Text>
        <Select
          mode="multiple"
          style={{ minWidth: 160 }}
          value={filters.dataDimension}
          options={dataDimensionOptions}
          onChange={(value) => onFilterChange({ dataDimension: value })}
          placeholder="选择维度"
          maxTagCount={2}
        />
      </div>

      {/* 预警状态 */}
      <div style={filterItemStyle}>
        <Text type="secondary">预警状态：</Text>
        <Select
          mode="multiple"
          style={{ minWidth: 160 }}
          value={filters.warningStatus}
          options={warningStatusOptions}
          onChange={(value) => onFilterChange({ warningStatus: value })}
          placeholder="选择状态"
          maxTagCount={2}
        />
      </div>

      {/* AI数据分析按钮 */}
      {onAIDataAnalysis && (
        <div style={{ marginLeft: 'auto' }}>
          <Button 
            type="primary"
            onClick={onAIDataAnalysis}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              fontSize: '13px',
              height: '32px',
              padding: '0 20px',
              borderRadius: '20px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
            }}
          >
            AI数据分析
          </Button>
        </div>
      )}
    </div>
  </Card>
);

export { FilterPanel };
