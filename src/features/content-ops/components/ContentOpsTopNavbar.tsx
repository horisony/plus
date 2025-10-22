import { Avatar, Badge, Button, Card, Space, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { designTokens } from '../constants/designTokens';

interface ContentOpsTopNavbarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  userInfo?: {
    name?: string;
    avatar?: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
}

const tabs = [
  { key: 'dataManager', label: '智慧数据管家' },
  { key: 'content', label: '内容运营' },
  { key: 'commercial', label: '商业化' },
  { key: 'ai', label: 'AI 经纪师' },
];

const ContentOpsTopNavbar: React.FC<ContentOpsTopNavbarProps> = ({
  activeTab,
  onTabChange,
  userInfo,
  onLogin,
  onLogout,
  onProfile,
}) => {
  const isAuthenticated = Boolean(userInfo?.name || userInfo?.avatar);

  const renderUserSection = () => {
    if (!isAuthenticated) {
      return (
        <Button type="primary" onClick={onLogin}>
          登录
        </Button>
      );
    }

    const avatarContent = userInfo?.avatar ? (
      <Avatar src={userInfo.avatar} size={40} />
    ) : (
      <Avatar size={40}>{userInfo?.name?.charAt(0) ?? 'U'}</Avatar>
    );

    return (
      <Space size="middle" align="center">
        <Badge count={3} size="small">
          <Button shape="circle" icon={<BellOutlined />} />
        </Badge>
        <Button type="text" onClick={onProfile} style={{ paddingInline: 0 }}>
          {avatarContent}
        </Button>
        <Button onClick={onLogout} type="link">
          退出
        </Button>
      </Space>
    );
  };

  return (
    <Card
      bordered={false}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 80,
      }}
      style={{
        borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
        borderRadius: 0,
        boxShadow: designTokens.shadows.sm,
      }}
    >
      <Space size={16} align="center">
        <img src="/brand/PLUSCO-logo.png" alt="PLUSCO" style={{ width: 32, height: 32 }} />
        <Typography.Title level={4} style={{ margin: 0 }}>
          PLUSCO
        </Typography.Title>
      </Space>

      <Space size={8}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            type={activeTab === tab.key ? 'primary' : 'text'}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </Space>

      {renderUserSection()}
    </Card>
  );
};

export default ContentOpsTopNavbar;
