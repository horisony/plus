import React from 'react';

interface RadarChartProps {
  data: {
    viewData: number;
    liveData: number;
    brandData: number;
    audienceData: number;
  };
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const chartPadding = 15; // 控制雷达图与容器边界的距离
  const radius = (size - chartPadding) / 2; // 留边距
  
  // 五边形的五个顶点角度（从顶部开始，顺时针）
  const angles = [
    -Math.PI / 2, // 顶部 - 视频数据
    -Math.PI / 2 + (2 * Math.PI) / 5, // 右上 - 直播数据
    -Math.PI / 2 + (4 * Math.PI) / 5, // 右下 - 商品数据
    -Math.PI / 2 + (6 * Math.PI) / 5, // 左下 - 种草数据
    -Math.PI / 2 + (8 * Math.PI) / 5, // 左上 - 用户画像
  ];

  const labels = ['视频数据', '直播数据', '商品数据', '种草数据', '用户画像'];
  const values = [
    data.viewData,
    data.liveData,
    data.brandData,
    data.audienceData,
  ];

  // 计算多边形顶点
  const getPolygonPoints = (scale: number) => {
    return angles
      .map((angle) => {
        const x = center + Math.cos(angle) * radius * scale;
        const y = center + Math.sin(angle) * radius * scale;
        return `${x},${y}`;
      })
      .join(' ');
  };

  // 计算数据多边形顶点
  const dataPoints = angles
    .map((angle, index) => {
      const value = values[index];
      const x = center + Math.cos(angle) * radius * value;
      const y = center + Math.sin(angle) * radius * value;
      return `${x},${y}`;
    })
    .join(' ');

  // 计算标签位置
  const getLabelPosition = (index: number) => {
    const angle = angles[index];
  const labelRadius = radius + 12;
    const x = center + Math.cos(angle) * labelRadius;
    const y = center + Math.sin(angle) * labelRadius;
    return { x, y };
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={size} height={size} style={{ background: 'transparent' }}>
        {/* 网格线 */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <polygon
            key={scale}
            points={getPolygonPoints(scale)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* 从中心到顶点的连线 */}
        {angles.map((angle, index) => {
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据区域 */}
        <polygon
          points={dataPoints}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

      </svg>

      {/* 标签 */}
      {labels.map((label, index) => {
        if (index === 0) {
          return null;
        }
        const pos = getLabelPosition(index);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: pos.x - 30,
              top: pos.y - 10,
              width: 60,
              textAlign: 'center',
              fontSize: 11,
              color: '#6b7280',
              fontWeight: 500,
              pointerEvents: 'none',
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export { RadarChart };