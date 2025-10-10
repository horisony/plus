# 聊天系统设计文档

## 概述

这是一个为PLUSCO平台设计的通用聊天系统，支持品牌方、MCN机构、MCN达人之间的项目相关沟通。

## 核心功能

### 1. 多角色支持
- **品牌方 (brand)**: 品牌管理员、市场经理等
- **MCN机构 (mcn)**: MCN管理员、商务经理等  
- **MCN达人 (mcn_talent)**: 内容创作者、KOL等

### 2. 聊天场景
- **项目讨论 (project_discussion)**: 一般项目沟通
- **商务谈判 (negotiation)**: 价格、条件谈判
- **技术支持 (support)**: 问题求助
- **通用聊天 (general)**: 其他沟通

### 3. 消息类型
- **文本消息**: 基础文字交流
- **图片消息**: 图片分享
- **文件消息**: 文档、附件等
- **系统消息**: 自动生成的提示信息

## 文件结构

```
src/
├── features/
│   └── chat/
│       └── ChatPage.js          # 聊天页面主组件
└── utils/
    └── chatApi.js              # 聊天API服务
```

## 数据结构设计

### 对话 (Conversation)
```javascript
{
  conversationId: "conv_12345",           // 对话唯一ID
  projectId: "project_456",               // 关联项目ID
  projectName: "小米SU7 发布会",          // 项目名称
  participants: [                         // 参与者列表
    {
      userId: "user_123",
      userType: "brand|mcn|mcn_talent",
      name: "小米",
      avatar: "avatar_url",
      role: "brand_manager",
      lastActiveAt: "2025-10-08T15:30:00Z"
    }
  ],
  conversationType: "project_discussion",  // 对话类型
  status: "active|archived|closed",       // 对话状态
  createdAt: "2025-10-08T10:00:00Z",     // 创建时间
  updatedAt: "2025-10-08T15:30:00Z",     // 更新时间
  lastMessageAt: "2025-10-08T15:30:00Z", // 最后消息时间
  unreadCount: 5,                         // 未读消息数
  metadata: {}                            // 扩展数据
}
```

### 消息 (Message)
```javascript
{
  messageId: "msg_789",                   // 消息唯一ID
  conversationId: "conv_123",            // 所属对话ID
  senderId: "user_123",                  // 发送者ID
  content: {                             // 消息内容
    type: "text|image|file|system",
    text: "消息文本",
    attachments: [                       // 附件列表
      {
        id: "att_001",
        type: "image|file|video|audio",
        url: "file_url",
        name: "文件名",
        size: 1024,
        mimeType: "image/jpeg"
      }
    ]
  },
  timestamp: "2025-10-08T15:30:00Z",     // 消息时间
  readBy: ["user_123"],                  // 已读用户列表
  isSystemMessage: false,                // 是否系统消息
  replyTo: "msg_456",                    // 回复的消息ID
  status: "sent|delivered|failed",       // 消息状态
  editedAt: "2025-10-08T15:35:00Z"      // 编辑时间
}
```

## API 接口设计

### 基础接口
- `GET /api/chat/conversations` - 获取对话列表
- `GET /api/chat/conversations/:id` - 获取对话详情
- `POST /api/chat/conversations` - 创建新对话
- `GET /api/chat/conversations/:id/messages` - 获取消息列表
- `POST /api/chat/conversations/:id/messages` - 发送消息
- `POST /api/chat/conversations/:id/read` - 标记已读
- `POST /api/chat/attachments` - 上传附件

### WebSocket 事件
- `message.new` - 新消息通知
- `message.read` - 消息已读通知
- `user.typing` - 用户正在输入
- `user.online` - 用户上线
- `user.offline` - 用户下线

## 使用方式

### 1. 从其他页面跳转到聊天
```javascript
// 在CommercialDashboard或ProjectDetail中
const chatData = {
  projectId: "project_123",
  projectName: "项目名称",
  currentUserType: "brand",           // 当前用户类型
  targetUserId: "mcn_001",           // 聊天对象ID
  targetUserType: "mcn",             // 聊天对象类型
  targetUserName: "无忧传媒",        // 聊天对象名称
  targetUserAvatar: "/avatar.jpg",   // 聊天对象头像
  conversationType: "project_discussion"
};

navigate('/chat/new', { state: chatData });
```

### 2. 直接访问已存在的对话
```javascript
navigate('/chat/conv_12345');
```

## 扩展功能

### 1. 实时通信
- 使用WebSocket实现实时消息推送
- 支持消息状态同步（已发送、已送达、已读）
- 用户在线状态显示

### 2. 消息功能
- 消息编辑和删除
- 消息回复和引用
- 富文本消息支持
- 表情包和贴纸

### 3. 文件处理
- 图片预览和缩放
- 文件上传进度显示
- 支持多种文件格式
- 文件安全检查

### 4. 用户体验
- 消息搜索功能
- 对话置顶和归档
- 消息免打扰设置
- 快捷回复模板

## 后端集成要点

### 1. 数据库设计
```sql
-- 对话表
CREATE TABLE conversations (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50),
  project_name VARCHAR(200),
  conversation_type VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_message_at TIMESTAMP
);

-- 参与者表
CREATE TABLE conversation_participants (
  conversation_id VARCHAR(50),
  user_id VARCHAR(50),
  user_type VARCHAR(20),
  user_name VARCHAR(100),
  user_avatar VARCHAR(500),
  user_role VARCHAR(50),
  joined_at TIMESTAMP,
  last_read_at TIMESTAMP
);

-- 消息表
CREATE TABLE messages (
  id VARCHAR(50) PRIMARY KEY,
  conversation_id VARCHAR(50),
  sender_id VARCHAR(50),
  content_type VARCHAR(20),
  content_text TEXT,
  attachments JSON,
  timestamp TIMESTAMP,
  reply_to VARCHAR(50),
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 消息已读状态表
CREATE TABLE message_reads (
  message_id VARCHAR(50),
  user_id VARCHAR(50),
  read_at TIMESTAMP
);
```

### 2. 权限控制
- 验证用户是否有权限访问对话
- 检查用户是否为对话参与者
- 限制文件上传大小和类型
- 敏感词过滤

### 3. 性能优化
- 消息分页加载
- 对话列表缓存
- 文件CDN存储
- WebSocket连接池管理

## 安全考虑

### 1. 数据验证
- 输入参数校验
- 文件类型检查
- 消息内容过滤
- SQL注入防护

### 2. 权限验证
- JWT token验证
- 用户身份确认
- 操作权限检查
- 跨站请求防护

### 3. 隐私保护
- 消息加密存储
- 敏感信息脱敏
- 数据访问日志
- 用户数据导出/删除

## 监控和日志

### 1. 业务监控
- 消息发送成功率
- 用户活跃度统计
- 对话创建数量
- 文件上传情况

### 2. 技术监控
- API响应时间
- WebSocket连接数
- 数据库查询性能
- 服务器资源使用

### 3. 错误日志
- API调用失败记录
- WebSocket连接异常
- 文件上传失败
- 数据库操作错误

## 测试策略

### 1. 单元测试
- API接口测试
- 组件功能测试
- 工具函数测试
- 数据验证测试

### 2. 集成测试
- 端到端聊天流程
- 多用户并发测试
- 文件上传下载
- WebSocket通信测试

### 3. 性能测试
- 大量消息加载
- 多用户同时在线
- 文件传输压力
- 数据库查询优化

## 部署说明

### 1. 环境变量
```bash
REACT_APP_API_URL=https://api.plusco.com
REACT_APP_WS_URL=wss://ws.plusco.com
REACT_APP_UPLOAD_MAX_SIZE=10485760
```

### 2. 构建配置
- 生产环境代码压缩
- 静态资源CDN配置
- WebSocket服务器部署
- 负载均衡配置

### 3. 监控部署
- 应用性能监控(APM)
- 日志收集系统
- 错误报警机制
- 健康检查端点