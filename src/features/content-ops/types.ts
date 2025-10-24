export type QuickPromptKey = 'shortVideo' | 'liveStream';

export type MentionCategoryKey =
  | 'fanFavorites'
  | 'hotTopics'
  | 'trends'
  | 'inspirationSnippets';

export interface MentionCategory {
  key: MentionCategoryKey;
  label: string;
  suggestions: string[];
}

export type MessageAuthor = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  content: string;
  timestamp: Date;
}

export interface InspirationSnippet {
  id: string;
  content: string;
  updatedAt: number;
}
