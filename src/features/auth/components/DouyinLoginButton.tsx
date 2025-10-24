import React from 'react';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

interface DouyinLoginButtonProps {
  onClick?: () => void;
  loading?: boolean;
  buttonProps?: ButtonProps;
}

const DouyinLoginButton: React.FC<DouyinLoginButtonProps> = ({ onClick, loading = false, buttonProps }) => (
  <Button
    type="default"
    icon={<PlayCircleOutlined />}
    size="large"
    block
    onClick={onClick}
    loading={loading}
    style={{
      background: 'linear-gradient(135deg, #111111 0%, #222222 40%, #ff0050 100%)',
      color: '#ffffff',
      border: 'none',
    }}
    {...buttonProps}
  >
    使用抖音账号登录
  </Button>
);

export default DouyinLoginButton;
