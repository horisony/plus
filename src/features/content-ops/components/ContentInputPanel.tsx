import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Input, Segmented, Space, Tabs, Tooltip, Typography } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import {
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import copy from '../constants/copy.zh-CN.json';
import { designTokens } from '../constants/designTokens';
import type { MentionCategory, MentionCategoryKey, QuickPromptKey } from '../types';

interface ContentInputPanelProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
  onStop: () => void;
  hasMessages?: boolean;
}

const { Text } = Typography;

const mentionCategories: MentionCategory[] = [
  {
    key: 'fanFavorites',
    label: copy.sections.fanFavorites,
    suggestions: copy.fanFavorites,
  },
  {
    key: 'hotTopics',
    label: copy.sections.hotTopics,
    suggestions: copy.hotTopics,
  },
  {
    key: 'trends',
    label: copy.sections.trends,
    suggestions: copy.trends,
  },
  {
    key: 'inspirationSnippets',
    label: copy.sections.inspirationSnippets,
    suggestions: copy.inspirationSnippets,
  },
];

const quickPromptOptions: { label: string; value: QuickPromptKey }[] = [
  { label: copy.quickPrompts.shortVideo, value: 'shortVideo' },
  { label: copy.quickPrompts.liveStream, value: 'liveStream' },
];

const ContentInputPanel: React.FC<ContentInputPanelProps> = ({
  onSendMessage,
  isGenerating,
  onStop,
  hasMessages = false,
}) => {
  const textAreaRef = useRef<TextAreaRef>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [activePrompt, setActivePrompt] = useState<QuickPromptKey>('shortVideo');
  const [message, setMessage] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [activeMentionTab, setActiveMentionTab] = useState<MentionCategoryKey>('fanFavorites');
  const [mentionQuery, setMentionQuery] = useState('');

  const mentionOptions = useMemo(() => {
    return new Map<MentionCategoryKey, string[]>(
      mentionCategories.map((category) => [category.key, category.suggestions]),
    );
  }, []);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!showMentionDropdown) return;
      const dropdown = dropdownRef.current;
      const textarea = textAreaRef.current?.resizableTextArea?.textArea;
      if (dropdown && !dropdown.contains(event.target as Node) && textarea && !textarea.contains(event.target as Node)) {
        setShowMentionDropdown(false);
      }
    };
    window.addEventListener('mousedown', listener);
    return () => window.removeEventListener('mousedown', listener);
  }, [showMentionDropdown]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
    setShowMentionDropdown(false);
  }, [message, onSendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    const cursorPos = event.target.selectionStart ?? value.length;
    setMessage(value);

    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) {
      setShowMentionDropdown(false);
      setMentionQuery('');
      return;
    }

    const query = textBeforeCursor.slice(lastAtIndex + 1);
    if (query.includes(' ') || query.includes('\n')) {
      setShowMentionDropdown(false);
      setMentionQuery('');
      return;
    }

    const textareaRect = event.target.getBoundingClientRect();
    setMentionQuery(query);
    setMentionPosition({
      top: hasMessages ? textareaRect.top - 220 : textareaRect.bottom + 8,
      left: textareaRect.left,
    });
    setShowMentionDropdown(true);
  };

  const handleSelectMention = (mention: string) => {
    const textarea = textAreaRef.current?.resizableTextArea?.textArea;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart ?? message.length;
    const textBeforeCursor = message.slice(0, cursorPos);
    const textAfterCursor = message.slice(cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) return;

    const beforeMention = textBeforeCursor.slice(0, lastAtIndex);
    const newValue = `${beforeMention}@${mention} ${textAfterCursor}`;
    setMessage(newValue);
    setShowMentionDropdown(false);

    // 将光标定位到插入的提及之后，保持编辑体验顺滑
    requestAnimationFrame(() => {
      const nextCursorPos = beforeMention.length + mention.length + 2;
      textarea.focus();
      textarea.setSelectionRange(nextCursorPos, nextCursorPos);
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const dragged = event.dataTransfer.getData('text/plain');
    if (!dragged) return;
    setMessage((prev) => `${prev}${prev ? '\n' : ''}@${dragged} `);
  };

  const filteredSuggestions = useMemo(() => {
    const source = mentionOptions.get(activeMentionTab) ?? [];
    if (!mentionQuery) return source;
    return source.filter((item) => item.includes(mentionQuery));
  }, [activeMentionTab, mentionOptions, mentionQuery]);

  const dropdown = showMentionDropdown ? (
    <Card
      ref={dropdownRef}
      size="small"
      style={{
        position: 'fixed',
        top: mentionPosition.top,
        left: mentionPosition.left,
        zIndex: 1000,
        width: 320,
        boxShadow: designTokens.shadows.xl,
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* 通过 Tabs 做多分类提示，便于按模块快速选择 */}
      <Tabs
        activeKey={activeMentionTab}
        onChange={(key) => setActiveMentionTab(key as MentionCategoryKey)}
        items={mentionCategories.map((category) => ({
          key: category.key,
          label: category.label,
          children: (
            <Space direction="vertical" style={{ width: '100%', padding: 12 }}>
              {filteredSuggestions.length === 0 && category.key === activeMentionTab ? (
                <Text type="secondary">暂无匹配内容</Text>
              ) : (
                (category.key === activeMentionTab ? filteredSuggestions : category.suggestions).map((suggestion) => (
                  <Card
                    key={suggestion}
                    size="small"
                    hoverable
                    style={{ margin: 0 }}
                    onMouseDown={(mouseEvent) => mouseEvent.preventDefault()}
                    onClick={() => handleSelectMention(suggestion)}
                  >
                    {suggestion}
                  </Card>
                ))
              )}
            </Space>
          ),
        }))}
      />
    </Card>
  ) : null;

  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
      style={{ width: '100%', boxShadow: designTokens.shadows.md }}
    >
      <Segmented
        size="large"
        options={quickPromptOptions}
        value={activePrompt}
        onChange={(value) => setActivePrompt(value as QuickPromptKey)}
      />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Input.TextArea
          ref={textAreaRef}
          autoSize={{ minRows: 5, maxRows: 10 }}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          placeholder={copy.placeholders.messageInput}
          disabled={isGenerating}
          style={{ fontSize: 16 }}
        />

        <Space align="center" style={{ justifyContent: 'space-between' }}>
          <Space size="middle">
            <Tooltip title="上传附件">
              <Button icon={<PaperClipOutlined />} />
            </Tooltip>
            <Tooltip title="上传图片">
              <Button icon={<PictureOutlined />} />
            </Tooltip>
            <Tooltip title="上传视频">
              <Button icon={<VideoCameraOutlined />} />
            </Tooltip>
          </Space>

          <Button
            type="primary"
            icon={isGenerating ? undefined : <SendOutlined />}
            onClick={isGenerating ? onStop : handleSend}
            disabled={!message.trim() && !isGenerating}
            danger={isGenerating}
          >
            {isGenerating ? '停止生成' : '发送'}
          </Button>
        </Space>
      </Space>

      {dropdown}
    </Card>
  );
};

export default ContentInputPanel;
