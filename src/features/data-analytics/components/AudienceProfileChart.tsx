import React, { useEffect, useMemo, useRef } from 'react';
import { Tooltip, Typography } from 'antd';
import type { InfluencerDemographics } from '../data/mockData';

const { Text } = Typography;

const segmentColors: Record<string, string> = {
  'Z世代': '#FF6B6B',
  '小镇青年': '#4ECDC4',
  '新锐白领': '#45B7D1',
  '都市蓝领': '#96CEB4',
  '资深中产': '#FFEAA7',
  '小镇中老年': '#DDA0DD',
  '精致妈妈': '#FFB6C1',
  '都市银发': '#87CEEB',
};

const CANVAS_SIZE = 48;
const PIE_RADIUS = 20;

interface AudienceProfileChartProps {
  demographics?: InfluencerDemographics;
}

const AudienceProfileChart: React.FC<AudienceProfileChartProps> = ({ demographics }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !demographics) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawSegmentedPie(ctx, demographics);
  }, [demographics]);

  const tooltipContent = useMemo(() => {
    if (!demographics) {
      return <Text type="secondary">暂无画像数据</Text>;
    }

    return (
      <div style={{ minWidth: 160 }}>
        {Object.entries(demographics).map(([segment, ratio]) => (
          <div key={segment} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
            <Text>{segment}</Text>
            <Text strong>{`${(ratio * 100).toFixed(1)}%`}</Text>
          </div>
        ))}
      </div>
    );
  }, [demographics]);

  if (!demographics || Object.keys(demographics).length === 0) {
    return (
      <Tooltip title={tooltipContent}>
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">暂无</Text>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipContent} placement="top">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ cursor: 'pointer' }}
      />
    </Tooltip>
  );
};

const drawSegmentedPie = (ctx: CanvasRenderingContext2D, demographics: InfluencerDemographics) => {
  const center = CANVAS_SIZE / 2;
  let startAngle = 0;

  Object.entries(demographics).forEach(([segment, ratio]) => {
    const endAngle = startAngle + ratio * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, PIE_RADIUS, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segmentColors[segment] ?? '#999';
    ctx.fill();
    startAngle = endAngle;
  });

  ctx.beginPath();
  ctx.arc(center, center, PIE_RADIUS, 0, Math.PI * 2);
  ctx.strokeStyle = '#d4d4d8';
  ctx.stroke();
};

export { AudienceProfileChart };
