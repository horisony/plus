import React, { useMemo } from 'react';
import { Card, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import PhoneLoginForm from '../components/PhoneLoginForm';
import { useAuthContext } from '../context/AuthContext';
import type { LoginType } from '../types';
import './LoginPage.css';

const { Title, Paragraph } = Typography;

const validLoginTypes: LoginType[] = ['brand', 'mcn', 'talent'];

const useQueryLoginType = (): LoginType | null => {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const loginType = params.get('loginType') as LoginType | null;
  if (loginType && validLoginTypes.includes(loginType)) {
    return loginType;
  }
  return null;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginType = useQueryLoginType();
  const { isAuthenticated } = useAuthContext();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (!loginType) {
      navigate('/welcome', { replace: true });
    }
  }, [loginType, navigate]);

  if (!loginType) {
    return null;
  }

  return (
    <div className="login-page">
      <Card className="login-page__form-card" bordered={false}>
        <Title level={3} style={{ marginBottom: 8 }}>
          欢迎登录 PlusCo
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          请输入手机号登录，如需其他登录方式请联系管理员
        </Paragraph>
        
        {process.env.NODE_ENV === 'development' && (
          <Card size="small" style={{ marginBottom: 24, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Paragraph style={{ margin: 0, fontSize: 12 }}>
              <strong>演示账号 (验证码: 0000)：</strong><br/>
              • 18819060130 - MCN 管理员<br/>
              • 18819060131 - MCN 达人<br/>
              • 18819060132 - MCN 部门管理员<br/>
              • 18819060133 - 野生达人
            </Paragraph>
          </Card>
        )}
        
        <PhoneLoginForm loginType={loginType} onSuccess={(nextLoginType) => navigate(`/?loginType=${nextLoginType}`)} />
      </Card>
    </div>
  );
};

export default LoginPage;
