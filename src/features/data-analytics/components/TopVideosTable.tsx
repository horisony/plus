import React from 'react';

interface VideoRecord {
  key: string;
  publishDate: string;
  sales: string;
  views: string;
  interactionRate: string;
  completionRate3s: string;
  completionRate5s: string;
  playCurve: string;
}

const mockVideoData: VideoRecord[] = [
  {
    key: '1',
    publishDate: '2024-10-20',
    sales: '¥12,580',
    views: '158.2万',
    interactionRate: '8.5%',
    completionRate3s: '75.2%',
    completionRate5s: '58.3%',
    playCurve: '上升趋势',
  },
  {
    key: '2',
    publishDate: '2024-10-19',
    sales: '¥8,960',
    views: '92.5万',
    interactionRate: '6.8%',
    completionRate3s: '68.9%',
    completionRate5s: '52.1%',
    playCurve: '稳定',
  },
  {
    key: '3',
    publishDate: '2024-10-18',
    sales: '¥15,420',
    views: '205.7万',
    interactionRate: '9.2%',
    completionRate3s: '78.6%',
    completionRate5s: '61.4%',
    playCurve: '波动上升',
  },
  {
    key: '4',
    publishDate: '2024-10-17',
    sales: '¥6,750',
    views: '67.3万',
    interactionRate: '5.9%',
    completionRate3s: '65.4%',
    completionRate5s: '48.7%',
    playCurve: '下降趋势',
  },
  {
    key: '5',
    publishDate: '2024-10-16',
    sales: '¥11,230',
    views: '136.8万',
    interactionRate: '7.6%',
    completionRate3s: '72.1%',
    completionRate5s: '55.9%',
    playCurve: '稳定上升',
  },
];

interface TopVideosTableProps {
  onDataDetail?: (record: VideoRecord) => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '120px 120px 100px 80px 90px 90px 100px 120px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #e5e5e5',
  },
  headerCell: {
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #e5e5e5',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '120px 120px 100px 80px 90px 90px 100px 120px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    fontSize: '12px',
    color: '#333',
    borderRight: '1px solid #f3f4f6',
    minHeight: '48px',
  },
  salesCell: {
    fontWeight: 600,
    color: '#f56565',
  },
  viewsCell: {
    fontWeight: 600,
    color: '#3182ce',
  },
  actionButton: {
    padding: '5px 10px',
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
};

const TopVideosTable: React.FC<TopVideosTableProps> = ({ onDataDetail }) => {
  const handleDataDetail = (record: VideoRecord) => {
    // eslint-disable-next-line no-console
    console.log('查看视频数据详情:', record);
    onDataDetail?.(record);
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableHeader}>
        <div style={styles.headerCell}>视频发布</div>
        <div style={styles.headerCell}>视频销售额</div>
        <div style={styles.headerCell}>播放量</div>
        <div style={styles.headerCell}>互动率</div>
        <div style={styles.headerCell}>3s完播率</div>
        <div style={styles.headerCell}>5s完播率</div>
        <div style={styles.headerCell}>播放曲线</div>
        <div style={styles.headerCell}>操作</div>
      </div>

      {mockVideoData.map((video) => (
        <div 
          key={video.key} 
          style={styles.listItem}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={styles.cell}>{video.publishDate}</div>
          <div style={{ ...styles.cell, ...styles.salesCell }}>{video.sales}</div>
          <div style={{ ...styles.cell, ...styles.viewsCell }}>{video.views}</div>
          <div style={styles.cell}>{video.interactionRate}</div>
          <div style={styles.cell}>{video.completionRate3s}</div>
          <div style={styles.cell}>{video.completionRate5s}</div>
          <div style={styles.cell}>{video.playCurve}</div>
          <div style={styles.cell}>
            <button
              type="button"
              style={styles.actionButton}
              onClick={() => handleDataDetail(video)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#666';
              }}
            >
              数据详情
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TopVideosTable };
export type { VideoRecord };