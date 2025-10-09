import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { chatApi } from '../../utils/chatApi';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从URL参数或location state获取聊天初始化数据
  const initData = location.state || {};
  
  // 获取当前用户信息 - 立即初始化
  const getCurrentUserInfo = () => {
    // TODO: 从全局状态或认证系统获取
    // 暂时模拟不同角色的用户
    const mockUsers = {
      brand: {
        userId: 'brand_001',
        userType: 'brand',
        name: '小米',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'brand_manager'
      },
      mcn: {
        userId: 'mcn_001', 
        userType: 'mcn',
        name: '无忧传媒',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'mcn_manager'
      },
      mcn_talent: {
        userId: 'talent_001',
        userType: 'mcn_talent', 
        name: '韫取',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'content_creator'
      }
    };
    
    // 根据initData判断用户类型，或使用默认
    const userType = initData.currentUserType || 'mcn_talent';
    return mockUsers[userType];
  };
  
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]); // 聊天列表
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUserInfo()); // 立即初始化
  const [selectedConversationId, setSelectedConversationId] = useState(conversationId);
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    initializeChat();
    loadConversationsList();
  }, [conversationId]);

  // 加载用户的对话列表
  const loadConversationsList = async () => {
    try {
      // TODO: 调用API获取用户的对话列表
      // const result = await chatApi.getConversations(currentUser?.userId);
      
      // 模拟对话列表数据
      const mockConversations = [
        {
          conversationId: 'conv_001',
          projectName: '小米SU7 发布会',
          lastMessage: '好的，现在开始为你匹配',
          lastMessageTime: '2025-10-10',
          participants: [
            { name: '奇光', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn' },
            { name: '小米', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand' }
          ],
          unreadCount: 0,
          isActive: conversationId === 'conv_001'
        },
        {
          conversationId: 'conv_002', 
          projectName: '华为Mate项目',
          lastMessage: '最近有档期呢',
          lastMessageTime: '昨天',
          participants: [
            { name: '通望MCN', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn' },
            { name: '华为', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand' }
          ],
          unreadCount: 2,
          isActive: conversationId === 'conv_002'
        },
        {
          conversationId: 'conv_003',
          projectName: '苹果发布会推广',
          lastMessage: '这个文件发现了一下',
          lastMessageTime: '昨天',
          participants: [
            { name: '奇光MCN', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn' },
            { name: '苹果', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand' }
          ],
          unreadCount: 0,
          isActive: conversationId === 'conv_003'
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('加载对话列表失败:', error);
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 初始化聊天
  const initializeChat = async () => {
    try {
      setIsLoading(true);

      if (conversationId && conversationId !== 'new') {
        // 加载已存在的对话
        await loadExistingConversation(conversationId);
      } else {
        // 创建新对话
        await createNewConversation();
      }
    } catch (error) {
      console.error('初始化聊天失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载已存在的对话
  const loadExistingConversation = async (convId) => {
    try {
      // 直接使用模拟数据，不调用API
      const mockConversation = {
        conversationId: convId,
        projectId: initData.projectId || 'project_001',
        projectName: initData.projectName || '小米SU7 发布会',
        participants: [
          {
            userId: 'brand_001',
            userType: 'brand',
            name: '小米',
            avatar: '/PLUSCO-LOGO.jpg',
            role: 'brand_manager'
          },
          {
            userId: 'mcn_001',
            userType: 'mcn', 
            name: '无忧传媒',
            avatar: '/PLUSCO-LOGO.jpg',
            role: 'mcn_manager'
          }
        ],
        conversationType: 'project_discussion',
        status: 'active',
        createdAt: '2025-10-08T10:00:00Z'
      };

      const mockMessages = [
        {
          messageId: 'msg_001',
          senderId: 'mcn_001',
          content: {
            type: 'text',
            text: '您好！关于小米SU7的推广项目，我们MCN有很多优质达人资源，可以为您提供专业的内容营销服务。'
          },
          timestamp: '2025-10-08T10:05:00Z',
          readBy: ['mcn_001']
        },
        {
          messageId: 'msg_002', 
          senderId: 'brand_001',
          content: {
            type: 'text',
            text: '谢谢！我们对你们的达人资源很感兴趣。能否先介绍一下你们在汽车领域的案例？'
          },
          timestamp: '2025-10-08T10:15:00Z',
          readBy: ['brand_001', 'mcn_001']
        }
      ];

      setConversation(mockConversation);
      setMessages(mockMessages);
      setParticipants(mockConversation.participants);
    } catch (error) {
      console.error('加载对话失败:', error);
    }
  };

  // 创建新对话
  const createNewConversation = async () => {
    try {
      // 从initData获取参与者信息，如果没有则使用默认值
      const otherParticipant = {
        userId: initData.targetUserId || 'mcn_001',
        userType: initData.targetUserType || 'mcn',
        name: initData.targetUserName || '无忧传媒',
        avatar: initData.targetUserAvatar || '/PLUSCO-LOGO.jpg',
        role: initData.targetUserRole || 'mcn_manager'
      };

      // 直接创建新对话，不调用API
      const newConversation = {
        conversationId: `conv_${Date.now()}`,
        projectId: initData.projectId || 'project_new',
        projectName: initData.projectName || '新项目讨论',
        participants: [currentUser, otherParticipant],
        conversationType: initData.conversationType || 'project_discussion',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setConversation(newConversation);
      setParticipants(newConversation.participants);
      
      // 添加系统欢迎消息
      const welcomeMessage = {
        messageId: `msg_${Date.now()}`,
        senderId: 'system',
        content: {
          type: 'system',
          text: `开始与 ${otherParticipant.name} 的项目沟通`
        },
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('创建对话失败:', error);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || !currentUser) return;

    const newMessage = {
      messageId: `msg_${Date.now()}`,
      senderId: currentUser.userId,
      content: {
        type: 'text',
        text: text
      },
      timestamp: new Date().toISOString(),
      readBy: [currentUser.userId]
    };

    // 立即添加到UI
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // 模拟发送成功，不调用API
    console.log('消息已发送（模拟）:', newMessage);
  };

  // 获取参与者信息
  const getParticipantInfo = (userId) => {
    if (!userId) return currentUser || { name: '未知用户', avatar: '/PLUSCO-LOGO.jpg' };
    return participants.find(p => p && p.userId === userId) || currentUser || { name: '未知用户', avatar: '/PLUSCO-LOGO.jpg' };
  };

  // 获取用户类型显示名称
  const getUserTypeDisplay = (userType) => {
    const typeMap = {
      'brand': '品牌方',
      'mcn': 'MCN机构', 
      'mcn_talent': 'MCN达人'
    };
    return typeMap[userType] || userType;
  };

  // 返回按钮处理
  const handleBack = () => {
    navigate(-1);
  };

  // 选择对话处理
  const handleSelectConversation = (convId) => {
    setSelectedConversationId(convId);
    navigate(`/chat/${convId}`, { replace: true });
  };

  if (isLoading && !conversation) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div>加载聊天中...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div style={styles.errorContainer}>
        <div>聊天加载失败</div>
        <button onClick={handleBack} style={styles.backButton}>返回</button>
      </div>
    );
  }

  // 获取聊天对象（排除当前用户）
  const chatTarget = participants.find(p => p && p.userId && p.userId !== currentUser?.userId) || participants[0];

  return (
    <div style={styles.container}>
      {/* 左侧聊天列表 */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <button onClick={handleBack} style={styles.backButton}>
            ← 返回
          </button>
        </div>
        
        <div style={styles.conversationsList}>
          {conversations.map((conv) => {
            // 安全获取对话名称
            const otherParticipant = conv.participants?.find(p => p && p.userType !== currentUser?.userType);
            const displayName = otherParticipant?.name || conv.projectName || '未知对话';
            
            return (
              <div 
                key={conv.conversationId}
                style={{
                  ...styles.conversationItem,
                  ...(selectedConversationId === conv.conversationId ? styles.conversationItemActive : {})
                }}
                onClick={() => handleSelectConversation(conv.conversationId)}
              >
                <div style={styles.conversationAvatar}>
                  <img src="/PLUSCO-LOGO.jpg" alt="" />
                </div>
                <div style={styles.conversationContent}>
                  <div style={styles.conversationHeader}>
                    <div style={styles.conversationName}>
                      {displayName}
                    </div>
                    <div style={styles.conversationRightInfo}>
                      {conv.unreadCount > 0 && (
                        <div style={styles.unreadBadge}>{conv.unreadCount}</div>
                      )}
                      <div style={styles.conversationTime}>{conv.lastMessageTime}</div>
                    </div>
                  </div>
                  <div style={styles.conversationPreview}>
                    {conv.lastMessage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧聊天区域 */}
      <div style={styles.chatArea}>
        {conversation ? (
          <>
            {/* 聊天头部 */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderLeft}>
                <div style={styles.chatAvatar}>
                  <img src="/PLUSCO-LOGO.png" alt="" />
                </div>
                <div style={styles.chatHeaderInfo}>
                  <div style={styles.chatHeaderName}>{chatTarget?.name}</div>
                </div>
              </div>
              <div style={styles.chatHeaderRight}>
                <button style={styles.moreButton}>⋯</button>
              </div>
            </div>

            {/* 聊天消息区域 */}
            <div style={styles.messagesContainer} ref={chatContainerRef}>
              {messages.map((message) => {
                const sender = getParticipantInfo(message.senderId);
                const isCurrentUser = message.senderId === currentUser?.userId;
                const isSystemMessage = message.isSystemMessage;

                if (isSystemMessage) {
                  return (
                    <div key={message.messageId} style={styles.systemMessage}>
                      <div style={styles.systemMessageText}>{message.content.text}</div>
                    </div>
                  );
                }

                return (
                  <div key={message.messageId} style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    marginBottom: '4px',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '4px',
                      maxWidth: '75%',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row'
                    }}>
                      <div style={styles.senderAvatar}>
                        <img src="/PLUSCO-LOGO.jpg" 
                             alt={isCurrentUser ? currentUser?.name : sender?.name} />
                      </div>
                      
                      <div style={{
                        ...styles.messageBubble,
                        ...(isCurrentUser ? styles.messageBubbleUser : styles.messageBubbleOther)
                      }}>
                        <div style={styles.messageContent}>
                          {message.content.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 输入区域 */}
            <div style={styles.inputContainer}>
              <div style={styles.inputWrapper}>
                <textarea
                  style={styles.textarea}
                  placeholder="人工接客回复小米"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                
                <div style={styles.inputActions}>
                  <button style={styles.addButton}>+</button>
                  <button 
                    style={{
                      ...styles.sendButton,
                      ...(isLoading || !input.trim() ? styles.sendButtonDisabled : {})
                    }}
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.emptyChatArea}>
            <div style={styles.emptyMessage}>选择一个对话开始聊天</div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 80px)',
    maxHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden'
  },

  // 左侧栏样式
  sidebar: {
    width: '280px',
    minWidth: '280px',
    backgroundColor: '#e6f4ff',
    borderRight: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 80px)',
    overflow: 'hidden'
  },

  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderBottom: '1px solid #e5e5e5',
    height: '40px',
    flexShrink: 0
  },

  sidebarTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333'
  },

  addChatButton: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  conversationsList: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0
  },

  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s',
    position: 'relative',
    minHeight: '48px'
  },

  conversationItemActive: {
    backgroundColor: '#e6f7ff',
    borderRight: '3px solid #1890ff'
  },

  conversationAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '8px',
    flexShrink: 0
  },

  conversationContent: {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
    paddingRight: '8px'
  },

  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px'
  },

  conversationName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '140px',
    textAlign: 'left'
  },

  conversationRightInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    flexShrink: 0
  },

  conversationTime: {
    fontSize: '11px',
    color: '#999',
    flexShrink: 0,
    textAlign: 'right'
  },

  conversationPreview: {
    fontSize: '12px',
    color: '#666',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
    lineHeight: '1.3',
    textAlign: 'left'
  },

  unreadBadge: {
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px'
  },

  // 右侧聊天区域样式
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    height: 'calc(100vh - 80px)',
    maxHeight: 'calc(100vh - 80px)',
    overflow: 'hidden'
  },

  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderBottom: '1px solid #e5e5e5',
    height: '40px',
    flexShrink: 0
  },

  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center'
  },

  chatAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '10px'
  },

  chatHeaderInfo: {
    display: 'flex',
    flexDirection: 'column'
  },

  chatHeaderName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },

  chatHeaderStatus: {
    fontSize: '11px',
    color: '#52c41a'
  },

  chatHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  projectTag: {
    padding: '3px 8px',
    backgroundColor: '#f0f8ff',
    color: '#1890ff',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
    maxWidth: '120px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },

  moreButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666'
  },

  emptyChatArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  emptyMessage: {
    fontSize: '16px',
    color: '#999'
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px'
  },
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1890ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px'
  },
  
  backButton: {
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#1890ff',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      color: '#40a9ff',
      textDecoration: 'underline'
    }
  },
  
  messagesContainer: {
    height: 'calc(100vh - 170px)',
    maxHeight: 'calc(100vh - 170px)',
    padding: '8px 12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  
  systemMessage: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0'
  },
  
  systemMessageText: {
    fontSize: '11px',
    color: '#999',
    backgroundColor: '#f0f0f0',
    padding: '4px 10px',
    borderRadius: '10px'
  },
  

  
  senderAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0
  },
  
  messageBubble: {
    maxWidth: '70%',
    padding: '4px 8px',
    borderRadius: '10px',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    position: 'relative'
  },
  
  messageBubbleUser: {
    backgroundColor: '#1890ff',
    color: '#fff',
    borderBottomRightRadius: '6px'
  },
  
  messageBubbleOther: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderBottomLeftRadius: '6px'
  },
  
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.4'
  },
  
  inputContainer: {
    padding: '6px 12px 8px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e5e5',
    height: '50px',
    flexShrink: 0
  },
  
  inputWrapper: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '6px 35px 6px 10px',
    display: 'flex',
    alignItems: 'center',
    height: '32px'
  },
  
  textarea: {
    width: '100%',
    height: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '20px'
  },
  
  inputActions: {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  },
  
  addButton: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  sendButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  },
  
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
};

// 添加旋转动画的CSS
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 将keyframes注入到document中
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

export default ChatPage;