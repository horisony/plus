import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Empty, List, Pagination, Row, Space, Tag, Typography } from 'antd';
import ContentInputPanel from '../components/ContentInputPanel';
import LeftSidebar from '../components/LeftSidebar';
import copy from '../constants/copy.zh-CN.json';
import { designTokens } from '../constants/designTokens';
import type { ChatMessage } from '../types';

interface ContentOpsPageProps {
  onNavigateToSnippets?: () => void;
}

const { Text } = Typography;

const MOCK_RESPONSE = `这是为您生成的短视频文案示例：\n标题：AR 眼镜，带你看见未来\n开场：15 秒反转开头，引出痛点与场景\n卖点：轻、清晰、长续航；三点结构递进\n结尾：强召回+优惠口播+关注引导。`;

const SNIPPETS_PER_PAGE = 3;

const ContentOpsPage: React.FC<ContentOpsPageProps> = ({ onNavigateToSnippets }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [snippetPage, setSnippetPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const generatorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  const mentionDictionary = useMemo(() => {
    return new Set<string>([
      ...copy.fanFavorites,
      ...copy.hotTopics,
      ...copy.trends,
      ...copy.inspirationSnippets,
    ]);
  }, []);

  useEffect(() => {
    return () => {
      if (generatorTimerRef.current) {
        clearInterval(generatorTimerRef.current);
        generatorTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const startMockStreaming = useCallback(() => {
    if (!streamingMessageIdRef.current) return;

    if (generatorTimerRef.current) {
      clearInterval(generatorTimerRef.current);
    }

    const targetId = streamingMessageIdRef.current;
    let nextIndex = 0;
    setIsGenerating(true);

    generatorTimerRef.current = setInterval(() => {
      nextIndex += 1;
      const nextContent = MOCK_RESPONSE.slice(0, nextIndex);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === targetId ? { ...message, content: nextContent } : message,
        ),
      );

      if (nextIndex >= MOCK_RESPONSE.length) {
        if (generatorTimerRef.current) {
          clearInterval(generatorTimerRef.current);
          generatorTimerRef.current = null;
        }
        setIsGenerating(false);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 40);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      const now = new Date();
      const userMessage: ChatMessage = {
        id: `user-${now.getTime()}`,
        author: 'user',
        content,
        timestamp: now,
      };

      const aiMessage: ChatMessage = {
        id: `ai-${now.getTime() + 1}`,
        author: 'ai',
        content: '好的，请稍等，正在为您生成短视频文案...',
        timestamp: now,
      };

      streamingMessageIdRef.current = aiMessage.id;
      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setSnippetPage(1);
      startMockStreaming();
    },
    [startMockStreaming],
  );

  const handleStopGeneration = useCallback(() => {
    if (generatorTimerRef.current) {
      clearInterval(generatorTimerRef.current);
      generatorTimerRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  const handleNewConversation = useCallback(() => {
    handleStopGeneration();
    setMessages([]);
    setSnippetPage(1);
  }, [handleStopGeneration]);

  const handleDragStart = (text: string, event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', text);
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, lineIndex) => {
      const parts: (string | ReactNode)[] = [];
      const mentionPattern = /@([^\s]+)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;

      while ((match = mentionPattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }
        const rawMention = match[1];
        const normalizedMention = rawMention.replace(/[，。！？,.!?]/g, '');
        if (mentionDictionary.has(normalizedMention) || mentionDictionary.has(rawMention)) {
          parts.push(
            <Tag color="blue" key={`${lineIndex}-${match.index}`}>
              @{normalizedMention}
            </Tag>,
          );
        } else {
          parts.push(`@${rawMention}`);
        }
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      return (
        <Typography.Paragraph key={`line-${lineIndex}`} style={{ marginBottom: 0 }}>
          {parts}
        </Typography.Paragraph>
      );
    });
  };

  const snippetItems = useMemo(() => {
    const start = (snippetPage - 1) * SNIPPETS_PER_PAGE;
    return copy.inspirationSnippets.slice(start, start + SNIPPETS_PER_PAGE);
  }, [snippetPage]);

  const renderRecommendations = () => (
    <Row gutter={24}>
      <Col span={6}>
        <Card
          title={copy.sections.fanFavorites}
          bordered={false}
          bodyStyle={{ padding: 16 }}
          style={{ height: '100%', boxShadow: designTokens.shadows.lg }}
        >
          <List
            dataSource={copy.fanFavorites}
            renderItem={(item, index) => (
              <List.Item
                key={`${item}-${index}`}
                draggable
                onDragStart={(event) => handleDragStart(item, event)}
                style={{ cursor: 'grab', borderRadius: 8, paddingInline: 12, transition: 'background-color 0.2s ease' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title={copy.sections.hotTopics}
          bordered={false}
          bodyStyle={{ padding: 16 }}
          style={{ height: '100%', boxShadow: designTokens.shadows.lg }}
        >
          <List
            dataSource={copy.hotTopics}
            renderItem={(item, index) => (
              <List.Item
                key={`${item}-${index}`}
                draggable
                onDragStart={(event) => handleDragStart(item, event)}
                style={{ cursor: 'grab', borderRadius: 8, paddingInline: 12, transition: 'background-color 0.2s ease' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title={copy.sections.trends}
          bordered={false}
          bodyStyle={{ padding: 16 }}
          style={{ height: '100%', boxShadow: designTokens.shadows.lg }}
        >
          <List
            dataSource={copy.trends}
            renderItem={(item, index) => (
              <List.Item
                key={`${item}-${index}`}
                draggable
                onDragStart={(event) => handleDragStart(item, event)}
                style={{ cursor: 'grab', borderRadius: 8, paddingInline: 12, transition: 'background-color 0.2s ease' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong>{copy.sections.inspirationSnippets}</Text>
              <Button type="link" onClick={() => onNavigateToSnippets?.()}>
                添加碎片
              </Button>
            </Space>
          }
          bordered={false}
          bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
          style={{ height: '100%', boxShadow: designTokens.shadows.lg }}
        >
          <List
            dataSource={snippetItems}
            renderItem={(item, index) => (
              <List.Item
                key={`${item}-${index}`}
                draggable
                onDragStart={(event) => handleDragStart(item, event)}
                style={{ cursor: 'grab', borderRadius: 8, paddingInline: 12, transition: 'background-color 0.2s ease' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.16)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Text>{item}</Text>
              </List.Item>
            )}
          />
          <Pagination
            simple
            size="small"
            current={snippetPage}
            total={copy.inspirationSnippets.length}
            pageSize={SNIPPETS_PER_PAGE}
            onChange={(page) => setSnippetPage(page)}
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: designTokens.colors.background,
      }}
    >
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar onNewConversation={handleNewConversation} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: '24px 32px',
            overflow: 'hidden',
          }}
        >
          <Card
            bordered={false}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', boxShadow: designTokens.shadows.md }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
          >
            {messages.length === 0 ? (
              <Space
                direction="vertical"
                align="center"
                style={{ flex: 1, justifyContent: 'center', textAlign: 'center', padding: 48 }}
              >
                <Empty description={copy.placeholders.emptyState} />
              </Space>
            ) : (
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {messages.map((message) => (
                  <Card
                    key={message.id}
                    bordered={false}
                    style={{
                      alignSelf: message.author === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      backgroundColor:
                        message.author === 'user' ? designTokens.colors.primary : designTokens.colors.white,
                      color: message.author === 'user' ? designTokens.colors.white : designTokens.colors.gray[900],
                      boxShadow: designTokens.shadows.sm,
                    }}
                    bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <div style={{ color: 'inherit' }}>{renderMessageContent(message.content)}</div>
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          message.author === 'user'
                            ? 'rgba(255,255,255,0.7)'
                            : designTokens.colors.gray[500],
                      }}
                    >
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {message.author === 'ai' && message.id === streamingMessageIdRef.current && isGenerating && (
                      <Text type="secondary">生成中...</Text>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <ContentInputPanel
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            onStop={handleStopGeneration}
            hasMessages={messages.length > 0}
          />

          {messages.length === 0 && renderRecommendations()}
        </div>
      </div>
    </div>
  );
};

export default ContentOpsPage;
