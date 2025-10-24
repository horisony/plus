import React from 'react';
import { Button, Checkbox, Form, Input, message, Space, Typography } from 'antd';
import authService from '../../../shared/services/authService';
import { useAuthContext } from '../context/AuthContext';
import type { LoginType } from '../types';
import CountdownButton from './CountdownButton';
import DouyinLoginButton from './DouyinLoginButton';

const { Text } = Typography;

interface PhoneLoginFormProps {
  loginType: LoginType;
  onSuccess?: (loginType: LoginType) => void;
}

interface LoginFormValues {
  phone: string;
  smsCode: string;
  rememberMe: boolean;
}

const initialValues: LoginFormValues = {
  phone: '',
  smsCode: '',
  rememberMe: true,
};

const PHONE_REGEX = /^1[3-9]\d{9}$/;

const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({ loginType, onSuccess }) => {
  const [form] = Form.useForm<LoginFormValues>();
  const { login, loading } = useAuthContext();

  const handleSendSms = async () => {
    const phone = form.getFieldValue('phone');

    if (!PHONE_REGEX.test(phone)) {
      message.warning('请输入有效的11位手机号码');
      throw new Error('invalid-phone');
    }

      await authService.requestCaptcha({ phone, type: 'login' });
    message.success('验证码已发送');
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        phone: values.phone,
        smsCode: values.smsCode,
        loginType,
        rememberMe: values.rememberMe,
      });
      message.success('登录成功');
  onSuccess?.(loginType);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || '登录失败，请稍后重试');
      } else {
        message.error('登录失败，请稍后重试');
      }
    }
  };

  const handleDouyinLogin = () => {
    message.info('即将跳转抖音授权登录，功能待对接');
    window.open('https://open.douyin.com/platform', '_blank');
  };

  return (
    <Form<LoginFormValues>
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
    >
      <Form.Item<LoginFormValues>
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          {
            validator: (_, value) => {
              if (!value || PHONE_REGEX.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('手机号格式不正确'));
            },
          },
        ]}
      >
        <Input placeholder="请输入手机号" addonBefore="+86" maxLength={11} />
      </Form.Item>

      <Form.Item<LoginFormValues>
        label="短信验证码"
        name="smsCode"
        rules={[{ required: true, message: '请输入短信验证码' }]}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="请输入短信验证码" maxLength={6} />
          <CountdownButton
            duration={60}
            idleText="发送验证码"
            buttonProps={{ type: 'primary' }}
            onClick={async () => {
              await handleSendSms();
              // Returning void to satisfy CountdownButton signature
            }}
          />
        </Space.Compact>
      </Form.Item>

      <Form.Item<LoginFormValues> name="rememberMe" valuePropName="checked">
        <Checkbox>记住登录状态</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          手机号登录
        </Button>
      </Form.Item>

      <Form.Item>
        <DouyinLoginButton onClick={handleDouyinLogin} />
      </Form.Item>

      <Text type="secondary" style={{ fontSize: 12 }}>
        登录即表示你已阅读并同意平台的《用户协议》和《隐私政策》
      </Text>
    </Form>
  );
};

export default PhoneLoginForm;
