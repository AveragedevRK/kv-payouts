
export interface Payout {
  id: string;
  date: string;
  payoutAmount: number;
  transferId: string;
  bankAccount: string;
  isNew?: boolean;
}

export interface AHMetrics {
  ahr: number;        // Account Health Rating (Target >= 200)
  odr: number;        // Order Defect Rate (Target < 1%)
  otdr: number;       // On-Time Delivery Rate (Target > 90%)
  vtr: number;        // Valid Tracking Rate (Target > 90%)
  lsr: number;        // Late Shipment Rate (Target < 4%)
  pfcr: number;       // Pre-fulfillment Cancel Rate (Target < 2.5%)
  feedbackScore: number;
  feedbackCount: number;
}

export interface Account {
  id: string;
  name: string;
  platform: string;
  lastPayoutDate: string;
  nextPayoutDate: string;
  notifiedUsers: string[];
  payouts: Payout[];
  healthMetrics?: AHMetrics;
}

export type ViewState = 'ACCOUNTS' | 'PAYOUTS' | 'REPORTS' | 'AH_REPORTS' | 'SETTINGS';
