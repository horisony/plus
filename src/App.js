import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EditAvatar from './components/EditAvatar';
import './App.css'; // 保留现有的样式文件

function App() {
  const [page, setPage] = useState('dashboard'); // 初始页面为仪表盘

  const handlePageChange = (newPage) => {
    setPage(newPage); // 更新页面状态
  };

  return (
    <div className="App">
      {page === 'dashboard' ? (
        <Dashboard onEditAvatar={() => handlePageChange('editAvatar')} />
      ) : (
        <EditAvatar onBack={() => handlePageChange('dashboard')} />
      )}
    </div>
  );
}

export default App;