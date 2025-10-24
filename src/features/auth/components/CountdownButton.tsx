import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface CountdownButtonProps {
  duration?: number;
  onClick: () => Promise<void> | void;
  disabled?: boolean;
  buttonProps?: ButtonProps;
  idleText?: string;
  runningTextBuilder?: (remaining: number) => string;
}

const DEFAULT_DURATION = 60;

const CountdownButton: React.FC<CountdownButtonProps> = ({
  duration = DEFAULT_DURATION,
  onClick,
  disabled = false,
  buttonProps,
  idleText = '获取验证码',
  runningTextBuilder = (remaining) => `${remaining}s 后可重试`,
}) => {
  const [remaining, setRemaining] = useState<number>(0);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (remaining <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [remaining]);

  const handleClick = async () => {
    if (disabled || isSubmitting || remaining > 0) {
      return;
    }
    try {
      setSubmitting(true);
      await onClick();
      setRemaining(duration);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Countdown action interrupted:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const buttonText = remaining > 0 ? runningTextBuilder(remaining) : idleText;

  return (
    <Button
      {...buttonProps}
      disabled={disabled || remaining > 0 || buttonProps?.disabled}
      loading={isSubmitting}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
};

export default CountdownButton;
