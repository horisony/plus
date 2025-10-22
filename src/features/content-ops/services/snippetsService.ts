import { InspirationSnippet } from '../types';

// 预留服务层：当前使用内存数据模拟，未来可直接替换为真实 API
let inMemorySnippets: InspirationSnippet[] = [
  {
    id: 's1',
    content:
      '参加到新商学，王润宇讲的视频号的逻辑很清晰，值得学习，其中微信小店是一个必须开起来的，机会很大。',
    updatedAt: Date.now(),
  },
  {
    id: 's2',
    content:
      '内容灵感：先抛结论再讲原因，用反常识吸引注意力，再给出三个证据。',
    updatedAt: Date.now(),
  },
];

export async function fetchSnippets(): Promise<InspirationSnippet[]> {
  return Promise.resolve([...inMemorySnippets]);
}

export async function addSnippet(content: string): Promise<InspirationSnippet> {
  const snippet: InspirationSnippet = {
    id: `s_${Date.now()}`,
    content,
    updatedAt: Date.now(),
  };
  inMemorySnippets = [snippet, ...inMemorySnippets];
  return Promise.resolve(snippet);
}

export async function updateSnippet(id: string, content: string): Promise<boolean> {
  inMemorySnippets = inMemorySnippets.map((snippet) =>
    snippet.id === id ? { ...snippet, content, updatedAt: Date.now() } : snippet,
  );
  return Promise.resolve(true);
}

export async function deleteSnippet(id: string): Promise<boolean> {
  inMemorySnippets = inMemorySnippets.filter((snippet) => snippet.id !== id);
  return Promise.resolve(true);
}
