import React, { useMemo } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Tag } from 'antd';
import { formatNumber, formatPercentage } from '../data/mockData';
import type { InfluencerRecord } from '../data/mockData';

interface KPICardsProps {
  influencers: InfluencerRecord[];
}

const KPICards: React.FC<KPICardsProps> = ({ influencers }) => {
  const aggregate = useMemo(() => {
    if (!influencers.length) {
      return {
        totalFans: 0,
        totalViews: 0,
        avgEngagement: 0,
        avgCompletion: 0,
      };
    }

    const totals = influencers.reduce(
      (accumulator, influencer) => {
        accumulator.totalFans += influencer.fans;
        accumulator.totalViews += influencer.views;
        accumulator.avgEngagement += influencer.engagementRate;
        accumulator.avgCompletion += influencer.completionRate;
        return accumulator;
      },
      {
        totalFans: 0,
        totalViews: 0,
        avgEngagement: 0,
        avgCompletion: 0,
      },
    );

    totals.avgEngagement /= influencers.length;
    totals.avgCompletion /= influencers.length;

    return totals;
  }, [influencers]);

  const kpiCards = useMemo(
    () => [
      {
        label: '粉丝总量',
        value: formatNumber(aggregate.totalFans),
        change: '+5.2%',
      },
      {
        label: '播放量',
        value: formatNumber(aggregate.totalViews),
        change: '+3.8%',
      },
      {
        label: '互动率',
        value: formatPercentage(aggregate.avgEngagement),
        change: '+2.1%',
      },
      {
        label: '完播率',
        value: formatPercentage(aggregate.avgCompletion),
        change: '+1.5%',
      },
    ],
    [aggregate],
  );

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      {kpiCards.map((card) => (
        <Col xs={24} sm={12} md={12} lg={6} key={card.label}>
          <Card bordered={false}>
            <Statistic
              title={card.label}
              value={card.value}
              valueStyle={{ fontSize: 28 }}
            />
            <Tag color="green" style={{ marginTop: 12 }} icon={<ArrowUpOutlined />}>
              {card.change}
            </Tag>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { KPICards };
