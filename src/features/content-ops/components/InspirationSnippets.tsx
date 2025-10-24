import { BulbOutlined } from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import copy from '../constants/copy.zh-CN.json';

interface InspirationSnippetsProps {
  onDragStart?: (text: string, event: React.DragEvent<HTMLDivElement>) => void;
  items?: string[];
}

const { Text } = Typography;

const InspirationSnippets: React.FC<InspirationSnippetsProps> = ({ onDragStart, items }) => {
  const snippetList = items ?? copy.inspirationSnippets;
  return (
    <Card
      bordered={false}
      title={copy.sections.inspirationSnippets}
      headStyle={{ fontWeight: 600 }}
    >
      <List
        dataSource={snippetList}
        renderItem={(item, index) => (
          <List.Item
            key={`${item}-${index}`}
            draggable
            onDragStart={(event) => onDragStart?.(item, event)}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              cursor: 'grab',
              borderRadius: 8,
              paddingInline: 12,
              paddingBlock: 10,
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = 'rgba(250, 204, 21, 0.16)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <BulbOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
            <Text>{item}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default InspirationSnippets;
