import { useEffect, useState } from 'react';
import { Button, Card, Input, List, Modal, Space, Typography, message } from 'antd';
import LeftSidebar from '../components/LeftSidebar';
import { designTokens } from '../constants/designTokens';
import type { InspirationSnippet } from '../types';
import {
  addSnippet,
  deleteSnippet,
  fetchSnippets,
  updateSnippet,
} from '../services/snippetsService';

interface InspirationSnippetsPageProps {
  onBack?: () => void;
}

const { TextArea } = Input;
const { Title, Text } = Typography;

const InspirationSnippetsPage: React.FC<InspirationSnippetsPageProps> = ({ onBack }) => {
  const [snippets, setSnippets] = useState<InspirationSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InspirationSnippet | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<InspirationSnippet | null>(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSnippets = async () => {
    setLoading(true);
    try {
      const data = await fetchSnippets();
      setSnippets(data);
    } catch (error) {
      message.error('加载灵感碎片失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, []);

  const openCreateModal = () => {
    setActiveSnippet(null);
    setContent('');
    setEditorOpen(true);
  };

  const openEditModal = (snippet: InspirationSnippet) => {
    setActiveSnippet(snippet);
    setContent(snippet.content);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setActiveSnippet(null);
    setContent('');
    setEditorOpen(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('请输入灵感内容');
      return;
    }
    setSubmitting(true);
    try {
      if (activeSnippet) {
        await updateSnippet(activeSnippet.id, content.trim());
        message.success('更新成功');
      } else {
        await addSnippet(content.trim());
        message.success('添加成功');
      }
      closeEditor();
      loadSnippets();
    } catch (error) {
      message.error('保存失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await deleteSnippet(deleteTarget.id);
      message.success('删除成功');
      setDeleteTarget(null);
      loadSnippets();
    } catch (error) {
      message.error('删除失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: designTokens.colors.background,
      }}
    >
      <LeftSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card
          bordered={false}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 32px',
          }}
          style={{ borderBottom: `1px solid ${designTokens.colors.gray[200]}` }}
        >
          <Button onClick={onBack}>返回</Button>
          <Title level={3} style={{ margin: 0, flex: 1 }}>
            灵感碎片
          </Title>
          <Space>
            <Button type="primary" onClick={openCreateModal}>
              新增碎片
            </Button>
          </Space>
        </Card>

        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          <List
            loading={loading}
            dataSource={snippets}
            locale={{ emptyText: '暂无灵感碎片，点击“新增碎片”开始创建' }}
            renderItem={(snippet) => (
              <List.Item key={snippet.id}>
                <Card
                  style={{ width: '100%', boxShadow: designTokens.shadows.md }}
                  hoverable
                  onClick={() => openEditModal(snippet)}
                  actions={[
                    <Button
                      key="delete"
                      danger
                      type="text"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget(snippet);
                      }}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>{snippet.content}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(snippet.updatedAt).toLocaleString()}
                    </Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>

      <Modal
        title={activeSnippet ? '编辑灵感碎片' : '新增灵感碎片'}
        open={editorOpen}
        onOk={handleSubmit}
        onCancel={closeEditor}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitting}
        okButtonProps={{ disabled: !content.trim() }}
      >
        <TextArea
          autoSize={{ minRows: 6, maxRows: 12 }}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="请输入灵感内容..."
        />
      </Modal>

      <Modal
        title="确定删除灵感吗？"
        open={Boolean(deleteTarget)}
        okText="确认删除"
        okButtonProps={{ danger: true, loading: submitting }}
        cancelText="取消"
        onOk={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <Text>删除后将无法恢复，确定要删除这个灵感碎片吗？</Text>
      </Modal>
    </div>
  );
};

export default InspirationSnippetsPage;
