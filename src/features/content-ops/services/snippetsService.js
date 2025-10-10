// 预留服务层：未来可替换为真实后端 API
// 目前使用内存数据模拟，接口保持 Promise 形式，便于后续无缝切换

let inMemorySnippets = [
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

export async function fetchSnippets() {
  // TODO: 替换为真实请求
  return Promise.resolve([...inMemorySnippets]);
}

export async function addSnippet(content) {
  const snippet = { id: `s_${Date.now()}`, content, updatedAt: Date.now() };
  inMemorySnippets.unshift(snippet);
  return Promise.resolve(snippet);
}

export async function updateSnippet(id, content) {
  inMemorySnippets = inMemorySnippets.map((s) =>
    s.id === id ? { ...s, content, updatedAt: Date.now() } : s
  );
  return Promise.resolve(true);
}

export async function deleteSnippet(id) {
  inMemorySnippets = inMemorySnippets.filter((s) => s.id !== id);
  return Promise.resolve(true);
}


