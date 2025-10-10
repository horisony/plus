# 聊天接口 JSON 样例

## 🎯 接口1: 简单聊天接口（前端管理上下文）

### 接口地址
```
POST /api/v1/chat
```

### 请求头
```json
{
  "Content-Type": "application/json",
  "X-User-ID": "test-user-123"
}
```

### 请求体样例

#### 最简单的请求
```json
{
  "agent_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "你好，请介绍一下自己"
}
```

#### 包含对话上下文的请求
```json
{
  "agent_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "那你能帮我写代码吗？",
  "conversation_context": [
    {
      "role": "user",
      "content": "你好，请介绍一下自己",
      "timestamp": "2025-10-07T10:25:00Z"
    },
    {
      "role": "assistant", 
      "content": "你好！我是智能编程助手，可以帮你解决各种编程问题。",
      "timestamp": "2025-10-07T10:25:05Z"
    }
  ],
  "stream": false,
  "temperature": 0.8,
  "max_tokens": 1500
}
```

### 响应体样例
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "聊天成功",
  "data": {
    "conversation_id": "temp_conv_a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "agent_info": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "智能编程助手",
      "avatar": "https://example.com/avatars/coding-assistant.jpg"
    },
    "response": {
      "content": "当然可以！我很擅长编程，可以帮你写Python、JavaScript、Go等多种语言的代码。你需要什么样的代码呢？",
      "role": "assistant",
      "timestamp": "2025-10-07T10:26:00Z",
      "finish_reason": "stop"
    },
    "usage": {
      "prompt_tokens": 95,
      "completion_tokens": 38,
      "total_tokens": 133
    },
    "model_info": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.8,
      "max_tokens": 1500
    },
    "conversation_context": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己",
        "timestamp": "2025-10-07T10:25:00Z"
      },
      {
        "role": "assistant",
        "content": "你好！我是智能编程助手，可以帮你解决各种编程问题。",
        "timestamp": "2025-10-07T10:25:05Z"
      },
      {
        "role": "user",
        "content": "那你能帮我写代码吗？",
        "timestamp": "2025-10-07T10:26:00Z"
      },
      {
        "role": "assistant",
        "content": "当然可以！我很擅长编程，可以帮你写Python、JavaScript、Go等多种语言的代码。你需要什么样的代码呢？",
        "timestamp": "2025-10-07T10:26:00Z"
      }
    ]
  },
  "request_id": "req-12345678",
  "timestamp": "2025-10-07T10:26:00Z"
}
```

---

## 🚀 接口2: 基于会话的聊天接口（推荐）

### 接口地址
```
POST /api/v1/chat/session
```

### 请求头
```json
{
  "Content-Type": "application/json",
  "X-User-ID": "test-user-123"
}
```

### 请求体样例

#### 创建新会话的请求
```json
{
  "agent_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "你好，我想学习Go语言",
  "context_strategy": "recent"
}
```

#### 继续现有会话的请求
```json
{
  "agent_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "能给我写一个Hello World的例子吗？",
  "session_id": "session_abc123def456",
  "context_strategy": "recent",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

#### 长对话使用总结策略
```json
{
  "agent_id": "550e8400-e29b-41d4-a716-446655440000", 
  "message": "我们之前讨论的那个算法问题，现在有新的想法",
  "session_id": "session_longconv789",
  "context_strategy": "summary"
}
```

### 响应体样例
```json
{
  "success": true,
  "code": "SUCCESS", 
  "message": "聊天成功",
  "data": {
    "conversation_id": "session_abc123def456",
    "agent_info": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Go语言导师",
      "avatar": "https://example.com/avatars/go-teacher.jpg"
    },
    "response": {
      "content": "当然可以！这是一个简单的Go语言Hello World程序：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}\n```\n\n你可以把这段代码保存为 `hello.go` 文件，然后运行 `go run hello.go` 来执行它。",
      "role": "assistant",
      "timestamp": "2025-10-07T10:30:15Z",
      "finish_reason": "stop"
    },
    "usage": {
      "prompt_tokens": 45,
      "completion_tokens": 72,
      "total_tokens": 117
    },
    "model_info": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "max_tokens": 1000
    },
    "conversation_context": [
      {
        "role": "user",
        "content": "你好，我想学习Go语言",
        "timestamp": "2025-10-07T10:30:00Z"
      },
      {
        "role": "assistant",
        "content": "很好的选择！Go是一门简洁高效的编程语言，特别适合后端开发和系统编程。",
        "timestamp": "2025-10-07T10:30:05Z"
      },
      {
        "role": "user",
        "content": "能给我写一个Hello World的例子吗？",
        "timestamp": "2025-10-07T10:30:10Z"
      },
      {
        "role": "assistant",
        "content": "当然可以！这是一个简单的Go语言Hello World程序：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}\n```\n\n你可以把这段代码保存为 `hello.go` 文件，然后运行 `go run hello.go` 来执行它。",
        "timestamp": "2025-10-07T10:30:15Z"
      }
    ]
  },
  "request_id": "req-87654321",
  "timestamp": "2025-10-07T10:30:15Z"
}
```

---

## 📋 字段说明

### 请求字段详解

| 字段名 | 类型 | 必填 | 说明 | 示例值 |
|-------|------|------|------|--------|
| `agent_id` | string | ✅ | 使用的AI代理ID | `"550e8400-e29b-41d4-a716-446655440000"` |
| `message` | string | ✅ | 用户输入的消息 | `"你好，请介绍一下自己"` |
| `session_id` | string | ❌ | 会话ID，不填则创建新会话 | `"session_abc123def456"` |
| `conversation_context` | array | ❌ | 对话历史上下文 | 见上方样例 |
| `stream` | boolean | ❌ | 是否流式输出 | `false` |
| `temperature` | number | ❌ | 温度设置(0-2) | `0.7` |
| `max_tokens` | integer | ❌ | 最大token数 | `1000` |
| `context_strategy` | string | ❌ | 上下文策略 | `"recent"`, `"full"`, `"summary"` |

### 响应字段详解

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `conversation_id` | string | 会话ID，用于后续对话 |
| `agent_info` | object | 代理基本信息 |
| `response` | object | AI回复内容和元数据 |
| `usage` | object | Token使用统计 |
| `model_info` | object | 使用的模型配置信息 |
| `conversation_context` | array | 完整的对话上下文 |

---

## 🔥 测试用的cURL命令

### 测试简单聊天接口
```bash
curl -X POST http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{
    "agent_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "你好，请介绍一下自己"
  }'
```

### 测试会话聊天接口
```bash
curl -X POST http://localhost:8080/api/v1/chat/session \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{
    "agent_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "你好，我想学习编程",
    "context_strategy": "recent"
  }'
```