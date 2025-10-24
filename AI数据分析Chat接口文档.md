# AI数据分析Chat Agent接口文档

## 概述
本文档定义了AI数据分析Chat Agent的完整接口规范，包括对话管理、消息存储、上下文管理等核心功能。

## 1. 基础接口

### 1.1 创建对话会话
```http
POST /api/chat/sessions
```

**请求参数**
```json
{
  "title": "数据分析咨询",
  "scenario": "data_analysis",
  "context_config": {
    "max_tokens": 8000,
    "compression_threshold": 200,
    "retention_rules": ["summary", "attribution", "conclusion"]
  }
}
```

**响应**
```json
{
  "code": 200,
  "data": {
    "session_id": "sess_1234567890",
    "title": "数据分析咨询",
    "created_at": "2025-10-21T14:30:00Z",
    "status": "active"
  }
}
```

### 1.2 发送消息
```http
POST /api/chat/sessions/{session_id}/messages
```

**请求参数**
```json
{
  "content": "请帮我分析最近一个月的用户增长趋势",
  "message_type": "text",
  "attachments": [
    {
      "type": "dataset",
      "url": "data://user_growth_202410.csv",
      "metadata": {
        "rows": 50000,
        "columns": ["date", "new_users", "active_users"]
      }
    }
  ],
  "options": {
    "enable_search": true,
    "enable_code_generation": true,
    "priority": "normal"
  }
}
```

**响应**
```json
{
  "code": 200,
  "data": {
    "message_id": "msg_1234567890",
    "session_id": "sess_1234567890",
    "content": "我来帮您分析用户增长趋势...",
    "message_type": "ai_response",
    "metadata": {
      "thinking_chain": [
        {
          "step": "data_validation",
          "content": "检查数据完整性和质量",
          "timestamp": "2025-10-21T14:30:01Z"
        },
        {
          "step": "trend_analysis",
          "content": "计算增长率和趋势线",
          "timestamp": "2025-10-21T14:30:03Z"
        }
      ],
      "search_history": [
        {
          "query": "用户增长分析方法",
          "source": "internal_knowledge",
          "relevance_score": 0.95
        }
      ],
      "references": [
        {
          "type": "data_source",
          "name": "user_growth_202410.csv",
          "used_columns": ["date", "new_users"]
        }
      ],
      "code_snippets": [
        {
          "language": "python",
          "code": "import pandas as pd\ndf = pd.read_csv('user_growth_202410.csv')",
          "purpose": "数据加载"
        }
      ]
    },
    "created_at": "2025-10-21T14:30:05Z"
  }
}
```

### 1.3 获取对话历史
```http
GET /api/chat/sessions/{session_id}/messages?page=1&size=20&context_optimized=true
```

**响应**
```json
{
  "code": 200,
  "data": {
    "messages": [
      {
        "message_id": "msg_1234567890",
        "content": "优化后的消息内容",
        "message_type": "user",
        "is_compressed": false,
        "importance_score": 0.95,
        "created_at": "2025-10-21T14:30:00Z"
      }
    ],
    "context_summary": {
      "total_tokens": 1500,
      "compressed_messages": 3,
      "key_points": [
        "用户增长分析需求",
        "数据源：user_growth_202410.csv",
        "分析维度：时间趋势"
      ]
    },
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 45,
      "has_more": true
    }
  }
}
```

## 2. 上下文管理接口

### 2.1 获取上下文状态
```http
GET /api/chat/sessions/{session_id}/context
```

**响应**
```json
{
  "code": 200,
  "data": {
    "current_tokens": 6500,
    "max_tokens": 8000,
    "compression_ratio": 0.75,
    "active_messages": 12,
    "compressed_messages": 8,
    "key_context": [
      {
        "type": "rule",
        "content": "数据分析专家角色设定",
        "importance": 1.0
      },
      {
        "type": "summary", 
        "content": "用户咨询增长趋势分析",
        "importance": 0.9
      }
    ]
  }
}
```

### 2.2 手动压缩上下文
```http
POST /api/chat/sessions/{session_id}/context/compress
```

**请求参数**
```json
{
  "strategy": "intelligent",
  "preserve_rules": ["role_definition", "key_conclusions"],
  "compression_ratio": 0.6
}
```

## 3. 消息搜索与检索

### 3.1 搜索历史对话
```http
GET /api/chat/search?query=用户增长&session_id=sess_1234567890&time_range=7d
```

**响应**
```json
{
  "code": 200,
  "data": {
    "results": [
      {
        "message_id": "msg_1234567890",
        "session_id": "sess_1234567890",
        "content_snippet": "...用户增长趋势分析显示...",
        "relevance_score": 0.95,
        "highlight": ["用户增长", "趋势分析"],
        "metadata": {
          "references_count": 2,
          "code_snippets_count": 1
        }
      }
    ],
    "total": 15,
    "search_metadata": {
      "query_processed": "用户增长 AND 趋势分析",
      "search_time_ms": 50
    }
  }
}
```

## 4. 会话管理接口

### 4.1 获取会话列表
```http
GET /api/chat/sessions?page=1&size=10&status=active
```

### 4.2 更新会话标题
```http
PUT /api/chat/sessions/{session_id}
```

### 4.3 删除会话
```http
DELETE /api/chat/sessions/{session_id}
```

### 4.4 归档会话
```http
POST /api/chat/sessions/{session_id}/archive
```

## 5. 分析与统计接口

### 5.1 获取对话统计
```http
GET /api/chat/analytics/sessions/{session_id}
```

**响应**
```json
{
  "code": 200,
  "data": {
    "message_count": 25,
    "total_tokens": 15000,
    "avg_response_time": 2.5,
    "topics": [
      {
        "name": "用户增长分析",
        "message_count": 8,
        "importance": 0.9
      }
    ],
    "code_executions": 5,
    "data_sources_used": 3
  }
}
```

---

# 存储架构设计

## 1. 数据库表结构

### 1.1 对话会话表 (chat_sessions)
```sql
CREATE TABLE chat_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(64) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    scenario VARCHAR(50) DEFAULT 'general',
    status ENUM('active', 'archived', 'deleted') DEFAULT 'active',
    context_config JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    archived_at TIMESTAMP NULL,
    
    INDEX idx_user_id_status (user_id, status),
    INDEX idx_created_at (created_at),
    INDEX idx_scenario (scenario)
);
```

### 1.2 消息内容表 (chat_messages) - 按时间分区
```sql
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    message_id VARCHAR(64) UNIQUE NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    parent_message_id VARCHAR(64),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text',
    message_type ENUM('user', 'ai_response', 'system') NOT NULL,
    token_count INT DEFAULT 0,
    importance_score DECIMAL(3,2) DEFAULT 0.5,
    is_compressed BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_session_created (session_id, created_at),
    INDEX idx_message_type (message_type),
    INDEX idx_importance_score (importance_score),
    FULLTEXT idx_content (content)
) PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
    PARTITION p2025_10 VALUES LESS THAN (UNIX_TIMESTAMP('2025-11-01')),
    PARTITION p2025_11 VALUES LESS THAN (UNIX_TIMESTAMP('2025-12-01')),
    PARTITION p2025_12 VALUES LESS THAN (UNIX_TIMESTAMP('2026-01-01'))
);
```

### 1.3 元数据扩展表 (message_metadata)
```sql
CREATE TABLE message_metadata (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    message_id VARCHAR(64) NOT NULL,
    metadata_type VARCHAR(50) NOT NULL,
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_message_type_key (message_id, metadata_type, metadata_key),
    INDEX idx_metadata_type (metadata_type),
    INDEX idx_created_at (created_at)
);
```

### 1.4 上下文管理表 (context_snapshots)
```sql
CREATE TABLE context_snapshots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(64) NOT NULL,
    snapshot_type ENUM('auto', 'manual', 'compression') DEFAULT 'auto',
    context_data JSON NOT NULL,
    token_count INT NOT NULL,
    compression_ratio DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_session_created (session_id, created_at),
    INDEX idx_snapshot_type (snapshot_type)
);