import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Layout, Menu, Typography } from 'antd';
import {
  IdcardOutlined,
  LoginOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { AuthRole } from './features/auth/types';
import PLUSLogo from './PLUSLOGO.png';

const { Header } = Layout;
const { Text, Title } = Typography;

interface UserSnapshot {
  name: string;
  email?: string;
  avatar?: string | null;
  roles?: AuthRole[];
}

interface TopNavbarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  userInfo: UserSnapshot | null;
  onLogin: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onPermissionManage?: (role: AuthRole) => void;
  onLogoClick?: () => void;
  isOperationsMode?: boolean;
  operationsLabel?: string;
}

const brandButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  outline: 'none',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  background: '#ffffff',
  borderBottom: '1px solid #f0f0f0',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
  zIndex: 10,
};

const menuStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  borderBottom: 'none',
  marginLeft: 48,
};

const operationsTitleStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  fontWeight: 600,
  color: '#1f2933',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  flexShrink: 0,
};

const userInfoWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  maxWidth: 220,
};

const userInfoTextStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  lineHeight: 1.2,
  maxWidth: 160,
  overflow: 'hidden',
};

const userInfoLineStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
};

const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onTabChange,
  userInfo,
  onLogin,
  onLogout,
  onProfile,
  onPermissionManage,
  onLogoClick,
  isOperationsMode = false,
  operationsLabel,
}) => {
  const handleLogoButtonClick = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }
    if (!isOperationsMode) {
      onTabChange('data');
    }
  };

  const operationsHeading = operationsLabel ?? '运营后台';

  const tabs = useMemo(
    () => [
      { key: 'data', label: '智慧数据管家' },
      { key: 'content', label: '内容运营' },
      { key: 'commercial', label: '商业化' },
      { key: 'ai', label: 'AI 经纪人' },
    ],
    [],
  );

  const allowedRoleTokens = useMemo(() => (
    new Set([
      'plusco_role_department',
      'plusco_role_mcn',
      'plusco_role_super_admin',
      'plusco_role_mcn_employee',
    ].map((token) => token.toLowerCase()))
  ), []);

  const permissionRoles = useMemo(() => {
    if (!userInfo?.roles?.length) {
      return [] as AuthRole[];
    }
    return userInfo.roles.filter((role) => {
      const candidates = [role.roleId, role.name]
        .filter(Boolean)
        .map((value) => value!.toString().toLowerCase());
      return candidates.some((candidate) => allowedRoleTokens.has(candidate));
    });
  }, [allowedRoleTokens, userInfo?.roles]);

  const menuItems = useMemo<MenuProps['items']>(() => {
    if (!userInfo) {
      return [
        {
          key: 'login',
          label: '立即登录',
          icon: <LoginOutlined />,
        },
      ];
    }

    const items: MenuProps['items'] = [
      {
        key: 'profile',
        label: '个人资料',
        icon: <IdcardOutlined />,
      },
    ];

    if (permissionRoles.length > 0) {
      items.push({
        key: 'permission-management',
        label: '权限管理',
        icon: <SafetyCertificateOutlined />,
      });
    }

    items.push({ type: 'divider' });
    items.push({
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
    });

    return items;
  }, [permissionRoles, userInfo]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      onProfile();
      return;
    }
    if (key === 'logout') {
      onLogout();
      return;
    }
    if (key === 'login') {
      onLogin();
      return;
    }
    if (key === 'permission-management') {
      if (permissionRoles.length === 0) {
        return;
      }
      const [targetRole] = permissionRoles;
      onPermissionManage?.(targetRole);
      return;
    }
  };

  const handleTabSelect: MenuProps['onClick'] = ({ key }) => {
    onTabChange(key);
  };

  return (
    <Header style={headerStyle}>
      <button type="button" style={brandButtonStyle} onClick={handleLogoButtonClick} aria-label="返回主页">
        <img src={PLUSLogo} alt="PLUSCO" style={{ width: 40, height: 40 }} />
        <Title level={4} style={{ margin: 0 }}>
          PLUSCO
        </Title>
      </button>

      {isOperationsMode ? (
        <div style={operationsTitleStyle}>{operationsHeading}</div>
      ) : (
        <Menu
          mode="horizontal"
          selectedKeys={[activeTab]}
          items={tabs}
          onClick={handleTabSelect}
          style={menuStyle}
        />
      )}

      <div style={actionsStyle}>
        <Button shape="circle" icon={<MessageOutlined />} />
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          trigger={['hover', 'click']}
          placement="bottomRight"
        >
          <div style={userInfoWrapperStyle}>
            {userInfo ? (
              userInfo.avatar ? (
                <Avatar src={userInfo.avatar} alt={userInfo.name} />
              ) : (
                <Avatar>{userInfo.name.charAt(0)}</Avatar>
              )
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            <div style={userInfoTextStyle}>
              <Text strong style={userInfoLineStyle}>
                {userInfo?.name ?? '访客'}
              </Text>
              <Text type="secondary" style={{ ...userInfoLineStyle, fontSize: 12 }}>
                {userInfo?.email ?? '未登录'}
              </Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopNavbar;
