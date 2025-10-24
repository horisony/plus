import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { RadarChart } from './RadarChart';

const { Text, Title, Paragraph } = Typography;

interface TalentStats {
  followers: string;
  gmv: string;
  videoCount: string;
  avgViews: string;
  category: string;
  status: string;
  // 五边形雷达图数据 (0-1 标准化值)
  radarData: {
    viewData: number; // 视频数据
    liveData: number; // 直播数据
    brandData: number; // 商品数据
    audienceData: number; // 种草数据
  };
}

interface TalentInfo {
  name: string;
  platform: string;
  accountId: string;
  description: string;
  longDescription?: string;
  stats: TalentStats;
  tags?: string[];
  avatarSrc?: string;
  accountLevel?: string;
  industry: string;
  fanAge: string;
  location: string;
  videoTag: string;
}

// 模拟达人数据
const talentInfo: TalentInfo = {
  name: '萌叔',
  platform: '抖音',
  accountId: 'V2白银账号',
  accountLevel: '校友',
  description: '再涨12w粉丝即可达V2白银级别，即可解锁达人资料推荐 详情>',
  industry: '科技数码',
  fanAge: '35岁',
  location: '云南 头部达人',
  videoTag: '科普',
  longDescription:
    '达人简介：科技数码达人，专注分享最新科技产品评测和数码好物推荐。内容涵盖手机、电脑、智能家居等领域，为粉丝提供专业的购买建议和使用技巧。合作案例包括小米、华为、苹果等知名品牌。',
  stats: {
    followers: '22.2w',
    gmv: '1000w',
    videoCount: '2838',
    avgViews: '11.7万',
    category: '食品',
    status: '正常',
    radarData: {
      viewData: 0.85, // 视频数据
      liveData: 0.72, // 直播数据
      brandData: 0.65, // 商品数据
      audienceData: 0.78, // 种草数据
    },
  },
  tags: ['科技数码', '产品评测', '数码好物', '智能家居'],
  avatarSrc: '/brand/PLUSCO-logo.png',
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  alignItems: 'flex-start',
};

const leftSectionStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
};

const avatarStyles: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 28,
  objectFit: 'cover',
  border: '2px solid #e5e7eb',
  background: '#fff',
};

const nameTagStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
};

const statsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px 16px',
  marginTop: 12,
};

const statItemStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const statLabelStyles: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  marginBottom: 2,
};

const statValueStyles: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#111827',
};

const rightSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};

const chartTitleStyles: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  fontWeight: 500,
};

const TalentInfoCard: React.FC = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleAIAnalysisClick = () => {
    navigate('/ai-data-analysis-chat');
  };

  const longDescription = useMemo(() => {
    if (!talentInfo.longDescription) {
      return null;
    }

    return (
      <Paragraph
        style={{
          marginBottom: 0,
          color: '#6b7280',
          fontSize: 12,
          lineHeight: 1.5,
          textAlign: 'left',
          ...(expanded
            ? {}
            : {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
        }}
      >
        {talentInfo.longDescription}
      </Paragraph>
    );
  }, [expanded]);

  return (
    <Card bordered={false} bodyStyle={{ padding: 20 }}>
      <div style={containerStyles}>
        {/* 左侧内容区域 */}
        <div style={leftSectionStyles}>
          {/* 达人头像和基本信息 */}
          <div style={headerStyles}>
            <img src={talentInfo.avatarSrc} alt={talentInfo.name} style={avatarStyles} />
            <Space direction="vertical" size={4} style={{ flex: 1 }} align="start">
              <div style={nameTagStyles}>
                <Text style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>
                  {talentInfo.name}
                </Text>
                <Tag color="orange" style={{ fontSize: 11, padding: '2px 6px', margin: 0 }}>
                  {talentInfo.accountLevel}
                </Tag>
              </div>
              <Text
                style={{
                  fontSize: 12,
                  color: '#4b5563',
                  lineHeight: 1.4,
                }}
              >
                {talentInfo.description}
              </Text>
              <Space size={16} style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  抖音号 {talentInfo.accountId}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  行业 {talentInfo.industry}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  达人信息 {talentInfo.fanAge} {talentInfo.location}
                </Text>
              </Space>
            </Space>
            <Button
              type="primary"
              onClick={handleAIAnalysisClick}
              style={{
                borderRadius: 16,
                padding: '4px 12px',
                height: 'auto',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 14 }}>🔍</span>
              AI 数据分析
            </Button>
          </div>

          {/* 数据统计网格 */}
          <div style={statsGridStyles}>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>粉丝数</Text>
              <Text style={statValueStyles}>{talentInfo.stats.followers}</Text>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>近30日GMV</Text>
              <Text style={statValueStyles}>{talentInfo.stats.gmv}</Text>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>近30日主营品类</Text>
              <Space align="center" size={4}>
                <Text style={statValueStyles}>{talentInfo.stats.category}</Text>
                <Tag
                  color="gold"
                  style={{ fontSize: 10, padding: '1px 4px', margin: 0, lineHeight: 1.2 }}
                >
                  中
                </Tag>
              </Space>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>带货口碑</Text>
              <Text style={statValueStyles}>4.57</Text>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>累计视频数</Text>
              <Text style={statValueStyles}>{talentInfo.stats.videoCount}</Text>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>累计点赞数</Text>
              <Text style={statValueStyles}>{talentInfo.stats.avgViews}</Text>
            </div>
            <div style={statItemStyles}>
              <Text style={statLabelStyles}>视频标签</Text>
              <Text style={statValueStyles}>{talentInfo.videoTag}</Text>
            </div>
          </div>


        </div>

        {/* 右侧雷达图区域 */}
        <div style={rightSectionStyles}>
          <Text style={chartTitleStyles}>视频数据</Text>
          <RadarChart data={talentInfo.stats.radarData} size={180} />
        </div>
      </div>
    </Card>
  );
};

export { TalentInfoCard };