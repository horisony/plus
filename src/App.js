import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AIAgent from './features/ai-agent/AIAgent';
import EditAvatar from './features/ai-agent/EditAvatar';
import UserAIAgentDashboard from './features/ai-agent/UserAIAgentDashboard';
import WarningCardDetail from './features/ai-agent/WarningCardDetail';
import CommercialDashboard from './features/commercial/CommercialDashboard';
import ProjectDetail from './features/commercial/ProjectDetail';
import MarketingCampaign from './features/commercial/MarketingCampaign';
import ChatPage from './features/chat/ChatPage';
import TopNavbar from './TopNavbar';
import { ContentOpsPage } from './features/content-ops';
import InspirationSnippetsPage from './features/content-ops/pages/InspirationSnippetsPage';
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

  // 处理标签切换（使用路由）
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const pageMap = {
      data: '/data',
      content: '/content',
      commercial: '/commercial',
      ai: '/ai',
    };
    const path = pageMap[tabKey] || '/';
    navigate(path);
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
        return <ContentOpsPage onNavigateToSnippets={() => setCurrentPage('inspirationSnippets')} />;
      case 'inspirationSnippets':
        return <InspirationSnippetsPage onBack={() => setCurrentPage('contentOps')} />;
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
      <Routes>
        <Route path="/" element={<div style={styles.content}><DataAnalyticsApp /></div>} />
        <Route path="/ai" element={<div style={styles.content}><AIAgent /></div>} />
        <Route path="/commercial" element={<div style={styles.content}><CommercialDashboard /></div>} />
        <Route path="/commercial/project/:projectId" element={<div style={styles.content}><ProjectDetail /></div>} />
        <Route path="/marketing-campaign" element={<div style={styles.content}><MarketingCampaign /></div>} />
        <Route path="/marketing-campaign/:projectId" element={<div style={styles.content}><MarketingCampaign /></div>} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/edit-avatar/:userId" element={<EditAvatar />} />
        <Route path="/user-dashboard" element={<UserAIAgentDashboard />} />
        <Route path="/warnings/:type" element={<div style={styles.content}><WarningCardDetail /></div>} />
        <Route path="/content" element={<div style={styles.content}><ContentOpsPage /></div>} />
        <Route path="/data" element={<div style={styles.content}><DataAnalyticsApp /></div>} />
      </Routes>
    </div>
  );
}

const styles = {
  content: {
    height: 'calc(100vh - 80px)', // 减去导航栏高度
    maxHeight: 'calc(100vh - 80px)', // 确保不超过计算高度
    overflow: 'hidden', // 防止内容溢出
    backgroundColor: '#f5f7fa',
  }
};

export default App;