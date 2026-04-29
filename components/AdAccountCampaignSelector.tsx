"use client";

import { Check, Loader2 } from 'lucide-react';
import { useAccountCampaigns } from '@/hooks/use-account-campaigns';
import { AdAccount } from '@/hooks/use-campaign-ad-accounts';

interface AdAccountCampaignSelectorProps {
  channelId: string;
  account: AdAccount;
  authProviderId: number;
  selectedCampaigns: Array<{ id: string; name: string }>;
  onCampaignToggle: (campaignId: string, campaignName: string) => void;
}

export function AdAccountCampaignSelector({
  channelId,
  account,
  authProviderId,
  selectedCampaigns,
  onCampaignToggle,
}: AdAccountCampaignSelectorProps) {
  const { data: campaignsData, isLoading, error } = useAccountCampaigns(
    authProviderId,
    account.account_id
  );
  const campaigns = campaignsData?.campaigns || [];

  return (
    <div className="ml-6 pl-6 border-l-2 border-violet-200">
      {/* Ad Account Header */}
      <div className="mb-3">
        <h4 className="font-medium text-slate-800">{account.account_name}</h4>
        <p className="text-xs text-slate-500">ID: {account.account_id}</p>
        {selectedCampaigns.length > 0 && (
          <p className="text-xs text-violet-600 mt-1 font-medium">
            {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading campaigns...
        </div>
      ) : error ? (
        <div className="py-3 px-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Failed to load campaigns for this account
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
          No campaigns are available for this ad account. Please create ads and then select campaign here.
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map((campaign) => {
            const isSelected = selectedCampaigns.some(c => c.id === campaign.campaign_id);

            return (
              <div
                key={campaign.campaign_id}
                onClick={() => onCampaignToggle(campaign.campaign_id, campaign.campaign_name)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-violet-600 border-violet-600'
                    : 'border-slate-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {campaign.campaign_name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    ID: {campaign.campaign_id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
