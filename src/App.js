import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AIAgent from './features/ai-agent/AIAgent';
import EditAvatar from './features/ai-agent/EditAvatar';
import UserAIAgentDashboard from './features/ai-agent/UserAIAgentDashboard';
import WarningCardDetail from './features/ai-agent/WarningCardDetail';
import CommercialDashboard from './features/commercial/CommercialDashboard';
import TopNavbar from './TopNavbar';
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

  // 使用 react-router 的路由表来渲染页面

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
    padding: '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)', // 减去导航栏高度
  }
};

export default App;