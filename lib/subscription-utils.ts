/**
 * Subscription Utility Functions
 *
 * Utilities for checking subscription status, trial periods, and access control
 */

export interface SubscriptionData {
  has_subscription: boolean;
  has_active_access: boolean;
  needs_plan_selection: boolean;
  subscription: Subscription | null;
  plan: Plan | null;
  connected_platforms_count?: number;
  campaigns_count?: number;
  connected_channels?: number;
  connectedChannels?: number;
  launched_campaigns?: number;
  launchedCampaigns?: number;
  billing_grace_days_remaining?: number;
  grace_days_remaining?: number;
  days_remaining?: number;
}

export interface Subscription {
  id: number;
  organization_id: number;
  plan_id: number;
  status: string; // Can be 'trial' | 'active' | 'inactive' | 'canceled' or other values
  trial_end?: string | number; // Can be ISO string or Unix timestamp
  plan_expiry?: string | number; // Can be ISO string or Unix timestamp
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at?: number;
}

export interface Plan {
  id: number;
  plan_title: string;
  nickname: string;
  unit_amount: number;
  interval: 'month' | 'year';
  features?: string[];
  price_id?: string;
}

/**
 * Calculate days remaining until a given date
 */
export function calculateDaysLeft(endDate: string | number): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if user has active access to the platform
 */
export function hasActiveAccess(subscriptionData: SubscriptionData | null): boolean {
  if (!subscriptionData) return false;

  // Use the has_active_access flag from API
  if (subscriptionData.has_active_access !== undefined) {
    return subscriptionData.has_active_access;
  }

  // Fallback manual check
  const { subscription } = subscriptionData;
  if (!subscription) return false;

  if (subscription.status === 'trial' && subscription.trial_end) {
    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    return trialEnd > now;
  }

  return subscription.status === 'active';
}

/**
 * Get subscription status with details
 */
export function getSubscriptionStatus(subscription: Subscription | null): {
  status: 'none' | 'trial' | 'trial_expired' | 'active' | 'inactive';
  message: string;
  canAccess: boolean;
  daysLeft?: number;
} {
  if (!subscription) {
    return {
      status: 'none',
      message: 'Please select a plan',
      canAccess: false,
    };
  }

  if (subscription.status === 'trial') {
    if (subscription.trial_end) {
      const daysLeft = calculateDaysLeft(subscription.trial_end);

      if (daysLeft > 0) {
        return {
          status: 'trial',
          message: `Trial ends in ${daysLeft} days`,
          canAccess: true,
          daysLeft,
        };
      } else {
        return {
          status: 'trial_expired',
          message: 'Trial expired',
          canAccess: false,
        };
      }
    }
  }

  if (subscription.status === 'active') {
    return {
      status: 'active',
      message: 'Subscription active',
      canAccess: true,
    };
  }

  return {
    status: 'inactive',
    message: 'Payment required',
    canAccess: false,
  };
}

/**
 * Format price from cents to dollars
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

/**
 * Check if user needs to select a plan
 */
export function needsPlanSelection(subscriptionData: SubscriptionData | null): boolean {
  if (!subscriptionData) return false;
  return subscriptionData.needs_plan_selection === true;
}
