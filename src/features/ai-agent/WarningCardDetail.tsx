import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type WarningLevel = 'low' | 'high';

interface WarningEntry {
  name: string;
  brand: string;
  message: string;
  suggestion: string;
  avatar?: string;
}

interface WarningCardDetailProps {
  type?: WarningLevel;
}

const lowWarningData: WarningEntry[] = [
  { name: '萌叔', brand: '品牌A', message: '直播怎么做起来呢', suggestion: '增加互动、优化标题' },
  { name: '小美', brand: '品牌B', message: '最近流量好差啊', suggestion: '分析投放&内容方向' },
  { name: '大熊', brand: '品牌C', message: '不知道怎么拍视频', suggestion: '提供脚本与拍摄建议' },
];

const highWarningData: WarningEntry[] = [
  { name: '萌叔', brand: '品牌A', message: '直播怎么做起来呢', suggestion: '保持当前节奏并放大投放' },
  { name: '小花', brand: '品牌D', message: '视频爆了太开心！', suggestion: '跟进变现策略' },
  { name: '阿强', brand: '品牌E', message: '粉丝涨得飞快', suggestion: '增加互动转化活动' },
];

const WarningCardDetail: React.FC<WarningCardDetailProps> = ({ type: propType }) => {
  const params = useParams<{ type?: WarningLevel }>();
  const navigate = useNavigate();

  const initialLevel = (propType ?? params.type ?? 'low').toLowerCase() === 'high' ? 'high' : 'low';
  const [activeTab, setActiveTab] = useState<WarningLevel>(initialLevel as WarningLevel);
  const [brandFilter, setBrandFilter] = useState('');
  const [influencerFilter, setInfluencerFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const counts = useMemo(
    () => ({ low: lowWarningData.length, high: highWarningData.length, total: lowWarningData.length + highWarningData.length }),
    [],
  );

  const resetFilters = () => {
    setBrandFilter('');
    setInfluencerFilter('');
    setKeywordFilter('');
    setPage(1);
  };

  const handleSwitchTab = (level: WarningLevel) => {
    setActiveTab(level);
    resetFilters();
    navigate(`/warnings/${level}`);
  };

  const activeData = activeTab === 'high' ? highWarningData : lowWarningData;

  const filteredData = useMemo(() => {
    const brand = brandFilter.trim().toLowerCase();
    const influencer = influencerFilter.trim().toLowerCase();
    const keyword = keywordFilter.trim().toLowerCase();

    return activeData.filter((item) => {
      if (brand && !item.brand.toLowerCase().includes(brand)) {
        return false;
      }
      if (influencer && !item.name.toLowerCase().includes(influencer)) {
        return false;
      }
      if (keyword) {
        const matches = item.message.toLowerCase().includes(keyword) || item.suggestion.toLowerCase().includes(keyword);
        if (!matches) {
          return false;
        }
      }
      return true;
    });
  }, [activeData, brandFilter, influencerFilter, keywordFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageData = filteredData.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const title = activeTab === 'low' ? '情绪低预警达人' : '情绪高预警达人';

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div style={styles.headerInner}>
          <div style={styles.leftHeader}>
            <button type="button" onClick={() => navigate('/')} style={styles.back}>
              ← 返回
            </button>
            <div style={styles.pageTitle}>{title}</div>
          </div>

          <div style={styles.rightHeader}>
            <div style={styles.tabBar}>
              <button
                type="button"
                onClick={() => handleSwitchTab('low')}
                style={{ ...styles.tabButton, ...(activeTab === 'low' ? styles.tabActive : {}) }}
              >
                情绪低预警达人 ({counts.low})
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab('high')}
                style={{ ...styles.tabButton, ...(activeTab === 'high' ? styles.tabActive : {}) }}
              >
                情绪高预警达人 ({counts.high})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.controlsCard}>
        <div style={styles.filterRow}>
          <div style={styles.filterItem}>
            <div style={styles.filterLabel}>品牌</div>
            <input
              placeholder="输入品牌名"
              value={brandFilter}
              onChange={(event) => {
                setBrandFilter(event.target.value);
                setPage(1);
              }}
              style={styles.smallInput}
            />
          </div>

          <div style={styles.filterItem}>
            <div style={styles.filterLabel}>达人</div>
            <input
              placeholder="输入达人名"
              value={influencerFilter}
              onChange={(event) => {
                setInfluencerFilter(event.target.value);
                setPage(1);
              }}
              style={styles.smallInput}
            />
          </div>

          <div style={styles.filterItem}>
            <div style={styles.filterLabel}>关键词</div>
            <input
              placeholder="预警 / 建议"
              value={keywordFilter}
              onChange={(event) => {
                setKeywordFilter(event.target.value);
                setPage(1);
              }}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterItem}>
            <div style={styles.filterLabel}>每页</div>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              style={styles.pageSizeSelect}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#666', fontSize: 13 }}>
            共 {filteredData.length} 条结果
          </div>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <div style={styles.tableHeaderRow}>
          <div style={styles.tableHeaderCell}>达人</div>
          <div style={styles.tableHeaderCell}>品牌方</div>
          <div style={styles.tableHeaderCell}>预警信息</div>
          <div style={styles.tableHeaderCell}>建议操作</div>
          <div style={styles.tableHeaderCell} />
        </div>

        {pageData.map((row, index) => (
          <div key={`${row.name}-${index}`} style={styles.tableBodyRow}>
            <div style={styles.tableCell}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={row.avatar ?? '/PLUSCO-LOGO.jpg'} alt={row.name} style={styles.avatarImg} />
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
              <button
                type="button"
                style={styles.contactButton}
                onClick={() => window.alert(`联系 ${row.name}`)}
              >
                联系达人
              </button>
            </div>
          </div>
        ))}

        <div style={styles.pagination}>
          <button type="button" style={styles.pageButton} onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
            上一页
          </button>
          <div style={styles.pageInfo}>第 {page} / {totalPages} 页</div>
          <button
            type="button"
            style={styles.pageButton}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '12px',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  back: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
  },
  pageTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginLeft: '12px',
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
  controlsCard: {
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginTop: '12px',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  smallInput: {
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '140px',
  },
  searchInput: {
    flex: '0 0 auto',
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  pageSizeSelect: {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  tableWrap: {
    marginTop: '12px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 0.9fr 1.4fr 1.6fr 0.6fr',
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
    gridTemplateColumns: '1fr 0.9fr 1.4fr 1.6fr 0.6fr',
    borderBottom: '1px solid #f3f4f6',
  },
  tableCell: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    minHeight: '64px',
    wordBreak: 'break-word',
  },
  contactButton: {
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  avatarImg: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#fff',
  },
  pageButton: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #e8e8e8',
    background: '#fff',
    cursor: 'pointer',
  },
  pageInfo: {
    fontSize: '13px',
    color: '#666',
  },
};

export default WarningCardDetail;
