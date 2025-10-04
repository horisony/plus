import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EditAvatar from './components/EditAvatar';
import CommercialDashboard from './components/CommercialDashboard';
import TopNavbar from './components/TopNavbar';
import { ContentOpsPage } from './features/content-ops';
import { DataAnalyticsApp } from './features/data-analytics';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('data');
  const [userInfo, setUserInfo] = useState({
    name: '管理员',
    email: 'admin@plusco.com',
    avatar: null
  });

  // 处理标签切换
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    
    const pageMap = {
      'data': 'dataAnalytics',
      'content': 'contentOps', 
      'commercial': 'commercial',
      'ai': 'dashboard'
    };
    
    if (pageMap[tabKey]) {
      setCurrentPage(pageMap[tabKey]);
    }
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
      {/* TopNavbar 放在 App.js 中，统一管理 */}
      <TopNavbar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userInfo={userInfo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
      
      {/* 页面内容区域 */}
      <div style={styles.content}>
        {renderPageContent()}
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)', // 减去导航栏高度
  }
};

export default App;