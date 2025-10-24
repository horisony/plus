import React from 'react';

interface LiveRecord {
  key: string;
  date: string;
  title: string;
  avgViewers: string;
  maxOnline: string;
  interactionRate: string;
  sales: string;
  products: string;
  roomCount: string;
}

const mockLiveData: LiveRecord[] = [
  {
    key: '1',
    date: '2024-10-20',
    title: '科技好物分享 | 双十一预热专场',
    avgViewers: '2.3万',
    maxOnline: '5.8万',
    interactionRate: '12.5%',
    sales: '¥58,920',
    products: '智能家居套装',
    roomCount: '15.2万',
  },
  {
    key: '2',
    date: '2024-10-18',
    title: '手机数码测评 | 新品首发',
    avgViewers: '1.8万',
    maxOnline: '4.2万',
    interactionRate: '10.8%',
    sales: '¥42,150',
    products: '手机配件',
    roomCount: '12.6万',
  },
  {
    key: '3',
    date: '2024-10-16',
    title: '电脑装机教学 | 性价比推荐',
    avgViewers: '3.1万',
    maxOnline: '7.5万',
    interactionRate: '15.2%',
    sales: '¥78,640',
    products: '电脑硬件',
    roomCount: '18.9万',
  },
  {
    key: '4',
    date: '2024-10-14',
    title: '智能穿戴体验 | 健康科技',
    avgViewers: '1.5万',
    maxOnline: '3.8万',
    interactionRate: '9.6%',
    sales: '¥31,280',
    products: '智能手表',
    roomCount: '9.7万',
  },
  {
    key: '5',
    date: '2024-10-12',
    title: '家电好物推荐 | 生活必备',
    avgViewers: '2.7万',
    maxOnline: '6.3万',
    interactionRate: '13.4%',
    sales: '¥65,750',
    products: '小家电',
    roomCount: '16.8万',
  },
];

interface RecentLiveTableProps {
  onDataDetail?: (record: LiveRecord) => void;
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
    gridTemplateColumns: '100px 220px 110px 90px 80px 100px 120px 100px 120px',
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
    gridTemplateColumns: '100px 220px 110px 90px 80px 100px 120px 100px 120px',
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
  titleCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '12px 8px',
    fontSize: '12px',
    color: '#333',
    borderRight: '1px solid #f3f4f6',
    minHeight: '48px',
    textAlign: 'left',
  },
  titleText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  viewersCell: {
    fontWeight: 600,
    color: '#3182ce',
  },
  onlineCell: {
    fontWeight: 600,
    color: '#38a169',
  },
  salesCell: {
    fontWeight: 600,
    color: '#f56565',
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

const RecentLiveTable: React.FC<RecentLiveTableProps> = ({ onDataDetail }) => {
  const handleDataDetail = (record: LiveRecord) => {
    // eslint-disable-next-line no-console
    console.log('查看直播数据详情:', record);
    onDataDetail?.(record);
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableHeader}>
        <div style={styles.headerCell}>日期</div>
        <div style={styles.headerCell}>标题</div>
        <div style={styles.headerCell}>场均观看人数</div>
        <div style={styles.headerCell}>最高在线</div>
        <div style={styles.headerCell}>互动率</div>
        <div style={styles.headerCell}>销售额</div>
        <div style={styles.headerCell}>销售产品</div>
        <div style={styles.headerCell}>直播间人数</div>
        <div style={styles.headerCell}>操作</div>
      </div>

      {mockLiveData.map((live) => (
        <div 
          key={live.key} 
          style={styles.listItem}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={styles.cell}>{live.date}</div>
          <div style={styles.titleCell}>
            <div style={styles.titleText} title={live.title}>
              {live.title}
            </div>
          </div>
          <div style={{ ...styles.cell, ...styles.viewersCell }}>{live.avgViewers}</div>
          <div style={{ ...styles.cell, ...styles.onlineCell }}>{live.maxOnline}</div>
          <div style={styles.cell}>{live.interactionRate}</div>
          <div style={{ ...styles.cell, ...styles.salesCell }}>{live.sales}</div>
          <div style={styles.cell}>{live.products}</div>
          <div style={styles.cell}>{live.roomCount}</div>
          <div style={styles.cell}>
            <button
              type="button"
              style={styles.actionButton}
              onClick={() => handleDataDetail(live)}
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

export { RecentLiveTable };
export type { LiveRecord };