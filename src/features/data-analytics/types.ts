export type FilterScope = 'all' | 'cooperating' | 'completed' | 'mine';
export type FilterTimeRange = '7d' | '30d' | '90d';
export type FilterPlatform = 'douyin' | 'xhs' | 'weibo' | 'bilibili' | 'kuaishou';
export type FilterDimension = 'fans,views' | 'engagement' | 'cpm,cpe';
export type FilterIndustry = 'tech' | 'auto' | 'fashion' | 'food' | 'travel' | 'health';
export type FilterContentTag = 'review' | 'unbox' | 'tutorial' | 'comparison' | 'lifestyle';
export type FilterWarningStatus = 'normal' | 'warning' | 'danger' | 'monitoring';

export interface DataAnalyticsFilters {
  scope: FilterScope;
  timeRange: FilterTimeRange;
  platform: FilterPlatform[];
  fansMin: string;
  fansMax: string;
  industry: FilterIndustry[];
  contentTags: FilterContentTag[];
  dataDimension: FilterDimension[];
  warningStatus: FilterWarningStatus[];
}
