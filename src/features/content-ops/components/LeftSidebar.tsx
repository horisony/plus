import { Button, Divider, List, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import copy from '../constants/copy.zh-CN.json';
import { designTokens } from '../constants/designTokens';

interface LeftSidebarProps {
  onNewConversation?: () => void;
  onSelectHistory?: (conversation: string) => void;
}

const { Title, Text } = Typography;

const sidebarStyle: React.CSSProperties = {
  width: 240,
  backgroundColor: designTokens.colors.gray[50],
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  borderRight: `1px solid ${designTokens.colors.gray[200]}`,
  height: '100%',
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNewConversation, onSelectHistory }) => {
  return (
    <div style={sidebarStyle}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        block
        style={{ borderRadius: 999, height: 44 }}
        onClick={onNewConversation}
      >
        {copy.navigation.newConversation}
      </Button>

      <div>
        <Title level={5} style={{ marginBottom: 12 }}>
          {copy.navigation.competitorTracking}
        </Title>
        <Text type="secondary">{copy.navigation.commercialIntent}</Text>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Title level={5} style={{ marginBottom: 12 }}>
          {copy.navigation.historyConversations}
        </Title>
        <Divider style={{ margin: '8px 0' }} />
        <List
          dataSource={copy.historyConversations}
          rowKey={(item) => item}
          split={false}
          style={{ height: '100%' }}
          renderItem={(item) => (
            <List.Item
              style={{
                paddingInline: 4,
                paddingBlock: 8,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onClick={() => onSelectHistory?.(item)}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = designTokens.colors.gray[100];
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Text>{item}</Text>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
