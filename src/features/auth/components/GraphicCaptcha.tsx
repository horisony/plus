import React, { useEffect, useMemo, useRef, useState } from 'react';

interface GraphicCaptchaProps {
  onCodeChange: (code: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 40;
const CHAR_POOL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const generateCode = (length = 4): string => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
  }
  return result;
};

const drawNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  for (let i = 0; i < 6; i += 1) {
    ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  for (let i = 0; i < 30; i += 1) {
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
    ctx.fill();
  }
};

const GraphicCaptcha: React.FC<GraphicCaptchaProps> = ({
  onCodeChange,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [code, setCode] = useState<string>(() => generateCode());

  const characters = useMemo(() => code.split(''), [code]);

  useEffect(() => {
    onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    characters.forEach((char, index) => {
      const fontSize = Math.floor(height * 0.6);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, 0.9)`;
      const x = (width / (characters.length + 1)) * (index + 1) - fontSize / 2;
      const y = height / 2 + fontSize / 2 - 4;
      const angle = (Math.random() - 0.5) * 0.6;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    drawNoise(ctx, width, height);
  }, [characters, height, width]);

  const handleRefresh = () => {
    setCode(generateCode());
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRefresh}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleRefresh();
        }
      }}
      className={className}
      style={{ cursor: 'pointer', display: 'inline-block', userSelect: 'none' }}
      aria-label="刷新图形验证码"
    >
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default GraphicCaptcha;
