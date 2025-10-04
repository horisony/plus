import React, { useRef, useEffect } from 'react';

export const AudienceProfileChart = ({ demographics }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && demographics) {
      drawEightGroupsMiniPie(canvasRef.current, demographics);
    }
  }, [demographics]);

  // 绘制八大人群小饼图
  const drawEightGroupsMiniPie = (canvas, eightGroupsData) => {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const radius = 18;
    
    // 清空画布
    ctx.clearRect(0, 0, 40, 40);
    
    // 八大人群颜色配置
    const eightGroupsColors = {
      'Z世代': '#FF6B6B',      // 红色
      '小镇青年': '#4ECDC4',   // 青色
      '新锐白领': '#45B7D1',   // 蓝色
      '都市蓝领': '#96CEB4',   // 绿色
      '资深中产': '#FFEAA7',   // 黄色
      '小镇中老年': '#DDA0DD', // 紫色
      '精致妈妈': '#FFB6C1',   // 粉色
      '都市银发': '#87CEEB'    // 天蓝色
    };
    
    // 计算总数
    const total = Object.values(eightGroupsData).reduce((sum, value) => sum + value, 0);
    
    if (total === 0) return;
    
    // 绘制饼图
    let startAngle = 0;
    Object.entries(eightGroupsData).forEach(([group, value]) => {
      const ratio = value / total;
      const color = eightGroupsColors[group] || '#999';
      
      const endAngle = startAngle + (ratio * 2 * Math.PI);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = color;
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // 添加边框
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // 如果没有数据，显示默认图标
  if (!demographics || Object.keys(demographics).length === 0) {
    return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataIcon}>👥</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <canvas 
        ref={canvasRef}
        width="40" 
        height="40"
        style={styles.canvas}
        title="八大人群画像"
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  canvas: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  noDataContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  noDataIcon: {
    fontSize: '20px',
    opacity: 0.5,
  },
};
