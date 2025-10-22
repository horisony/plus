import React from 'react';
import { Card, Space, Tag, Typography } from 'antd';

const { Text } = Typography;

interface CompanyStats {
  followers: string;
  creators: string;
}

interface CompanyInfo {
  title: string;
  subtitle?: string;
  description: string;
  stats: CompanyStats;
  logoSrc?: string;
}

const companyInfo: CompanyInfo = {
  title: '无忧传媒',
  subtitle: '北京无忧传媒传媒有限公司',
  description:
    '占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符占位符',
  stats: {
    followers: '10.3亿',
    creators: '592',
  },
  logoSrc: '/PLUSCO-LOGO.jpg',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
};

const titleSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  flex: 1,
};

const logoStyles: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 8,
  objectFit: 'contain',
  border: '1px solid #e5e7eb',
  background: '#fff',
};

const statsContainerStyles: React.CSSProperties = {
  display: 'flex',
  gap: 20,
};

const statItemStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const statLabelStyles: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  textAlign: 'left',
};

const statValueStyles: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: '#111827',
  width: '100%',
  textAlign: 'center',
};

const CompanyInfoCard: React.FC = () => {

  return (
    <Card bordered={false} bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={headerStyles}>
        <div style={titleSectionStyles}>
          <img src={companyInfo.logoSrc} alt={companyInfo.title} style={logoStyles} />
          <Space direction="vertical" size={2} style={{ flex: 1, alignItems: 'flex-start' }} align="start">
            <Text style={{ fontSize: 18, fontWeight: 600, color: '#111827', lineHeight: 1 }}>
              {companyInfo.title}
            </Text>
            {companyInfo.subtitle && (
              <Text type="secondary" style={{ fontSize: 13, lineHeight: 1 }}>
                {companyInfo.subtitle}
              </Text>
            )}
          </Space>
        </div>
        <div style={statsContainerStyles}>
          <div style={statItemStyles}>
            <Text style={statValueStyles}>{companyInfo.stats.followers}</Text>
            <Text style={statLabelStyles}>粉丝数</Text>
          </div>
          <div style={statItemStyles}>
            <Text style={statValueStyles}>{companyInfo.stats.creators}</Text>
            <Text style={statLabelStyles}>签约人数</Text>
          </div>
        </div>
      </div>

      <Space direction="vertical" size={8} style={{ width: '100%' }} align="start">
        <Text
          style={{
            fontSize: 12,
            color: '#4b5563',
            width: '100%',
            textAlign: 'left',
          }}
        >
          {companyInfo.description}
        </Text>
      </Space>
    </Card>
  );
};

export { CompanyInfoCard };
