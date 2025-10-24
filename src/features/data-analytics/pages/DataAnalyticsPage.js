import React, { useState, useEffect } from 'react';
import { InfluencerTable } from '../components/InfluencerTable';
import { FilterPanel } from '../components/FilterPanel';
import { mockInfluencerData } from '../data/mockData';

const DataAnalyticsPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [filters, setFilters] = useState({
    timeRange: '30d',
    platform: 'douyin',
    dataDimension: 'fans,views'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 加载模拟数据
    setInfluencers(mockInfluencerData);
    setFilteredInfluencers(mockInfluencerData);
  }, []);

  // 处理筛选逻辑
  useEffect(() => {
    let filtered = [...influencers];

    // 按搜索关键词筛选
    if (searchQuery) {
      filtered = filtered.filter(inf => 
        inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInfluencers(filtered);
  }, [influencers, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div style={styles.container}>
      {/* 筛选面板 */}
      <FilterPanel 
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 达人数据表格 */}
      <InfluencerTable 
        influencers={filteredInfluencers}
        onInfluencerSelect={(influencer) => {
          console.log('Selected influencer:', influencer);
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)',
  },
};

export { DataAnalyticsPage };
export default DataAnalyticsPage;
