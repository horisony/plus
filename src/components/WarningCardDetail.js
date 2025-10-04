import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WarningCardDetail = ({ type: propType }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const initial = (propType || type || 'low').toLowerCase() === 'high' ? 'high' : 'low';
  const [activeTab, setActiveTab] = useState(initial);

  // 示例数据（可以替换为真实 API 数据）
  const lowData = [
    { name: '萌叔', brand: '品牌A', message: '直播怎么做起来呢', suggestion: '增加互动、优化标题' },
    { name: '小美', brand: '品牌B', message: '最近流量好差啊', suggestion: '分析投放&内容方向' },
    { name: '大熊', brand: '品牌C', message: '不知道怎么拍视频', suggestion: '提供脚本与拍摄建议' },
  ];

  const highData = [
    { name: '萌叔', brand: '品牌A', message: '直播怎么做起来呢', suggestion: '保持当前节奏并放大投放' },
    { name: '小花', brand: '品牌D', message: '视频爆了太开心！', suggestion: '跟进变现策略' },
    { name: '阿强', brand: '品牌E', message: '粉丝涨得飞快', suggestion: '增加互动转化活动' },
  ];

  const counts = useMemo(() => ({ low: lowData.length, high: highData.length, total: lowData.length + highData.length }), []);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setQuery('');
    setPage(1);
    navigate(`/warnings/${tab}`);
  };

  const activeData = activeTab === 'high' ? highData : lowData;
  // filtered and paginated
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeData;
    return activeData.filter(item => (
      (item.name || '').toLowerCase().includes(q) ||
      (item.brand || '').toLowerCase().includes(q) ||
      (item.message || '').toLowerCase().includes(q) ||
      (item.suggestion || '').toLowerCase().includes(q)
    ));
  }, [activeData, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const title = activeTab === 'low' ? '情绪低预警达人' : '情绪高预警达人';

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.leftHeader}>
          <button onClick={() => navigate('/')} style={styles.back}>← 返回</button>
        </div>
        <div style={styles.rightHeader}>
          <div style={styles.tabBar}>
            <button
              onClick={() => switchTab('low')}
              style={{ ...styles.tabButton, ...(activeTab === 'low' ? styles.tabActive : {}) }}
            >
              情绪低预警达人 ({counts.low})
            </button>
            <button
              onClick={() => switchTab('high')}
              style={{ ...styles.tabButton, ...(activeTab === 'high' ? styles.tabActive : {}) }}
            >
              情绪高预警达人 ({counts.high})
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableControls}>
        <input
          placeholder="搜索达人 / 品牌 / 关键词"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          style={styles.searchInput}
        />
        <div style={styles.pageSizeWrap}>
          <label style={{ marginRight: 8 }}>每页</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} style={styles.pageSizeSelect}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <div style={styles.tableHeaderRow}>
          <div style={styles.tableHeaderCell}>达人</div>
          <div style={styles.tableHeaderCell}>品牌方</div>
          <div style={styles.tableHeaderCell}>预警信息</div>
          <div style={styles.tableHeaderCell}>建议操作</div>
          <div style={styles.tableHeaderCell}></div>
        </div>

        {pageData.map((row, idx) => (
          <div key={idx} style={styles.tableBodyRow}>
            <div style={styles.tableCell}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={row.avatar || '/PLUSCO-LOGO.jpg'} alt={row.name} style={styles.avatarImg} />
                <div>
                  <div style={{ fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{row.brand}</div>
                </div>
              </div>
            </div>
            <div style={styles.tableCell}>{row.brand}</div>
            <div style={styles.tableCell}>{row.message}</div>
            <div style={styles.tableCell}>{row.suggestion}</div>
            <div style={{ ...styles.tableCell, textAlign: 'right' }}>
              <button style={styles.contactButton} onClick={() => alert(`联系 ${row.name}`)}>联系达人</button>
            </div>
          </div>
        ))}

        {/* pagination controls */}
        <div style={styles.pagination}>
          <button style={styles.pageButton} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>上一页</button>
          <div style={styles.pageInfo}>第 {page} / {totalPages} 页</div>
          <button style={styles.pageButton} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>下一页</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  back: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    textAlign: 'center',
    minWidth: '120px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1890ff',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  tabButton: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  tabActive: {
    background: '#1890ff',
    color: '#fff',
    borderColor: '#1890ff',
  },
  tableWrap: {
    marginTop: '12px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'none',
    padding: '12px 16px',
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
    fontWeight: 700,
    alignItems: 'center',
  },
  tableHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 2fr 1.5fr 0.6fr',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e5e5e5',
  },
  tableHeaderCell: {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
  },
  tableBodyRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 2fr 1.5fr 0.6fr',
    borderBottom: '1px solid #f3f4f6',
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    minHeight: '64px',
  },
  tableRow: {
    display: 'flex',
    padding: '12px 16px',
    alignItems: 'center',
    borderBottom: '1px solid #f6f6f6',
  },
  colName: { flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px' },
  colBrand: { flex: '0 0 140px', color: '#333' },
  colMessage: { flex: '2 1 320px', color: '#444' },
  colSuggestion: { flex: '1 1 240px', color: '#444' },
  colAction: { flex: '0 0 120px', textAlign: 'right' },
  contactButton: {
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  avatarImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
  }
  ,
  tableControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    gap: '12px',
  },
  searchInput: {
    flex: '1 1 320px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  pageSizeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pageSizeSelect: {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#fff'
  },
  pageButton: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #e8e8e8',
    background: '#fff',
    cursor: 'pointer'
  },
  pageInfo: {
    fontSize: '13px',
    color: '#666'
  }
};

export default WarningCardDetail;
