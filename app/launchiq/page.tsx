"use client";

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LaunchIQFlow } from '@/components/launchiq/LaunchIQFlow';
import { LaunchIQ } from '@/components/LaunchIQ';
import { useCampaigns } from '@/hooks/use-campaigns';
import { useCampaign } from '@/hooks/use-campaign';
import { usePlatforms } from '@/hooks/use-platforms';
import { useDeleteCampaign } from '@/hooks/use-delete-campaign';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  name: string;
  goal: string;
  market: string;
  channels: Array<{ id: string; name: string; icon: string; logoUrl?: string | null }>;
  status: 'active' | 'draft' | 'disabled';
  createdAt: Date;
}

type Screen = 'launchiq' | 'create-campaign';

export default function LaunchIQPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('launchiq');
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch campaigns from API
  const { data: campaignsData = [], isLoading: isCampaignsLoading, error: campaignsError } = useCampaigns();

  // Fetch single campaign for editing (only when editingCampaignId is set)
  const { data: editingCampaignDetail, isLoading: isLoadingCampaignDetail } = useCampaign(editingCampaignId);

  // Fetch platforms for transformation
  const { data: platforms = [] } = usePlatforms();

  // Delete campaign mutation
  const deleteCampaignMutation = useDeleteCampaign();

  // Transform API campaigns to UI format
  const campaigns = useMemo<Campaign[]>(() => {
    return campaignsData.map((campaign) => {
      // Get goal name from embedded _goal object
      const goalName = campaign._goal?.name || 'Unknown';

      // Transform auth providers to channels
      const channels = campaign._campaign_auth_providers_of_campaigns
        .map((authProvider) => {
          // Find platform by auth provider id
          const platform = platforms.find(
            p => p._authentication?.id === authProvider.auth_provider_id
          );

          if (!platform) return null;

          // Get platform icon (simple emoji based on name)
          const getPlatformIcon = (name: string): string => {
            const nameLower = name.toLowerCase();
            if (nameLower.includes('facebook')) return '📘';
            if (nameLower.includes('instagram')) return '📸';
            if (nameLower.includes('linkedin')) return '💼';
            if (nameLower.includes('twitter') || nameLower.includes('x ')) return '🐦';
            if (nameLower.includes('tiktok')) return '🎵';
            if (nameLower.includes('google ads')) return '🔍';
            if (nameLower.includes('youtube')) return '📺';
            return '🔗';
          };

          return {
            id: platform.id,
            name: platform.name,
            icon: getPlatformIcon(platform.name),
            logoUrl: platform.logo?.url ?? null,
          };
        })
        .filter(
          (ch): ch is { id: string; name: string; icon: string; logoUrl: string | null } =>
            ch !== null
        );

      // Map status
      const uiStatus: Campaign['status'] =
        campaign.status === 'active' ? 'active' :
          campaign.status === 'disabled' ? 'disabled' :
            'draft';

      return {
        id: String(campaign.id),
        name: campaign.name,
        goal: goalName,
        market: campaign.geography,
        channels,
        status: uiStatus,
        createdAt: new Date(campaign.created_at),
      };
    });
  }, [campaignsData, platforms]);

  const handleCreateCampaign = () => {
    setEditingCampaignId(null);
    void queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    setCurrentScreen('create-campaign');
  };

  const handleEditCampaign = (campaignId: string) => {
    setEditingCampaignId(campaignId);
    setCurrentScreen('create-campaign');
  };

  const handleCampaignComplete = (campaignData: {
    name: string;
    goal: string;
    market: string;
    channels: Array<{ id: string; name: string; icon: string }>;
  }) => {
    setEditingCampaignId(null);
    setCurrentScreen('launchiq');
  };

  const handleBackToLaunchIQ = () => {
    setCurrentScreen('launchiq');
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaignMutation.mutateAsync({
        campaign_id: Number(campaignId),
      });

      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to delete campaign",
        description: error instanceof Error ? error.message : "An error occurred while deleting the campaign.",
        variant: "destructive",
      });
    }
  };

  // Render current screen
  if (currentScreen === 'create-campaign') {
    // If editing a campaign, wait for the campaign details to load
    if (editingCampaignId && isLoadingCampaignDetail) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-lavender-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
            <p className="text-lg text-slate-600">Loading campaign details...</p>
          </div>
        </div>
      );
    }

    return (
      <LaunchIQFlow
        mode={editingCampaignId ? 'edit' : 'create'}
        editingCampaignId={editingCampaignId}
        editingCampaignDetail={editingCampaignDetail ?? null}
        onComplete={handleCampaignComplete}
        onBack={handleBackToLaunchIQ}
      />
    );
  }

  // Show loading state
  if (isCampaignsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-lavender-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
          <p className="text-lg text-slate-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (campaignsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-lavender-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load campaigns</h2>
          <p className="text-slate-600 mb-6">{campaignsError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Default: LaunchIQ Landing Screen
  return (
    <LaunchIQ
      onCreateCampaign={handleCreateCampaign}
      onEditCampaign={handleEditCampaign}
      onDeleteCampaign={handleDeleteCampaign}
      campaigns={campaigns}
      isDeletingCampaign={deleteCampaignMutation.isPending}
    />
  );
}
