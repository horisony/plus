import React, { useMemo } from 'react';
import { LineChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Button, Space, Table, Tag, Typography } from 'antd';
import { AudienceProfileChart } from './AudienceProfileChart';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  type InfluencerRecord,
} from '../data/mockData';

const { Text } = Typography;

interface InfluencerTableProps {
  influencers: InfluencerRecord[];
  onInfluencerSelect: (influencer: InfluencerRecord) => void;
}

const warningTagColor: Record<InfluencerRecord['warningStatus'], string> = {
  normal: 'success',
  high: 'processing',
  low: 'error',
};

const InfluencerTable: React.FC<InfluencerTableProps> = ({ influencers, onInfluencerSelect }) => {
  const columns = useMemo<ColumnsType<InfluencerRecord>>(() => [
    {
      title: '达人',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (_name: string, record) => (
        <Space>
          <Avatar src={record.avatar} style={{ backgroundColor: '#2563eb' }}>
            {record.name.charAt(0)}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Text type="secondary">{record.category}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '粉丝总量',
      dataIndex: 'fans',
      key: 'fans',
      sorter: (a, b) => a.fans - b.fans,
      render: (_fans: number, record) => (
        <Metric value={formatNumber(record.fans)} changeRate={record.changeRate} />
      ),
    },
    {
      title: '播放量',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
      render: (_views: number, record) => (
        <Metric value={formatNumber(record.views)} changeRate={record.changeRate} />
      ),
    },
    {
      title: '互动率',
      dataIndex: 'engagementRate',
      key: 'engagementRate',
      sorter: (a, b) => a.engagementRate - b.engagementRate,
      render: (_rate: number, record) => (
        <Metric value={formatPercentage(record.engagementRate)} changeRate={record.changeRate} />
      ),
    },
    {
      title: '完播率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      sorter: (a, b) => a.completionRate - b.completionRate,
      render: (_rate: number, record) => (
        <Metric value={formatPercentage(record.completionRate)} changeRate={record.changeRate} />
      ),
    },
    {
      title: '预期CPM',
      dataIndex: 'expectedCPM',
      key: 'expectedCPM',
      sorter: (a, b) => a.expectedCPM - b.expectedCPM,
      render: (_value: number, record) => (
        <Metric value={formatCurrency(record.expectedCPM)} changeRate={record.changeRate} inverted />
      ),
    },
    {
      title: '预期CPE',
      dataIndex: 'expectedCPE',
      key: 'expectedCPE',
      sorter: (a, b) => a.expectedCPE - b.expectedCPE,
      render: (_value: number, record) => (
        <Metric value={formatCurrency(record.expectedCPE)} changeRate={record.changeRate} inverted />
      ),
    },
    {
      title: '观众画像',
      dataIndex: 'demographics',
      key: 'demographics',
      width: 120,
      render: (_demographics, record) => <AudienceProfileChart demographics={record.demographics} />,
    },
    {
      title: '近期趋势',
      dataIndex: 'recentTrend',
      key: 'recentTrend',
      render: (trend, record) => (
        <Tag color={trend === 'up' ? 'green' : 'red'} icon={<LineChartOutlined />}>
          {trend === 'up' ? '增长' : '下滑'}
        </Tag>
      ),
      sorter: (a, b) => (a.recentTrend === b.recentTrend ? 0 : a.recentTrend === 'up' ? -1 : 1),
    },
    {
      title: '数据预警',
      dataIndex: 'warningStatus',
      key: 'warningStatus',
      render: (status: InfluencerRecord['warningStatus']) => (
        <Tag color={warningTagColor[status]}>{status === 'normal' ? '正常' : status === 'high' ? '高预警' : '低预警'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_value, record) => (
        <Button
          type="text"
          size="small"
          icon={<LineChartOutlined />}
          onClick={() => onInfluencerSelect(record)}
        >
          归因报告
        </Button>
      ),
    },
  ], [onInfluencerSelect]);

  return (
    <Table<InfluencerRecord>
      bordered={false}
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={influencers}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 960 }}
      size="middle"
    />
  );
};

interface MetricProps {
  value: string;
  changeRate: number;
  inverted?: boolean;
}

const Metric: React.FC<MetricProps> = ({ value, changeRate, inverted }) => {
  const positive = changeRate >= 0;
  const color = inverted ? (positive ? 'red' : 'green') : positive ? 'green' : 'red';
  const prefix = changeRate > 0 ? '+' : '';

  return (
    <Space direction="vertical" size={0}>
      <Text strong>{value}</Text>
      <Text type={color === 'green' ? 'success' : 'danger'}>{`${prefix}${changeRate.toFixed(1)}%`}</Text>
    </Space>
  );
};

export { InfluencerTable };
