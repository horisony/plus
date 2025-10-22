import React from 'react';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { LoginType } from '../types';
import './RoleSelectionPage.css';

const { Title, Paragraph } = Typography;

interface RoleOption {
  key: LoginType;
  title: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    key: 'brand',
    title: '品牌',
    description: '品牌自营账号与达人合作全链路增长方案',
  },
  {
    key: 'mcn',
    title: 'MCN 机构',
    description: '多账号矩阵管理与数据洞察，助力机构规模化运营',
  },
  {
    key: 'talent',
    title: '达人',
    description: '达人个人增长、商业化合作与内容策略一站管理',
  },
];

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPreferredLoginType } = useAuthContext();

  const handleSelect = (loginType: LoginType) => {
    setPreferredLoginType(loginType);
    navigate(`/login?loginType=${loginType}`);
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-overlay">
        <header className="role-selection-header">
          <Space align="center" size={16}>
            <img src="/brand/PLUSCO-logo.png" alt="PlusCo" className="role-selection-logo" />
            <div>
              <Title level={3} style={{ margin: 0, color: '#ffffff' }}>
                PlusCo
              </Title>
              <Paragraph style={{ margin: 0, color: '#ffffffb3' }}>Give you a plus cofounder</Paragraph>
            </div>
          </Space>
        </header>

        <main className="role-selection-content">
          <Title level={2} style={{ color: '#ffffff', textAlign: 'center', marginBottom: 8 }}>
            请选择你的角色
          </Title>
          <Paragraph style={{ color: '#ffffffb3', textAlign: 'center', marginBottom: 32 }}>
            帮助我们为您定制最合适的智能助手体验
          </Paragraph>
          <Row gutter={[24, 24]} justify="center">
            {roleOptions.map((role) => (
              <Col xs={24} sm={12} md={8} key={role.key}>
                <Card
                  hoverable
                  className="role-selection-card"
                  onClick={() => handleSelect(role.key)}
                >
                  <Title level={4}>{role.title}</Title>
                  <Paragraph type="secondary" style={{ minHeight: 48 }}>
                    {role.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
