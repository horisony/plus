import { Card, List, Tabs, Typography } from 'antd';
import copy from '../constants/copy.zh-CN.json';
import { MentionCategoryKey } from '../types';

interface ContentRecommendationsProps {
  onDragStart?: (text: string, event: React.DragEvent<HTMLDivElement>) => void;
}

const { Text } = Typography;

const tabOrder: MentionCategoryKey[] = ['fanFavorites', 'hotTopics', 'trends'];

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({ onDragStart }) => {
  const tabItems = tabOrder.map((key) => ({
    key,
    label: copy.sections[key],
    children: (
      <List
        dataSource={copy[key] as string[]}
        rowKey={(item) => item}
        renderItem={(item) => (
          <List.Item
            key={item}
            style={{
              cursor: 'grab',
              borderRadius: 8,
              paddingInline: 12,
              paddingBlock: 10,
              transition: 'background-color 0.2s ease',
            }}
            draggable
            onDragStart={(event) => onDragStart?.(item, event)}
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
    ),
  }));

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Tabs defaultActiveKey={tabOrder[0]} items={tabItems} destroyInactiveTabPane={false} />
    </Card>
  );
};

export default ContentRecommendations;
