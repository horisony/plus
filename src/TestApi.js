import React, { useEffect, useState } from 'react';

const TestApi = () => {
  const [result, setResult] = useState('');

  const callApi = async () => {
    console.log('开始直接调用API...');
    
    try {
      // 测试不同的请求头组合
      const tests = [
        {
          name: '使用 X-User-ID: test-user-123',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': 'test-user-123',
          }
        },
        {
          name: '不使用任何自定义头',
          headers: {
            'Content-Type': 'application/json',
          }
        },
        {
          name: '使用其他用户ID',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': 'admin-user-123',
          }
        }
      ];

      let allResults = '';
      
      for (const test of tests) {
        console.log(`\n=== ${test.name} ===`);
        
        const response = await fetch('/api/v1/agents/test-user-123', {
          method: 'GET',
          headers: test.headers,
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log('Response text:', text.substring(0, 200));
        
        allResults += `\n=== ${test.name} ===\n`;
        allResults += `Status: ${response.status}\n`;
        allResults += `Content: ${text.substring(0, 100)}...\n`;
      }
      
      setResult(allResults);
    } catch (error) {
      console.error('API调用错误:', error);
      setResult(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>直接API调用测试</h1>
      <button onClick={callApi} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        重新调用API
      </button>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
        {result || '正在调用...'}
      </pre>
    </div>
  );
};

export default TestApi;