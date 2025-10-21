// 八大人群数据模板
const generateDemographics = (seed) => {
  const baseData = {
    'Z世代': 0.3 + (seed % 3) * 0.1,
    '小镇青年': 0.2 + (seed % 2) * 0.1,
    '新锐白领': 0.15 + (seed % 2) * 0.05,
    '都市蓝领': 0.1 + (seed % 2) * 0.05,
    '资深中产': 0.08 + (seed % 2) * 0.03,
    '小镇中老年': 0.05 + (seed % 2) * 0.02,
    '精致妈妈': 0.03 + (seed % 2) * 0.02,
    '都市银发': 0.02 + (seed % 2) * 0.01
  };
  
  // 标准化到总和为1
  const total = Object.values(baseData).reduce((sum, val) => sum + val, 0);
  Object.keys(baseData).forEach(key => {
    baseData[key] = baseData[key] / total;
  });
  
  return baseData;
};

// 基于您之前的数据结构，创建新的模拟数据
export const mockInfluencerData = [
  {
    id: 'c01',
    name: '萌叔',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 222000,
    views: 2183000,
    engagementRate: 3.2,
    completionRate: 32.2,
    expectedCPM: 22.2,
    expectedCPE: 0.8,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal', // normal, high, low
    status: 'cooperating',
    owner: 'mine',
    changeRate: 5.2,
    demographics: generateDemographics(1)
  },
  {
    id: 'c02',
    name: '霸道总柴',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 727000,
    views: 437000,
    engagementRate: 1.5,
    completionRate: 0.3,
    expectedCPM: 77.2,
    expectedCPE: 6.9,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'high',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 3.8,
    demographics: generateDemographics(2)
  },
  {
    id: 'c03',
    name: '朱朱有点货',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 540000,
    views: 219000,
    engagementRate: 1.5,
    completionRate: 0.5,
    expectedCPM: 149.1,
    expectedCPE: 9.1,
    audienceProfile: 'tech-focused',
    recentTrend: 'down',
    warningStatus: 'low',
    status: 'completed',
    owner: 'other',
    changeRate: -2.1,
    demographics: generateDemographics(3)
  },
  {
    id: 'c04',
    name: '无聊的林深',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 381000,
    views: 341000,
    engagementRate: 1.6,
    completionRate: 0.6,
    expectedCPM: 276.2,
    expectedCPE: 10.9,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 4.5,
    demographics: generateDemographics(4)
  },
  {
    id: 'c05',
    name: '贝尔叔叔',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 221000,
    views: 1933000,
    engagementRate: 8.3,
    completionRate: 1.8,
    expectedCPM: 317.1,
    expectedCPE: 8.7,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 6.2,
    demographics: generateDemographics(5)
  },
  {
    id: 'c06',
    name: '老龚鉴货',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 142000,
    views: 101000,
    engagementRate: 1.5,
    completionRate: 0.4,
    expectedCPM: 183.1,
    expectedCPE: 11.8,
    audienceProfile: 'tech-focused',
    recentTrend: 'down',
    warningStatus: 'low',
    status: 'completed',
    owner: 'other',
    changeRate: -1.8,
    demographics: generateDemographics(6)
  },
  {
    id: 'c07',
    name: 'marco科技说',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 281000,
    views: 392000,
    engagementRate: 0.8,
    completionRate: 1.0,
    expectedCPM: 11.8,
    expectedCPE: 1.7,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 2.3,
    demographics: generateDemographics(7)
  },
  {
    id: 'c08',
    name: '上官先生',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 76000,
    views: 162000,
    engagementRate: 2.2,
    completionRate: 1.0,
    expectedCPM: 216.4,
    expectedCPE: 13.7,
    audienceProfile: 'tech-focused',
    recentTrend: 'down',
    warningStatus: 'high',
    status: 'cooperating',
    owner: 'mine',
    changeRate: -3.2,
    demographics: generateDemographics(8)
  },
  {
    id: 'c09',
    name: '王北有点ne',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 112000,
    views: 747000,
    engagementRate: 2.8,
    completionRate: 2.3,
    expectedCPM: 237.2,
    expectedCPE: 8.5,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 7.1,
    demographics: generateDemographics(9)
  },
  {
    id: 'c10',
    name: '小琳黑科技',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 211000,
    views: 359000,
    engagementRate: 0.4,
    completionRate: 0.5,
    expectedCPM: 77.8,
    expectedCPE: 7.1,
    audienceProfile: 'tech-focused',
    recentTrend: 'down',
    warningStatus: 'low',
    status: 'completed',
    owner: 'other',
    changeRate: -4.5,
    demographics: generateDemographics(10)
  },
  {
    id: 'c11',
    name: '易膨胀',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 301000,
    views: 99000,
    engagementRate: 1.0,
    completionRate: 0.8,
    expectedCPM: 270.2,
    expectedCPE: 9.6,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 1.9,
    demographics: generateDemographics(11)
  },
  {
    id: 'c12',
    name: '剑桥萌叔',
    category: '科技数码',
    avatar: '/avatar_placeholder.png',
    fans: 835000,
    views: 2332000,
    engagementRate: 2.1,
    completionRate: 4.5,
    expectedCPM: 41.5,
    expectedCPE: 1.1,
    audienceProfile: 'tech-focused',
    recentTrend: 'up',
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 8.7,
    demographics: generateDemographics(12)
  }
];

// 格式化数字的工具函数
export const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 格式化百分比
export const formatPercentage = (num) => {
  return num.toFixed(1) + '%';
};

// 格式化货币
export const formatCurrency = (num) => {
  return '¥' + num.toFixed(1);
};
