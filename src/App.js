import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditAvatar from './components/EditAvatar';
import CommercialDashboard from './components/CommercialDashboard';
import TopNavbar from './components/TopNavbar';
import WarningCardDetail from './components/WarningCardDetail';
import { ContentOpsPage } from './features/content-ops';
import { DataAnalyticsApp } from './features/data-analytics';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('data');
  const [userInfo, setUserInfo] = useState({
    name: '管理员',
    email: 'admin@plusco.com',
    avatar: null
  });

  const navigate = useNavigate();

  // 处理标签切换（现在通过路由跳转）
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const pageMap = {
      'data': 'dataAnalytics',
      'content': 'contentOps', 
      'commercial': 'commercial',
      'ai': 'dashboard'
    };
    if (pageMap[tabKey]) navigate(pageMap[tabKey]);
  };

  // 用户操作函数
  const handleLogin = () => {
    console.log('跳转到登录页面');
  };

  const handleLogout = () => {
    setUserInfo(null);
    console.log('用户已退出登录');
  };

  const handleProfile = () => {
    console.log('跳转到个人资料页面');
  };

  // 渲染页面内容（不包含导航栏）
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dataAnalytics':
        return <DataAnalyticsApp />;
      case 'dashboard':
        return <Dashboard onEditAvatar={() => setCurrentPage('editAvatar')} />;
      case 'commercial':
        return <CommercialDashboard />;
      case 'contentOps':
        return <ContentOpsPage />;
      case 'editAvatar':
        return <EditAvatar onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <DataAnalyticsApp />;
    }
  };

  return (
    <div className="App">
      <TopNavbar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userInfo={userInfo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/commercial" element={<CommercialDashboard />} />
          <Route path="/edit-avatar" element={<EditAvatar />} />
          <Route path="/warnings/:type" element={<WarningCardDetail />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)',
  }
};

export default App;