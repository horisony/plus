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
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
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
  }, [messages, isWaitingForAI]);

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
    setIsWaitingForAI(true);

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
        
        // 显示错误消息给用户
        const errorMessage: ConversationMessage = {
          messageId: `error_${Date.now()}`,
          conversationId: conversation.conversationId,
          senderId: 'mcn_001',
          content: {
            type: 'text',
            text: `API请求失败 (${response.status}): ${errorText}`,
          },
          timestamp: new Date().toISOString(),
          readBy: [currentUser.userId],
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      // 处理流式响应
      console.log('开始处理流式响应...');
      const reader = response.body?.getReader();
      if (!reader) {
        console.error('无法读取响应流');
        const errorMessage: ConversationMessage = {
          messageId: `error_${Date.now()}`,
          conversationId: conversation.conversationId,
          senderId: 'mcn_001',
          content: {
            type: 'text',
            text: '无法读取API响应流',
          },
          timestamp: new Date().toISOString(),
          readBy: [currentUser.userId],
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const decoder = new TextDecoder();
      let aiMessageCreated = false;
      let currentEvent = '';

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
            // 处理event行
            if (line.startsWith('event:')) {
              currentEvent = line.slice(6).trim();
              console.log('当前事件类型:', currentEvent);
            } 
            // 处理data行
            else if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              if (data === '"[DONE]"' || data === '[DONE]') {
                console.log('流式响应完成标记');
                continue;
              }

              try {
                const eventData = JSON.parse(data);
                console.log('解析的数据:', currentEvent, eventData);

                // 处理增量消息 - 优先处理delta事件，实现实时显示
                if (currentEvent === 'conversation.message.delta' && 
                    eventData.role === 'assistant' && 
                    eventData.type === 'answer') {
                  
                  const content = eventData.content || '';
                  
                  if (!aiMessageCreated) {
                    // 第一次收到delta时创建AI消息
                    const aiMessage: ConversationMessage = {
                      messageId: eventData.id,
                      conversationId: conversation.conversationId,
                      senderId: 'mcn_001',
                      content: {
                        type: 'text',
                        text: content,
                      },
                      timestamp: new Date().toISOString(),
                      readBy: [currentUser.userId],
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setIsWaitingForAI(false);
                    aiMessageCreated = true;
                    console.log('AI消息已创建(首次delta):', content);
                  } else {
                    // 更新已存在的AI消息 - 使用不可变更新
                    setMessages(prev => {
                      const updated = [...prev];
                      const lastIndex = updated.length - 1;
                      const lastMessage = updated[lastIndex];
                      if (lastMessage && lastMessage.senderId === 'mcn_001') {
                        updated[lastIndex] = {
                          ...lastMessage,
                          content: {
                            ...lastMessage.content,
                            text: lastMessage.content.text + content
                          }
                        };
                      }
                      return updated;
                    });
                  }
                } else if (currentEvent === 'conversation.message.completed' && 
                           eventData.role === 'assistant' && 
                           eventData.type === 'answer') {
                  
                  // 消息完成，用完整内容替换（确保最终内容正确）
                  const content = eventData.content || '';
                  const reasoningContent = eventData.reasoning_content || '';
                  const fullContent = content + (reasoningContent ? '\n\n思考过程：\n' + reasoningContent : '');
                  
                  console.log('收到completed事件，完整内容:', fullContent);
                  
                  if (!aiMessageCreated) {
                    // 如果之前没有收到delta，在这里创建消息
                    const aiMessage: ConversationMessage = {
                      messageId: eventData.id,
                      conversationId: conversation.conversationId,
                      senderId: 'mcn_001',
                      content: {
                        type: 'text',
                        text: fullContent,
                      },
                      timestamp: new Date().toISOString(),
                      readBy: [currentUser.userId],
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setIsWaitingForAI(false);
                    aiMessageCreated = true;
                    console.log('AI消息已创建(completed):', fullContent);
                  } else {
                    // 如果已经有消息，用完整内容替换（覆盖delta累加的可能错误的内容）
                    setMessages(prev => {
                      const updated = [...prev];
                      const lastIndex = updated.length - 1;
                      const lastMessage = updated[lastIndex];
                      if (lastMessage && lastMessage.senderId === 'mcn_001') {
                        updated[lastIndex] = {
                          ...lastMessage,
                          content: {
                            ...lastMessage.content,
                            text: fullContent
                          }
                        };
                      }
                      return updated;
                    });
                    console.log('AI消息已更新(completed，替换内容):', fullContent);
                  }
                } else if (currentEvent === 'conversation.chat.completed') {
                  console.log('聊天完成');
                }
              } catch (parseError) {
                console.error('解析流式响应数据失败:', parseError);
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
      setIsWaitingForAI(false);
    }
  };

  const getParticipantInfo = (userId?: string): ChatParticipant => {
    if (!userId) {
      return currentUser ?? fallbackParticipant;
    }

    const participant = participants.find((item) => item?.userId === userId);
    return participant ?? currentUser ?? fallbackParticipant;
  };

  // 渲染支持Markdown格式的文本
  const renderMessageText = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // 处理标题 (###, ##, #)
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingText = headingMatch[2];
        const fontSize = level === 1 ? '20px' : level === 2 ? '18px' : level === 3 ? '16px' : '14px';
        const headingStyle: React.CSSProperties = { 
          fontWeight: 'bold', 
          margin: '8px 0 4px 0',
          fontSize,
          lineHeight: 1.3
        };
        
        elements.push(
          React.createElement(
            `h${level}`,
            { key: `heading-${key++}`, style: headingStyle },
            parseInlineMarkdown(headingText, key)
          )
        );
        continue;
      }

      // 处理无序列表
      const unorderedListMatch = line.match(/^[\-\*]\s+(.+)$/);
      if (unorderedListMatch) {
        elements.push(
          <div key={`list-${key++}`} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '8px', marginBottom: '2px' }}>
            <span style={{ marginRight: '8px', flexShrink: 0 }}>•</span>
            <span>{parseInlineMarkdown(unorderedListMatch[1], key)}</span>
          </div>
        );
        continue;
      }

      // 处理有序列表
      const orderedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (orderedListMatch) {
        elements.push(
          <div key={`list-${key++}`} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '8px', marginBottom: '2px' }}>
            <span style={{ marginRight: '8px', flexShrink: 0, minWidth: '20px' }}>{orderedListMatch[1]}.</span>
            <span>{parseInlineMarkdown(orderedListMatch[2], key)}</span>
          </div>
        );
        continue;
      }

      // 处理引用
      const quoteMatch = line.match(/^>\s+(.+)$/);
      if (quoteMatch) {
        elements.push(
          <div 
            key={`quote-${key++}`} 
            style={{ 
              borderLeft: '3px solid #ddd', 
              paddingLeft: '12px', 
              marginLeft: '4px',
              color: '#666',
              fontStyle: 'italic',
              marginBottom: '4px'
            }}
          >
            {parseInlineMarkdown(quoteMatch[1], key)}
          </div>
        );
        continue;
      }

      // 处理代码块
      if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++; // 跳过开始的 ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre 
            key={`code-${key++}`} 
            style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '8px 12px', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '13px',
              margin: '4px 0',
              border: '1px solid #e0e0e0'
            }}
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // 处理普通段落（包含行内格式）
      if (line.trim()) {
        elements.push(
          <div key={`line-${key++}`} style={{ marginBottom: i < lines.length - 1 ? '4px' : 0 }}>
            {parseInlineMarkdown(line, key)}
          </div>
        );
      } else if (i < lines.length - 1) {
        // 空行
        elements.push(<br key={`br-${key++}`} />);
      }
    }

    return elements.length > 0 ? elements : text;
  };

  // 解析行内Markdown格式（粗体、斜体、代码、删除线、链接）
  const parseInlineMarkdown = (text: string, baseKey: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = baseKey;

    // 正则表达式优先级：链接 > 粗体 > 斜体 > 删除线 > 行内代码
    const patterns = [
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },          // [text](url)
      { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },                  // **text**
      { regex: /__([^_]+)__/g, type: 'bold' },                      // __text__
      { regex: /\*([^*]+)\*/g, type: 'italic' },                    // *text*
      { regex: /_([^_]+)_/g, type: 'italic' },                      // _text_
      { regex: /~~([^~]+)~~/g, type: 'strikethrough' },             // ~~text~~
      { regex: /`([^`]+)`/g, type: 'code' },                        // `code`
    ];

    let allMatches: Array<{ index: number; length: number; type: string; match: RegExpExecArray }> = [];

    // 收集所有匹配
    patterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      while ((match = regex.exec(text)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          type: pattern.type,
          match: match
        });
      }
    });

    // 按位置排序
    allMatches.sort((a, b) => a.index - b.index);

    let lastIndex = 0;
    allMatches.forEach(item => {
      // 检查重叠
      if (item.index < lastIndex) return;

      // 添加之前的普通文本
      if (item.index > lastIndex) {
        parts.push(text.substring(lastIndex, item.index));
      }

      // 添加格式化文本
      const content = item.match[1];
      switch (item.type) {
        case 'bold':
          parts.push(<strong key={`bold-${key++}`}>{content}</strong>);
          break;
        case 'italic':
          parts.push(<em key={`italic-${key++}`}>{content}</em>);
          break;
        case 'strikethrough':
          parts.push(<del key={`del-${key++}`}>{content}</del>);
          break;
        case 'code':
          parts.push(
            <code 
              key={`code-${key++}`} 
              style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '2px 4px', 
                borderRadius: '3px',
                fontSize: '0.9em',
                fontFamily: 'monospace'
              }}
            >
              {content}
            </code>
          );
          break;
        case 'link':
          const url = item.match[2];
          parts.push(
            <a 
              key={`link-${key++}`} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1890ff', textDecoration: 'underline' }}
            >
              {content}
            </a>
          );
          break;
      }

      lastIndex = item.index + item.length;
    });

    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
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
                  <div style={styles.systemMessageText}>{renderMessageText(message.content.text ?? '')}</div>
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
                      maxWidth: '80%',
                      width: 'fit-content',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    }}
                  >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(message.content.text.length > 50 ? styles.messageBubbleMultiLine : {}),
                      ...(isCurrentUser ? styles.messageBubbleUser : styles.messageBubbleOther),
                    }}
                  >
                    <div style={styles.messageContent}>{renderMessageText(message.content.text ?? '')}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* AI回复加载动画 */}
          {isWaitingForAI && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
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
                  maxWidth: '80%',
                  width: 'fit-content',
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...styles.messageBubbleOther,
                    ...styles.loadingBubble,
                  }}
                >
                  <div style={styles.loadingDots} className="loadingDots">
                    <span style={styles.loadingDot}></span>
                    <span style={styles.loadingDot}></span>
                    <span style={styles.loadingDot}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
    width: '100%', // 使用父容器的宽度限制
    padding: '8px 12px',
    borderRadius: '10px',
    position: 'relative',
    whiteSpace: 'pre-wrap', // 允许换行
    wordBreak: 'break-word', // 在单词间换行
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
  loadingBubble: {
    minWidth: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 16px',
  },
  loadingDots: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
  },
  loadingDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#999',
    animation: 'loadingBounce 1.2s infinite ease-in-out',
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

const loadingBounceKeyframes = `
  @keyframes loadingBounce {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes + loadingBounceKeyframes;
  document.head.appendChild(style);
  
  // 为每个loading dot添加不同的延迟，实现从左到右的效果
  const loadingDotsStyle = document.createElement('style');
  loadingDotsStyle.textContent = `
    .loadingDots span:nth-child(1) {
      animation-delay: 0s;
    }
    .loadingDots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .loadingDots span:nth-child(3) {
      animation-delay: 0.4s;
    }
  `;
  document.head.appendChild(loadingDotsStyle);
}

export default ChatPage;