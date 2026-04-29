// Ported from Convert_Insights_-_Drill_Down RevenueFlow.tsx (static mock data)
// Attribution model type
export type AttributionModel = 'lastClick' | 'firstClick' | 'equalCredit' | 'aiWeighted';

// Node and flow data structures
export interface Node {
  id: string;
  label: string;
  value: number;
  color: string;
  description?: string;
}

export interface Flow {
  source: string;
  target: string;
  value: number;
}

export interface AttributionData {
  totalRevenue: string;
  subscriptionMix: string;
  completed: string;
  churned: string;
  leftColumn: {
    header: string;
    nodes: Node[];
  };
  middleColumn: {
    header: string;
    nodes: Node[];
  };
  rightColumn: {
    header: string;
    nodes: Node[];
  };
  leftToMiddle: Flow[];
  middleToRight: Flow[];
}

// Data for all four attribution models
export const attributionModels: Record<AttributionModel, AttributionData> = {
  lastClick: {
    totalRevenue: '$847K',
    subscriptionMix: '42%',
    completed: '58%',
    churned: '18%',
    leftColumn: {
      header: 'Traffic Source',
      nodes: [
        { id: 'email', label: 'Email', value: 195000, color: '#36B37E', description: 'Email campaigns & newsletters' },
        { id: 'googleppc', label: 'Google PPC', value: 285000, color: '#4285F4', description: 'Paid search campaigns' },
        { id: 'facebook', label: 'Facebook Ads', value: 142000, color: '#1877F2', description: 'Facebook paid advertising' },
        { id: 'linkedin', label: 'LinkedIn', value: 98000, color: '#0A66C2', description: 'LinkedIn paid & organic' },
        { id: 'instagram', label: 'Instagram', value: 68000, color: '#E1306C', description: 'Instagram ads & posts' },
        { id: 'tiktok', label: 'TikTok', value: 42000, color: '#1A1A2E', description: 'TikTok advertising' },
      ]
    },
    middleColumn: {
      header: 'Conversion Type',
      nodes: [
        { id: 'subscription', label: 'Subscription', value: 356000, color: '#7C4DFF' },
        { id: 'onetime', label: 'One-time', value: 263000, color: '#9F7AEA' },
        { id: 'upgrade', label: 'Upgrade', value: 127000, color: '#3B82F6' },
        { id: 'renewal', label: 'Renewal', value: 101500, color: '#B794F4' },
      ]
    },
    rightColumn: {
      header: 'Outcome',
      nodes: [
        { id: 'completed', label: 'Completed', value: 491500, color: '#36B37E' },
        { id: 'pipeline', label: 'In Pipeline', value: 203400, color: '#F59E0B' },
        { id: 'churned', label: 'Churned', value: 152600, color: '#EF4444' },
      ]
    },
    leftToMiddle: [
      { source: 'email', target: 'subscription', value: 85000 },
      { source: 'email', target: 'onetime', value: 75000 },
      { source: 'email', target: 'renewal', value: 35000 },
      { source: 'googleppc', target: 'subscription', value: 120000 },
      { source: 'googleppc', target: 'onetime', value: 95000 },
      { source: 'googleppc', target: 'upgrade', value: 70000 },
      { source: 'facebook', target: 'onetime', value: 75000 },
      { source: 'facebook', target: 'subscription', value: 47000 },
      { source: 'facebook', target: 'upgrade', value: 20000 },
      { source: 'linkedin', target: 'subscription', value: 52000 },
      { source: 'linkedin', target: 'upgrade', value: 28000 },
      { source: 'linkedin', target: 'renewal', value: 18000 },
      { source: 'instagram', target: 'onetime', value: 48000 },
      { source: 'instagram', target: 'subscription', value: 20000 },
      { source: 'tiktok', target: 'onetime', value: 25000 },
      { source: 'tiktok', target: 'subscription', value: 17000 },
    ],
    middleToRight: [
      { source: 'subscription', target: 'completed', value: 195000 },
      { source: 'subscription', target: 'pipeline', value: 98000 },
      { source: 'subscription', target: 'churned', value: 63000 },
      { source: 'onetime', target: 'completed', value: 165000 },
      { source: 'onetime', target: 'pipeline', value: 55000 },
      { source: 'onetime', target: 'churned', value: 43000 },
      { source: 'upgrade', target: 'completed', value: 78000 },
      { source: 'upgrade', target: 'pipeline', value: 34000 },
      { source: 'upgrade', target: 'churned', value: 15000 },
      { source: 'renewal', target: 'completed', value: 53500 },
      { source: 'renewal', target: 'pipeline', value: 16400 },
      { source: 'renewal', target: 'churned', value: 31600 },
    ]
  },
  firstClick: {
    totalRevenue: '$847K',
    subscriptionMix: '38%',
    completed: '61%',
    churned: '15%',
    leftColumn: {
      header: 'Discovery Channel',
      nodes: [
        { id: 'tiktok', label: 'TikTok', value: 138000, color: '#1A1A2E', description: 'First touchpoint for journeys' },
        { id: 'googleppc', label: 'Google PPC', value: 210000, color: '#4285F4', description: 'Paid search campaigns' },
        { id: 'facebook', label: 'Facebook Ads', value: 180000, color: '#1877F2', description: 'Facebook paid advertising' },
        { id: 'email', label: 'Email', value: 120000, color: '#36B37E', description: 'Email campaigns & newsletters' },
        { id: 'instagram', label: 'Instagram', value: 110000, color: '#E1306C', description: 'Instagram ads & posts' },
        { id: 'linkedin', label: 'LinkedIn', value: 72000, color: '#0A66C2', description: 'LinkedIn paid & organic' },
      ]
    },
    middleColumn: {
      header: 'Conversion Type',
      nodes: [
        { id: 'subscription', label: 'Subscription', value: 321000, color: '#7C4DFF' },
        { id: 'onetime', label: 'One-time', value: 278000, color: '#9F7AEA' },
        { id: 'upgrade', label: 'Upgrade', value: 142000, color: '#3B82F6' },
        { id: 'renewal', label: 'Renewal', value: 106000, color: '#B794F4' },
      ]
    },
    rightColumn: {
      header: 'Outcome',
      nodes: [
        { id: 'completed', label: 'Completed', value: 516000, color: '#36B37E' },
        { id: 'pipeline', label: 'In Pipeline', value: 204000, color: '#F59E0B' },
        { id: 'churned', label: 'Churned', value: 127000, color: '#EF4444' },
      ]
    },
    leftToMiddle: [
      { source: 'tiktok', target: 'onetime', value: 105000 },
      { source: 'tiktok', target: 'subscription', value: 65000 },
      { source: 'tiktok', target: 'upgrade', value: 25000 },
      { source: 'googleppc', target: 'subscription', value: 88000 },
      { source: 'googleppc', target: 'onetime', value: 55000 },
      { source: 'googleppc', target: 'upgrade', value: 35000 },
      { source: 'facebook', target: 'onetime', value: 92000 },
      { source: 'facebook', target: 'subscription', value: 63000 },
      { source: 'facebook', target: 'upgrade', value: 30000 },
      { source: 'email', target: 'subscription', value: 73000 },
      { source: 'email', target: 'renewal', value: 55000 },
      { source: 'email', target: 'upgrade', value: 40000 },
      { source: 'instagram', target: 'subscription', value: 32000 },
      { source: 'instagram', target: 'onetime', value: 26000 },
      { source: 'instagram', target: 'renewal', value: 51000 },
      { source: 'instagram', target: 'upgrade', value: 12000 },
      { source: 'linkedin', target: 'subscription', value: 42000 },
      { source: 'linkedin', target: 'renewal', value: 32000 },
      { source: 'linkedin', target: 'upgrade', value: 13000 },
    ],
    middleToRight: [
      { source: 'subscription', target: 'completed', value: 185000 },
      { source: 'subscription', target: 'pipeline', value: 95000 },
      { source: 'subscription', target: 'churned', value: 41000 },
      { source: 'onetime', target: 'completed', value: 185000 },
      { source: 'onetime', target: 'pipeline', value: 62000 },
      { source: 'onetime', target: 'churned', value: 31000 },
      { source: 'upgrade', target: 'completed', value: 92000 },
      { source: 'upgrade', target: 'pipeline', value: 33000 },
      { source: 'upgrade', target: 'churned', value: 17000 },
      { source: 'renewal', target: 'completed', value: 54000 },
      { source: 'renewal', target: 'pipeline', value: 14000 },
      { source: 'renewal', target: 'churned', value: 38000 },
    ]
  },
  equalCredit: {
    totalRevenue: '$847K',
    subscriptionMix: '40%',
    completed: '59%',
    churned: '17%',
    leftColumn: {
      header: 'Contributing Channels',
      nodes: [
        { id: 'googleppc', label: 'Google PPC', value: 248000, color: '#4285F4', description: 'Paid search campaigns' },
        { id: 'facebook', label: 'Facebook Ads', value: 160000, color: '#1877F2', description: 'Facebook paid advertising' },
        { id: 'email', label: 'Email', value: 158000, color: '#36B37E', description: 'Email campaigns & newsletters' },
        { id: 'tiktok', label: 'TikTok', value: 90000, color: '#1A1A2E', description: 'TikTok advertising' },
        { id: 'instagram', label: 'Instagram', value: 89000, color: '#E1306C', description: 'Instagram ads & posts' },
        { id: 'linkedin', label: 'LinkedIn', value: 85000, color: '#0A66C2', description: 'LinkedIn paid & organic' },
      ]
    },
    middleColumn: {
      header: 'Conversion Type',
      nodes: [
        { id: 'subscription', label: 'Subscription', value: 339000, color: '#7C4DFF' },
        { id: 'onetime', label: 'One-time', value: 270000, color: '#9F7AEA' },
        { id: 'upgrade', label: 'Upgrade', value: 134000, color: '#3B82F6' },
        { id: 'renewal', label: 'Renewal', value: 104000, color: '#B794F4' },
      ]
    },
    rightColumn: {
      header: 'Outcome',
      nodes: [
        { id: 'completed', label: 'Completed', value: 499000, color: '#36B37E' },
        { id: 'pipeline', label: 'In Pipeline', value: 204000, color: '#F59E0B' },
        { id: 'churned', label: 'Churned', value: 144000, color: '#EF4444' },
      ]
    },
    leftToMiddle: [
      { source: 'googleppc', target: 'subscription', value: 105000 },
      { source: 'googleppc', target: 'onetime', value: 75000 },
      { source: 'googleppc', target: 'upgrade', value: 35000 },
      { source: 'facebook', target: 'onetime', value: 95000 },
      { source: 'facebook', target: 'subscription', value: 70000 },
      { source: 'facebook', target: 'upgrade', value: 27000 },
      { source: 'email', target: 'subscription', value: 82000 },
      { source: 'email', target: 'renewal', value: 62000 },
      { source: 'email', target: 'onetime', value: 44000 },
      { source: 'tiktok', target: 'onetime', value: 78000 },
      { source: 'tiktok', target: 'subscription', value: 42000 },
      { source: 'tiktok', target: 'upgrade', value: 25000 },
      { source: 'instagram', target: 'subscription', value: 40000 },
      { source: 'instagram', target: 'renewal', value: 42000 },
      { source: 'instagram', target: 'onetime', value: 25000 },
      { source: 'linkedin', target: 'subscription', value: 40000 },
      { source: 'linkedin', target: 'renewal', value: 42000 },
      { source: 'linkedin', target: 'upgrade', value: 25000 },
    ],
    middleToRight: [
      { source: 'subscription', target: 'completed', value: 190000 },
      { source: 'subscription', target: 'pipeline', value: 96000 },
      { source: 'subscription', target: 'churned', value: 53000 },
      { source: 'onetime', target: 'completed', value: 170000 },
      { source: 'onetime', target: 'pipeline', value: 58000 },
      { source: 'onetime', target: 'churned', value: 42000 },
      { source: 'upgrade', target: 'completed', value: 85000 },
      { source: 'upgrade', target: 'pipeline', value: 33000 },
      { source: 'upgrade', target: 'churned', value: 16000 },
      { source: 'renewal', target: 'completed', value: 54000 },
      { source: 'renewal', target: 'pipeline', value: 17000 },
      { source: 'renewal', target: 'churned', value: 33000 },
    ]
  },
  aiWeighted: {
    totalRevenue: '$847K',
    subscriptionMix: '44%',
    completed: '62%',
    churned: '14%',
    leftColumn: {
      header: 'Weighted Channels',
      nodes: [
        { id: 'googleppc', label: 'Google PPC', value: 262000, color: '#4285F4', description: 'AI-weighted influence score' },
        { id: 'email', label: 'Email', value: 210000, color: '#36B37E', description: 'Email campaigns & newsletters' },
        { id: 'linkedin', label: 'LinkedIn', value: 130000, color: '#0A66C2', description: 'LinkedIn paid & organic' },
        { id: 'facebook', label: 'Facebook Ads', value: 128000, color: '#1877F2', description: 'Facebook paid advertising' },
        { id: 'instagram', label: 'Instagram', value: 55000, color: '#E1306C', description: 'Instagram ads & posts' },
        { id: 'tiktok', label: 'TikTok', value: 45000, color: '#1A1A2E', description: 'TikTok advertising' },
      ]
    },
    middleColumn: {
      header: 'Conversion Type',
      nodes: [
        { id: 'subscription', label: 'Subscription', value: 373000, color: '#7C4DFF' },
        { id: 'onetime', label: 'One-time', value: 255000, color: '#9F7AEA' },
        { id: 'upgrade', label: 'Upgrade', value: 119000, color: '#3B82F6' },
        { id: 'renewal', label: 'Renewal', value: 100000, color: '#B794F4' },
      ]
    },
    rightColumn: {
      header: 'Outcome',
      nodes: [
        { id: 'completed', label: 'Completed', value: 525000, color: '#36B37E' },
        { id: 'pipeline', label: 'In Pipeline', value: 203000, color: '#F59E0B' },
        { id: 'churned', label: 'Churned', value: 119000, color: '#EF4444' },
      ]
    },
    leftToMiddle: [
      { source: 'googleppc', target: 'subscription', value: 110000 },
      { source: 'googleppc', target: 'onetime', value: 85000 },
      { source: 'googleppc', target: 'upgrade', value: 35000 },
      { source: 'email', target: 'subscription', value: 110000 },
      { source: 'email', target: 'renewal', value: 68000 },
      { source: 'email', target: 'onetime', value: 32000 },
      { source: 'linkedin', target: 'subscription', value: 70000 },
      { source: 'linkedin', target: 'upgrade', value: 38000 },
      { source: 'linkedin', target: 'renewal', value: 22000 },
      { source: 'facebook', target: 'onetime', value: 73000 },
      { source: 'facebook', target: 'subscription', value: 48000 },
      { source: 'facebook', target: 'upgrade', value: 18000 },
      { source: 'instagram', target: 'onetime', value: 35000 },
      { source: 'instagram', target: 'subscription', value: 20000 },
      { source: 'tiktok', target: 'onetime', value: 30000 },
      { source: 'tiktok', target: 'renewal', value: 10000 },
      { source: 'tiktok', target: 'upgrade', value: 10000 },
    ],
    middleToRight: [
      { source: 'subscription', target: 'completed', value: 220000 },
      { source: 'subscription', target: 'pipeline', value: 105000 },
      { source: 'subscription', target: 'churned', value: 48000 },
      { source: 'onetime', target: 'completed', value: 168000 },
      { source: 'onetime', target: 'pipeline', value: 58000 },
      { source: 'onetime', target: 'churned', value: 29000 },
      { source: 'upgrade', target: 'completed', value: 82000 },
      { source: 'upgrade', target: 'pipeline', value: 27000 },
      { source: 'upgrade', target: 'churned', value: 10000 },
      { source: 'renewal', target: 'completed', value: 55000 },
      { source: 'renewal', target: 'pipeline', value: 13000 },
      { source: 'renewal', target: 'churned', value: 32000 },
    ]
  }
};

// Channel breakdown table data
export const channelBreakdown = [
  { channel: 'Email', color: '#36B37E', completed: 72, churned: 8, friction: null, verdict: 'SCALE' },
  { channel: 'Google PPC', color: '#4285F4', completed: 68, churned: 12, friction: null, verdict: 'SCALE' },
  { channel: 'Facebook Ads', color: '#1877F2', completed: 58, churned: 16, friction: null, verdict: 'MAINTAIN' },
  { channel: 'LinkedIn', color: '#0A66C2', completed: 64, churned: 14, friction: { label: 'Long sales cycle', value: null }, verdict: 'OPTIMIZE' },
  { channel: 'Instagram Ads', color: '#E1306C', completed: 48, churned: 22, friction: { label: 'Low intent traffic', value: null }, verdict: 'OPTIMIZE' },
  { channel: 'TikTok', color: '#1A1A2E', completed: 35, churned: 32, friction: { label: 'No mid-funnel nurture', value: null }, verdict: 'FIX' },
];

export const REVENUE_FLOW_TOTAL_BASE = 847000;
