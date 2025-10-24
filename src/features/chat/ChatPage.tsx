import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ConversationMessage, ConversationSummary } from '../../shared/services/chatService';

type UserType = 'brand' | 'mcn' | 'mcn_talent';

type ChatParticipant = ConversationSummary['participants'][number];

interface ConversationListItem {
  conversationId: string;
  projectName: string;
  lastMessage: string;
  lastMessageTime: string;
  participants: ChatParticipant[];
  unreadCount: number;
}

interface ChatInitState {
  currentUserType?: UserType;
  projectId?: string;
  projectName?: string;
  targetUserId?: string;
  targetUserType?: UserType;
  targetUserName?: string;
  targetUserAvatar?: string;
  targetUserRole?: string;
  conversationType?: ConversationSummary['conversationType'];
}

const fallbackParticipant: ChatParticipant = {
  userId: 'unknown',
  userType: 'mcn',
  name: '未知用户',
  avatar: '/PLUSCO-LOGO.jpg',
  role: 'guest',
};

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initData = (location.state as ChatInitState | undefined) ?? {};

  // 设置当前激活的tab为AI经纪人
  useEffect(() => {
    const event = new CustomEvent('setActiveTab', { detail: 'ai' });
    window.dispatchEvent(event);
  }, []);

  const getCurrentUserInfo = (): ChatParticipant => {
    const mockUsers: Record<UserType, ChatParticipant> = {
      brand: {
        userId: 'brand_001',
        userType: 'brand',
        name: '小米',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'brand_manager',
      },
      mcn: {
        userId: 'mcn_001',
        userType: 'mcn',
        name: '无忧传媒',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'mcn_manager',
      },
      mcn_talent: {
        userId: 'talent_001',
        userType: 'mcn_talent',
        name: '韫取',
        avatar: '/PLUSCO-LOGO.jpg',
        role: 'content_creator',
      },
    };

    const userType: UserType = initData.currentUserType ?? 'mcn_talent';
    return mockUsers[userType];
  };

  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [currentUser] = useState<ChatParticipant>(getCurrentUserInfo);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(conversationId);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void initializeChat();
    void loadConversationsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversationsList = async (): Promise<void> => {
    try {
      const mockConversations: ConversationListItem[] = [
        {
          conversationId: 'conv_001',
          projectName: '小米SU7 发布会',
          lastMessage: '好的，现在开始为你匹配',
          lastMessageTime: '2025-10-10',
          participants: [
            { name: '奇光', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn', userId: 'mcn_002', role: 'mcn_partner' },
            { name: '小米', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand', userId: 'brand_001', role: 'brand_manager' },
          ],
          unreadCount: 0,
        },
        {
          conversationId: 'conv_002',
          projectName: '华为Mate项目',
          lastMessage: '最近有档期呢',
          lastMessageTime: '昨天',
          participants: [
            { name: '通望MCN', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn', userId: 'mcn_003', role: 'mcn_manager' },
            { name: '华为', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand', userId: 'brand_002', role: 'brand_manager' },
          ],
          unreadCount: 2,
        },
        {
          conversationId: 'conv_003',
          projectName: '苹果发布会推广',
          lastMessage: '这个文件发现了一下',
          lastMessageTime: '昨天',
          participants: [
            { name: '奇光MCN', avatar: '/PLUSCO-LOGO.jpg', userType: 'mcn', userId: 'mcn_004', role: 'mcn_manager' },
            { name: '苹果', avatar: '/PLUSCO-LOGO.jpg', userType: 'brand', userId: 'brand_003', role: 'brand_manager' },
          ],
          unreadCount: 0,
        },
      ];

      setConversations(mockConversations);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('加载对话列表失败:', error);
    }
  };

  const initializeChat = async (): Promise<void> => {
    try {
      setIsLoading(true);

      if (conversationId && conversationId !== 'new') {
        await loadExistingConversation(conversationId);
      } else {
        await createNewConversation();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('初始化聊天失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingConversation = async (convId: string): Promise<void> => {
    try {
      const mockConversation: ConversationSummary = {
        conversationId: convId,
        projectId: initData.projectId ?? 'project_001',
        projectName: initData.projectName ?? '小米SU7 发布会',
        participants: [
          {
            userId: 'brand_001',
            userType: 'brand',
            name: '小米',
            avatar: '/PLUSCO-LOGO.jpg',
            role: 'brand_manager',
          },
          {
            userId: 'mcn_001',
            userType: 'mcn',
            name: '无忧传媒',
            avatar: '/PLUSCO-LOGO.jpg',
            role: 'mcn_manager',
          },
        ],
        conversationType: 'project_discussion',
        status: 'active',
        createdAt: '2025-10-08T10:00:00Z',
        updatedAt: '2025-10-08T10:00:00Z',
        lastMessageAt: '2025-10-08T10:15:00Z',
        unreadCount: 0,
        metadata: {},
      };

      const mockMessages: ConversationMessage[] = [
        {
          messageId: 'msg_001',
          conversationId: convId,
          senderId: 'mcn_001',
          content: {
            type: 'text',
            text: '您好！关于小米SU7的推广项目，我们MCN有很多优质达人资源，可以为您提供专业的内容营销服务。',
          },
          timestamp: '2025-10-08T10:05:00Z',
          readBy: ['mcn_001'],
        },
        {
          messageId: 'msg_002',
          conversationId: convId,
          senderId: 'brand_001',
          content: {
            type: 'text',
            text: '谢谢！我们对你们的达人资源很感兴趣。能否先介绍一下你们在汽车领域的案例？',
          },
          timestamp: '2025-10-08T10:15:00Z',
          readBy: ['brand_001', 'mcn_001'],
        },
      ];

      setConversation(mockConversation);
      setMessages(mockMessages);
      setParticipants(mockConversation.participants);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('加载对话失败:', error);
    }
  };

  const createNewConversation = async (): Promise<void> => {
    try {
      const otherParticipant: ChatParticipant = {
        userId: initData.targetUserId ?? 'mcn_001',
        userType: initData.targetUserType ?? 'mcn',
        name: initData.targetUserName ?? '无忧传媒',
        avatar: initData.targetUserAvatar ?? '/PLUSCO-LOGO.jpg',
        role: initData.targetUserRole ?? 'mcn_manager',
      };

      const newConversation: ConversationSummary = {
        conversationId: `conv_${Date.now()}`,
        projectId: initData.projectId ?? 'project_new',
        projectName: initData.projectName ?? '新项目讨论',
        participants: [currentUser, otherParticipant],
        conversationType: initData.conversationType ?? 'project_discussion',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessageAt: undefined,
        unreadCount: 0,
        metadata: {},
      };

      setConversation(newConversation);
      setParticipants(newConversation.participants);

      const welcomeMessage: ConversationMessage = {
        messageId: `msg_${Date.now()}`,
        conversationId: newConversation.conversationId,
        senderId: 'system',
        content: {
          type: 'system',
          text: `开始与 ${otherParticipant.name} 的项目沟通`,
        },
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
        readBy: [],
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('创建对话失败:', error);
    }
  };

  // 轮询等待任务完成
  const pollForCompletion = async (chatId: string, conversationId: string): Promise<void> => {
    const maxAttempts = 30; // 最多轮询30次
    const pollInterval = 2000; // 每2秒轮询一次
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // 使用查看对话详情接口轮询状态
        const statusResponse = await fetch(`https://api.coze.cn/v3/chat/conversation/${conversationId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer pat_luAnppZCtLHJX6KzXFJI8KIduOGEKrO16E8o9XvprRdxm5jmrX8Yj7oyNnJ17Bdc',
            'Content-Type': 'application/json',
          },
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log(`轮询第${attempt + 1}次:`, statusData);
          
          if (statusData.data && statusData.data.status === 'completed') {
            // 任务完成，获取消息内容
            await handleCompletedResponse(conversationId);
            return;
          } else if (statusData.data && statusData.data.status === 'failed') {
            // 任务失败
            const errorMessage: ConversationMessage = {
              messageId: `msg_${Date.now() + 1}`,
              conversationId: conversation.conversationId,
              senderId: 'ai_assistant',
              content: {
                type: 'text',
                text: 'AI处理失败，请重试。',
              },
              timestamp: new Date().toISOString(),
              readBy: [currentUser.userId],
            };
            setMessages((prev) => [...prev, errorMessage]);
            return;
          }
        }
        
        // 等待下次轮询
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error(`轮询第${attempt + 1}次失败:`, error);
        if (attempt === maxAttempts - 1) {
          // 最后一次轮询失败
          const errorMessage: ConversationMessage = {
            messageId: `msg_${Date.now() + 1}`,
            conversationId: conversation.conversationId,
            senderId: 'ai_assistant',
            content: {
              type: 'text',
              text: 'AI处理超时，请重试。',
            },
            timestamp: new Date().toISOString(),
            readBy: [currentUser.userId],
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }
      }
    }
    
    // 超时处理
    const timeoutMessage: ConversationMessage = {
      messageId: `msg_${Date.now() + 1}`,
      conversationId: conversation.conversationId,
      senderId: 'ai_assistant',
      content: {
        type: 'text',
        text: 'AI处理超时，请重试。',
      },
      timestamp: new Date().toISOString(),
      readBy: [currentUser.userId],
    };
    setMessages((prev) => [...prev, timeoutMessage]);
  };

  // 处理完成状态，获取AI回复
  const handleCompletedResponse = async (conversationId: string): Promise<void> => {
    try {
      // 使用conversation_id获取消息历史
      const messagesResponse = await fetch(`https://api.coze.cn/v3/chat/conversation/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer pat_luAnppZCtLHJX6KzXFJI8KIduOGEKrO16E8o9XvprRdxm5jmrX8Yj7oyNnJ17Bdc',
          'Content-Type': 'application/json',
        },
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        console.log('消息历史:', messagesData);
        
        // 获取最后一条AI消息
        if (messagesData.data && messagesData.data.messages && messagesData.data.messages.length > 0) {
          const aiMessages = messagesData.data.messages.filter((msg: any) => msg.role === 'assistant');
          if (aiMessages.length > 0) {
            const lastAiMessage = aiMessages[aiMessages.length - 1];
            const aiResponse = lastAiMessage.content || lastAiMessage.text || '';
            
            const aiMessage: ConversationMessage = {
              messageId: `msg_${Date.now() + 1}`,
              conversationId: conversation.conversationId,
              senderId: 'ai_assistant',
              content: {
                type: 'text',
                text: aiResponse,
              },
              timestamp: new Date().toISOString(),
              readBy: [currentUser.userId],
            };
            setMessages((prev) => [...prev, aiMessage]);
            return;
          }
        }
      }
      
      // 如果无法获取消息，显示默认回复
      const fallbackMessage: ConversationMessage = {
        messageId: `msg_${Date.now() + 1}`,
        conversationId: conversation.conversationId,
        senderId: 'ai_assistant',
        content: {
          type: 'text',
          text: 'AI已处理完成，但无法获取回复内容。',
        },
        timestamp: new Date().toISOString(),
        readBy: [currentUser.userId],
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } catch (error) {
      console.error('获取消息失败:', error);
      const errorMessage: ConversationMessage = {
        messageId: `msg_${Date.now() + 1}`,
        conversationId: conversation.conversationId,
        senderId: 'ai_assistant',
        content: {
          type: 'text',
          text: 'AI已处理完成，但获取回复时出错。',
        },
        timestamp: new Date().toISOString(),
        readBy: [currentUser.userId],
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    const text = input.trim();
    if (!text || isLoading || !currentUser || !conversation) {
      return;
    }

    const newMessage: ConversationMessage = {
      messageId: `msg_${Date.now()}`,
      conversationId: conversation.conversationId,
      senderId: currentUser.userId,
      content: {
        type: 'text',
        text,
      },
      timestamp: new Date().toISOString(),
      readBy: [currentUser.userId],
    };

    setMessages((previous) => [...previous, newMessage]);

    setInput('');
    setIsLoading(true);

      try {
        // 调用扣子API
        console.log('开始调用扣子API...');
        // 不传递conversation_id，让API自动创建新对话
        const response = await fetch('https://api.coze.cn/v3/chat', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pat_luAnppZCtLHJX6KzXFJI8KIduOGEKrO16E8o9XvprRdxm5jmrX8Yj7oyNnJ17Bdc',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: '7564809084328198187',
          user_id: currentUser.userId,
          stream: true,
          auto_save_history: true,
          additional_messages: [
            {
              role: 'user',
              content: text,
              content_type: 'text'
            }
          ]
        })
      });

      console.log('API响应状态:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API请求失败:', response.status, errorText);
        throw new Error(`API请求失败: ${response.status} - ${errorText}`);
      }

      // 处理流式响应
      console.log('开始处理流式响应...');
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let aiResponse = '';
      let isFirstMessage = true;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('流式响应结束');
            break;
          }

          const chunk = decoder.decode(value);
          console.log('接收到数据块:', chunk);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const eventData = JSON.parse(data);
                console.log('流式响应事件:', eventData);

                // 处理AI回复消息
                if (eventData.data && 
                    eventData.data.role === 'assistant' && 
                    eventData.data.type === 'answer') {
                  
                  if (eventData.event === 'conversation.message.delta') {
                    // 增量消息，实时更新
                    if (isFirstMessage) {
                      // 创建AI消息
                      const aiMessage: ConversationMessage = {
                        messageId: `msg_${Date.now() + 1}`,
                        conversationId: conversation.conversationId,
                        senderId: 'mcn_001', // 使用现有的参与者ID
                        content: {
                          type: 'text',
                          text: eventData.data.content || '',
                        },
                        timestamp: new Date().toISOString(),
                        readBy: [currentUser.userId],
                      };
                      setMessages((prev) => {
                        console.log('创建AI消息:', aiMessage);
                        const newMessages = [...prev, aiMessage];
                        console.log('更新后的消息列表:', newMessages);
                        return newMessages;
                      });
                      isFirstMessage = false;
                    } else {
                      // 更新最后一条AI消息
                      setMessages((prev) => {
                        const updated = [...prev];
                        const lastMessage = updated[updated.length - 1];
                        if (lastMessage && lastMessage.senderId === 'mcn_001') {
                          lastMessage.content.text += eventData.data.content || '';
                          console.log('更新AI消息内容:', lastMessage.content.text);
                        }
                        return updated;
                      });
                    }
                  } else if (eventData.event === 'conversation.message.completed') {
                    // 消息完成，确保最终内容正确
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMessage = updated[updated.length - 1];
                      if (lastMessage && lastMessage.senderId === 'mcn_001') {
                        lastMessage.content.text = eventData.data.content || '';
                      }
                      return updated;
                    });
                  }
                }
              } catch (parseError) {
                console.error('解析流式响应失败:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('扣子API调用失败:', error);
      
      // 如果API调用失败，显示错误消息
      const errorMessage: ConversationMessage = {
        messageId: `msg_${Date.now() + 1}`,
        conversationId: conversation.conversationId,
        senderId: 'ai_assistant',
        content: {
          type: 'text',
          text: `抱歉，服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        },
        timestamp: new Date().toISOString(),
        readBy: [currentUser.userId],
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getParticipantInfo = (userId?: string): ChatParticipant => {
    if (!userId) {
      return currentUser ?? fallbackParticipant;
    }

    const participant = participants.find((item) => item?.userId === userId);
    return participant ?? currentUser ?? fallbackParticipant;
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleSelectConversation = (convId: string): void => {
    setSelectedConversationId(convId);
    navigate(`/chat/${convId}`, { replace: true });
  };

  if (isLoading && !conversation) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <div>加载聊天中...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div style={styles.errorContainer}>
        <div>聊天加载失败</div>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          返回
        </button>
      </div>
    );
  }

  const chatTarget = participants.find((participant) => participant?.userId && participant.userId !== currentUser?.userId) ?? participants[0];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <button type="button" onClick={handleBack} style={styles.backButton}>
            ← 返回
          </button>
        </div>

        <div style={styles.conversationsList}>
          {conversations.map((conv) => {
            const otherParticipant = conv.participants?.find((participant) => participant && participant.userType !== currentUser?.userType);
            const displayName = otherParticipant?.name ?? conv.projectName ?? '未知对话';

            return (
              <div
                key={conv.conversationId}
                style={{
                  ...styles.conversationItem,
                  ...(selectedConversationId === conv.conversationId ? styles.conversationItemActive : {}),
                }}
                onClick={() => handleSelectConversation(conv.conversationId)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleSelectConversation(conv.conversationId);
                  }
                }}
              >
                <div style={styles.conversationAvatar}>
                  <img src="/PLUSCO-LOGO.jpg" alt="对话头像" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={styles.conversationContent}>
                  <div style={styles.conversationHeader}>
                    <div style={styles.conversationName}>{displayName}</div>
                    <div style={styles.conversationRightInfo}>
                      {conv.unreadCount > 0 && <div style={styles.unreadBadge}>{conv.unreadCount}</div>}
                      <div style={styles.conversationTime}>{conv.lastMessageTime}</div>
                    </div>
                  </div>
                  <div style={styles.conversationPreview}>{conv.lastMessage}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderLeft}>
            <div style={styles.chatAvatar}>
              <img src="/PLUSCO-LOGO.png" alt="聊天对象头像" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={styles.chatHeaderInfo}>
              <div style={styles.chatHeaderName}>{chatTarget?.name ?? '我的对话'}</div>
            </div>
          </div>
          <div style={styles.chatHeaderRight}>
            <button type="button" style={styles.moreButton}>
              ⋯
            </button>
          </div>
        </div>

        <div style={styles.messagesContainer} ref={chatContainerRef}>
          {messages.map((message) => {
            const sender = getParticipantInfo(message.senderId);
            const isCurrentUser = message.senderId === currentUser?.userId;
            const isSystemMessage = message.isSystemMessage;

            if (isSystemMessage) {
              return (
                <div key={message.messageId} style={styles.systemMessage}>
                  <div style={styles.systemMessageText}>{message.content.text ?? ''}</div>
                </div>
              );
            }

            return (
              <div
                key={message.messageId}
                style={{
                  display: 'flex',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  marginBottom: '4px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '4px',
                    maxWidth: '75%',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(isCurrentUser ? styles.messageBubbleUser : styles.messageBubbleOther),
                    }}
                  >
                    <div style={styles.messageContent}>{message.content.text ?? ''}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <textarea
              style={styles.textarea}
              placeholder="人工接客回复小米"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
              disabled={isLoading}
            />

            <div style={styles.inputActions}>
              <button type="button" style={styles.addButton}>
                +
              </button>
              <button
                type="button"
                style={{
                  ...styles.sendButton,
                  ...(isLoading || !input.trim() ? styles.sendButtonDisabled : {}),
                }}
                onClick={() => void handleSendMessage()}
                disabled={isLoading || !input.trim()}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 80px)',
    maxHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    minWidth: '280px',
    backgroundColor: '#e6f4ff',
    borderRight: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 80px)',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderBottom: '1px solid #e5e5e5',
    height: '40px',
    flexShrink: 0,
  },
  conversationsList: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s',
    position: 'relative',
    minHeight: '48px',
  },
  conversationItemActive: {
    backgroundColor: '#e6f7ff',
    borderRight: '3px solid #1890ff',
  },
  conversationAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '8px',
    flexShrink: 0,
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
    paddingRight: '8px',
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  conversationName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '140px',
    textAlign: 'left',
  },
  conversationRightInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    flexShrink: 0,
  },
  conversationTime: {
    fontSize: '11px',
    color: '#999',
    flexShrink: 0,
    textAlign: 'right',
  },
  conversationPreview: {
    fontSize: '12px',
    color: '#666',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
    lineHeight: 1.3,
    textAlign: 'left',
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
    padding: '0 4px',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    height: 'calc(100vh - 80px)',
    maxHeight: 'calc(100vh - 80px)',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderBottom: '1px solid #e5e5e5',
    height: '40px',
    flexShrink: 0,
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  chatAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '10px',
  },
  chatHeaderInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeaderName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
  },
  chatHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  moreButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1890ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
  },
  backButton: {
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#1890ff',
    fontWeight: 500,
    textDecoration: 'none',
  },
  messagesContainer: {
    height: 'calc(100vh - 170px)',
    maxHeight: 'calc(100vh - 170px)',
    padding: '8px 12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  systemMessage: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0',
  },
  systemMessageText: {
    fontSize: '11px',
    color: '#999',
    backgroundColor: '#f0f0f0',
    padding: '4px 10px',
    borderRadius: '10px',
  },
  senderAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '4px 8px',
    borderRadius: '10px',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    position: 'relative',
  },
  messageBubbleUser: {
    backgroundColor: '#D1E3FF',
    color: '#333',
    borderBottomRightRadius: '6px',
  },
  messageBubbleOther: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderBottomLeftRadius: '6px',
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: 1.4,
    textAlign: 'left',
  },
  inputContainer: {
    padding: '6px 12px 8px',
    backgroundColor: '#fff',
    height: '55px',
    flexShrink: 0,
  },
  inputWrapper: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '6px 35px 6px 10px',
    display: 'flex',
    alignItems: 'center',
    height: '32px',
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
    lineHeight: '20px',
  },
  inputActions: {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
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
    justifyContent: 'center',
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
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

export default ChatPage;