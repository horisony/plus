import type { FilterDimension, FilterPlatform, FilterTimeRange } from '../types';

export type TrendDirection = 'up' | 'down';
export type WarningStatus = 'normal' | 'high' | 'low';
export type InfluencerStatus = 'cooperating' | 'completed';
export type OwnerType = 'mine' | 'other';

export interface InfluencerDemographics {
  [segment: string]: number;
}

export interface InfluencerRecord {
  id: string;
  name: string;
  category: string;
  avatar: string;
  fans: number;
  views: number;
  engagementRate: number;
  completionRate: number;
  expectedCPM: number;
  expectedCPE: number;
  audienceProfile: string;
  recentTrend: TrendDirection;
  warningStatus: WarningStatus;
  status: InfluencerStatus;
  owner: OwnerType;
  changeRate: number;
  demographics: InfluencerDemographics;
  platform: FilterPlatform;
  timeRanges: FilterTimeRange[];
  focusDimensions: FilterDimension[];
}

const generateDemographics = (seed: number): InfluencerDemographics => {
  const baseData: InfluencerDemographics = {
    'Z世代': 0.3 + (seed % 3) * 0.1,
    '小镇青年': 0.2 + (seed % 2) * 0.1,
    '新锐白领': 0.15 + (seed % 2) * 0.05,
    '都市蓝领': 0.1 + (seed % 2) * 0.05,
    '资深中产': 0.08 + (seed % 2) * 0.03,
    '小镇中老年': 0.05 + (seed % 2) * 0.02,
    '精致妈妈': 0.03 + (seed % 2) * 0.02,
    '都市银发': 0.02 + (seed % 2) * 0.01,
  };

  const total = Object.values(baseData).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return baseData;
  }

  const normalized: InfluencerDemographics = {};

  Object.keys(baseData).forEach((segment) => {
    normalized[segment] = Number((baseData[segment] / total).toFixed(4));
  });

  return normalized;
};

export const mockInfluencerData: InfluencerRecord[] = [
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
    warningStatus: 'normal',
    status: 'cooperating',
    owner: 'mine',
    changeRate: 5.2,
    demographics: generateDemographics(1),
    platform: 'douyin',
    timeRanges: ['7d', '30d'],
    focusDimensions: ['fans,views', 'engagement'],
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
    demographics: generateDemographics(2),
    platform: 'douyin',
  timeRanges: ['7d', '30d', '90d'],
  focusDimensions: ['fans,views', 'cpm,cpe', 'engagement'],
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
    demographics: generateDemographics(3),
    platform: 'douyin',
  timeRanges: ['7d', '30d'],
  focusDimensions: ['fans,views', 'engagement'],
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
    demographics: generateDemographics(4),
    platform: 'douyin',
    timeRanges: ['30d'],
    focusDimensions: ['fans,views', 'cpm,cpe'],
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
    demographics: generateDemographics(5),
    platform: 'douyin',
  timeRanges: ['7d', '30d', '90d'],
  focusDimensions: ['fans,views', 'engagement'],
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
    demographics: generateDemographics(6),
    platform: 'douyin',
  timeRanges: ['30d', '90d'],
  focusDimensions: ['fans,views', 'cpm,cpe'],
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
    demographics: generateDemographics(7),
  platform: 'douyin',
  timeRanges: ['7d', '30d', '90d'],
  focusDimensions: ['fans,views', 'engagement'],
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
    demographics: generateDemographics(8),
  platform: 'douyin',
  timeRanges: ['30d', '90d'],
  focusDimensions: ['fans,views', 'engagement'],
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
    demographics: generateDemographics(9),
  platform: 'douyin',
  timeRanges: ['7d', '30d'],
  focusDimensions: ['fans,views', 'cpm,cpe'],
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
    demographics: generateDemographics(10),
  platform: 'douyin',
  timeRanges: ['30d'],
  focusDimensions: ['fans,views', 'cpm,cpe'],
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
    demographics: generateDemographics(11),
    platform: 'xhs',
    timeRanges: ['7d', '90d'],
    focusDimensions: ['fans,views', 'engagement'],
  },
  {
    id: 'c12',
    name: '波仔同学',
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
    demographics: generateDemographics(12),
    platform: 'xhs',
    timeRanges: ['30d', '90d'],
    focusDimensions: ['engagement', 'cpm,cpe'],
  },
];

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

export const formatPercentage = (num: number): string => `${num.toFixed(1)}%`;

export const formatCurrency = (num: number): string => `¥${num.toFixed(1)}`;
